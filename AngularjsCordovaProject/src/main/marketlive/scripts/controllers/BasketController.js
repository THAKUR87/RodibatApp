/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('basketController', 
		['$scope', '$location', '$route', 'dataStorageService', 'basketService',
			'accountService', 'scanBarcodeService', '$log', '$q', 'productCatalogService',

			function ($scope, $location, $route, dataStorageService, basketService, 
				accountService, scanBarcodeService, $log, $q, productCatalogService) {
		
				$scope.barcodeService = scanBarcodeService;

				$scope.customerInformation = null;
				
				$scope.basketDetailDataModel = null;

				$scope.currentStore = dataStorageService.getStore();

				$scope.basketId = dataStorageService.getBasketId();

				$scope.storeId = dataStorageService.getStoreId();

				$scope.loggedInCSR = dataStorageService.getLoggedInCSR();

				$scope.skuBarcodeSearchPostData = {
					basketId: $scope.basketId || null,
					csrId: $scope.loggedInCSR.id || null,
					storeId: $scope.storeId || null
				};

				// Listen to basket reload and react on that.
				$scope.$on('reloadBasket', function() {
					$scope.initializeCustomerDetail(dataStorageService.getCustomerId());
					$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
				});

				/**
				 * This function gets basket details based on the given basket ID.
				 * 
				 * @param {Number} basketId - The ID of the basket to get details.
				 */
				$scope.initializeBasketDetailDataModel = function (basketId) {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = false;
					if (basketId) {
						basketService.getBasketById(basketId)
							.then(
							function (successResult) {
								$scope.basketDetailDataModel = successResult;

								$scope.basketDetailDataModel.isAutoSaveBag = basketService.isAutoSaveBag();
								
								var skuAvailabilityAtOnlinePromises = [];
								var skuAvailabilityAtStorePromises = [];

								angular.forEach($scope.basketDetailDataModel.data.shipments, function (shipment) {
									angular.forEach(shipment.items, function (item) {
										if(item.isPickupFromStore === true) {
											skuAvailabilityAtOnlinePromises.push(
											$scope.isSkuAvailableOnline(item.skuID));
										} else {
											sessionStorage.showShippingModal = true;
											var storeId = dataStorageService.getStoreId();
											skuAvailabilityAtStorePromises.push(
												$scope.isSkuAvailableAtStore(item.skuID, storeId));
										}
									});
								});

								$q.all(skuAvailabilityAtOnlinePromises)
									.then(
									function (result) {
										angular.forEach(result, function (response) {
											angular.forEach($scope.basketDetailDataModel.data.shipments, 
												function (shipment) {
													angular.forEach(shipment.items, function (item) {
														if(item.isPickupFromStore === true) {
															if(response.data.sku === item.skuID) {
																item['isAvailableInStore'] = true;
																// modify basket response to accomodate availability
																if(response.data.qtyAvailable >= item.qty) {
																	item['isAvailableOnline'] = true;
																} else {
																	item['isAvailableOnline'] = false;
																}
															}
														}
													});
											});
										});
								});

								$q.all(skuAvailabilityAtStorePromises)
									.then(
									function (result) {
										angular.forEach(result, function (response) {
											angular.forEach($scope.basketDetailDataModel.data.shipments, 
												function (shipment) {
													angular.forEach(shipment.items, function (item) {
														if(item.isPickupFromStore === false) {
															if(response.data.sku === item.skuID) {
																item['isAvailableOnline'] = true;
																// modify basket response to accomodate availability
																if(response.data.qtyAvailable >= item.qty) {
																	item['isAvailableInStore'] = true;
																} else {
																	item['isAvailableInStore'] = false;
																}
															}
														}
													});
											});
										});
								});
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};

				$scope.isSkuAvailableOnline = function (skuId) {
					return productCatalogService.getInventory(skuId, null);
				};
				
				$scope.isSkuAvailableAtStore = function (skuId, storeId) {
					return productCatalogService.getInventory(skuId, storeId);
				};

				/**
				 * This function gets customer details based on the given customer ID.
				 * 
				 * @param {Number} customerId - The ID of the customer to get details.
				 */
				$scope.initializeCustomerDetail = function (customerId) {
					if (customerId) {
						accountService.getCustomerById(customerId)
							.then(
							function (successResult) {
								var customerDetail = successResult.data;
								if (customerDetail.primaryContact.person.firstName === 'Guest' && 
									customerDetail.primaryContact.person.lastName === 'Guest') {
									$scope.customerInformation = 'Guest';
								} else {
									$scope.customerInformation = customerDetail.primaryContact.person.firstName + 
										' ' + customerDetail.primaryContact.person.lastName;
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};
				
				/**
				 * This function updates the basket item.
				 * 
				 * @param {Number} basketId - The basket ID.
				 * @param {Number} basketItemId - The basket item ID.
				 * @param {Number} productId - The prodicy ID.
				 * @param {Number} skuId - The Sku ID.
				 * @param {Number} qty - The quantity to update.
				 */
				$scope.updateBasketItem = function (basketId, basketItemId, productId, skuId, qty, store) {
					var storeId = null;
					if (store !== null) {
						storeId = store.id;
					}
					var basketItems = {
						'basketItems' : [
							{
								'basketItemID' : basketItemId,
								'productID' : productId,
								'skuID' : skuId,
								'qty' : qty,
								'storeID' : storeId
							}
						]
					};
					
					if (basketId && basketItemId) {
						if (qty === 0) {
							// PEBL-14659 If entered quantity is equal to 0 then remove item from basket.
							$scope.removeItemFromBasket(basketId, basketItemId);
						} else {
							basketService.updateBasketItems(basketId, basketItems)
								.then(
								function (successResult) {
									if (successResult) {
										$scope.initializeBasketDetailDataModel(basketId);
									}
								}, function (errorResult) {
									console.log(errorResult);
								});
						}
					}
				};

				/**
				 * This function deletes item from basket.
				 * 
				 * @param {Number} basketId - The ID of the basket to delete basket item from.
				 * @param {Number} basketItemId - The ID of the basket item to delete.
				 */
				$scope.removeItemFromBasket = function (basketId, basketItemId) {
					if (basketId && basketItemId) {
						basketService.removeItemFromBasket(basketId, basketItemId)
							.then(
							function (successResult) {
								if (successResult) {
									$scope.initializeBasketDetailDataModel(basketId);
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};
				
				/**
				 * This function removes given source code from basket.
				 * 
				 * @param {Number} basketId - The ID of the basket to remove source code.
				 * @param {String} sourceCode - The source code to remove.
				 */
				$scope.removeSourceCode = function (basketId, sourceCode) {
					if (basketId && sourceCode) {
						basketService.removeSourceCode(basketId, sourceCode)
							.then(
							function (successResult) {
								if (successResult) {
									$scope.initializeBasketDetailDataModel(basketId);
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};

				$scope.saveBag = function (basketId) {
					basketService.saveBag(basketId, dataStorageService.getLoggedInCSR().id)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.initializeBasketDetailDataModel(basketId);

								angular.element('#saveBagSuccessModal').modal('show');
							}
						}, function (errorResult) {
							console.log(errorResult);
						});
				};

				$scope.setItemAsShipTo = function (basketId, basketItem) {
					// Set the received basket item as ship to item
					if (basketItem.isPickupFromStore) {
						accountService.getCustomerById(
							dataStorageService.getCustomerId()).then(function (successResult) {
						if (successResult.data.primaryContact.id) {
							var basketItemToUpdate = prepareBasketItem(basketItem, 
									successResult.data.primaryContact.id, null);
							var shipToBasketItems = {
								'basketItems' : [basketItemToUpdate],
							};
							basketService.updateBasketItems(basketId, shipToBasketItems).then(function (successResult) {
								$log.info(successResult);
								$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
							}, function(errorResult) {
								$log.error(errorResult);
							});
						}
						}, function (errorResult) {
							$log.error(errorResult);
						});
					}
				};

				$scope.setItemAsPickup = function (basketId, basketItem) {
					// Set the received basket item as pickup item
					/*store id not null
					contact id = -1*/
					if (!basketItem.isPickupFromStore) {
						var basketItemToUpdate = prepareBasketItem(basketItem, null,
							dataStorageService.getStoreId());
						var shipToBasketItems = {
							'basketItems' : [basketItemToUpdate],
						};
						basketService.updateBasketItems(basketId, shipToBasketItems).then(function (successResult) {
							$log.info(successResult);
							$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
						}, function(errorResult) {
							$log.error(errorResult);
						});
					}
				};

				function prepareBasketItem (basketItem, shipToContactId, storeId) {
					var shipTobasketItem = {
						'basketItemID' : basketItem.id,
						'productID' : basketItem.product.id,
						'skuID' : basketItem.skuID,
						'qty' : basketItem.qty,
						'storeID' : storeId,
						'shipToContactID' : shipToContactId
					};

					return shipTobasketItem;
				}

				$scope.scanSuccessHandler = function () {
					var scrollContainer = angular.element('.ml-ppos-basket-detail-container .ml-ppos-scroll-container'),
						itemsContainer = scrollContainer.find('div:first');

					$scope.reinitializeBasketDetailDataModel();
					scrollContainer.animate({ scrollTop: itemsContainer.height() }, 'slow');
				};

				$scope.viewProductDetail = function (productId) {
					// Navigate to product detail page.
					$location.url('/productDetail?productId=' + productId + '&fromProductSearch=false');
				};

				$scope.reinitializeBasketDetailDataModel = function () {
					$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
				};
				
				// Initialize basket model for view.
				$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());

				// Initialize customer details.
				$scope.initializeCustomerDetail(dataStorageService.getCustomerId());

			}]);
}(window.angular));
