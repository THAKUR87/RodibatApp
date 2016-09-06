/*! PaymentCreditCardManual.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCreditCardManual', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/PaymentCreditCardManual.html',
            scope: {
                mlPaymentModel: '=',
                paymentService: '=',
                mlParentSubmit: '&'
            },
            link: function (scope) {

                /**
                 * Used to init the model for this payment
                 */
                scope.init = function () {
                    scope.selectionType = 'CREDIT_CARD_ENTRY';
                    scope.formSubmitted = false;

                    scope.mlPaymentModel.creditCard = scope.paymentService.getCreditCardOptions();

                    scope.paymentService.getCreditCardTypes().then(function(successResult){
                        scope.mlPaymentModel.creditCard.types = successResult.data;
                    }, function (errorResult) {
                        console.log(errorResult.data);
                        console.log(errorResult.data.errorMessage);
                    });
                };


                // Watch for changes on the credit card number
                scope.$watch('mlPaymentModel.creditCard.number', function(newValue) {
                    scope.ccTypeMatch(newValue);
                });

                /**
                 * Try to match the credit card number to a credit card and if a match is found, sync the model data
                 * @param value
                 */
                scope.ccTypeMatch = function (value){
                    var card, pattern, foundValue = '', i;

                    // Only continue if we have cards to iterate over
                    if (scope.mlPaymentModel.creditCard.types) {
                        // Iterate over all available cards and test the current number against the card's pattern
                        for (i = 0; i < scope.mlPaymentModel.creditCard.types.length; i++) {
                            card = scope.mlPaymentModel.creditCard.types[i];
                            pattern = new RegExp(card.pattern);

                            // If a match is found, update the 'foundValue' and break out of the loop
                            if (pattern.test(value)) {
                                foundValue = card.value;
                                break;
                            }
                        }

                        // Update the model data with the result
                        scope.mlPaymentModel.creditCard.type = foundValue;
                    }
                };

                /**
                 * Add the payment to the model and submit to the parent controller
                 */
                scope.applyPayment = function () {
                    var code = 'CARDPRESENT';
                    var name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name');
                    var payment = {
                        'paymentType': name,
                        'creditCardNumber': scope.mlPaymentModel.creditCard.number,
                        'creditCardExpiryMonth': scope.mlPaymentModel.creditCard.expiryMonth.selectedOption,
                        'creditCardExpiryYear': scope.mlPaymentModel.creditCard.expiryYear.selectedOption,
                        'creditCardType': scope.mlPaymentModel.creditCard.type,
                        'cvv2': scope.mlPaymentModel.creditCard.cvv,
                        'postalCode': scope.mlPaymentModel.creditCard.postalCode,
                        'code': code,
                        'name': name
                    };

                    scope.mlPaymentModel.payments[code] = payment;

                    scope.mlParentSubmit();
                };

                /**
                 * Handel the form submit.
                 * This is where the form validation should happen
                 */
                scope.submitForm = function (){
                    scope.formSubmitted = true;

                    // check to make sure the form is  valid
                    if (scope.paymentManualCreditCard.$valid) {
                        scope.applyPayment();
                    } else {
                        console.log('The form is NOT valid.');
                    }
                };

                /**
                 * Listen for a processPayment broadcast and validate/submit the data
                 */
                scope.$on('processPayment', function(event, data) {
                    if (data === scope.selectionType) {
                        scope.submitForm();
                    }
                });

                // Init the model
                scope.init();
            }
        };
    });
}(window.angular, window._));

