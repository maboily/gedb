angular.module('database.thumbnail-modal', [])

    .controller('ThumbnailModalCtrl', ['$scope', 'thumbnail',
        function ($scope, thumbnail) {
            $scope.thumbnail = thumbnail;
        }]);