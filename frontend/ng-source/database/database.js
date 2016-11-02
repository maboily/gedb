angular.module('database', [
    'database.items',
    'database.skills',
    'database.stances',
    'database.thumbnail-modal'
])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database', {
                url: '/database',
                templateUrl: 'database/database-index.html',
                ncyBreadcrumb: {
                    skip: true
                }
            })
    }])

    .controller('DatabaseCtrl', ['$scope',
        function ($scope) {

        }])


    .factory('DatabaseService', [function() {
        return {

        }
    }]);