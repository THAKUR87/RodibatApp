/*! ProductOptions.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    // A Directive for displaying prices (is, was, free, etc)
    angular.module('pointOfSaleApplication').directive('mlProductOptions', function () {
        // Return the directive object
        return {
            restrict: 'A',
            templateUrl: 'views/product/ProductOptions.html',
            scope: {
                'options': '='
            },
            link: function (scope) {
                // Active state vars
                scope.selectedSkus = null;
                scope.activeOptionType = null;

				scope.$watch('options', function() {
					scope.selectedSkus = null;
					scope.activeOptionType = null;
				});

                /**
                 * Handles Option selection, updating active state vars (selectedSkus, activeOptionType, etc)
                 * @param {object} type The option type object.
                 * @param {object} option The option object.
                 */
                scope.selectOption = function (type, option) {
                    var selectable;

                    // Update the selectedOption property on the option type object
                    type.selectedOption = option;

                    // Update the scope, so we can keep track of the currently 'active' option type
                    scope.activeOptionType = type;

                    // Check to see if the current option is selectable
                    selectable = scope.isOptionSelectable(type, option);

                    // Only continue if the current option is selectable
                    if (selectable) {

                        if (scope.selectedSkus !== null && !scope.firstOptionSelect()) {
                            // We've already made some selections, so take an intersection of the sku IDs
                            scope.selectedSkus = _.intersection(scope.selectedSkus, option.skuIDs);
                        } else {
                            // We haven't make a selection yet, so just update the selectedSkus
                            scope.selectedSkus = option.skuIDs;
                        }

                    } else {
                        // If the option wasn't 'selectable' reset the selectedSkus with this options's sku IDs
                        scope.selectedSkus = option.skuIDs;
                    }

                    if (scope.selectedSkus){
                        scope.$emit('productOptionChanged', { selectedSkus: scope.selectedSkus });
                    }
                };

                /**
                 * Checks to see if we currently only have one, or less, selected option/optionType
                 * @returns {boolean} Returns true if we only have one selected option time or false otherwise
                 */
                scope.firstOptionSelect = function () {
                    var multipleOptionTypes,
                        selectedOptionTypeLength;

                    // Check to see if this product has multiple option types
                    multipleOptionTypes = scope.options.length > 1;

                    // Figure out how many options we already have selected
                    selectedOptionTypeLength = _.filter(scope.options, function (n) {
                        return n.selectedOption !== null;
                    }).length;

                    // If we have multiple option types and one or less selected options return true, otherwise false
                    return (multipleOptionTypes && selectedOptionTypeLength <= 1);
                };

                /**
                 * Checks to see if the provided option for the given option type is selectable
                 * @param {object} type The option type object.
                 * @param {object} option The option object.
                 * @returns {boolean}
                 */
                scope.isOptionSelectable = function (type, option) {
                    // Default 'selectable' to true
                    var selectable = true;

                    // Since we're flagging options as non-selectable...
                    // Only continue if our state vars confirm that we've had an option selected
                    if (scope.activeOptionType != null && scope.selectedSkus !== null) {
                        if (type !== scope.activeOptionType) {
                            // If the the type is outside our current activeOptionType, check the skuID's intersection
                            // to see if it's selectable
                            selectable = (_.intersection(scope.selectedSkus, option.skuIDs).length > 0);
                        } else if (type === scope.activeOptionType) {
                            // If the type is equal to the current activeOptionType, check to see if we have one or
                            // less prior selections, if so, enable this optionType's other options, otherwise check
                            // the skuID's intersection
                            selectable = (scope.firstOptionSelect()) ? true :
                                (_.intersection(scope.selectedSkus, option.skuIDs).length > 0);
                        }
                    }

                    return selectable;
                };
            }
        };
    });
}(window.angular, window._));

