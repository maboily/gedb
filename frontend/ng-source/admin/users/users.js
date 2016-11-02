angular.module('admin.users', ['admin.permissions'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.admin.users', {
                url: '/users',
                templateUrl: 'admin/users/users-list.html',
                controller: 'UserListCtrl',
                ncyBreadcrumb: {
                    label: 'Users'
                },
                data: {
                    requiredPermission: 'admin.users.view'
                }
            })

            .state('app.admin.users.new', {
                url: '/new',
                templateUrl: 'admin/users/users-new.html',
                controller: 'UserNewCtrl',
                ncyBreadcrumb: {
                    label: 'New User'
                },
                data: {
                    requiredPermission: 'admin.users.new'
                }
            })

            .state('app.admin.users.edit', {
                url: '/edit/:id',
                templateUrl: 'admin/users/users-edit.html',
                controller: 'UserEditCtrl',
                ncyBreadcrumb: {
                    label: 'Edit User'
                },
                data: {
                    requiredPermission: 'admin.users.edit'
                }
            })
    }])

    .controller('UserListCtrl', ['$rootScope', '$scope', '$timeout', 'ngProgress', 'UserService', 'HistoryService', 'ListService', 'FilterService',
        function ($rootScope, $scope, $timeout, ngProgress, UserService, HistoryService, ListService, FilterService) {
            $scope.activeFilters = HistoryService.loadOrCreate('admin.users.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('admin.users.searchSettings', {
                elementsPerPage: 10,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'email',
                orderDirection: 'Asc'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('admin.users.simpleFilters', {
                emailContains: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('admin.users.data', null);
            $scope.metadata = HistoryService.loadOrCreate('admin.users.metadata', null);

            // Filters update request from navbar/simple filters
            $scope.filtersUpdated = function (filters) {
                $scope.activeFilters = filters;
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


            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('admin.users.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('admin.users.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('admin.users.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('email', 'like', '%' + $scope.simpleFilters.emailContains + '%'));

                $scope.activeFilters = FilterService.compileFiltersForServer(filters);
                $scope.filtersUpdated($scope.activeFilters);
            };

            $scope.deleteUser = function(user) {
                UserService.destroy({ id: user.id })
                    .success(function() {
                        $rootScope.addAlert('User was successfully deleted.', 'success');
                        $scope.refreshList();
                    })
                    .error(function() {
                        $rootScope.addAlert('An unknown error has occured while deleting the user.', 'warning');
                    });
            };

            $scope.restoreUser = function(user) {
                UserService.update({ id: user.id, deleted_at: null })
                    .success(function() {
                        $rootScope.addAlert('User was restored.', 'success');
                    })
                    .error(function() {
                        $rootScope.addAlert('An unknown error has occured while restoring the user.', 'warning');
                    });
            };

            $scope.pendRefresh = function() {
                $scope.listLoading = true;
                clearTimeout($scope.refreshTimeout);
                $scope.refreshTimeout = setTimeout(function() {
                    $scope.$apply();
                    $scope.refreshList();
                }, 300);
            };

            $scope.refreshList = function () {
                $scope.listLoading = true;

                // Data to send to server
                var sendToServer = ListService.prepareDataForServer(angular.extend({}, $scope.searchSettings, $scope.activeFilters));

                ListService.refreshList(sendToServer, UserService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('admin.users.data', $scope.data);
                    HistoryService.save('admin.users.metadata', $scope.metadata);

                    // We use $timeout here to ensure digest cycle has finished before declaring the list as loaded
                    $timeout(function () {
                        $scope.listLoading = false;
                    });
                });
            };
        }])

    .controller('UserNewCtrl', ['$rootScope', '$scope', '$state', 'UserService', 'PermissionService',
        function ($rootScope, $scope, $state, UserService, PermissionService) {
            $scope.availablePermissions = {};
            $scope.user = {
                permissions: null
            };
            $scope.validationErrors = {};

            $scope.saveUser = function() {
                $scope.compilePermissionsToSend();
                UserService.store($scope.user)
                    .success(function(res, status) {
                        $rootScope.addAlert('User was successfully saved.', 'success');
                        $state.go('app.admin.users');
                    })
                    .error(function(res, status) {
                        if (status == 422) { // Unprocessable Entity = validation errors in this case
                            $scope.validationErrors = res.data;
                        } else {
                            $rootScope.addAlert('Failed to save user due to an unknown error.', 'error');
                        }
                    });
            };

            $scope.loadPermissions = function() {
                PermissionService.getCategories()
                    .success(function(res, status) {
                        // Fills permissions list
                        $scope.permissionCategories = res.data;
                        $scope.compilePermissions();
                    })
                    .error(function(res, status) {
                        $rootScope.addAlert('Failed to load permissions list');
                    });
            };

            $scope.compilePermissionsToSend = function() {
                // Prepares to send permissions to server
                var permissionsToSend = new Array();

                for (var c in $scope.permissionCategories) {
                    for (var p in $scope.permissionCategories[c].permissions) {
                        if ($scope.permissionCategories[c].permissions[p].isAssigned) {
                            // The server only cares about the ids, so let's send it only that
                            permissionsToSend.push($scope.permissionCategories[c].permissions[p].id);
                        }
                    }
                }

                // Sends updated permissions to server
                $scope.user.permissions = permissionsToSend;
            }

            $scope.compilePermissions = function() {
                // Walks the current permissions against the ones the user actively has and enable them
                for (var c in $scope.permissionCategories) {

                    // Starts browsing category's permissions
                    for (var p in $scope.permissionCategories[c].permissions) {
                        // Compares active permissions against the group's permissions
                        for (var ap in $scope.user.permissions) {
                            if ($scope.permissionCategories[c].permissions[p].name == $scope.user.permissions[ap].name) {
                                $scope.permissionCategories[c].permissions[p].isAssigned = true;
                                break;
                            }
                        }
                    }
                }
            };

            $scope.loadPermissions();
        }
    ])

    .controller('UserEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'UserService', 'PermissionService',
        function ($scope, $rootScope, $state, $stateParams, UserService, PermissionService) {
            // Loads information from service
            $scope.availablePermissions = {};
            $scope.user = {};
            $scope.validationErrors = {};

            $scope.loadData = function(id) {
                UserService.get(id)
                    .success(function(res, status) {
                        $scope.user = res.data;
                        $scope.loadPermissions();
                    });
            };

            $scope.saveUser = function() {
                $scope.compilePermissionsToSend();
                UserService.update($scope.user)
                    .success(function(res, status) {
                        $rootScope.addAlert('User was successfully saved.', 'success');
                        $state.go('app.admin.users');
                    })
                    .error(function(res, status) {
                        if (status == 422) { // Unprocessable Entity = validation errors in this case
                            $scope.validationErrors = res.data;
                        } else {
                            $rootScope.addAlert('Failed to save user due to an unknown error.', 'error');
                        }
                    });
            };

            $scope.loadPermissions = function() {
                PermissionService.getCategories()
                    .success(function(res, status) {
                        // Fills permissions list
                        $scope.permissionCategories = res.data;
                        $scope.compilePermissions();
                    })
                    .error(function(res, status) {
                        $rootScope.addAlert('Failed to load permissions list');
                    });
            };

            $scope.compilePermissionsToSend = function() {
                // Prepares to send permissions to server
                var permissionsToSend = new Array();

                for (var c in $scope.permissionCategories) {
                    for (var p in $scope.permissionCategories[c].permissions) {
                        if ($scope.permissionCategories[c].permissions[p].isAssigned) {
                            // The server only cares about the ids, so let's send it only that
                            permissionsToSend.push($scope.permissionCategories[c].permissions[p].id);
                        }
                    }
                }

                // Sends updated permissions to server
                $scope.user.permissions = permissionsToSend;
            }

            $scope.compilePermissions = function() {
                // Walks the current permissions against the ones the user actively has and enable them
                for (var c in $scope.permissionCategories) {

                    // Starts browsing category's permissions
                    for (var p in $scope.permissionCategories[c].permissions) {
                        // Compares active permissions against the group's permissions
                        for (var ap in $scope.user.permissions) {
                            if ($scope.permissionCategories[c].permissions[p].name == $scope.user.permissions[ap].name) {
                                $scope.permissionCategories[c].permissions[p].isAssigned = true;
                                break;
                            }
                        }
                    }
                }
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('UserService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available users. */
                getList: function (parameters) {
                    return $http
                        .get('/users', {
                            params: parameters
                        });
                },
                /** Gets a single detailed user entry */
                get: function (id) {
                    return $http
                        .get('/users/' + id);
                },
                /** Attempts to update the specified user in database */
                update: function (userData) {

                    return $http({
                        method: 'PATCH',
                        url: '/users/' + userData.id,
                        data: userData});
                },
                /** Attempts to create the specified user in database */
                store: function(userData) {
                    return $http
                        .post('/users', userData);
                },
                destroy: function(userData) {
                    return $http
                        .delete('/users/' + userData.id);
                }
            }
        }]);