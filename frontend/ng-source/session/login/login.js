angular.module('session.login', [])

    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider.
                state('app.session.login', {
                    url: '/login',
                    templateUrl: 'session/login/login-view.html',
                    controller: 'LoginCtrl',
                    data: {
                        ncyBreadcrumbLabel: 'Login'
                    }
                });
        }])

    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$modal', 'SessionService',
        function ($scope, $rootScope, $state, $modal, SessionService) {
            // Checks if we're already connected
            if ($rootScope.user.isConnected) {
                $state.go('app.home');
            }

            $scope.loginCredentials = {};

            $scope.attemptLogin = function () {
                SessionService.login($scope.loginCredentials)
                    .success(function (res, status) {
                        var data = res.data;

                        // Empties login fields
                        $scope.loginCredentials.username = '';
                        $scope.loginCredentials.password = '';

                        // Declares user as connected and applies permission changes
                        if (data.isConnected) {
                            $rootScope.addAlert('You are now connected as ' + data.username + '.', 'success');
                            $rootScope.user = data;

                            $rootScope.buildPermissionsTree(
                                $rootScope.composePermissionsToObject(res.data.permissions)
                            );

                            // Redirect to home page
                            $state.go('app.home');
                        }
                    })
                    .error(function (res, status) {
                        var data = res.data;

                        if (status == 422) { // Unprocessable Entity/Validation Errors
                            $scope.validationErrors = data;
                        } else {
                            $rootScope.addAlert('Unknown error occured while connecting', 'warning');
                        }
                    });
            };
        }]);

