angular.module('foundation-controls.checkbox', [])

    .directive('foundationCheckbox', [
        function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    validationErrors: '=validationErrors',
                    model: '=model',
                    label: '=label'
                },
                templateUrl: 'foundation-controls/checkbox/checkbox-view.html'
            }
        }
    ]);