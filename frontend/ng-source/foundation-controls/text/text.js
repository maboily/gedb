angular.module('foundation-controls.text', [])

    .directive('foundationText', [
        function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    validationErrors: '=validationErrors',
                    model: '=model',
                    isPassword: '=isPassword',
                    label: '=label'
                },
                templateUrl: 'foundation-controls/text/text-view.html'
            }
        }
    ]);