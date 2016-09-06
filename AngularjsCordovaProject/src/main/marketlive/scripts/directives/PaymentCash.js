/*! PaymentCash.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCash', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/PaymentCash.html',
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
                    scope.selectionType = 'CASH';

                    scope.mlPaymentModel.cash = {
                        'amount': '0',
                        'amountDisplay': scope.formatAmount('0'),
                        'buttons': scope.paymentService.getCashButtons()
                    };
                };

                /**
                 * Handel key selections.
                 * @param key
                 */
                scope.selectCashKey = function (key) {
                    if (key === 'Delete') {
                        var amount = scope.mlPaymentModel.cash.amount;
                        if (amount.length > 1) {
                            // remove last char
                            scope.mlPaymentModel.cash.amount = amount.substr(0, amount.length - 1);
                        }
                    } else {
                        scope.mlPaymentModel.cash.amount = scope.mlPaymentModel.cash.amount + key;
                    }
                    scope.mlPaymentModel.cash.amountDisplay = scope.formatAmount(scope.mlPaymentModel.cash.amount);
                };

                scope.formatAmount = function (amount) {
                    var formatted = parseInt(amount) / 100;
                    return formatted.toFixed(2);
                };

                scope.clearCash = function () {
                    scope.mlPaymentModel.cash.amount = '0';
                    scope.mlPaymentModel.cash.amountDisplay = scope.formatAmount('0');
                };

                /**
                 * Add the payment to the model and submit to the parent controller
                 */
                scope.applyPayment = function () {
                    if (parseInt(scope.mlPaymentModel.cash.amount) > 0){
                        var code = 'CASH';
                        var name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name');

                        var payment = {
                            'name': name,
                            'paymentType': name,
                            'paymentAmount': scope.mlPaymentModel.cash.amountDisplay,
                            'code': code
                        };

                        scope.mlPaymentModel.payments[code] = payment;

                        scope.mlParentSubmit();
                    }
                };

                /**
                 * Handel the form submit.
                 * This is where the form validation should happen
                 */
                scope.submitForm = function () {
                    // if we need to do validation, we'll do it here
                    scope.applyPayment();
                };

                /**
                 * Listen for a processPayment broadcast and validate/submit the data
                 */
                scope.$on('processPayment', function (event, data) {
                    if (data === scope.selectionType) {
                        scope.submitForm();
                    }
                });

                /**
                 * Listen for a resetPaymentDisplay broadcast and then clean up the display
                 */
                scope.$on('resetPaymentDisplay', function (event, data) {
                    if (data === scope.selectionType || !data) {
                        scope.clearCash();
                    }
                });

                // Init the model
                scope.init();
            }
        };
    });
}(window.angular, window._));

