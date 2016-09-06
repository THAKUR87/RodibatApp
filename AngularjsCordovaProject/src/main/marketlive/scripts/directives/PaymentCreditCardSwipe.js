/*! PaymentCreditCardSwipe.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCreditCardSwipe',
        ['$log', 'cardReaderService', function ($log, cardReaderService) {
            // Return the directive object
            return {
                restrict: 'E',
                templateUrl: 'views/basket/PaymentCreditCardSwipe.html',
                scope: {
                    mlPaymentModel: '=',
                    paymentService: '=',
                    mlParentSubmit: '&',
                    mlViewSelection: '=',
                    mlChangeSelection: '&'
                },
                link: function (scope) {
                    /**
                     * Used to init the model for this payment
                     */
                    scope.init = function () {
                        $log.debug('mlPaymentCreditCardSwipe: init');

                        scope.selectionType = 'CREDIT_CARD_SWIPE';
                        scope.sdkIsActive = false;
                        scope.readerIsConnected = false;
                        scope.readerIsAttached = false;
                        scope.isScanInError = false;
                        scope.sdkActivation = {};
                        scope.authInProgress = false;
                        scope.authFailed = false;
                        scope.authRequestIDs = '';
                        scope.amountAuthorized = '';
                        scope.authorizedCardType = '';
                        scope.maskedCardNumber = '';
                    };

                    /**
                     * This function makes a call to *activate* the sdk and *connect* the reader,
                     * or prepare the device for a *scan*, if the reader is already activated and connected
                     */
                    scope.initializeReader = function () {
                        $log.debug('mlPaymentCreditCardSwipe: initializeReader');

                        if (!scope.sdkIsActive) {
                            scope.nestedActivateSDK();
                        } else if (scope.sdkIsActive && scope.readerIsConnected) {
                            scope.scanCard();
                        }
                    };

                    /**
                     * This function tries to *activate* the sdk and *connect* to the reader device,
                     * and if successful, it then prepares the device for a *scan*
                     * otherwise flags are set for the error states and the errors are logged
                     */
                    scope.nestedActivateSDK = function () {
                        $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK');

                        try {
                            cardReaderService.activateSDK().then(
                                function () {
                                    $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK: activateSDK: Success');

                                    scope.sdkIsActive = true;
                                    cardReaderService.readerConnect().then(
                                        function () {
                                            $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK: ' +
                                            'readerConnect: Success');

                                            scope.readerIsConnected = true;
                                            scope.scanCard();
                                        },
                                        function (errorResult) {
                                            $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK:' +
                                            ' readerConnect: Failed');
                                            $log.error(errorResult);
                                            scope.readerIsConnected = false;
                                        }
                                    );

                                },
                                function (errorResult) {
                                    $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK: activateSDK: Failed');
                                    $log.error(errorResult);
                                    scope.sdkIsActive = false;
                                }
                            );
                        } catch (error) {
                            $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK:' +
                            ' Failed to activate/connect the card reader.');
                            $log.error(error);
                        }
                    };


                    /**
                     * This function tries to prepare the device for a scan.
                     */
                    scope.scanCard = function () {
                        $log.debug('mlPaymentCreditCardSwipe: scanCard');

                        scope.isScanInError = false;

                        if (!scope.sdkIsActive) {
                            scope.isScanInError = true;
                            return;
                        }
                        if (!scope.readerIsConnected) {
                            scope.isScanInError = true;
                            return;
                        }

                        cardReaderService.scanCard().then(
                            function (successResult) {
                                $log.debug('mlPaymentCreditCardSwipe: scanCard: Success');
                                var data = getStrRepr(successResult);
                                scope.isScanInError = false;
                                scope.authorizeCard(data);
                            },
                            function (errorResult) {
                                $log.error('mlPaymentCreditCardSwipe: scanCard: Failed ');
                                $log.error(errorResult);
                            }
                        );

                    };

                    /**
                     * This function is used to authorize the card with a back-end post.
                     * @param data The credit card track data.
                     */
                    scope.authorizeCard = function (data) {
                        $log.debug('mlPaymentCreditCardSwipe: authorizeCard');

                        scope.authInProgress = true;

                        cardReaderService.authorizeCard(scope.mlPaymentModel.id, {
                            trackData: data,
                            'payments': _.toArray(scope.mlPaymentModel.payments)
                        }).then(
                            function (successResult) {
                                if (successResult.data.success) {
                                    $log.debug('mlPaymentCreditCardSwipe: authorizeCard: Success');

                                    scope.authInProgress = false;
                                    scope.authFailed = false;
                                    scope.amountAuthorized = successResult.data.amountAuthorized;
                                    scope.authRequestIDs = successResult.data.requestIDs;
                                    scope.authorizedCardType = successResult.data.cardType;
                                    scope.maskedCardNumber = successResult.data.maskedCreditCardNumber;
                                    scope.mlChangeSelection({selection: 'SIGNATURE'});

                                    scope.mlPaymentModel.authData = {
                                        'creditCardType': scope.authorizedCardType,
                                        'authRequestIDs': scope.authRequestIDs
                                    };
                                } else {
                                    $log.error('mlPaymentCreditCardSwipe: authorizeCard: Failed');
                                    $log.error(successResult.data.error);

                                    scope.authInProgress = false;
                                    scope.authFailed = true;
                                    scope.scanCard();
                                }
                            },
                            function (errorResult) {
                                $log.error('mlPaymentCreditCardSwipe: authorizeCard: Failed');
                                $log.error(errorResult);

                                scope.authInProgress = false;
                                scope.authFailed = true;
                                scope.scanCard();
                            }
                        );
                    };

                    /**
                     * Add the payment to the model and submit to the parent controller
                     */
                    scope.applyPayment = function () {
                        $log.debug('mlPaymentCreditCardSwipe: applyPayment');

                        var code = 'CARDPRESENT',
                            name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name'),
                            payment = {
                            'paymentType': name,
                            'paymentAmount': scope.amountAuthorized,
                            'signatureVerified': true,
                            'authRequestIDs': scope.authRequestIDs,
                            'creditCardType': scope.authorizedCardType,
                            'maskedCreditCardNumber': scope.maskedCardNumber
                        };

                        scope.mlPaymentModel.payments[code] = payment;
                        scope.mlParentSubmit();
                    };

                    /**
                     * Watch the view selection so we can init all necessary pieces.
                     */
                    scope.$watch('mlViewSelection', function (value) {
                        if (value === scope.selectionType) {
                            cardReaderService.clearRunningTasks().then(function () {
                                scope.init();
                                scope.initializeReader();
                            });

                        }
                    });

                    /**
                     * Listen for a processPayment broadcast and validate/submit the data
                     */
                    scope.$on('processPayment', function (event, data) {
                        if (data === scope.selectionType) {
                            scope.applyPayment();
                        }
                    });

                    /**
                     * Takes an array of credit card track data and returns a concatenated string.
                     * @param array
                     * @returns {string}
                     */
                    function getStrRepr(array) {
                        var ret = [], a = array;
                        for (var i = 0; i < a.length; i++) {
                            if (a[i] === '\t'.charCodeAt(0)) {
                                ret[i] = '\\t';
                            } else if (a[i] === '\n'.charCodeAt(0)) {
                                ret[i] = '\\n';
                            } else if (a[i] === '\r'.charCodeAt(0)) {
                                ret[i] = '\\r';
                            } else if (a[i] === '\\'.charCodeAt(0)) {
                                ret[i] = '\\\\';
                                //printable
                            } else if (a[i] >= 0x20 && a[i] <= 0x7E) {
                                ret[i] = String.fromCharCode(a[i]);
                                //use \hex for all others
                            } else {
                                var hex = a[i].toString(16);
                                ret[i] = '\\' + (hex.length === 1 ? '0' : '') + hex; // eg. 0xab => \ab instead of \xab
                            }
                        }
                        return ret.join('');
                    }

                    // Make a call to init the scope
                    scope.init();
                }
            };
        }]);
}(window.angular, window._));

