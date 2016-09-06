/*! ProductDetailModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('productDetailModal', 
		['$log', '$location', 'dataStorageService', 'basketService', 'newOrderService',
		function ($log, $location, dataStorageService, basketService, newOrderService) {
			return {
				restrict : 'E',

				templateUrl : 'views/product/ProductDetailModal.html',
				
				controller : 'productDetailController',
				
				link : function (scope) {
					angular.element('#productDetailModal').on('show.bs.modal', function () {
						// Initialize product detail modal.
						// Look for product Id in the scope of this directive 
						// and use it to initialize model for view.
						if (scope.productId) {
							scope.model.initialized = false;
							scope.init(scope.productId);
						}
					});

					/**
					 * Close product detail modal.
					 */
					scope.closeProductDetailModal = function () {
						angular.element('#productDetailModal').modal('hide');
					};

					/**
					 * Cancel product detail modal.
					 */
					scope.cancelProductDetailModal = function () {
						angular.element('#productDetailModal').modal('hide');
					};

					scope.addItemToBasketAndReloadBasket = function () {
						scope.model.addToBasketItem.storeID = dataStorageService.getStoreId();

						// Get the selected sku Id
						scope.model.addToBasketItem.skuID = scope.getSelectedSku();

						// Only continue if we have a selected sku
						if (scope.model.addToBasketItem.skuID !== null && 
							scope.model.stockAvailable && 
							scope.model.addToBasketItem.qty > 0) {

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								var customerId = '';
								var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											// Get the basket Id from data storage
											var basketId = dataStorageService.getBasketId();

											// Make the service call to addItemToBasket
											basketService.addItemToBasket(basketId, scope.model.addToBasketItem).then(
												function (successResult) {
													if (successResult) {
														// Navigate to basket page.
														$location.path('/basket');
													}
												}, function (errorResult) {
													$log.error('An error occurred while adding item to the Basket.' + 
														errorResult);
												}
											);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Get the basket Id from data storage
								var basketId = dataStorageService.getBasketId();

								// Make the service call to addItemToBasket
								basketService.addItemToBasket(basketId, scope.model.addToBasketItem).then(
									function (successResult) {
										if (successResult) {
											var currentUrlPath = $location.path();
											if (currentUrlPath === '/basket') {
												// Fire basket reload event back upwards using $scope.$emit
												scope.$emit('reloadBasket');
											} else {
												// Navigate to basket page.
												$location.path('/basket');
											}
										}
									}, function (errorResult) {
										$log.error('An error occurred while adding item to the Basket.' + 
											errorResult);
									}
								);
							}
						}
					};
				}
			};
		}]);
}(window.angular));
