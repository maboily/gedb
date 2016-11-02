angular.module('admin.groups', ['admin.groups'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.admin.groups', {
                url: '/groups',
                templateUrl: 'admin/groups/groups-list.html',
                controller: 'GroupListCtrl',
                ncyBreadcrumb: {
                    label: 'Groups'
                },
                data: {
                    requiredPermission: 'admin.groups.view'
                }
            })

            .state('app.admin.groups.new', {
                url: '/new',
                templateUrl: 'admin/groups/groups-new.html',
                controller: 'GroupNewCtrl',
                ncyBreadcrumb: {
                    label: 'New Group'
                },
                data: {
                    requiredPermission: 'admin.groups.new'
                }
            })

            .state('app.admin.groups.edit', {
                url: '/edit/:id',
                templateUrl: 'admin/groups/groups-edit.html',
                controller: 'GroupEditCtrl',
                ncyBreadcrumb: {
                    label: 'Edit Group'
                },
                data: {
                    requiredPermission: 'admin.groups.edit'
                }
            })
    }])

    .controller('GroupListCtrl', ['$rootScope', '$scope', '$timeout', 'ngProgress', 'GroupService', 'HistoryService', 'ListService', 'FilterService',
        function ($rootScope, $scope, $timeout, ngProgress, GroupService, HistoryService, ListService, FilterService) {
            $scope.activeFilters = HistoryService.loadOrCreate('admin.groups.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('admin.groups.searchSettings', {
                elementsPerPage: 10,
                groupOrderDirection: 'Asc',
                page: 1,
                orderBy: 'name',
                orderDirection: 'Asc'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('admin.groups.simpleFilters', {
                emailContains: ''
            });

            // Recalls data that came from the last page's visit
            $scope.data = HistoryService.loadOrCreate('admin.groups.data', null);
            $scope.metadata = HistoryService.loadOrCreate('admin.groups.metadata', null);

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
                    HistoryService.save('admin.groups.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('admin.groups.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('admin.groups.simpleFilters', $scope.simpleFilters);
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

            $scope.deleteGroup = function(group) {
                GroupService.destroy({ id: group.id })
                    .success(function(res, status) {
                        $rootScope.addAlert('Group was successfully deleted.', 'success');
                        $scope.refreshList();
                    })
                    .error(function(res, status) {
                        $rootScope.addAlert('An unknown error has occured while deleting the group.', 'warning');
                    });
            };

            $scope.restoreGroup = function(user) {
                GroupService.update({ id: user.id, deleted_at: null })
                    .success(function() {
                        $rootScope.addAlert('Group was restored.', 'success');
                    })
                    .error(function() {
                        $rootScope.addAlert('An unknown error has occured while restoring the group.', 'warning');
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

                ListService.refreshList(sendToServer, GroupService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('admin.groups.data', $scope.data);
                    HistoryService.save('admin.groups.metadata', $scope.metadata);

                    // We use $timeout here to ensure digest cycle has finished before declaring the list as loaded
                    $timeout(function () {
                        $scope.listLoading = false;
                    });
                });
            };
        }])

    .controller('GroupNewCtrl', ['$rootScope', '$scope', '$state', 'GroupService', 'PermissionService',
        function ($rootScope, $scope, $state, GroupService, PermissionService) {
            $scope.availablePermissions = {};
            $scope.group = {};
            $scope.validationErrors = {};

            $scope.saveGroup = function() {
                $scope.compilePermissionsToSend();
                GroupService.store($scope.group)
                    .success(function(res, status) {
                        $rootScope.addAlert('Group was successfully saved.', 'success');
                        $state.go('app.admin.groups');
                    })
                    .error(function(res, status) {
                        if (status == 422) { // Unprocessable Entity = validation errors in this case
                            $scope.validationErrors = res.data;
                        } else {
                            $rootScope.addAlert('Failed to save group due to an unknown error.', 'error');
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
                $scope.group.permissions = permissionsToSend;
            }

            $scope.compilePermissions = function() {
                // Walks the current permissions against the ones the group actively has and enable them
                for (var c in $scope.permissionCategories) {

                    // Starts browsing category's permissions
                    for (var p in $scope.permissionCategories[c].permissions) {
                        // Compares active permissions against the group's permissions
                        for (var ap in $scope.group.permissions) {
                            if ($scope.permissionCategories[c].permissions[p].name == $scope.group.permissions[ap].name) {
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

    .controller('GroupEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'GroupService', 'PermissionService',
        function ($scope, $rootScope, $state, $stateParams, GroupService, PermissionService) {
            // Loads information from service
            $scope.availablePermissions = {};
            $scope.group = {};
            $scope.validationErrors = {};

            $scope.loadData = function(id) {
                GroupService.get(id)
                    .success(function(res, status) {
                        $scope.group = res.data;
                        $scope.loadPermissions();
                    });
            };

            $scope.saveGroup = function() {
                $scope.compilePermissionsToSend();
                GroupService.update($scope.group)
                    .success(function(res, status) {
                        $rootScope.addAlert('Group was successfully saved.', 'success');
                        $state.go('app.admin.groups');
                    })
                    .error(function(res, status) {
                        if (status == 422) { // Unprocessable Entity = validation errors in this case
                            $scope.validationErrors = res.data;
                        } else {
                            $rootScope.addAlert('Failed to save group due to an unknown error.', 'error');
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
                $scope.group.permissions = permissionsToSend;
            }

            $scope.compilePermissions = function() {
                // Walks the current permissions against the ones the group actively has and enable them
                for (var c in $scope.permissionCategories) {

                    // Starts browsing category's permissions
                    for (var p in $scope.permissionCategories[c].permissions) {
                        // Compares active permissions against the group's permissions
                        for (var ap in $scope.group.permissions) {
                            if ($scope.permissionCategories[c].permissions[p].name == $scope.group.permissions[ap].name) {
                                $scope.permissionCategories[c].permissions[p].isAssigned = true;
                                break;
                            }
                        }
                    }
                }
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('GroupService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available groups. */
                getList: function (parameters) {
                    return $http
                        .get('/groups', {
                            params: parameters
                        });
                },
                /** Gets a single detailed group entry */
                get: function (id) {
                    return $http
                        .get('/groups/' + id);
                },
                /** Attempts to update the specified group in database */
                update: function (groupData) {
                    return $http({
                        method: 'PATCH',
                        url: '/groups/' + groupData.id,
                        data: groupData});
                },
                /** Attempts to create the specified group in database */
                store: function(groupData) {
                    return $http
                        .post('/groups', groupData);
                },
                destroy: function(groupData) {
                    return $http
                        .delete('/groups/' + groupData.id);
                }
            }
        }]);