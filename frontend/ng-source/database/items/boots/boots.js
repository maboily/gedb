angular.module('database.items.boots', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items.boots', {
                url: '/boots',
                templateUrl: 'database/items/boots/boots-list.html',
                controller: 'BootCtrl',
                ncyBreadcrumb: {
                    label: 'Boots'
                },
                data: {
                    requiredPermission: 'database.items.boots.view'
                }
            })

            .state('app.database.items.boots.view', {
                url: '/:id',
                templateUrl: 'database/items/boots/boots-view.html',
                controller: 'BootViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Boot'
                },
                data: {
                    requiredPermission: 'database.items.boots.view'
                }
            })
    }])

    .controller('BootCtrl', ['$scope', '$rootScope', '$timeout', 'ItemBootService', 'HistoryService', 'FilterService', 'DatabaseService', 'ItemsDatabaseService', 'ItemsAdministrationService', 'ListService',
        function ($scope, $rootScope, $timeout, ItemBootService, HistoryService, FilterService, DatabaseService, ItemsDatabaseService, ItemsAdministrationService, ListService) {
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.boots.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.boots.searchSettings', {
                elementsPerPage: 10,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'ItemName',
                orderDirection: 'Asc',
                groupBy: 'ClassTypeQualifier'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.boots.simpleFilters', {
                nameContains: '',
                bootType: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.boots.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.boots.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.boots.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.boots.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.boots.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('ItemName', 'like', '%' + $scope.simpleFilters.nameContains + '%'));

                if ($scope.simpleFilters.bootType != '')
                    filters.push(FilterService.createFilter('ClassTypeQualifier', 'eq', $scope.simpleFilters.bootType));

                $scope.activeFilters = FilterService.compileFiltersForServer(filters);
                $scope.filtersUpdated($scope.activeFilters);
            };

            $scope.pendRefresh = function() {
                $scope.listLoading = true;
                clearTimeout($scope.refreshTimeout);
                $scope.refreshTimeout = setTimeout(function() {
                    $scope.$apply();
                    $scope.refreshList();
                }, 300);
            };

            // Filters update request from navbar/simple filters
            $scope.filtersUpdated = function (filters) {
                $scope.activeFilters = filters;
            };

            // Group update request from navbar
            $scope.groupingUpdated = function (groupingName, groupingDirection) {
                $scope.searchSettings.groupBy = groupingName;
                $scope.searchSettings.groupOrderDirection = groupingDirection;
            };

            // Paging update request from navbar
            $scope.pagingUpdated = function (paging) {
                $scope.searchSettings.elementsPerPage = paging;
            };

            // Sort update request from navbar
            $scope.sortUpdated = function (sortName, sortDirection) {
                $scope.searchSettings.orderBy = sortName;
                $scope.searchSettings.orderDirection = sortDirection;
            };

            // Refreshes item's list
            $scope.refreshList = function () {
                $scope.listLoading = true;

                // Data to send to server
                var sendToServer = ListService.prepareDataForServer(angular.extend({}, $scope.searchSettings, $scope.activeFilters));

                ListService.refreshList(sendToServer, ItemBootService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.boots.data', $scope.data);
                    HistoryService.save('database.items.boots.metadata', $scope.metadata);

                    // Post-processing
                    $scope.postProcessRefresh();

                    // We use $timeout here to ensure digest cycle has finished before declaring the list as loaded
                    $timeout(function () {
                        $scope.listLoading = false;
                    });
                });
            };

            // Post-process columns after a refresh
            $scope.postProcessRefresh = function() {
                for (var groupIdx in $scope.data) {
                    for (var dataIdx in $scope.data[groupIdx].data) {
                        // Image file name (to lowercase)
                        $scope.data[groupIdx].data[dataIdx].ImgFileName = ItemsDatabaseService.getImageFileName($scope.data[groupIdx].data[dataIdx]);

                        // Special tags replace: prepare ParsedDesc
                        $scope.data[groupIdx].data[dataIdx].ParsedDesc = ItemsDatabaseService.parseIMCTags($scope.data[groupIdx].data[dataIdx].Desc);

                        // Stats' HTML
                        $scope.data[groupIdx].data[dataIdx].StatsHTML = ItemBootService.constructStatsHTML($scope.data[groupIdx].data[dataIdx]);

                        // Enchantments' HTML
                        $scope.data[groupIdx].data[dataIdx].EnchantmentsHTML = ItemsDatabaseService.constructEnchantmentsHTML($scope.data[groupIdx].data[dataIdx]);

                        // Recipe's HTML
                        $scope.data[groupIdx].data[dataIdx].RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data[groupIdx].data[dataIdx]);
                    }
                }
            };

            // Administration stuff
            $scope.deleteItem = function (item) {
                ItemsAdministrationService.deleteItem(item.ID, ItemBootService).then(function() {
                    item.deleted_at = new Date();
                });
            };

            $scope.restoreItem = function (item) {
                ItemsAdministrationService.restoreItem(item.ID, ItemBootService).then(function() {
                    item.deleted_at = null;
                });
            }
        }])

    .controller('BootViewCtrl', ['$scope', '$stateParams', 'ItemBootService', 'ItemsDatabaseService',
        function ($scope, $stateParams, ItemBootService, ItemsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.$watch('data', function () {
                $scope.$apply();
            }, true);

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                ItemBootService.get(id)
                    .success(function (res, status) {
                        $scope.data = res.data;
                        $scope.postProcessRefresh();
                        $scope.itemLoading = false;
                    });
            };

            // Post-process columns after a refresh
            $scope.postProcessRefresh = function() {
                // Image file name (to lowercase)
                $scope.data.ImgFileName = ItemsDatabaseService.getImageFileName($scope.data);

                // Special tags replace: prepare ParsedDesc
                $scope.data.ParsedDesc = ItemsDatabaseService.parseIMCTags($scope.data.Desc);

                // Stats' HTML
                $scope.data.StatsHTML = ItemBootService.constructStatsHTML($scope.data);

                // Enchantments' HTML
                $scope.data.EnchantmentsHTML = ItemsDatabaseService.constructEnchantmentsHTML($scope.data);

                // Recipe's HTML
                $scope.data.RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data);
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('ItemBootService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available boots. */
                getList: function (parameters) {
                    return $http
                        .get('/boots', {
                            params: parameters
                        });
                },
                /** Gets a single detailed boot entry */
                get: function (id) {
                    return $http
                        .get('/boots/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (itemData) {

                    return $http({
                        method: 'PATCH',
                        url: '/boots/' + itemData.id,
                        data: itemData
                    });
                },
                destroy: function (id) {
                    return $http
                        .delete('/boots/' + id);
                },

                // Additional functions
                constructStatsHTML: function(item) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var statsHTML = '';

                    // Non-optional stats
                    statsHTML += '<li>' + item.DEF + ' DEF</li>';

                    // Optional stats
                    var additionalStatsHTML = '';

                    if (item.BeastBane != 0)
                        additionalStatsHTML += '<li>' + item.BeastBane + '% Damage vs. Wildlife</li>';
                    if (item.DemonBane != 0)
                        additionalStatsHTML += '<li>' + item.DemonBane + '% Damage vs. Daemon</li>';
                    if (item.GolemBane != 0)
                        additionalStatsHTML += '<li>' + item.GolemBane + '% Damage vs. Lifeless</li>';
                    if (item.HumanBane != 0)
                        additionalStatsHTML += '<li>' + item.HumanBane + '% Damage vs. Human</li>';
                    if (item.UndeadBane != 0)
                        additionalStatsHTML += '<li>' + item.UndeadBane + '% Damage vs. Undead</li>';

                    if (item.ShldDR != 0)
                        additionalStatsHTML += '<li>' + item.ShldDR + ' DR</li>';

                    if (item.HR != 0)
                        additionalStatsHTML += '<li>' + item.HR + ' Accuracy</li>';
                    if (item.ATK != 0)
                        additionalStatsHTML += '<li>' + item.ATK + '% Attack</li>';
                    if (item.ASPD != 0)
                        additionalStatsHTML += '<li>' + item.ASPD + '% Attack Speed</li>';
                    if (item.BLK != 0)
                        additionalStatsHTML += '<li>' + item.BLK + ' Block Chance</li>';
                    if (item.CRT != 0)
                        additionalStatsHTML += '<li>' + item.CRT + ' Critical Chance</li>';
                    if (item.DEF != 0)
                        additionalStatsHTML += '<li>' + item.DEF + ' Defense</li>';
                    if (item.PR != 0)
                        additionalStatsHTML += '<li>' + item.PR + ' Evasion</li>';
                    if (item.IMP != 0)
                        additionalStatsHTML += '<li>' + item.IMP + ' Immunity</li>';
                    if (item.HPDrain != 0)
                        additionalStatsHTML += '<li>' + item.HPDrain + '% Life Drain</li>';
                    if (item.MSPD != 1)
                        additionalStatsHTML += '<li>' + Math.round((item.MSPD - 1) * 100) + '% Movement Speed</li>';
                      
                    if (item.IncSTR != 0)
                        additionalStatsHTML += '<li>' + item.IncSTR + ' STR</li>';
                    if (item.IncAGI != 0)
                        additionalStatsHTML += '<li>' + item.IncAGI + ' AGI</li>';
                    if (item.IncCON != 0)
                        additionalStatsHTML += '<li>' + item.IncCON + ' HP</li>';
                    if (item.IncDEX != 0)
                        additionalStatsHTML += '<li>' + item.IncDEX + ' DEX</li>';
                    if (item.IncINT != 0)
                        additionalStatsHTML += '<li>' + item.IncINT + ' INT</li>';
                    if (item.IncCHA != 0)
                        additionalStatsHTML += '<li>' + item.IncCHA + ' CHA</li>';  

                    if (item.MHP != 0)
                        additionalStatsHTML += '<li>' + item.MHP + ' Max HP</li>';
                    if (item.MSP != 0)
                        additionalStatsHTML += '<li>' + item.MSP + ' Max SP</li>';
                    if (item.MHP2 != 0)
                        additionalStatsHTML += '<li>' + item.MHP2 + '% Max HP</li>';
                    if (item.MSP2 != 0)
                        additionalStatsHTML += '<li>' + item.MSP2 + '% Max SP</li>';
                    if (item.RHP != 0)
                        additionalStatsHTML += '<li>' + item.RHP + ' HP Recovery</li>';
                    if (item.RSP != 0)
                        additionalStatsHTML += '<li>' + item.RSP + ' SP Recovery</li>';
                    
                    if (item.DefIP != 0)
                        additionalStatsHTML += '<li>' + item.DefIP + ' Physical Penetration</li>';
                    if (item.FireIP != 0)
                        additionalStatsHTML += '<li class="fire">' + item.FireIP + ' Fire Penetration</li>';
                    if (item.LgtIP != 0)
                        additionalStatsHTML += '<li class="lightning">' + item.LgtIP + ' Lightning Penetration</li>';
                    if (item.IceIP != 0)
                        additionalStatsHTML += '<li class="ice">' + item.IceIP + ' Ice Penetration</li>';
                    if (item.PsyIP != 0)
                        additionalStatsHTML += '<li class="mental">' + item.PsyIP + ' Mental Penetration</li>';
                    
                    if (item.FireATK != 0)
                        additionalStatsHTML += '<li class="fire">' + item.FireATK + ' Fire Attack</li>';
                    if (item.IceATK != 0)
                        additionalStatsHTML += '<li class="ice">' + item.IceATK + ' Ice Attack</li>';
                    if (item.LghtATK != 0)
                        additionalStatsHTML += '<li class="lightning">' + item.LghtATK + ' Lightning Attack</li>';
                    if (item.PsyATK != 0)
                        additionalStatsHTML += '<li class="mental">' + item.PsyATK + ' Mental Attack</li>';
                        
                    if (item.RFIRE != 0)
                        additionalStatsHTML += '<li class="fire">' + item.RFIRE + ' Fire Resistance</li>';
                    if (item.RICE != 0)
                        additionalStatsHTML += '<li class="ice">' + item.RICE + ' Ice Resistance</li>';
                    if (item.RLGHT != 0)
                        additionalStatsHTML += '<li class="lightning">' + item.RLGHT + ' Lightning Resistance</li>';
                    if (item.RPSY != 0)
                        additionalStatsHTML += '<li class="mental">' + item.RPSY + ' Mental Resistance</li>';
                    if (item.RSTAT != 0)
                        additionalStatsHTML += '<li class="debuff">' + item.RSTAT + ' Debuff Resistance</li>';                    
                    
                    if (item.RedFIRE != 0)
                        additionalStatsHTML += '<li class="fire">' + item.RedFIRE + '% Reduced Fire Damage</li>';
                    if (item.RedICE != 0)
                        additionalStatsHTML += '<li class="ice">' + item.RedICE + '% Reduced Ice Damage</li>';
                    if (item.RedLGHT != 0)
                        additionalStatsHTML += '<li class="lightning">' + item.RedLGHT + '% Reduced Lightning Damage</li>'
                    if (item.RedPSY != 0)
                        additionalStatsHTML += '<li class="mental">' + item.RedPSY + '% Reduced Mental Damage</li>';
                    
                    if (item.RedMEL != 0)
                        additionalStatsHTML += '<li>' + item.RedMEL + '% Reduced Melee Damage</li>'
                    if (item.RedSHT != 0)
                        additionalStatsHTML += '<li>' + item.RedSHT + '% Reduced Shooting Damage</li>';
                    
                    if (item.RendBlind != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendBlind + '% chance to inflict Blind</li>';
                    if (item.RendBurning != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendBurning + '% chance to inflict Burning</li>';
                    if (item.RendFear != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendFear + '% chance to inflict Fear</li>';
                    if (item.RendFreeze != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendFreeze + '% chance to inflict Freeze</li>';
                    if (item.RendPoison != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendPoison + '% chance to inflict Poison</li>';
                    if (item.RendShock != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendShock + '% chance to inflict Shock</li>';
                    if (item.RendStun != 0)
                        additionalStatsHTML += '<li>Your auto-attacks have ' + item.RendStun + '% chance to inflict Stun</li>';                    
                        
                    statsHTML += additionalStatsHTML;

                    // Checks if there is any additional stat
                    if (additionalStatsHTML == '')
                        statsHTML += '<li><em>No base stats given</em></li>';

                    return statsHTML;
                }
            }
        }]);