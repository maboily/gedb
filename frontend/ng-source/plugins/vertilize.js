// Based on https://github.com/Sixthdim/angular-vertilize/
/*!
 * angular-vertilize 1.0.0
 * Christopher Collins
 * https://github.com/Sixthdim/angular-vertilize.git
 * License: MIT
 */

angular.module('vertilize', [])

    .directive('vertilizeContainer', [
        function(){
            return {
                restrict: 'EA',
                controller: [
                    '$scope', '$window', '$timeout',
                    function($scope, $window, $timeout){
                        // Alias this
                        var _this = this;

                        // Array of children heights
                        _this.childrenElements = [];

                        _this.allocate = function(element) {
                            _this.childrenElements.push({
                                baseElement: element,
                                heightWatcher: null
                            });

                            // Workaround: waits a bit before fixing heights
                            $timeout(function() {
                                _this.childrenElements.heightWatcher = $scope.$watch(function () {
                                    return element[0].offsetHeight;
                                }, function (newHeight) {
                                    _this.updateTallestHeight();
                                });
                            }, 1);
                        };

                        // API: Get tallest height
                        _this.updateTallestHeight = function(){
                            var height = 0;

                            for (var i = 0; i < _this.childrenElements.length; i++) {
                                height = Math.max(height, _this.childrenElements[i].baseElement[0].offsetHeight);
                            }

                            for (var i = 0; i < _this.childrenElements.length; i++) {
                                var elementToChange = _this.childrenElements[i].baseElement[0];

                                if (elementToChange.offsetHeight != height &&
                                    elementToChange.offsetHeight < height) {
                                    elementToChange.style.height = height + 'px';
                                }
                            }
                         };
                    }
                ]
            };
        }
    ])

    .directive('vertilize', [
        function(){
            return {
                restrict: 'EA',
                require: '^vertilizeContainer',
                link: function(scope, element, attrs, parent){
                    // Allocates element to parent collection
                    parent.allocate(element);
                }
            };
        }
    ]);