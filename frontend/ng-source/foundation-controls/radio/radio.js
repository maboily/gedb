angular.module('foundation-controls.radio', [])

    .directive('foundationRadio', [
        function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    validationErrors: '=validationErrors',
                    model: '=model',
                    label: '=label',
                    groupName: '=groupName',
                    groupValue: '=groupValue'
                },
                templateUrl: 'foundation-controls/radio/radio-view.html'
            }
        }
    ]);