angular.module('database.items.quests', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items.quests', {
                url: '/quests',
                templateUrl: 'database/items/quests/quests-list.html',
                controller: 'QuestCtrl',
                ncyBreadcrumb: {
                    label: 'Quests'
                },
                data: {
                    requiredPermission: 'database.items.quests.view'
                }
            })

            .state('app.database.items.quests.view', {
                url: '/:id',
                templateUrl: 'database/items/quests/quests-view.html',
                controller: 'QuestViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Quest'
                },
                data: {
                    requiredPermission: 'database.items.quests.view'
                }
            })
    }])

    .controller('QuestCtrl', ['$scope', '$rootScope', '$timeout', 'ItemQuestService', 'HistoryService', 'FilterService', 'DatabaseService', 'ItemsDatabaseService', 'ItemsAdministrationService', 'ListService',
        function ($scope, $rootScope, $timeout, ItemQuestService, HistoryService, FilterService, DatabaseService, ItemsDatabaseService, ItemsAdministrationService, ListService) {
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.quests.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.quests.searchSettings', {
                elementsPerPage: 25,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'ItemName',
                orderDirection: 'Asc',
                groupBy: ''
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.quests.simpleFilters', {
                nameContains: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.quests.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.quests.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.quests.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.quests.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.quests.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('ItemName', 'like', '%' + $scope.simpleFilters.nameContains + '%'));

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

                ListService.refreshList(sendToServer, ItemQuestService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.quests.data', $scope.data);
                    HistoryService.save('database.items.quests.metadata', $scope.metadata);

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
                    }
                }
            };

            // Administration stuff
            $scope.deleteItem = function (item) {
                ItemsAdministrationService.deleteItem(item.ID, ItemQuestService).then(function() {
                    item.deleted_at = new Date();
                });
            };

            $scope.restoreItem = function (item) {
                ItemsAdministrationService.restoreItem(item.ID, ItemQuestService).then(function() {
                    item.deleted_at = null;
                });
            }
        }])

    .controller('QuestViewCtrl', ['$scope', '$stateParams', 'ItemQuestService', 'ItemsDatabaseService',
        function ($scope, $stateParams, ItemQuestService, ItemsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.$watch('data', function () {
                $scope.$apply();
            }, true);

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                ItemQuestService.get(id)
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
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('ItemQuestService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available quests. */
                getList: function (parameters) {
                    return $http
                        .get('/quests', {
                            params: parameters
                        });
                },
                /** Gets a single detailed quest entry */
                get: function (id) {
                    return $http
                        .get('/quests/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (itemData) {

                    return $http({
                        method: 'PATCH',
                        url: '/quests/' + itemData.id,
                        data: itemData
                    });
                },
                destroy: function (id) {
                    return $http
                        .delete('/quests/' + id);
                },

                // Additional functions
                constructStatsHTML: function(item) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var statsHTML = '';

                    // Non-optional stats
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