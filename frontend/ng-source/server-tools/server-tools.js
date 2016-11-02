angular.module('server-tools', [
    'changelog',
    'cwMap'
])

.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('app.server-tools', {
            url: '/server-tools',
            templateUrl: 'server-tools/server-tools-index.html',
            ncyBreadcrumb: {
                skip: true
            }
        })
}])