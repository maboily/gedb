angular.module('admin.permissions', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.admin.permissions', {
                url: '/permissions',
                templateUrl: 'admin/permissions/permissions-list.html',
                ncyBreadcrumb: {
                    label: 'Permissions'
                },
                data: {
                    requiredPermission: 'admin.permissions.view'
                }
            })

            .state('app.admin.permissions.new', {
                url: '/new',
                templateUrl: 'admin/permissions/permissions-new.html',
                ncyBreadcrumb: {
                    label: 'New Permission'
                },
                data: {
                    requiredPermission: 'admin.permissions.new'
                }
            })

            .state('app.admin.permissions.edit', {
                url: '/edit/:id',
                templateUrl: 'admin/permissions/permissions-edit.html',
                ncyBreadcrumb: {
                    label: 'Edit Permission'
                },
                data: {
                    requiredPermission: 'admin.permissions.edit'
                }
            })
    }])

    .controller('PermissionListCtrl', ['$scope', '$timeout', 'ngProgress', 'PermissionService',
        function ($scope, $timeout, ngProgress, PermissionService) {
            $scope.filterTimeout = null;
            $scope.listLoading = true;
            $scope.searchSettings = {
                elementsPerPage: 10,
                page: 1,
                orderBy: 'permissionname',
                orderDirection: 'Asc'
            };

            // Data sent by server
            $scope.data = {};
            $scope.metadata = {};

            $scope.$watch('activeFilters', function() {
                clearTimeout($scope.filterTimeout)
                $scope.filterTimeout = setTimeout(function () {
                    $scope.$apply();
                    $scope.refreshList();
                }, 1000);
            });

            $scope.$watch('searchSettings', function () {
                $scope.refreshList();
            }, true);

            $scope.prepareData = function() {
                var sendToServer = {};
                for (var key in $scope.searchSettings) {
                    sendToServer[key] = $scope.searchSettings[key];
                }
                for (var key in $scope.activeFilters) {
                    sendToServer[key] = $scope.activeFilters[key];
                }

                return sendToServer;
            };

            $scope.refreshList = function () {
                $scope.listLoading = true;
                ngProgress.start();
                // Data to send to server

                var sendToServer = $scope.prepareData();

                PermissionService.getList(sendToServer)
                    .success(function (res, status) {
                        // Store data and metadata information
                        $scope.data = res.data;
                        $scope.metadata = res.metadata;

                        // We use $timeout here to ensure digest cycle has finished before declaring the list as loaded
                        $timeout(function () {
                            $scope.listLoading = false;
                            ngProgress.complete();
                        });
                    });
            };
        }])

    .controller('PermissionNewCtrl', ['$scope', '$stateParams', 'PermissionService',
        function ($scope, $stateParams, PermissionService) {

        }
    ])

    .controller('PermissionEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'PermissionService',
        function ($scope, $rootScope, $state, $stateParams, PermissionService) {
            // Loads information from service
            $scope.permission = {};
            $scope.validationErrors = {};

            $scope.loadData = function(id) {
                PermissionService.get(id)
                    .success(function(res, status) {
                        $scope.permission = res.data;
                    });
            };

            $scope.savePermission = function() {
                PermissionService.update($scope.permission)
                    .success(function(res, status) {
                        $rootScope.addAlert('Permission was successfully saved.', 'success');
                        $state.go('app.admin.permissions');
                    })
                    .error(function(res, status) {
                        if (status == 422) { // Unprocessable Entity = validation errors in this case
                            $scope.validationErrors = res.data;
                        } else {
                            $rootScope.addAlert('Failed to save permission due to an unknown error.', 'error');
                        }
                    });
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('PermissionService', ['$http',
        function ($http) {
            return {
                /** Gets a listing of all permissions that are put together in groups */
                getCategories: function() {
                    return $http
                        .get('/permissions-categories');
                },
                /** Gets a shortened listing of available permissions. */
                getList: function (parameters) {
                    return $http
                        .get('/permissions', {
                            params: parameters
                        });
                },
                /** Gets a single detailed permission entry */
                get: function (id) {
                    return $http
                        .get('/permissions/' + id);
                },
                /** Attempts to update the specified permission in database */
                update: function (permissionData) {

                    return $http({
                        method: 'PATCH',
                        url: '/permissions/' + permissionData.id,
                        params: permissionData});
                },
                /** Attempts to create the specified permission in database */
                store: function(permissionData) {
                    return $http
                        .put('/permissions', permissionData);
                }
            }
        }]);