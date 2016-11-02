angular.module('database.items.recipes', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items.recipes', {
                url: '/recipes',
                templateUrl: 'database/items/recipes/recipes-list.html',
                controller: 'RecipeCtrl',
                ncyBreadcrumb: {
                    label: 'Recipes'
                },
                data: {
                    requiredPermission: 'database.items.recipes.view'
                }
            })

            .state('app.database.items.recipes.view', {
                url: '/:id',
                templateUrl: 'database/items/recipes/recipes-view.html',
                controller: 'RecipeViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Recipe'
                },
                data: {
                    requiredPermission: 'database.items.recipes.view'
                }
            })
    }])

    .controller('RecipeCtrl', ['$scope', '$rootScope', '$timeout', 'ItemRecipeService', 'HistoryService', 'FilterService', 'DatabaseService', 'ItemsDatabaseService', 'ItemsAdministrationService', 'ListService',
        function ($scope, $rootScope, $timeout, ItemRecipeService, HistoryService, FilterService, DatabaseService, ItemsDatabaseService, ItemsAdministrationService, ListService) {
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.recipes.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.recipes.searchSettings', {
                elementsPerPage: 25,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'ItemName',
                orderDirection: 'Asc',
                groupBy: ''
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.recipes.simpleFilters', {
                nameContains: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.recipes.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.recipes.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.recipes.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.recipes.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.recipes.simpleFilters', $scope.simpleFilters);
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

            // Filters update rerecipe from navbar/simple filters
            $scope.filtersUpdated = function (filters) {
                $scope.activeFilters = filters;
            };

            // Group update rerecipe from navbar
            $scope.groupingUpdated = function (groupingName, groupingDirection) {
                $scope.searchSettings.groupBy = groupingName;
                $scope.searchSettings.groupOrderDirection = groupingDirection;
            };

            // Paging update rerecipe from navbar
            $scope.pagingUpdated = function (paging) {
                $scope.searchSettings.elementsPerPage = paging;
            };

            // Sort update rerecipe from navbar
            $scope.sortUpdated = function (sortName, sortDirection) {
                $scope.searchSettings.orderBy = sortName;
                $scope.searchSettings.orderDirection = sortDirection;
            };

            // Refreshes item's list
            $scope.refreshList = function () {
                $scope.listLoading = true;

                // Data to send to server
                var sendToServer = ListService.prepareDataForServer(angular.extend({}, $scope.searchSettings, $scope.activeFilters));

                ListService.refreshList(sendToServer, ItemRecipeService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.recipes.data', $scope.data);
                    HistoryService.save('database.items.recipes.metadata', $scope.metadata);

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
                ItemsAdministrationService.deleteItem(item.ID, ItemRecipeService).then(function() {
                    item.deleted_at = new Date();
                });
            };

            $scope.restoreItem = function (item) {
                ItemsAdministrationService.restoreItem(item.ID, ItemRecipeService).then(function() {
                    item.deleted_at = null;
                });
            }
        }])

    .controller('RecipeViewCtrl', ['$scope', '$stateParams', 'ItemRecipeService', 'ItemsDatabaseService',
        function ($scope, $stateParams, ItemRecipeService, ItemsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.$watch('data', function () {
                $scope.$apply();
            }, true);

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                ItemRecipeService.get(id)
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

    .factory('ItemRecipeService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available recipes. */
                getList: function (parameters) {
                    return $http
                        .get('/recipes', {
                            params: parameters
                        });
                },
                /** Gets a single detailed recipe entry */
                get: function (id) {
                    return $http
                        .get('/recipes/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (itemData) {

                    return $http({
                        method: 'PATCH',
                        url: '/recipes/' + itemData.id,
                        data: itemData
                    });
                },
                destroy: function (id) {
                    return $http
                        .delete('/recipes/' + id);
                }
            }
        }]);