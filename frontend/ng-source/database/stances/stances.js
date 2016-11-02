angular.module('database.stances', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.stances', {
                url: '/stances',
                templateUrl: 'database/stances/stances-list.html',
                controller: 'StanceCtrl',
                ncyBreadcrumb: {
                    label: 'Stances'
                },
                data: {
                    requiredPermission: 'database.stances.view'
                }
            })

            .state('app.database.stances.view', {
                url: '/:id',
                templateUrl: 'database/stances/stances-view.html',
                controller: 'StanceViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Stance'
                },
                data: {
                    requiredPermission: 'database.stances.view'
                }
            })
    }])

    .factory('StancesDatabaseService', ['$q', 'ngProgress',
        function ($q, ngProgress) {
            return {
                constructStatsHTML: function(stance) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var additionalStatsHTML = '';

                    if (stance.Far == 'NO')
                        additionalStatsHTML += '<span class="negative stats-text">No auto-attack</span><br />';

                    if (stance.StnATK > 1)
                        additionalStatsHTML += '<span class="positive stats-text">+' + Math.round(stance.StnATK * 100 - 100) + "% ATK</span><br />";
                    else if (stance.StnATK < 1)
                        additionalStatsHTML += '<span class="negative stats-text">-' + Math.round(100 - stance.StnATK * 100) + "% ATK</span><br />";

                    additionalStatsHTML += stance.MinR / 100 + "m~" + stance.MaxR / 100 + "m range<br />";


                    if (stance.LHits > 0)
                        additionalStatsHTML += stance.RHits + " right-hand hits per cycle<br />";
                    additionalStatsHTML += stance.LHits + " left-hand hits per cycle<br />";

                    if (stance.ShootDef > 100)
                        additionalStatsHTML += '<span class="negative stats-text">+' + (stance.ShootDef - 100) + '% Shoot Damage taken</span><br />';
                    else if (stance.ShootDef < 100)
                        additionalStatsHTML += '<span class="positive stats-text">-' + (100 - stance.ShootDef) + '% Shoot Damage taken</span><br />';

                    if (stance.MeleeDef > 100)
                        additionalStatsHTML += '<span class="negative stats-text">+' + (stance.MeleeDef - 100) + '% Melee Damage taken</span><br />';
                    else if (stance.MeleeDef < 100)
                        additionalStatsHTML += '<span class="positive stats-text">-' + (100 - stance.MeleeDef) + '% Melee Damage taken</span><br />';

                    if (stance.MagicDef > 100)
                        additionalStatsHTML += '<span class="negative stats-text">+' + (stance.MagicDef - 100) + '% Magic Damage taken</span><br />';
                    else if (stance.MagicDef < 100)
                        additionalStatsHTML += '<span class="positive stats-text">-' + (100 - stance.MagicDef) + '% Magic Damage taken</span><br />';

                    if (stance.StnIgnoreDEFPer > 0)
                        additionalStatsHTML += "Ignores " + stance.StnIgnoreDEFPer + "% DEF<br />";

                    return additionalStatsHTML;
                },
                trimAdditionalDesc: function(text) {
                    // Removes trailing information in descriptions
                    return text
                        .replace(/(\{br\}.{1,})/gi, '')

                        .trim();
                },
                refreshList: function(sendToServer, service) {
                    var deferred = $q.defer();

                    ngProgress.start();

                    service.getList(sendToServer)
                        .success(function (res, status) {
                            // Store data and metadata information
                            var response = res;

                            // Surrounds data by a fake group if there was no group specified
                            if (sendToServer.groupBy == '') {
                                response.data = [{groupName: '', data: res.data}];
                            }

                            ngProgress.complete();
                            deferred.resolve(response);
                        })
                        .error(function (res, status) {
                            $rootScope.addAlert(res.data, 'error');
                            ngProgress.complete();
                            deferred.reject();
                        });

                    return deferred.promise;
                }
            }
        }])

    .controller('StanceCtrl', ['$scope', '$rootScope', '$timeout', 'StanceService', 'HistoryService', 'FilterService', 'ListService', 'StancesDatabaseService', 'ngProgress',
        function ($scope, $rootScope, $timeout, StanceService, HistoryService, FilterService, ListService, StancesDatabaseService, ngProgress) {
            $scope.pageLoaded = false;
            $scope.refreshTimeout = null;
            $scope.activeFilters = HistoryService.loadOrCreate('database.stances.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.stances.searchSettings', {
                elementsPerPage: 10,
                page: 1,
                orderBy: 'Name',
                orderDirection: 'Asc',
                groupBy: '',
                groupOrderDirection: 'Asc'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.stances.simpleFilters', {
                nameContains: ''
            });

            // Recalls data that came from last page's visit
            $scope.data = HistoryService.loadOrCreate('database.stances.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.stances.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.stances.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.stances.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.stances.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('Name', 'like', '%' + $scope.simpleFilters.nameContains + '%'));

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

            // Refreshes stance's list
            $scope.refreshList = function () {
                $scope.listLoading = true;

                // Data to send to server
                var sendToServer = ListService.prepareDataForServer(angular.extend({}, $scope.searchSettings, $scope.activeFilters));

                StancesDatabaseService.refreshList(sendToServer, StanceService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.stances.data', $scope.data);
                    HistoryService.save('database.stances.metadata', $scope.metadata);

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
                    // Group name
                    $scope.data[groupIdx].translatedGroupName = $scope.data[groupIdx].groupName;

                    for (var dataIdx in $scope.data[groupIdx].data) {
                        // Image file name (to lowercase)
                        $scope.data[groupIdx].data[dataIdx].ImgFileName = $scope.data[groupIdx].data[dataIdx].FileName.toLowerCase();

                        // Special tags replace: prepare ParsedDesc
                        $scope.data[groupIdx].data[dataIdx].ParsedDesc = StancesDatabaseService.trimAdditionalDesc($scope.data[groupIdx].data[dataIdx].Desc);

                        // Additional Stats HTML
                        $scope.data[groupIdx].data[dataIdx].StatsHTML = StancesDatabaseService.constructStatsHTML($scope.data[groupIdx].data[dataIdx]);
                    }
                }
            };
        }])

    .controller('StanceViewCtrl', ['$scope', '$stateParams', 'StanceService', 'StancesDatabaseService',
        function ($scope, $stateParams, StanceService, StancesDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                StanceService.get(id)
                    .success(function (res) {
                        $scope.data = res.data;
                        $scope.postProcessRefresh();
                        $scope.itemLoading = false;
                    });
            };

            // Post-process columns after a refresh
            $scope.postProcessRefresh = function() {
                // Image file name (to lowercase)
                $scope.data.ImgFileName = $scope.data.FileName.toLowerCase();

                // Special tags replace: prepare ParsedDesc
                $scope.data.ParsedDesc = StancesDatabaseService.trimAdditionalDesc($scope.data.Desc);

                // Additional Stats HTML
                $scope.data.StatsHTML = StancesDatabaseService.constructStatsHTML($scope.data);
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('StanceService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available stances. */
                getList: function (parameters) {
                    return $http
                        .get('/stances', {
                            params: parameters
                        });
                },
                /** Gets a single detailed stance entry */
                get: function (id) {
                    return $http
                        .get('/stances/' + id);
                }
            }
        }]);
