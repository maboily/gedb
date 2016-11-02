angular.module('database.items.consumables', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items.consumables', {
                url: '/consumables',
                templateUrl: 'database/items/consumables/consumables-list.html',
                controller: 'ConsumableCtrl',
                ncyBreadcrumb: {
                    label: 'Consumables'
                },
                data: {
                    requiredPermission: 'database.items.consumables.view'
                }
            })

            .state('app.database.items.consumables.view', {
                url: '/:id',
                templateUrl: 'database/items/consumables/consumables-view.html',
                controller: 'ConsumableViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Consumable'
                },
                data: {
                    requiredPermission: 'database.items.consumables.view'
                }
            })
    }])

    .controller('ConsumableCtrl', ['$scope', '$rootScope', '$timeout', 'ItemConsumableService', 'HistoryService', 'FilterService', 'DatabaseService', 'ItemsDatabaseService', 'ItemsAdministrationService', 'ListService',
        function ($scope, $rootScope, $timeout, ItemConsumableService, HistoryService, FilterService, DatabaseService, ItemsDatabaseService, ItemsAdministrationService, ListService) {
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.consumables.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.consumables.searchSettings', {
                elementsPerPage: 25,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'ItemName',
                orderDirection: 'Asc',
                groupBy: ''
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.consumables.simpleFilters', {
                nameContains: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.consumables.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.consumables.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.consumables.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.consumables.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.consumables.simpleFilters', $scope.simpleFilters);
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

                ListService.refreshList(sendToServer, ItemConsumableService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.consumables.data', $scope.data);
                    HistoryService.save('database.items.consumables.metadata', $scope.metadata);

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

                        // Recipe's HTML
                        $scope.data[groupIdx].data[dataIdx].RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data[groupIdx].data[dataIdx]);
                    }
                }
            };

            // Administration stuff
            $scope.deleteItem = function (item) {
                ItemsAdministrationService.deleteItem(item.ID, ItemConsumableService).then(function() {
                    item.deleted_at = new Date();
                });
            };

            $scope.restoreItem = function (item) {
                ItemsAdministrationService.restoreItem(item.ID, ItemConsumableService).then(function() {
                    item.deleted_at = null;
                });
            }
        }])

    .controller('ConsumableViewCtrl', ['$scope', '$stateParams', 'ItemConsumableService', 'ItemsDatabaseService',
        function ($scope, $stateParams, ItemConsumableService, ItemsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.$watch('data', function () {
                $scope.$apply();
            }, true);

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                ItemConsumableService.get(id)
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

                // Recipe's HTML
                $scope.data.RecipeHTML = ItemsDatabaseService.constructRecipeHTML($scope.data);
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('ItemConsumableService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available consumables. */
                getList: function (parameters) {
                    return $http
                        .get('/consumables', {
                            params: parameters
                        });
                },
                /** Gets a single detailed consumable entry */
                get: function (id) {
                    return $http
                        .get('/consumables/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (itemData) {

                    return $http({
                        method: 'PATCH',
                        url: '/consumables/' + itemData.id,
                        data: itemData
                    });
                },
                destroy: function (id) {
                    return $http
                        .delete('/consumables/' + id);
                }
            }
        }]);