/*! PaymentController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('paymentController',
        ['$log', '$scope', '$location', '$timeout', 'paymentService',
            'dataStorageService', 'basketService', 'starPrinter', 'appService',

            function ($log, $scope, $location, $timeout, paymentService,
                      dataStorageService, basketService, starPrinter, appService) {

                // Add the paymentService to the scope, so that it can be passed along to
                // the payment type directives
                $scope.paymentService = paymentService;

                $scope.selection = 'PAYMENT_SELECTION';

                /**
                 * The main model for this controller.
                 * @type {{
                 *      id: {(string|null)},
                 *      total: {(string|null)},
                 *      paymentTypes: {(object[]|null)},
                 *      payments: {(object|null)},
                 *      creditCard: {(object|null)},
                 *      cash: object,
                 *      signature: object,
                 *      lastSection: string
                 *      }}
                 */
                $scope.model = {
                    'id': null,
                    'total': null,
                    'paymentTypes': null,
                    'payments': {},
                    'creditCard': {},
                    'cash': {},
                    'signature': {},
                    'lastSection': '',
                    'orderInProgress': false,
                    'enableCashDrawer': true,
                    'authData': null
                };

                /**
                 * This function is used to display the payment modal.
                 * @param id The basket id.
                 * @param total The basket total
                 */
                $scope.showPaymentModal = function (id, total) {
                    appService.activateSpinner();

                    $scope.model.checkoutInProgress = false;
					// TODO : Remove shipping modal session storage in phase 2
					if (sessionStorage.showShippingModal === 'true') {
                        $timeout(function() {
                            angular.element('#hiddenOpener').trigger('click');
                        }, 0);
					} else {
						$log.debug('paymentController: showPaymentModal');

                        // make sure we clear out any possible remaining change values from previous payments
                        dataStorageService.removeItem('paymentChange');

						$scope.selection = 'PAYMENT_SELECTION';
						$scope.$broadcast('resetPaymentDisplay', null);

						$scope.orderPlaced = false;

						$scope.model.signature.penColor = 'rgb(255,255,255)';
						$scope.clearSignature();

						paymentService.getPayments().then(function (successResult) {
							var paymentTypes = successResult;

							$scope.model.id = id;
							$scope.model.total = total;
							$scope.model.paymentTypes = paymentTypes;
							$scope.model.payments = {};
							$scope.model.displayBalance = total;
							$scope.model.placeOrder = false;
							$scope.model.data = {};
                            $scope.model.authData = null;
							// TODO - remove in phase 2
							//Hit basketService to get updated total, 
							//total can change because of different shipping method
							basketService.getBasketById(dataStorageService.getBasketId())
							.then(
							function (successResult) {
								$scope.model.total = successResult.data.total;
								$scope.model.displayBalance = successResult.data.total;
								// TODO : In phase 2 this 'show' call will be out of this rest call
								// this call will not be required, as shipping modal will be per item
                                appService.deactivateSpinner();
                                angular.element('#paymentModal').modal('show');
							}, function (errorResult) {
                                $log.error(errorResult);
                                appService.deactivateSpinner();
							});
						}, function (errorResult) {
                            $log.error(errorResult);
                            appService.deactivateSpinner();
                        });
					}
                };

                /**
                 * This function is used by inline class selection 'ng-class' to determine what should be displayed.
                 * @returns {boolean}
                 */
                $scope.showDefaultLayout = function () {
                    var showDefaultLayout = true;

                    if ($scope.selection === 'SIGNATURE' || $scope.selection === 'CREDIT_CARD_SWIPE') {
                        showDefaultLayout = false;
                    }

                    return showDefaultLayout;
                };

                /**
                 * This function is used to select a view (*selection*) to display. It also sets the last view
                 * ('lastSection') displayed.
                 * @param type
                 */
                $scope.select = function (type) {
                    $log.debug('paymentController: select: ' + type);

                    $scope.model.lastSection = $scope.selection + '';
                    $scope.selection = type;
                    $scope.model.placeOrder = false;
                };

                /**
                 * This function is fired on click of the generic cancel button. It's used to preform cleanup
                 * operations and forward the user to the *PAYMENT_SELECTION* view.
                 */
                $scope.cancel = function () {
                    $log.debug('paymentController: cancel');
					
                    $scope.model.placeOrder = $scope.model.data.placeOrder;
                    $scope.clearSignature();
                    $scope.$broadcast('resetPaymentDisplay', $scope.selection);

                    $scope.selection = 'PAYMENT_SELECTION';

                };

                /**
                 * This function calls the *addPayment* service. All payments in the model's payments property are
                 * processed by this service call.
                 */
                $scope.addPayment = function () {
                    $log.debug('paymentController: addPayment');

                    paymentService.addPayment($scope.model.id, {'payments': _.toArray($scope.model.payments)}).then(
                        function (successResult) {
                            if (successResult) {

                                $scope.model.data = successResult.data;
                                $scope.model.displayBalance = $scope.model.data.displayBalance;
                                $scope.model.placeOrder = $scope.model.data.placeOrder;
                                if ($scope.model.placeOrder) {
                                    // Open the cash register on successfully adding/modifying a cash payment.
                                    if ($scope.model.enableCashDrawer &&
                                        $scope.selection === 'CASH' && $scope.model.payments['CASH']) {
                                        starPrinter.openCashDrawer();
                                    }

                                    if ($scope.model.data.change) {
                                        dataStorageService.setPaymentChange($scope.model.data.change);
                                    }

                                    appService.activateSpinner();

                                    $scope.basketCheckout();
                                } else {
                                    $scope.selection = 'PAYMENT_SELECTION';
                                }
                            }
                        }, function (errorResult) {
                            $log.error(errorResult.data);
                            $log.error(errorResult.data.errorMessage);
                        }
                    );
                };

                /**
                 * This function is fired on click of the generic 'Add Payment' button. It broadcasts a *processPayment*
                 * event for the current *selection* view to pickup and process (processPayment)
                 */
                $scope.apply = function () {
                    $log.debug('paymentController: apply');

                    $scope.$broadcast('processPayment', $scope.selection);
                };

                /**
                 * This function removes a payment, for the given payment code, from the model's *payments* property.
                 * @param code A payment code.
                 */
                $scope.removePayment = function (code) {
                    $log.debug('paymentController: removePayment');

                    delete $scope.model.payments[code];

                    $scope.$broadcast('resetPaymentDisplay', code);

                    $scope.selection = 'PAYMENT_SELECTION';

                    $scope.addPayment();
                };

                /**
                 * This function is used to call the basketCheckout service.
                 */
                $scope.basketCheckout = function () {
                    if ($scope.model.checkoutInProgress !== true){

                        $scope.model.checkoutInProgress = true;
                        $log.debug('paymentController: basketCheckout');
                        var store = dataStorageService.getStore();

                        paymentService.basketCheckout(store.id,
                            $scope.model.id, {'payments': _.toArray($scope.model.payments)}).then(
                            function (successResult) {
                                if (successResult) {
                                    $scope.orderPlaced = true;

                                    angular.element('#paymentModal').modal('hide');
                                    dataStorageService.removeItem('basketId');
                                    dataStorageService.setFinalizedOrderId($scope.parseOrderId(successResult.data));

                                    appService.deactivateSpinner();

                                    $scope.$emit('order');
                                }
                                $scope.model.checkoutInProgress = false;
                            }, function (errorResult) {
                                $scope.model.checkoutInProgress = false;
                                appService.deactivateSpinner();

                                $log.error(errorResult.data);
                                $log.error(errorResult.data.errorMessage);
                            }
                        );
                    }
                };

                /**
                 * This function is used to parse the order id from the *basketCheckout* service call.
                 * @param data The data returned from the *basketCheckout* service call.
                 * @returns {string} The order id.
                 */
                $scope.parseOrderId = function (data) {
                    $log.debug('paymentController: parseOrderId');

                    return data.substr(data.lastIndexOf('/') + 1);
                };

                /**
                 * This function is used to 1) clear any previous signature gathered and 2) switch to the
                 * signature view.
                 */
                $scope.captureSignature = function () {
                    $log.debug('paymentController: captureSignature');

                    $scope.clearSignature();
                    $scope.selection = 'SIGNATURE';
                };

                /**
                 * This function is used to clear the signature data in the model
                 */
                $scope.clearSignature = function () {
                    $log.debug('paymentController: clearSignature');

                    $scope.model.signature.clear();
                };

                /**
                 * This function is called on signature accept and fires a broadcast for the last directive's controller
                 * (lastSelection) to pick up and process (processPayment)
                 */
                $scope.acceptSignature = function () {
                    $log.debug('paymentController: acceptSignature');

                    var hasSignature = !$scope.model.signature.isEmpty();

                    if (hasSignature) {
                        $scope.$broadcast('processPayment', $scope.model.lastSection);
                    }
                };

                /**
                 * This function is called on clicking the cancel button on the signature screen.
                 */
                $scope.cancelSignature = function () {
                    $scope.releaseAuthorization();
                    $scope.cancel();
                };

                /**
                 * This function is used to release any *authorized* payments and
                 * is called when the payment dialog is canceled.
                 */
                $scope.releaseAuthorization = function () {
                    $log.debug('paymentController: releaseAuthorization');

                    // Only continue if we have auth data to release
                    if ($scope.model.authData && $scope.model.authData.authRequestIDs &&
                        $scope.model.authData.authRequestIDs.length) {

                        paymentService.releaseAuthorization($scope.model.id,
                            $scope.model.authData).then(
                            function () {
                                $log.debug('paymentController: releaseAuthorization: Success');
                                $scope.model.authData = null;
                            },
                            function (errorResult) {
                                $log.error('paymentController: releaseAuthorization: Failed');
                                $log.error(errorResult);
                            }
                        );
                    }
                };

                /**
                 * This attaches an even to the Modal Dialog's *hidden* event, so we can do some
                 * cleanup after it's hidden.
                 */
                angular.element('#paymentModal').on('hidden.bs.modal', function () {
                    if ($scope.orderPlaced === false) {
                        $scope.releaseAuthorization();
                    }
                });

            }]);
}(window.angular, window._));
