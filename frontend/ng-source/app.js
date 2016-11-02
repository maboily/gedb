// Custom methods (ToDo: Move out of ng-app.js)
window.mobilecheck = function() {
    var check = false;
    (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function extendDeep(dst) {
    angular.forEach(arguments, function(obj) {
        if (obj !== dst) {
            angular.forEach(obj, function(value, key) {
                if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                    extendDeep(dst[key], value);
                } else {
                    dst[key] = value;
                }
            });
        }
    });
    return dst;
};

var baseApp = null;
if (window.mobilecheck()) {
    // Mobile-mode angular app
    baseApp = angular.module('gedbApp', [
        'ngSanitize',
        'ui.router',
        'ncy-angular-breadcrumb',
        'mm.foundation',
        'ngProgress',
        'hc.marked',

        'components',
        'database',
        'admin',
        'foundation-controls',
        'session',
        'server-tools',
        'sticky'
    ]);
} else {
    // Desktop-mode angular app
    baseApp = angular.module('gedbApp', [
        //'ngAnimate',
        'ngSanitize',
        'ui.router',
        'ncy-angular-breadcrumb',
        'mm.foundation',
        'ngProgress',
        'hc.marked',
        'angularFileUpload',

        'components',
        'database',
        'admin',
        'foundation-controls',
        'session',
        'server-tools',
        'vertilize',
        'sticky'
    ]);
}

baseApp.config(['$stateProvider', '$breadcrumbProvider', '$urlRouterProvider',
        function ($stateProvider, $breadcrumbProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider.
                state('app', {
                    templateUrl: 'base-index.html',
                    controller: 'MainCtrl',
                    ncyBreadcrumb: {
                        skip: true
                    }
                }).
                state('app.home', {
                    url: '/',
                    templateUrl: 'base-home.html'
                });


            $breadcrumbProvider.setOptions({
                templateUrl: 'breadcrumbs/breadcrumbs-view.html'
            });
        }])

    .directive('customFilters', [
        function() {
            return {
                restrict: 'E',
                scope: {
                    metadata: '=metadata',
                    activeFiltersOut: '&activeFilters'
                },
                link: function($scope) {
                    $scope.passFilters = function(filters) {
                        $scope.activeFiltersOut({ filters: filters });
                    }
                },
                controller: 'CustomFilterCtrl',
                templateUrl: 'custom-filters/custom-filters-view.html'
            }
        }
    ])

    .directive('stopClickEvents', [
        function() {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    element.on('click', function(event) {
                            event.stopPropagation();
                            //event.preventDefault();
                    });
                }
            }
        }
    ])

    .factory('ListService', ['$q', '$rootScope', 'ngProgress',
        function ($q, $rootScope, ngProgress) {
            return {
                prepareDataForServer: function(data) {
                    var sendToServer = {};
                    for (var key in data) {
                        sendToServer[key] = data[key];
                    }

                    return sendToServer;
                },

                refreshList: function (sendToServer, service) {
                    var deferred = $q.defer();

                    ngProgress.start();

                    service.getList(sendToServer)
                        .success(function (res) {
                            // Store data and metadata information
                            var response = res;

                            // Surrounds data by a fake group if there was no group specified
                            if (res.metadata.grouped && sendToServer.groupBy == '') {
                                response.data = [{groupName: '', data: res.data}];
                            }

                            ngProgress.complete();
                            deferred.resolve(response);
                        })
                        .error(function (res, status) {

                            if (status == 404) {
                                $rootScope.addAlert('404: Could not find resource.', 'alert');
                            } else {
                                $rootScope.addAlert(status + ': ' + res.data, 'warning');
                            }
                            ngProgress.complete();
                            deferred.reject();
                        });

                    return deferred.promise;
                }
        }
    }])

    .factory('FilterService', [function() {
        return {
            createFilter: function(name, comparator, value) {
                return {
                    name: name,
                    comparator: comparator,
                    value: value
                };
            },

            compileFiltersForServer: function(filters) {
                var serverRequest = { filtersCount: 0 };

                for (var filterIdx in filters) {
                    var filter = filters[filterIdx];

                    serverRequest['filter_' + serverRequest.filtersCount + '_name'] = filter.name;
                    serverRequest['filter_' + serverRequest.filtersCount + '_comparator'] = filter.comparator;
                    serverRequest['filter_' + serverRequest.filtersCount + '_value'] = filter.value;
                    serverRequest.filtersCount++;
                }

                return serverRequest;
            }
        }
    }])

    .controller('CustomFilterCtrl', ['$scope', 'FilterService',
        function($scope, FilterService) {
            $scope.activeFilters = [];

            $scope.$watch('activeFilters', function() {
                $scope.recompileRules();
            }, true);

            $scope.addNewRule = function() {
                // Gets currently selected filter
                var selectedFilter = $scope.metadata.availableFilters[$scope.selectedNewFilter];

                // Constructs new filter rule
                var newFilterRule = {};
                newFilterRule.name = $scope.selectedNewFilter;
                newFilterRule.description = selectedFilter.description;
                newFilterRule.type = selectedFilter.type;
                newFilterRule.values = selectedFilter.values;
                $scope.activeFilters.push(newFilterRule);
            };

            $scope.removeFilter = function(filterIndex) {
                $scope.activeFilters.splice(filterIndex, 1);
            };

            $scope.recompileRules = function() {
                var recompiledActiveFilters = [];
                var filtersCount = 0;

                for (var i = 0; i < $scope.activeFilters.length; i++) {
                    var activeFilter = $scope.activeFilters[i];
                    var compiledFilterData = {};

                    if (activeFilter.value1 == undefined) {
                        activeFilter.value1 = '';
                    }
                    if (activeFilter.value2 == undefined) {
                        activeFilter.value2 = '';
                    }

                    // Checks filter mode
                    if (activeFilter.filterMode == 'Contains') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'like', '%' + activeFilter.value1 + '%'));
                    } else if (activeFilter.filterMode == 'IsEmpty') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'eq', ''));
                    } else if (activeFilter.filterMode == 'EqualsTo') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'eq', activeFilter.value1));
                    } else if (activeFilter.filterMode == 'NotEqualsTo') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'neq', activeFilter.value1));
                    }else if (activeFilter.filterMode == 'IsTrue') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'eq', 'TRUE'));
                    } else if (activeFilter.filterMode == 'IsFalse') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'eq', 'FALSE'));
                    } else if (activeFilter.filterMode == 'GreaterThan') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'gt', activeFilter.value1));
                    } else if (activeFilter.filterMode == 'LowerThan') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'lt', activeFilter.value1));
                    } else if (activeFilter.filterMode == 'GreaterOrEqualTo') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'get', activeFilter.value1));
                    } else if (activeFilter.filterMode == 'LowerOrEqualTo') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'let', activeFilter.value1));
                    } else if (activeFilter.filterMode == 'IsBetweenExclusive') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'gt', activeFilter.value1));
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'lt', activeFilter.value2));
                    } else if (activeFilter.filterMode == 'IsBetweenInclusive') {
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'get', activeFilter.value1));
                        recompiledActiveFilters.push(FilterService.createFilter(activeFilter.name, 'let', activeFilter.value2));
                    }
                }

                $scope.passFilters(FilterService.compileFiltersForServer(recompiledActiveFilters));
            };

            $scope.appendFilterData = function(activeRules, ruleCount, name, comparator, value) {
                activeRules['filter_' + ruleCount + '_name'] = name;
                activeRules['filter_' + ruleCount + '_comparator'] = comparator;
                activeRules['filter_' + ruleCount + '_value'] = value;
            };

            $scope.getFilterDescription = function(filter) {
                return $scope.metadata.columns[filter.$key];
            }
        }
    ])

    .controller('MainCtrl', ['$scope', '$rootScope', '$state', '$modal', 'SessionService', 'ngProgress',
        function ($scope, $rootScope, $state, $modal, SessionService, ngProgress) {
            $scope.defaultUser = {
                isConnected: false,
                permissions: []
            };

            // Binds $state to the root scope
            $rootScope.$state = $state;
            $rootScope.globalLoading = true;

            // Clones the default user, taking into account the user is logged out
            $rootScope.user = extendDeep({}, $scope.defaultUser);

            // Composes the permissions received into a javascript object
            $rootScope.composePermissionsToObject = function(permissionsReceived) {
                var composedPermissions = {};

                // Goes line by line and completes the composed permissions array
                for (var p = 0; p < permissionsReceived.length; p++) {
                    // Splits current permission in namespace
                    var splitPermission = permissionsReceived[p].split('.');
                    var currentPermissionLocation = {};

                    // Browses split permission array
                    for (var sp = 0; sp < splitPermission.length; sp++) {
                        // Gets split permission name
                        var splitPermissionName = splitPermission[sp];

                        // Creates object if we're at the first part
                        if (sp == 0) {
                            if (typeof composedPermissions[splitPermissionName] != 'undefined') {
                                // Permission already exists in composed array
                                currentPermissionLocation = composedPermissions[splitPermissionName];
                            } else {
                                // Permission path doesn't exists in composed array: create it
                                composedPermissions[splitPermissionName] = currentPermissionLocation;
                            }
                        }

                        // Checks if we're at the last part
                        if (sp + 1 == splitPermission.length) {
                            currentPermissionLocation[splitPermissionName] = true;
                        } else if (sp != 0) {
                            if (typeof currentPermissionLocation[splitPermissionName] == 'undefined') {
                                // Make sure the permission doesn't exist before erasing it
                                currentPermissionLocation[splitPermissionName] = {};
                            }

                            currentPermissionLocation = currentPermissionLocation[splitPermissionName];
                        }
                    }
                }

                return composedPermissions;
            };

            $rootScope.buildPermissionsTree = function(permissionsOverride) {
                // Builds the base permission tree
                var rebuiltPermissions = extendDeep({
                    database: {
                        characters: {
                            view: true,
                            extendedView: false
                        },

                        skills: {
                            view: true,
                            extendedView: false
                        },

                        stances: {
                            view: true,
                            extendedView: false
                        },

                        items: {
                            view: true,

                            armors: {
                                view: true,
                                extendedView: false,
                                edit: false,
                                delete: false
                            },

                            artifacts: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            backCostumes: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            belts: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            boots: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            consumables: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            costumes: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            earrings: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            faceCostumes: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            gloves: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            medals: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            necklaces: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            others: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            quests: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            recipes: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            rings: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            stanceBooks: {
                                view: true,
                                extendedView: false,
                                delete: false
                            },

                            weapons: {
                                view: true,
                                extendedView: false,
                                delete: false
                            }
                        }
                    },

                    admin: {
                        view: false,

                        users: {
                            view: false,
                            edit: false,
                            delete: false,
                            new: false
                        },

                        groups: {
                            view: false,
                            edit: false,
                            delete: false,
                            new: false
                        },

                        permissions: {
                            view: false
                        }
                    },

                    tools: {
                        changelog: {
                            view: true,
                            edit: false,
                            new: false,
                            delete: false
                        },

                        cwMap: {
                            view: true,
                            new: false,
                            edit: false,
                            delete: false,

                            possibleOccupation: {
                                view: true
                            },

                            occupation: {
                                view: true,
                                new: false,
                                edit: false,
                                delete: false
                            }
                        }
                    },


                    blog: {
                        view: false,
                        edit: false,
                        new: false
                    }
                }, permissionsOverride);

                // Inserts 'any' permissions
                function recursiveInsertAny(currentLevelEntry) {
                    if (typeof currentLevelEntry == 'object') {
                        // Clears 'any' entry
                        currentLevelEntry['any'] = {};

                        for (var subEntryIdx in currentLevelEntry) {
                            var subEntry = currentLevelEntry[subEntryIdx];

                            if (subEntryIdx != 'any') {
                                currentLevelEntry[subEntryIdx] = recursiveInsertAny(subEntry);
                            } else {
                                currentLevelEntry[subEntryIdx] = subEntry;
                            }
                        }

                        // Merges all array entries for the current item into the any entry
                        for (var subEntryIdx in currentLevelEntry) {
                            var subEntry = currentLevelEntry[subEntryIdx];

                            currentLevelEntry['any'][subEntryIdx] = subEntry;
                            currentLevelEntry['anyValue'] = recursiveCompleteAnyValue(subEntry);
                        }
                    }

                    return currentLevelEntry;
                }

                function recursiveCompleteAnyValue(currentLevelEntry) {
                    var anyVal = false;

                    if (typeof currentLevelEntry == 'object') {
                        for (var subEntryIdx in currentLevelEntry) {
                            if (subEntryIdx != 'anyValue' && subEntryIdx != 'any') {
                                anyVal |= recursiveCompleteAnyValue(currentLevelEntry[subEntryIdx]);

                                if (typeof currentLevelEntry[subEntryIdx] == 'boolean') {
                                    anyVal |= currentLevelEntry[subEntryIdx];
                                }
                            }
                        }
                    }

                    return anyVal;
                }

                // Done
                rebuiltPermissions = recursiveInsertAny(rebuiltPermissions);
                $rootScope.permissions = rebuiltPermissions;
            };

            $rootScope.hasPermission = function (permissionName) {
                // Replace . with [.]
                var permissionNameExpression = permissionName.replace('.', '[.]');

                // Seeks asterisks
                var lastAsterisk = permissionNameExpression.lastIndexOf('*');
                if (lastAsterisk + 1 == permissionNameExpression.length) {
                    // Replace last asterisk with full search regex
                    permissionNameExpression =
                        permissionNameExpression.substr(0, lastAsterisk) +
                        '.{1,}' +
                        permissionNameExpression.substr(lastAsterisk + 1);
                }

                // Replaces other asterisks with standard regexes
                permissionNameExpression =
                    permissionNameExpression.replace('*', '[^.]{1,}');

                // Search through regex in array
                var permissionNameRegExp = new RegExp('^' + permissionNameExpression + '$');
                for (permissionIdx in $rootScope.user.permissions) {
                    if (permissionNameRegExp.test($rootScope.user.permissions[permissionIdx])) {
                        // Match was found
                        return true;
                    }
                }

                return false;
            };

            $scope.setSubMenu = function(menuName) {
                $scope.subMenu = menuName;
            };

            $scope.restoreUser = function() {
                $rootScope.globalLoading = true;
                SessionService.restore()
                    .success(function (res) {
                        $rootScope.user = res.data;
                        $rootScope.buildPermissionsTree(
                            $rootScope.composePermissionsToObject(res.data.permissions)
                        );
                        $rootScope.globalLoading = false;
                    });
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $scope.changeTitle(toState);

                if (toState.data && toState.data.requiredPermission && !$rootScope.hasPermission(toState.data.requiredPermission)) {
                    event.preventDefault();
                    return false;
                }
            });

            $scope.changeTitle = function(toState) {
                var baseName = 'GE Database';

                if (toState.ncyBreadcrumb && toState.ncyBreadcrumb.label) {
                    $rootScope.pageTitle = toState.ncyBreadcrumb.label;
                    document.title = toState.ncyBreadcrumb.label + ' - ' + baseName;
                } else {
                    $rootScope.pageTitle = '';
                    document.title = baseName;
                }
            };

            $rootScope.alerts = [];

            $rootScope.addAlert = function(message, type) {
                // Removes last added alert
                if ($rootScope.alerts.length >= 5) {
                    $rootScope.removeAlert(0);
                }

                $rootScope.alerts.push({
                    message: message,
                    type: type
                });
            }

            $rootScope.removeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            }

            $scope.changeTitle($state.current);
            $scope.restoreUser();
        }])

    .factory('HistoryService', [
        function() {
            var historyScope = {};

            historyScope.storedData = {};

            historyScope.loadOrCreate = function(dataName, defaultValue) {
                if (historyScope.storedData[dataName]) {
                    return historyScope.storedData[dataName];
                } else {
                    historyScope.storedData[dataName] = defaultValue;
                    return defaultValue;
                }
            };

            historyScope.save = function(dataName, value) {
                historyScope.storedData[dataName] = value;
            };

            return historyScope;
        }
    ])

    .directive('ngUpdateHidden',
    function () {
        return {
            restrict: 'AE', //attribute or element
            scope: {},
            replace: true,
            require: 'ngModel',
            link: function ($scope, elem, attr, ngModel) {
                $scope.$watch(ngModel, function (nv) {
                    elem.val(nv);
                });
                elem.change(function () { //bind the change event to hidden input
                    $scope.$apply(function () {
                        ngModel.$setViewValue(elem.val());
                    });
                });
            }
        };
    })

    .filter('toArray', function () {
        return function (obj, addKey) {
            if ( addKey === false ) {
                return Object.keys(obj).map(function(key) {
                    return obj[key];
                });
            } else {
                return Object.keys(obj).map(function (key) {
                    if(typeof obj[key] == 'object') return Object.defineProperty(obj[key], '$key', {     enumerable: false, value: key});
                });
            }
        };
    });