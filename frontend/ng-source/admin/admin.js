angular.module('admin', [
    'admin.users',
    'admin.groups'
   ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.admin', {
                url: '/admin',
                templateUrl: 'admin/admin-dashboard.html',
                ncyBreadcrumb: {
                    label: 'Admin Dashboard'
                },
                data: {
                    requiredPermission: 'admin.view'
                }
            })
    }])

    .controller('AdminDashboardCtrl', ['$scope',
    function($scope) {

    }]);