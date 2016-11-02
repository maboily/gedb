angular.module('session', [
    'session.login',
    'session.logout'
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider.
                state('app.session', {
                    templateUrl: 'session/session-index.html'
                });
        }])

    .controller('SessionCtrl')

    .factory('SessionService', ['$http',
        function ($http) {
            return {
                /** Persists a user's login during whole application reloads */
                restore: function () {
                    return $http
                        .post('/restore');
                },
                /** Attempts to login with the given credentials */
                login: function (credentials) {
                    return $http
                        .post('/login', credentials);
                },
                /** Attempts to logout */
                logout: function () {
                    return $http
                        .get('/logout');
                }
            }
        }]);