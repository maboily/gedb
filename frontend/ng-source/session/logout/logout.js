angular.module('session.logout', [])

    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider.
                state('app.session.logout', {
                    url: '/logout',
                    controller: 'LogoutCtrl',
                    data: {
                        ncyBreadcrumbLabel: 'Logout'
                    }
                });
        }])

    .controller('LogoutCtrl', ['$scope', '$rootScope', '$state', 'SessionService',
        function($scope, $rootScope, $state, SessionService) {
            // Checks if we're connected
            if ($rootScope.user.isConnected) {
                SessionService.logout()
                    .success(function () {
                        $rootScope.addAlert('You are now disconnected', 'success');

                        SessionService.restore()
                            .success(function(restoreRes) {
                                // Restores anonymous user
                                $rootScope.user = restoreRes.data;

                                $rootScope.buildPermissionsTree(
                                    $rootScope.composePermissionsToObject(restoreRes.data.permissions)
                                );

                                // Go to home state
                                // ToDo: Attempt to redirect to last state
                                $state.go('app.home');
                            });
                    })
                    .error(function (data) {
                        $rootScope.addAlert('Unknown error happened while logging out', 'warning');
                    });
            } else {
                // Go to home state regardless
                // ToDo: Attempt to redirect to last state
                $state.go('app.home');
            }
        }]);


