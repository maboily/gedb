angular.module('database.items', [
    'database.items.armors',
    'database.items.artifacts',
    'database.items.backCostumes',
    'database.items.belts',
    'database.items.boots',
    'database.items.consumables',
    'database.items.costumes',
    'database.items.earrings',
    'database.items.faceCostumes',
    'database.items.gloves',
    'database.items.medals',
    'database.items.necklaces',
    'database.items.others',
    'database.items.quests',
    'database.items.recipes',
    'database.items.rings',
    'database.items.stanceBooks',
    'database.items.weapons'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.items', {
                url: '/items',
                templateUrl: 'database/items/items-index.html',
                ncyBreadcrumb: {
                    label: 'Items'
                },
                data: {
                    requiredPermission: 'database.items.view'
                }
            })
    }])

    .factory('ItemsAdministrationService', ['$q', '$rootScope', 'ngProgress',
        function ($q, $rootScope, ngProgress) {
            return {
                deleteItem: function (itemId, itemAPIService) {
                    var deferred = $q.defer();

                    ngProgress.start();

                    itemAPIService.destroy(itemId)
                        .success(function (res, status) {
                            $rootScope.addAlert('Item ' + itemId + ' has been deleted and won\'t be shown to normal users anymore.', 'success');
                            ngProgress.complete();
                            deferred.resolve();
                        })
                        .error(function (res, status) {
                            $rootScope.addAlert('An unknown error occured while attempting to delete the item ' + itemId + '.', 'alert');
                            ngProgress.complete();
                            deferred.reject();
                        });

                    return deferred.promise;
                },

                restoreItem: function (itemId, itemAPIService) {
                    var deferred = $q.defer();

                    ngProgress.start();

                    itemAPIService.update({id: itemId, deleted_at: null})
                        .success(function (res, status) {
                            $rootScope.addAlert('Item ' + itemId + ' has been restored.');
                            ngProgress.complete();
                            deferred.resolve();

                        })
                        .error(function (res, status) {
                            $rootScope.addAlert('An unknown error occured while attempting to restore the item.', 'alert');
                            ngProgress.complete();
                            deferred.reject();
                        });

                    return deferred.promise;
                }
            }
        }])

    .directive('itemAdminBar', ['$rootScope',
        function($rootScope) {
            return {
                restrict: 'E',
                scope: {
                    item: '=item',
                    permissionNamespace: '=permissionNamespace',
                    deleteMethod: '&deleteMethod',
                    restoreMethod: '&restoreMethod'
                },
                link: function($scope) {
                    $scope.deleteItem = function(item) {
                        $scope.deleteMethod({ item: item });
                    };

                    $scope.restoreItem = function(item) {
                        $scope.restoreMethod({ item: item});
                    };
                },
                templateUrl: 'database/items/item-admin-bar/item-admin-bar-view.html'
            }
        }
    ])

    .factory('ItemsDatabaseService', ['$rootScope', '$q', '$state',
        function ($rootScope, $q, $state) {
        return {
            constructEnchantmentsHTML: function (item) {
                // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                var enchantmentsHTML = '';

                angular.forEach(item.enchantments, function (enchantment, enchantmentKey) {
                    if (enchantment.Rarity > 0) { // Makes sure enchantment can happen
                        // The class rare-enchant is used if the enchantment is a yellow one
                        enchantmentsHTML += '<li class="' + (enchantment.Grade == 1 ? 'rare-enchant' : '') + '">';

                        // Simply adds the enchantment's content
                        enchantmentsHTML += enchantment.Desc.replace('%s', enchantment.MinValue + '-' + enchantment.MaxValue).replace('%%', '%');

                        // Enchantment rate
                        enchantmentsHTML += '<span class="enchant-rate">';
                        enchantmentsHTML += '(1 out of ' + enchantment.Rarity + ')';
                        enchantmentsHTML += '</span>';

                        // End
                        enchantmentsHTML += '</li>';
                    }
                });

                if (enchantmentsHTML == '') { // Checks if no enchantment was found
                    enchantmentsHTML = '<em>No enchantments available</em>';
                }

                return enchantmentsHTML;
            },

            constructRecipeHTML: function (item) {
                // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                var recipeHTML = '';

                if (!item.recipe) { // Make the sure item even has a recipe
                    recipeHTML += '<em>No recipe available</em>';
                } else { // Item has a recipe: process it
                    // Who crafts it and level
                    recipeHTML += '<strong>Crafted by ' + item.recipe.CharName + ' (Level ' + item.recipe.RecipeLv + ')</strong>';

                    // Ingredients
                    angular.forEach(item.recipe.ingredients, function (ingredient, ingredientKey) {
                        // Start
                        recipeHTML += '<li>';

                        // Link
                        if ($rootScope.permissions.database.items.others.view) {
                            var compiledItemUrl = $state.href("app.database.items.others.view", { id: ingredient.ID });
                            recipeHTML += '<a href="' + compiledItemUrl + '">';
                        }

                        // Ingredient's image name
                        var imageName = '';
                        if (ingredient.ImgName.toLowerCase() != 'none') {
                            imageName = ingredient.ImgName.toLowerCase();
                        } else {
                            imageName = ingredient.FileName.toLowerCase();
                        }

                        // Ingredient's image
                        recipeHTML += '<img src="/images/illust/' + imageName + '.png" class="recipe-item-thumbnail" />';

                        // Ingredient's name/amount
                        recipeHTML += ingredient.ItemName + ' x' + ingredient.pivot.ingredient_amount;

                        // Link
                        if ($rootScope.hasPermission('database.items.others.view'))
                            recipeHTML += '</a>';

                        // End
                        recipeHTML += '</li>';
                    });
                }

                return recipeHTML;
            },

            parseIMCTags: function(text) {
                return text
                    // Special tags replace: replace {*br*} and \n to <br />
                    .replace(/(([{][\/ ]{0,}br[\/ ]{0,}[}])|\\n)/g, '<br />')

                    // Special tags replace: remove all non {*br*}
                    .replace(/({[^{]{1,}})/g, '');
            },

            getImageFileName: function(itemData) {
                // FileName is the default fallback if there's no ImgName present
                if (itemData.ImgName.toLowerCase() != 'none') {
                    return itemData.ImgName.toLowerCase();
                } else {
                    return itemData.FileName.toLowerCase();
                }
            }
        }
    }]);
