/*! InStorePickupCustomerVerificationModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('inStorePickupCustomerVerificationModal', 
		['$log', '$location', '$translate', 'orderService', 'dataStorageService', 'securityService', 
		'receiptService', 'starPrinter', 'globalValidationService',
		function ($log, $location, $translate, orderService, dataStorageService, securityService, 
		receiptService, starPrinter, globalValidationService) {
			return {
				restrict : 'E',

				templateUrl : 'views/instorepickup/InStorePickupCustomerVerificationModal.html',
				
				scope : {
                    orderDetailDataModel : '='
                },

				link : function (scope) {
					scope.$watch('orderDetailDataModel', function (value) {
						if (value) {
							scope.init();
						}
					});

					scope.init = function () {
						scope.orderId = scope.orderDetailDataModel.id;
						scope.orderNumber = scope.orderDetailDataModel.code;
						scope.pickupShipment = scope.getPickupShipment();

						scope.processInStorePickup = scope.canProcessInStorePickup();

						scope.paymentTypeCreditCard = scope.isPaymentTypeCreditCard();
						scope.creditCardType = scope.getCreditCardType();
						scope.creditCardLastFourDigits = scope.getCreditCardLastFourDigits();

						scope.billingContactFirstName = scope.getBillingContactFirstName();
						scope.billingContactLastName = scope.getBillingContactLastName();
						
						scope.pickupContactFirstName = scope.getPickupContactFirstName();
						scope.pickupContactLastName = scope.getPickupContactLastName();
						scope.pickupCustomerEmail = scope.getPickupCustomerEmail();

						if ((scope.billingContactFirstName !== scope.pickupContactFirstName) || 
							(scope.billingContactLastName !== scope.pickupContactLastName)) {
							scope.cardVerificationRequired = false;
						} else {
							scope.cardVerificationRequired = true;
						}

						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						scope.pickupDone = false;
					};

					scope.reset = function () {
						$log.debug('In Store Pickup Customer Verification - reset()');

						scope.orderId = '';
						scope.orderNumber = '';
						scope.pickupShipment = null;

						scope.processInStorePickup = false;

						scope.paymentTypeCreditCard = false;
						scope.creditCardType = '';
						scope.creditCardLastFourDigits = '';

						scope.billingContactFirstName = '';
						scope.billingContactLastName = '';
						
						scope.pickupContactFirstName = '';
						scope.pickupContactLastName = '';
						scope.pickupCustomerEmail = '';

						scope.cardVerificationRequired = false;

						scope.creditCardVerified = false;
						scope.customerVerified = false;

						scope.receiptTypePrinter = false;
						scope.receiptTypeEmail = false;

						scope.showStep1 = true;
						scope.showStep2 = false;
						scope.showStep3 = false;

						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						scope.pickupDone = false;
					};

					scope.isPaymentTypeCreditCard = function () {
						var paymentTypeCreditCard = false;

						var payments = scope.orderDetailDataModel.payments;

						if (payments) {
							angular.forEach(payments, function (payment) {
								if (payment.paymentType === 'CREDIT CARD') {
									paymentTypeCreditCard = true;
								}
							});
						}

						return paymentTypeCreditCard;
					};

					scope.getCreditCardPayment = function () {
						var creditCardPayment = null;

						var payments = scope.orderDetailDataModel.payments;

						if (payments) {
							angular.forEach(payments, function (payment) {
								if (payment.paymentType === 'CREDIT CARD') {
									creditCardPayment = payment;
								}
							});
						}

						return creditCardPayment;
					};

					scope.getCreditCardType = function () {
						if (scope.isPaymentTypeCreditCard()) {
							return scope.getCreditCardPayment().cardType;
						} else {
							return '';
						}
					};

					scope.getCreditCardLastFourDigits = function () {
						if (scope.isPaymentTypeCreditCard()) {
							return scope.getCreditCardPayment().maskedNumber;
						} else {
							return '';
						}
					};

					scope.getPickupShipment = function () {
						var pickupShipment = null;

						angular.forEach(scope.orderDetailDataModel.shipments, function (shipment) {
							angular.forEach(shipment.items, function (item) {
								if (dataStorageService.getStoreId() === item.storeID) {
									pickupShipment = shipment;
								}
							});
						});

						return pickupShipment;
					};

					scope.canProcessInStorePickup = function () {
						var canProcessInStorePickup = false;

						if (scope.pickupShipment) {
							if (scope.pickupShipment.status === 'Pickup Ready' &&
								securityService.authorize(
								dataStorageService.getLoggedInCSR(), ['INSTORE_PICKUP'])) {

								canProcessInStorePickup = true;
							}
						}

						return canProcessInStorePickup;
					};

					scope.getBillingContactFirstName = function () {
						if (scope.orderDetailDataModel.billToInfo) {
							return scope.orderDetailDataModel.billToInfo.firstName;
						}

						return '';
					};

					scope.getBillingContactLastName = function () {
						if (scope.orderDetailDataModel.billToInfo) {
							return scope.orderDetailDataModel.billToInfo.lastName;
						}

						return '';
					};

					scope.getPickupContactFirstName = function () {
						if (scope.pickupShipment) {
							return scope.pickupShipment.shipmentInfo.person.firstName;
						}

						return '';
					};

					scope.getPickupContactLastName = function () {
						if (scope.pickupShipment) {
							return scope.pickupShipment.shipmentInfo.person.lastName;
						}

						return '';
					};

					scope.getPickupCustomerEmail = function () {
						var pickupCustomerEmail = '';

						if (scope.pickupShipment) {
							if (scope.pickupShipment.shipmentInfo) {
								pickupCustomerEmail = scope.pickupShipment.shipmentInfo.email;
							}
						}

						if (!pickupCustomerEmail) {
							if (scope.orderDetailDataModel.customer) {
								return scope.orderDetailDataModel.customer.email;
							}
						}

						return pickupCustomerEmail;
					};

					scope.processStep1 = function () {
						if (scope.isPaymentTypeCreditCard() && scope.cardVerificationRequired) {
							if (scope.creditCardVerified && scope.customerVerified) {
								scope.showStep1 = false;
								scope.showStep2 = true;
								scope.showStep3 = false;

								if (!scope.signature.isEmpty()) {
									scope.clearSignature();
								}
							}
						} else if (scope.customerVerified) {
							scope.showStep1 = false;
							scope.showStep2 = true;
							scope.showStep3 = false;

							if (!scope.signature.isEmpty()) {
								scope.clearSignature();
							}
						}
					};

					scope.processStep2 = function (orderId, orderShipmentId) {
						var hasSignature = !scope.signature.isEmpty();

						if (hasSignature) {
							scope.clearSignature();

							orderService.moveToPickupDoneState(orderId, orderShipmentId, dataStorageService.getStoreId())
								.then(
								function (successResult) {
									if (successResult) {
										scope.showStep1 = false;
										scope.showStep2 = false;
										scope.showStep3 = true;

										scope.pickupDone = true;

										angular.element('#pickupCustomerEmail').focus();
									}
								}, function (errorResult) {
									$log.error(errorResult);
								});
						}

                        if (!dataStorageService.isPrinterConnected()) {
							scope.printerAvailable = false;

							$translate('lbl.ppos.noDevice').
								then(function (msg) {
									scope.deviceName = msg;
								});
                        } else {
							scope.printerAvailable = true;
							scope.deviceName = dataStorageService.getStarMicronicsPrinterName();
						}
					};

					scope.processStep3 = function () {
						// Assume there are no validation errors.
						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						if (angular.element('#pickupCustomerEmail').hasClass('ng-invalid-email')) {
							scope.hasValidationErrors = true;

							$translate('msg.ppos.invalidEmail').
								then(function (msg) {
									scope.validationErrors.push(msg);
									angular.element('#pickupCustomerEmail').focus();
								});
						} else if (!globalValidationService.isEmailValid(scope.pickupCustomerEmail)) {
							scope.hasValidationErrors = true;

							$translate('msg.ppos.invalidEmail').
								then(function (msg) {
									scope.validationErrors.push(msg);
									angular.element('#pickupCustomerEmail').focus();
								});
						} else {
							if (scope.receiptTypeEmail)	{
								receiptService.emailPickupDone(
									scope.orderId, dataStorageService.getStoreId(), 
									dataStorageService.getLoggedInCSR().id, scope.pickupCustomerEmail)
									.then(
									function (successResult) {
										if (successResult) {
										}
									}, function (errorResult) {
										$log.error(errorResult);
									});
							}

							if (scope.receiptTypePrinter) {
								receiptService.printPickupDone(
									scope.orderId, dataStorageService.getStoreId(), 
									dataStorageService.getLoggedInCSR().id)
									.then(
									function (successResult) {
										if (successResult) {
											scope.assembleTestPage = [];
											// Split the template data
											scope.assembleTestPage = successResult.data.split(',');
											window.temp =  scope.assembleTestPage;
											starPrinter.printTestPage(scope.assembleTestPage);
										}
									}, function (errorResult) {
										$log.error(errorResult);
									});
							}

							if (scope.receiptTypePrinter || scope.receiptTypeEmail) {
								scope.showStep1 = false;
								scope.showStep2 = false;
								scope.showStep3 = false;
								angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
								//angular.element('#inStorePickupConfirmationModal').modal('show');
                            }
						}
					};

					/////////////////////////////////// Cancel Steps ///////////////////////////////////

					scope.cancelStep1 = function () {
						scope.reset();

						scope.init();

						angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
					};

					scope.cancelStep2 = function () {
						scope.clearSignature();

						scope.showStep1 = true;
						scope.showStep2 = false;
						scope.showStep3 = false;
					};

					scope.clearSignature = function () {
						scope.signature.clear();
					};

					// Show "Pickup Confirmation" if user clicked on "No Receipt".
					scope.noReceipt = function () {
						scope.receiptTypePrinter = false;
						scope.receiptTypeEmail = false;

						scope.showStep1 = false;
						scope.showStep2 = false;
						scope.showStep3 = false;
						angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
						//angular.element('#inStorePickupConfirmationModal').modal('show');
					};

					scope.closeInStorePickupCustomerVerificationModal = function () {
						// Show "Pickup Confirmation" if user clicked on close icon from "Pickup Receipt".
						if (scope.showStep3) {
							scope.receiptTypePrinter = false;
							scope.receiptTypeEmail = false;

							scope.showStep1 = false;
							scope.showStep2 = false;
							scope.showStep3 = false;
							angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
							//angular.element('#inStorePickupConfirmationModal').modal('show');
						} else {
							scope.reset();

							scope.init();

							angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
						}
					};

					scope.showInStorePickupCustomerVerificationModal = function () {
						scope.reset();
						
						scope.init();

						angular.element('#inStorePickupCustomerVerificationModal').modal('show');
					};

					angular.element('#inStorePickupCustomerVerificationModal').on('hidden.bs.modal', function () {
						// On hide of #inStorePickupCustomerVerificationModal show #inStorePickupConfirmationModal
						if (scope.pickupDone) {

							if (scope.receiptTypeEmail && !scope.pickupCustomerEmail) {
								scope.receiptTypeEmail = false;
								scope.$apply();
							}
							
							angular.element('#inStorePickupConfirmationModal').modal('show');
						}
					});

					/////////////////////////
					/////////////////////////
					scope.inStorePickupConfirmationDone = function () {
						angular.element('#inStorePickupConfirmationModal').modal('hide');
					};

					scope.closeInStorePickupConfirmationModal = function () {
						angular.element('#inStorePickupConfirmationModal').modal('hide');
					};

					scope.safeApply = function(fn) {
						var phase = scope.$root.$$phase;

						if (phase === '$apply') {
							fn();
						} else {
							$location.path('/dashboard');
							scope.$apply();
						}
					};

					angular.element('#inStorePickupConfirmationModal').on('hidden.bs.modal', function () {
						scope.reset();

						// Navigate to dashboard page.
						// https://coderwall.com/p/ngisma/safe-apply-in-angular-js
						// monkey patch...
						scope.safeApply(function() {
						  $location.path('/dashboard');
						});
					});
					/////////////////////////
					/////////////////////////

					scope.reset();
				}
			};
	}]);
}(window.angular));
