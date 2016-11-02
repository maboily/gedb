angular.module('database.items.armors', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items.armors', {
                url: '/armors',
                templateUrl: 'database/items/armors/armors-list.html',
                controller: 'ArmorCtrl',
                ncyBreadcrumb: {
                    label: 'Armors'
                },
                data: {
                    requiredPermission: 'database.items.armors.view'
                }
            })

            .state('app.database.items.armors.view', {
                url: '/:id',
                templateUrl: 'database/items/armors/armors-view.html',
                controller: 'ArmorViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Armor'
                },
                data: {
                    requiredPermission: 'database.items.armors.view'
                }
            })
    }])

    .controller('ArmorCtrl', ['$scope', '$rootScope', '$timeout', '$upload', '$modal', 'ItemArmorService', 'HistoryService', 'FilterService', 'DatabaseService', 'ItemsDatabaseService', 'ItemsAdministrationService', 'ListService',
        function ($scope, $rootScope, $timeout, $upload, $modal, ItemArmorService, HistoryService, FilterService, DatabaseService, ItemsDatabaseService, ItemsAdministrationService, ListService) {
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.armors.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.armors.searchSettings', {
                elementsPerPage: 10,
                page: 1,
                orderBy: 'ItemName',
                orderDirection: 'Asc',
                groupBy: 'SeriesOrder',
                groupOrderDirection: 'Desc'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.armors.simpleFilters', {
                nameContains: '',
                armorType: ''
            });

            // ToDo: Work in progress (new thumbnail)
            $scope.goUpload = function(itemId, title, toUpload) {
                console.log($scope.newThumbnailFile);

                $scope.upload = $upload.upload({
                    url: '/thumbnails',
                    data: {
                        title: title,
                        type: 'armor',
                        item_id: itemId
                    },
                    file: toUpload,
                    fileFormDataName: 'file'
                }).progress(function(data) {

                }).success(function(data, status, headers, config) {
                    $scope.newThumbnailTitle = '';
                    $scope.newThumbnailFile = null;

                    console.log('Upload done!');
                });
            };

            /*$scope.$watch('newThumbnailFile', function() {
                console.log('ok');
                $scope.upload = $upload.upload({
                    url: '/thumbnails',
                    data: { title: $scope.newThumbnailTitle },
                    file: $scope.newThumbnailFile
                }).progress(function(data) {

                }).success(function(data, status, headers, config) {
                    $scope.newThumbnailTitle = '';
                    $scope.newThumbnailFile = null;
                });
            }, true);*/

            $scope.openThumbnailModal = function(thumbnail) {
                var modalInstance = $modal.open({
                    templateUrl: 'database/thumbnail-modal/thumbnail-modal.html',
                    controller: 'ThumbnailModalCtrl',
                    resolve: {
                        thumbnail: function() {
                            return thumbnail;
                        }
                    },
                    backdrop: true,
                    windowClass: 'thumbnail-modal'
                });
            }
            // ToDo end

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.armors.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.armors.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.armors.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.armors.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.armors.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('ItemName', 'like', '%' + $scope.simpleFilters.nameContains + '%'));

                if ($scope.simpleFilters.armorType != '')
                    filters.push(FilterService.createFilter('ClassTypeQualifier', 'eq', $scope.simpleFilters.armorType));

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

                ListService.refreshList(sendToServer, ItemArmorService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.armors.data', $scope.data);
                    HistoryService.save('database.items.armors.metadata', $scope.metadata);

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
                        $scope.data[groupIdx].data[dataIdx].StatsHTML = ItemArmorService.constructStatsHTML($scope.data[groupIdx].data[dataIdx]);

                        // Enchantments' HTML
                        $scope.data[groupIdx].data[dataIdx].EnchantmentsHTML = ItemsDatabaseService.constructEnchantmentsHTML($scope.data[groupIdx].data[dataIdx]);

                        // Recipe's HTML
                        $scope.data[groupIdx].data[dataIdx].RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data[groupIdx].data[dataIdx]);
                    }
                }
            };

            // Administration stuff
            $scope.deleteItem = function (item) {
                ItemsAdministrationService.deleteItem(item.ID, ItemArmorService).then(function() {
                    item.deleted_at = new Date();
                });
            };

            $scope.restoreItem = function (item) {
                ItemsAdministrationService.restoreItem(item.ID, ItemArmorService).then(function() {
                    item.deleted_at = null;
                });
            }
        }])

    .controller('ArmorViewCtrl', ['$scope', '$stateParams', 'ItemArmorService', 'ItemsDatabaseService',
        function ($scope, $stateParams, ItemArmorService, ItemsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                ItemArmorService.get(id)
                    .success(function (res) {
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
                $scope.data.StatsHTML = ItemArmorService.constructStatsHTML($scope.data);

                // Enchantments' HTML
                $scope.data.EnchantmentsHTML = ItemsDatabaseService.constructEnchantmentsHTML($scope.data);

                // Recipe's HTML
                $scope.data.RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data);

            };

            $scope.loadData($stateParams.id);
        }])

    .factory('ItemArmorService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available armors. */
                getList: function (parameters) {
                    return $http
                        .get('/armors', {
                            params: parameters
                        });
                },
                /** Gets a single detailed armor entry */
                get: function (id) {
                    return $http
                        .get('/armors/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (itemData) {

                    return $http({
                        method: 'PATCH',
                        url: '/armors/' + itemData.id,
                        data: itemData
                    });
                },
                destroy: function (id) {
                    return $http
                        .delete('/armors/' + id);
                },

                // Additional functions
                constructStatsHTML: function(item) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var statsHTML = '';

                    // Non-optional stats
                    statsHTML += '<li>' + item.MaxSocketCount + ' Sockets Max</li>';
                    statsHTML += '<li>' + item.WLv + ' DR</li>';
                    statsHTML += '<li>' + item.DEF + ' DEF</li>';
                    statsHTML += '<li class="fire">' + item.RFIRE + ' Fire Resistance</li>';
                    statsHTML += '<li class="ice">' + item.RICE + ' Ice Resistance</li>';
                    statsHTML += '<li class="lightning">' + item.RLGHT + ' Lightning Resistance</li>';
                    statsHTML += '<li class="mental">' + item.RPSY + ' Mental Resistance</li>';
                    statsHTML += '<li class="debuff">' + item.RSTAT + ' Debuff Resistance</li>';

                    // Optional stats
                    var additionalStatsHTML = '';
                    if (item.ASPD != 0)
                        additionalStatsHTML += '<li>' + item.ASPD + '% Attack Speed</li>';
                    if (item.HPDrain != 0)
                        additionalStatsHTML += '<li>' + item.HPDrain + '% Life Drain</li>';
                    if (item.IncMHP != 0)
                        additionalStatsHTML += '<li>' + item.IncMHP + ' Max HP</li>';
                    if (item.IncMSP != 0)
                        additionalStatsHTML += '<li>' + item.IncMSP + ' Max SP</li>';
                    if (item.IncAGI != 0)
                        additionalStatsHTML += '<li>' + item.IncAGI + ' AGI</li>';
                    if (item.IncCHA != 0)
                        additionalStatsHTML += '<li>' + item.IncCHA + ' CHA</li>';
                    if (item.IncCON != 0)
                        additionalStatsHTML += '<li>' + item.IncCON + ' CON</li>';
                    if (item.IncDEX != 0)
                        additionalStatsHTML += '<li>' + item.IncDEX + ' DEX</li>';
                    if (item.IncINT != 0)
                        additionalStatsHTML += '<li>' + item.IncINT + ' INT</li>';
                    if (item.IncSTR != 0)
                        additionalStatsHTML += '<li>' + item.IncSTR + ' STR</li>';
                    if (item.MHP != 0)
                        additionalStatsHTML += '<li>' + item.MHP + '% Max HP</li>';
                    if (item.MSP != 0)
                        additionalStatsHTML += '<li>' + item.MSP + '% Max SP</li>';
                    if (item.PR != 0)
                        additionalStatsHTML += '<li>' + item.PR + ' Evasion</li>';
                    statsHTML += additionalStatsHTML;

                    // Checks if there is any additional stat
                    if (additionalStatsHTML == '')
                        statsHTML += '<li><em>No additional stats</em></li>';

                    return statsHTML;
                }
            }
        }]);