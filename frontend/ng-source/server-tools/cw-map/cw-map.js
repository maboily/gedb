angular.module('cwMap', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.server-tools.cw-map', {
                url: '/cw-map',
                templateUrl: 'server-tools/cw-map/cw-map-index.html',
                controller: 'CWMapCtrl',
                ncyBreadcrumb: {
                    label: 'Colony War Map'
                }
            })
        }])

    .controller('CWMapCtrl', ['$scope', 'CWMapService', 'CWPossibleOccupationService',
        function ($scope, CWMapService, CWPossibleOccupationService) {
            $scope.editingCWMap = {};
            $scope.currentCWMap = {};
            $scope.cwPossibleOccupations = {};
            $scope.cwMapOccupations = {};
            $scope.currentCWMapOccupationId = 0;

            $scope.searchSettings = {
                elementsPerPage: 25,
                orderBy: 'cw_date',
                orderDirection: 'Desc'
            };

            // Loads the base occupation points (inputs to place on the map)
            $scope.loadPossibleOccupations = function () {
                CWPossibleOccupationService.getList().success(function (res) {
                    $scope.cwPossibleOccupations = res.data;
                });
            };

            // Refreshes the list of available CW maps
            $scope.refreshMapList = function (selectLastOccupation) {
                CWMapService.getList($scope.searchSettings).success(function (res) {
                    $scope.cwMapOccupations = res.data;
                    $scope.metadata = res.metadata;

                    if (selectLastOccupation) {
                        $scope.loadMap($scope.cwMapOccupations[0] ? $scope.cwMapOccupations[0].id : null);
                    }
                });
            };

            // Reformat occupations received from the server (ToDo Note: Will probably go away if backend framework changes)
            $scope.reformatOccupations = function (baseOccupations) {
                console.log(baseOccupations);
                var reformattedOccupations = new Object();
                for (var occupationIdx in $scope.currentCWMap.occupations) {
                    var occupation = baseOccupations[occupationIdx];

                    reformattedOccupations[occupation.id] = occupation.pivot.faction_name;
                }

                return reformattedOccupations;
            };

            // Loads a CW map
            $scope.loadMap = function (mapId) {
                if (mapId) {
                    $scope.currentCWMapOccupationId = mapId;

                    CWMapService.get(mapId).success(function (res) {
                        $scope.currentCWMap = res.data;
                        $scope.currentCWMap.occupations = $scope.reformatOccupations($scope.currentCWMap.occupations);
                    });
                } else {
                    $scope.currentCWMapOccupationId = '';
                }
            };

            // Opens up edit mode to create a new CW map
            $scope.createNewCWMap = function() {
                $scope.isEditing = true;
                $scope.editingCWMap = {
                    id: -1,
                    occupations: new Object(),
                    cw_date: new Date()
                };
            };

            // Opens up edit mode to edit current CW map
            $scope.editCurrentCWMap = function() {
                $scope.isEditing = true;
                $scope.editingCWMap = $scope.currentCWMap;
            };

            // Deletes an occupation entry
            $scope.deleteCurrentCWMap = function () {
                if (confirm('Are you sure you want to delete definitively the current CW occupation entry?')) {
                    CWMapService.destroy($scope.currentCWMap).then(function () {
                        // Reloads occupation entries
                        $scope.refreshMapList(true);
                    });
                }
            };

            // Saves current changes for the changelog
            $scope.saveChanges = function() {
                $scope.isEditing = false;

                if ($scope.editingCWMap.id == -1) {
                    CWMapService.store($scope.editingCWMap).then(function(res) {
                        $scope.refreshMapList(true);
                    });
                } else {
                    CWMapService.update($scope.editingCWMap).then(function(res) {
                        $scope.refreshMapList();
                        $scope.loadMap($scope.editingCWMap.id);
                    });
                }
            };

            // Cancels editing
            $scope.cancelChanges = function() {
                $scope.isEditing = false;
                $scope.editingCWMap = {};
            };

            $scope.loadPossibleOccupations();
            $scope.refreshMapList(true);
        }])


    .factory('CWMapService', ['$http', function ($http) {
        return {
            /** Gets a shortened listing of available CW weeks. */
            getList: function (parameters) {
                return $http
                    .get('/cw-maps', {
                        params: parameters
                    });
            },
            /** Gets a single detailed changelog entry */
            get: function (id) {
                return $http
                    .get('/cw-maps/' + id);
            },
            /** Attempts to update the specified CW week in database */
            update: function (cwOccupationData) {

                return $http({
                    method: 'PATCH',
                    url: '/cw-maps/' + cwOccupationData.id,
                    data: cwOccupationData
                });
            },
            /** Attempts to create the specified CW week in database */
            store: function (cwOccupationData) {
                return $http
                    .post('/cw-maps', cwOccupationData);
            },
            destroy: function (cwOccupationData) {
                return $http
                    .delete('/cw-maps/' + cwOccupationData.id);
            }
        }
    }])


    .factory('CWPossibleOccupationService', ['$http', function ($http) {
        return {
            /** Gets a shortened listing of available occupation points. */
            getList: function (parameters) {
                return $http
                    .get('/cw-possible-occupations', {
                        params: parameters
                    });
            }
        }
    }]);