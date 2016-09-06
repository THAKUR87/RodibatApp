/*! NearByStoresModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('nearByStoresModal',
		['$log', '$location', 'dataStorageService', 'productCatalogService', 'nearByStoresService', 'appService',
		'googleMapsInitializer', 'geoService', 'basketService', 'newOrderService',
		function($log, $location, dataStorageService, productCatalogService, nearByStoresService, appService,
		googleMapsInitializer, geoService, basketService, newOrderService) {

			return {
				restrict : 'E',

				templateUrl : 'views/common/NearByStoresModal.html',

				link : function (scope) {
					scope.nearByStoresDataModel = {
						radiusArray : [],
						defaultRadius : '',
						selectedRadius : '',
						product : null,
						selectedSku : '',
						requestedQuantity : '',
						nearByStoresSearchKeyword : '',
						online : {
							availableQty : ''
						},
						stores : []
					};
					
					/**
					 * Show near by stores modal.
					 */
					scope.showNearByStoresModal = function (productId, skuId, requestedQuantity) {
						angular.element('#productDetailModal').modal('hide');

						angular.element('#nearByStoresModal').modal('show');

						scope.initNearByStoresDataModel(productId, skuId, requestedQuantity);
					};
					
					/**
					 * Close near by stores modal.
					 */
					scope.closeNearByStoresModal = function () {
						angular.element('#nearByStoresModal').modal('hide');
					};
					
					/**
					 * Cancel near by stores modal.
					 */
					scope.cancelNearByStoresModal = function () {
						// Add your logic here that you want to execute on cancel event.
					};

					/**
					 * Initialize the model with blank or null values.
					 */
					scope.initNearByStoresDataModel = function (productId, skuId, requestedQuantity) {
						scope.nearByStoresDataModel = {
							radiusArray : nearByStoresService.getRadiusArray(),
							defaultRadius : nearByStoresService.getDefaultRadius(),
							selectedRadius : nearByStoresService.getDefaultRadius(),
							product : null,
							selectedSku : '',
							requestedQuantity : '',
							nearByStoresSearchKeyword : '',
							online : {
								availableQty : ''
							},
							stores : []
						};
						
						var product = null;

						var selectedSku = null;

						// Get product by Id.
						productCatalogService.getProductById(productId)
							.then(
							function (successResult) {
								product = successResult.data;

								var skus = successResult.data.skus;

								if (skus) {
									// Iterate over each Sku and use the one 
									// that matches with the given sku.
									angular.forEach(skus, function (sku) {
										if (sku.id === skuId) {
											selectedSku = sku;

											// Set product in model.
											scope.nearByStoresDataModel.product = product;

											// Set selected sku in model.
											scope.nearByStoresDataModel.selectedSku = selectedSku;

											// Set the requested quantity.
											scope.nearByStoresDataModel.requestedQuantity = requestedQuantity;
											
											productCatalogService.getInventory(selectedSku.id, null)
												.then(
												function (successResult) {
													// Set online quantity available.
													var availableQty = successResult.data.qtyAvailable;
													scope.nearByStoresDataModel.online = {
														availableQty : availableQty,
														showStockAvailabilityMessage : false
													};
												}, function (errorResult) {
													$log.error(errorResult);
												});
											
											scope.searchNearByStores(true);
										}
									});
								}
							}, function (errorResult) {
								$log.error(errorResult);
							});
					};

					/**
					 * This function search for near by stores.
					 */
					 // TODO: jsDocs
					scope.searchNearByStores = function (newSearch) {
						// If its a new search then use default radius as distance.
						if (newSearch) {
							scope.nearByStoresDataModel.selectedRadius = nearByStoresService.getDefaultRadius();
						}

						// Google maps API initialized.
						googleMapsInitializer.mapsInitialized.then(function () {
							// Promised resolved.

							// Default search by current store zip code.
							var store = dataStorageService.getStore();
							var nearByStoresSearchKeyword = store.zipCode;

							// If user has provided search keyword then use that keyword.
							if (scope.nearByStoresDataModel.nearByStoresSearchKeyword) {
								nearByStoresSearchKeyword = 
									scope.nearByStoresDataModel.nearByStoresSearchKeyword;
							} else {
								scope.nearByStoresDataModel.nearByStoresSearchKeyword = 
									nearByStoresSearchKeyword;
							}
							
							// Get latitude and longitude.
							var getGeoLocationPromise = geoService.
								getGeoLocationByAddress(nearByStoresSearchKeyword);
							
							// Register a callback function to get called 
							// when the geo location data is resolved.
							getGeoLocationPromise
								.then(
								function (geoLocation) {
									// Prepare near by stores search request.
									var nearByStoresSearchRequest = {
										skuId : scope.nearByStoresDataModel.selectedSku.id,
										latitude : geoLocation.lat(),
										longitude : geoLocation.lng(),
										distance : scope.nearByStoresDataModel.selectedRadius
									};
									
									// Search near by stores based on latitude and longitude.
									var nearByStoresSearchResponsePromise = 
										nearByStoresService.searchNearByStores(nearByStoresSearchRequest);

									// Get stores from response and set in the model.
									nearByStoresSearchResponsePromise
										.then(
										function (successResult) {
											scope.nearByStoresDataModel.stores = successResult;

											// Initially don't display stock availability message.
											for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
												scope.nearByStoresDataModel.stores[i].
													showStockAvailabilityMessage = false;
											}
										}, function (errorResult) {
											$log.error(errorResult);
											scope.nearByStoresDataModel.stores = [];
										});
								}, function (error) {
									$log.error(error);
									scope.nearByStoresDataModel.stores = [];
								});
						}, function () {
							// Promise rejected.
						});
					};

					/**
					 * This function adds item to basket consuming inventory of webstore.
					 */
					scope.addItemToBasketFromWebStore = function () {
						if (scope.nearByStoresDataModel.requestedQuantity > 
							scope.nearByStoresDataModel.online.availableQty) {
							// Display stock availability message.
							scope.nearByStoresDataModel.online.showStockAvailabilityMessage = true;
							
							for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
								scope.nearByStoresDataModel.stores[i].
									showStockAvailabilityMessage = false;
							}
						} else {
							appService.activateSpinner();

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								// Customer and Basket are not in session. So create guest Customer and its Basket.

								var customerId = '';
								var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											var itemToAdd = {
												productID : scope.nearByStoresDataModel.product.id,
												skuID : scope.nearByStoresDataModel.selectedSku.id,
												qty : scope.nearByStoresDataModel.requestedQuantity,
												storeID : null
											};
											
											scope.addItemToBasketFromNearByStoresModal(
												dataStorageService.getBasketId(), itemToAdd);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Customer and Basket are in session.
								var itemToAdd = {
									productID : scope.nearByStoresDataModel.product.id,
									skuID : scope.nearByStoresDataModel.selectedSku.id,
									qty : scope.nearByStoresDataModel.requestedQuantity,
									storeID : null
								};
								
								scope.addItemToBasketFromNearByStoresModal(
									dataStorageService.getBasketId(), itemToAdd);
							}
						}
					};
					
					/**
					 * This function adds item to basket consuming inventory of given store.
					 */
					scope.addItemToBasketFromPhysicalStore = function (store) {
						var storeId = store.id;

						if (scope.nearByStoresDataModel.requestedQuantity > store.availableQty) {
							// Display stock availability message.
							for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
								if (scope.nearByStoresDataModel.stores[i].id === store.id) {
									scope.nearByStoresDataModel.stores[i].
										showStockAvailabilityMessage = true;
								} else {
									scope.nearByStoresDataModel.stores[i].
										showStockAvailabilityMessage = false;
								}
							}

							// Display stock availability message.
							scope.nearByStoresDataModel.online.showStockAvailabilityMessage = false;
						} else {
							appService.activateSpinner();

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								// Customer and Basket are not in session. So create guest Customer and its Basket.

								var customerId = '';
								//var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											var itemToAdd = {
												productID : scope.nearByStoresDataModel.product.id,
												skuID : scope.nearByStoresDataModel.selectedSku.id,
												qty : scope.nearByStoresDataModel.requestedQuantity,
												storeID : storeId
											};
											
											scope.addItemToBasketFromNearByStoresModal(
												dataStorageService.getBasketId(), itemToAdd);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Customer and Basket are in session.
								var itemToAdd = {
									productID : scope.nearByStoresDataModel.product.id,
									skuID : scope.nearByStoresDataModel.selectedSku.id,
									qty : scope.nearByStoresDataModel.requestedQuantity,
									storeID : storeId
								};
								
								scope.addItemToBasketFromNearByStoresModal(
									dataStorageService.getBasketId(), itemToAdd);
							}
						}
					};

					/**
					 * This function adds the given item to basket.
					 * 
					 * @param {Number} basketId - The ID of the basket to add item to.
					 * @param {Object} {
					 *			productID: Number,
					 *			skuID: Number,
					 *			qty: Number,
					 *			storeID: Number
					 *		} itemToAdd - The item to add object.
					 */
					scope.addItemToBasketFromNearByStoresModal = function (basketId, itemToAdd) {
						basketService.addItemToBasket(basketId, itemToAdd)
							.then(
							function (successResult) {
								appService.deactivateSpinner();

								if (successResult) {
									// Hide near by stores modal.
									angular.element('#nearByStoresModal').modal('hide');

									var currentUrlPath = $location.path();
									if (currentUrlPath === '/basket') {
										scope.initializeBasketDetailDataModel(basketId);
									} else {
										// Navigate to basket page.
										$location.path('/basket');
									}
								}
							}, function (errorResult) {
								$log.error('An error occurred while adding item to the Basket.' + 
									errorResult);
								appService.deactivateSpinner();

                                // Hide near by stores modal.
                                angular.element('#nearByStoresModal').modal('hide');

                                var currentUrlPath = $location.path();
                                if (currentUrlPath === '/basket') {
                                    scope.initializeBasketDetailDataModel(basketId);
                                } else {
                                    // Navigate to basket page.
                                    $location.path('/basket');
                                }
							});
					};

					scope.continueStockAvailability = function (store) {
						if (store) {
							scope.nearByStoresDataModel.requestedQuantity = store.availableQty;
							scope.addItemToBasketFromPhysicalStore(store);
						} else {
							scope.nearByStoresDataModel.requestedQuantity = 
								scope.nearByStoresDataModel.online.availableQty;
							scope.addItemToBasketFromWebStore();
						}
					};

					scope.cancelStockAvailability = function () {
						// Reset show stock availability message to false.
						for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
							scope.nearByStoresDataModel.stores[i].
								showStockAvailabilityMessage = false;
						}

						scope.nearByStoresDataModel.online.showStockAvailabilityMessage = false;
					};
				}
			};
		}]);
}(window.angular));
