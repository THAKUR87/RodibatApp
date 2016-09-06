/*! NumericSpinner.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
	'use strict';

	// A Directive for displaying a numeric spinner (often used to display Qty fields)
	angular.module('pointOfSaleApplication').directive('mlNumericSpinner', function () {
		// Return the directive object
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'views/common/NumericSpinner.html',
			scope: {
				'mappedValue': '=',
				'maxLength': '@'
			},
			link: function (scope) {

                /**
                 * Increment the mapped value.
                 * @param event
                 */
                scope.incrementValue = function (event) {
                    var currentVal, newValLength;

                    // Stop acting like a button
                    event.preventDefault();
                    event.stopPropagation();

                    // Get the current value
                    currentVal = scope.mappedValue / 1;

                    // Get what would be the new value's length
                    newValLength = ((parseInt(currentVal) + 1).toString()).length;

                    // Length of the updated value should not be greater than max length of the input text field.
                    if(scope.isNumeric(currentVal) && newValLength <= scope.maxLength) {
                        // Increment the value
                        currentVal = parseInt(currentVal) + 1;
                    } else if(!scope.isNumeric(currentVal) || isNaN(currentVal)) {
                        // Reset the value
                        currentVal = 0;
                    }

                    // Update the mapped value
                    scope.mappedValue = currentVal;
                };

                /**
                 * Decrement the mapped value.
                 * @param event
                 */
				scope.decrementValue = function (event) {
					var currentVal;

					// Stop acting like a button
					event.preventDefault();
					event.stopPropagation();

					// Get its current value
					currentVal = scope.mappedValue / 1;

                    // The current value should be numeric and greater than 0
                    if(scope.isNumeric(currentVal) && currentVal > 0) {
                        // Decrement the value
                        currentVal = parseInt(currentVal) - 1;
					} else {
                        // Reset the value
						currentVal = 0;
					}

                    // Update the mapped value
                    scope.mappedValue = currentVal;
				};

                /**
                 * Check to see if the provided value is Numeric
                 * @param value
                 * @returns {boolean}
                 */
				scope.isNumeric = function (value) {
					var reg = new RegExp('^\\d*$');
					return reg.test(value) && !isNaN(value);
				};

                /**
                 * Check to see if the button, of the provided 'buttonType,' should be disabled
                 * @param buttonType The type of the button (eg. 'increment', 'decrement')
                 * @returns {boolean}
                 */
                scope.isButtonDisabled = function (buttonType) {
                    var currentVal = scope.mappedValue / 1,
                        disable = false;

                    // If the current value is an empty string, set it to 0
                    if(currentVal === '') {
                        currentVal = 0;
                    }

                    // Switch based on the button type (eg. 'increment', 'decrement')
                    switch (buttonType) {
                        case 'increment':
                            if (scope.isNumeric(currentVal) &&
                                ((parseInt(currentVal) + 1).toString()).length > scope.maxLength) {
                                disable = true;
                            }
                            break;
                        case 'decrement':
                            if (parseInt(currentVal) === 0) {
                                disable = true;
                            }
                            break;
                    }

                    return disable;
                };

                /**
                 * Handle on blur events for the Qty field and adjust the value if necessary.
                 */
                scope.handleBlur = function () {
                    var value = scope.mappedValue;

                    if (value == null || value.length === 0 || (value + '').replace(/\s/g, '').length === 0 ||
                        !scope.isNumeric(value)) {
                        scope.mappedValue = 0;
                    } else {
                        scope.mappedValue = value/1;
                    }
                };

                /**
                 * Watch the mappedValue for changes and reset to '0' if necessary
                 */
                scope.$watch('mappedValue', function(value) {
                    if (!scope.isNumeric(value)) {
                        scope.mappedValue = 0;
                    }

					scope.$emit('quantityChanged', scope.mappedValue);
                });

			}
		};
	});
}(window.angular));

