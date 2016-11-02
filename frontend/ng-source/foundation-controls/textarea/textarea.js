angular.module('foundation-controls.textarea', [])

    .directive('foundationTextarea', [
        function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    validationErrors: '=validationErrors',
                    model: '=model',
                    label: '=label'
                },
                templateUrl: 'foundation-controls/textarea/textarea-view.html'
            }
        }
    ]);