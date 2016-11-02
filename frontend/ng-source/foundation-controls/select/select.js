angular.module('foundation-controls.select', [])

    .directive('foundationSelect', [
        function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    validationErrors: '=validationErrors',
                    model: '=model',
                    choices: '=choices',
                    label: '=label'
                },
                templateUrl: 'foundation-controls/select/select-view.html'
            }
        }
    ]);