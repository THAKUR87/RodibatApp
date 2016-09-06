/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('customerSearchModalController',
		['$log', '$scope', '$location', 'dataStorageService', 'customerSearchService', 'appService',
		'basketService', 'newOrderService',

			function ($log, $scope, $location, dataStorageService, customerSearchService, appService,
				basketService, newOrderService) {

				$scope.customerSearchDataModel = {
					customerPhoneNumber : null,
					customerSearchResult : null
				};
				
				$scope.showPhoneNumberRequiredMessage = false;

				$scope.showInValidPhoneNumberMessage = false;

				$scope.showCustomerSearchModal = function () {
					angular.element('#customerSearchModal').modal('show');

					clearCustomerSearchData();

					angular.element('#customerPhoneNumber').focus();
					
					// PEBL-16348
					// Focus issue https://github.com/angular-ui/bootstrap/issues/2017
					// Adding plain JS for a work around
					document.getElementById('customerPhoneNumber').focus();
					angular.element('#customerPhoneNumber').select();

				};
				
				$scope.close = function () {
					clearCustomerSearchData();
					angular.element('#customerSearchModal').modal('hide');
				};

				$scope.cancel = function () {
					clearCustomerSearchData();
					angular.element('#customerSearchModal').modal('hide');
				};

				$scope.searchCustomer = function () {
					var isValid = true;

					if (!$scope.customerSearchDataModel.customerPhoneNumber) {
						isValid = false;
						$scope.showPhoneNumberRequiredMessage = true;
						$scope.showInValidPhoneNumberMessage = false;
						angular.element('#customerPhoneNumber').focus();
					} else if (!validateCustomerPhoneNumber($scope.customerSearchDataModel.customerPhoneNumber)) {
						isValid = false;
						$scope.showPhoneNumberRequiredMessage = false;
						$scope.showInValidPhoneNumberMessage = true;
						angular.element('#customerPhoneNumber').focus();
					}

					if (isValid) {
						if ($scope.customerSearchDataModel.customerPhoneNumber != null) {
							appService.activateSpinner();

							customerSearchService.searchCustomerByPhoneNumber(
								$scope.customerSearchDataModel.customerPhoneNumber)
								.then(
								function (successResult) {
									//removeGuestCustomer(successResult);
									if (successResult.data == null) {
										// If found 0 customer, it will start the 
										// basket with a phone number in a customer profile.
										// Customer provides phone number, sales associate 
										// enters and no record is found. Guest record is 
										// created with phone number only and 
										// store information for remaining required fields, 
										// and associated to the order. In this case, 
										// customer does not want to provide any further information.

										$scope.startNewOrder(null);
									} else if (successResult.data.length === 1) {
										// If found 1 customer, it will start the basket with customer's profile name.

										$scope.startNewOrder(successResult.data[0].id);
									} else if (successResult.data.length > 1) {
										// If found more than 1 customer, 
										// it will display customer list for the 
										// store associate to narrow down to a single customer.

										$scope.customerSearchDataModel.customerSearchResult = successResult;
										appService.deactivateSpinner();
									} else {
										appService.deactivateSpinner();
									}
								}, function (errorResult) {
									if (errorResult.data.responseCode === '404') {
										// If found 0 customer, it will start the 
										// basket with a phone number in a customer profile.
										// Customer provides phone number, sales associate 
										// enters and no record is found. Guest record is 
										// created with phone number only and 
										// store information for remaining required fields, 
										// and associated to the order. In this case, 
										// customer does not want to provide any further information.

										$scope.startNewOrder(null);
									} else {
										appService.deactivateSpinner();
									}
								});
						}
					}
				};


				/**
			* removes current customer from 
			**/
			/*function removeGuestCustomer (successResult) {
				for (var idx = 0;idx < successResult.data.length ; idx++) {
					// remove the customer record from the list if:
					// customer found is guest.
					if (successResult.data[idx].guest === true) {
						//alert('one');
						successResult.data.splice(idx, 1);
					}
				}
			}*/

				$scope.skipCustomerSearchAndStartNewOrder = function () {
					$scope.customerSearchDataModel.customerPhoneNumber = null;
					$scope.startNewOrder(null);
				};

				/**
				 * Start New Order.
                 *
				 * 1) Create Customer if not available.
				 * 2) Set Customer ID in storage.
				 * 3) Create Basket for Customer.
				 * 4) Set Basket ID in storage.
				 */
				$scope.startNewOrder = function (customerId) {
					var storeId = dataStorageService.getStore().id;

					var csrId = dataStorageService.getLoggedInCSR().id;

					var phone = $scope.customerSearchDataModel.customerPhoneNumber;
					if (!phone) {
						phone = '';
					}

					newOrderService.startNewOrder(customerId, storeId, csrId, phone)
						.then(
						function (successResult) {
							appService.deactivateSpinner();

							if (successResult) {
								$log.debug('New Order Response : ' + angular.toJson(successResult));

								// Clear customer search data
								clearCustomerSearchData();

								// Hide customer search modal.
								angular.element('#customerSearchModal').modal('hide');

								// Navigate to basket page.
								$location.path('/basket');
							}
						}, function (errorResult) {
							appService.deactivateSpinner();

							$log.error('An error occured while starting new Order.' + errorResult);
						});
				};

				$scope.searchAgain = function () {
					clearCustomerSearchData();
				};

				function validateCustomerPhoneNumber (customerPhoneNumber) {
					if (!customerPhoneNumber) {
						return false;
					} 

					var isPhoneNumberRegularExpression = /^\d{10}$/;
					return String(customerPhoneNumber).search(isPhoneNumberRegularExpression) !== -1;
				}

				/**
				 * Clears customer search data.
				 */
				function clearCustomerSearchData () {
					$scope.customerSearchDataModel = {
						customerPhoneNumber : null,
						customerSearchResult : null
					};
					$scope.showPhoneNumberRequiredMessage = false;
					$scope.showInValidPhoneNumberMessage = false;
				}
			}]);

			angular.module('pointOfSaleApplication').directive('showFocus', ['$timeout', function ($timeout) {
				return function(scope, element, attrs) {
					scope.$watch(attrs.showFocus, 
						function (newValue) {
							$timeout(function() {
								if (newValue) {
									element.focus();
								}
							});
						}, true);
				};    
			}]);
}(window.angular));
