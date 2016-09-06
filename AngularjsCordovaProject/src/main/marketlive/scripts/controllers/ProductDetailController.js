/*! ProductDetailController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('productDetailController',
        ['$scope', '$location', '$route', '$log', '$routeParams',
            'productCatalogService', 'dataStorageService', 'basketService', 'configService', 'newOrderService',
            function ($scope, $location, $route, $log, $routeParams,
                      productCatalogService, dataStorageService, basketService, configService, newOrderService) {

                $scope.model = {
                    product: {},
                    addToBasketItem: {
                        productID: null,
                        skuID: null,
                        qty: null
                    },
                    priceSkuMsg: '',
                    stockQty: '',
                    stockAvailable: '',
                    stockUnavailable: '',
					fromProductSearch: '',
					crossSells : []
                };

				function resetModel () {
					$scope.model.product = {};
                    $scope.model.addToBasketItem = {
                        productID : null,
                        skuID : null,
                        qty : null
                    };
					$scope.model.priceSkuMsg = '';
					$scope.model.stockQty = '';
					$scope.model.stockAvailable = '';
					$scope.model.stockUnavailable = '';
					$scope.model.fromProductSearch = '';
					$scope.model.crossSells = [];
				}

                function skuChangedUpdatePrice (skus) {
                    var skuId = skus[0];

                    // Reset/clear the sku price display
                    $scope.model.priceSkuMsg = '';

                    // Only update the sku price display if we only have 'a' selected sku
                    if (skus.length === 1){
                        $scope.model.priceSkuMsg = $scope.model.product.prices.sku[skuId].displayPrice.price;
                    }
                }

                function skuChangedUpdateStock (skus) {
                    $scope.model.stockQty = '';
                    $scope.model.stockAvailable = '';
                    $scope.model.stockUnavailable = '';
                    var skuId = skus[0];
                    if (skus.length === 1){
                        var stockInfo = $scope.model.product.stock[skuId];

                        if (stockInfo){
                            $scope.model.stockAvailable = stockInfo.available;
                            $scope.model.stockQty = stockInfo.quantity;
                        }
                        $scope.model.stockUnavailable = !$scope.model.stockAvailable;
                    }
                }

				$scope.backToProductSearchResult = function () {
					// Navigate to product search result page.
					$location.path('/productSearchResult');
				};

				$scope.$on('quantityChanged', function (event, quantity) {
					$log.debug('quantity : ' + quantity);

					if ($scope.model.initialized) {
						$scope.enableDisableStoresButton();
					}
				});

                $scope.$on('productOptionChanged', function () {
                    var skuID = $scope.getSelectedSku();

                    if (skuID !== null) {
                        skuChangedUpdatePrice([skuID]);
                        skuChangedUpdateStock([skuID]);
                    } else {
                        $scope.model.stockQty = '';
                        $scope.model.stockAvailable = '';
                        $scope.model.stockUnavailable = '';
                        $scope.model.priceSkuMsg = '';
                    }

					$scope.enableDisableStoresButton();
					$scope.enableDisableAddToCartButton();
                });

				$scope.enableDisableStoresButton = function () {
					if ($scope.model.product.optionsWithAssociatedSkuIDs.length) {
						// More than one SKU
						var skuID = $scope.getSelectedSku();
						if (skuID) {
							// Selected all options
							$scope.model.disableStoresButton = false;
						} else {
							// Not yet selected all options
							$scope.model.disableStoresButton = true;
						}
					} else {
						// Single SKU
						$scope.model.disableStoresButton = false;
					}

					if ($scope.model.addToBasketItem.qty === 0) {
						$scope.model.disableStoresButton = true;
					}
				};

				$scope.enableDisableAddToCartButton = function () {
					if ($scope.model.product.optionsWithAssociatedSkuIDs.length) {
						// More than one SKU
						var skuID = $scope.getSelectedSku();
						if (skuID && $scope.model.stockAvailable) {
							// Selected all options and available
							$scope.model.disableAddToCartButton = false;
						} else {
							// Not yet selected all options
							$scope.model.disableAddToCartButton = true;
						}
					} else {
						if ($scope.model.stockAvailable) {
							// Single SKU and available
							$scope.model.disableAddToCartButton = false;
						} else {
							// Single SKU and unavailable
							$scope.model.disableAddToCartButton = true;
						}
					}
				};

                /**
                 * Initialize the model data.
                 */
                $scope.init = function (productId, fromProductSearch) {
					if (productId) {

						// Reset model values.
						resetModel();

						var storeID = dataStorageService.getStoreId();

						$scope.model.fromProductSearch = fromProductSearch;

						$scope.model.showShortDescription =
							configService.getConfig('app.ppos.ProductDetail.show_short_description');

						$scope.model.showLongDescription =
							configService.getConfig('app.ppos.ProductDetail.show_long_description');

						$scope.model.showName =
							configService.getConfig('app.ppos.ProductDetail.show_name');

						// Get the cross sell product data
						productCatalogService.getProductCrossSells(productId, storeID).then(
							function (successResult) {
								$log.debug(successResult);
								$scope.model.crossSells = successResult.data;

							}, function (errorResult) {
								$log.error(errorResult);
							});

						// Get the product data
						productCatalogService.getProductViewData(productId, storeID).then(
							function (successResult) {
								$log.debug(successResult);
								$scope.model.product = successResult.data;

								// If we already have a sku selected, update the stock display
								if ($scope.model.product.skus.length === 1){
									skuChangedUpdatePrice([$scope.model.product.skus[0].id]);
									skuChangedUpdateStock([$scope.model.product.skus[0].id]);
								}

								$scope.model.initialized = true;
								$scope.enableDisableStoresButton();
								$scope.enableDisableAddToCartButton();
                                $scope.model.addToBasketItem = {
									storeID: null,
									productID: $scope.model.product.id,
                                    thumb: $scope.model.product.image.thumb,
                                    skuID: null,
									qty: 1
								};

							}, function (errorResult) {
								$log.error(errorResult);
							});

					}
                };

                /**
                 * Attempt to add the product to the basket.
                 */
                $scope.addItemToBasket = function () {
					$scope.model.addToBasketItem.storeID = dataStorageService.getStoreId();

					// Get the selected sku Id
					$scope.model.addToBasketItem.skuID = $scope.getSelectedSku();

					// Only continue if we have a selected sku
					if ($scope.model.addToBasketItem.skuID !== null && 
							$scope.model.stockAvailable && 
							$scope.model.addToBasketItem.qty > 0) {
						
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

										// Get the basket Id from data storage
										var basketId = dataStorageService.getBasketId();

										// Make the service call to addItemToBasket
										basketService.addItemToBasket(basketId, $scope.model.addToBasketItem).then(
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
							basketService.addItemToBasket(basketId, $scope.model.addToBasketItem).then(
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
					}
                };

                /**
                 * Returns the selected sku Id or null if one is not found
                 * @returns {*} The selected sku Id as a string or null if not found
                 */
                $scope.getSelectedSku = function () {
                    var selectedSku = null,
                        selectedSkus = [],
                        selectedOptions = _.filter($scope.model.product.optionsWithAssociatedSkuIDs, function (n) {
                            return n.selectedOption !== null;
                        });

                    // If we don't have any options, just return the product's first sku Id
                    if ($scope.model.product.optionsWithAssociatedSkuIDs.length === 0) {
                        return $scope.model.product.skus[0].id;
                    }

                    // Only continue if we have the same number of selected options as we do available option types
                    if (selectedOptions.length === $scope.model.product.optionsWithAssociatedSkuIDs.length) {
                        // Loop through the selected options sku Ids and find the intersections
                        for (var i = 0; i < selectedOptions.length; i++) {
                            var skuIDs = selectedOptions[i].selectedOption.skuIDs;
                            if (i === 0) {
                                // If it's our first trip through, just update the selectedSkus
                                selectedSkus = skuIDs;
                            } else {
                                // Otherwise, find the sku Ids intersection
                                selectedSkus = _.intersection(selectedSkus, skuIDs);
                            }
                        }
                    }

                    // At this point, we should only have one sku intersection, if so, set the selectedSku
                    if (selectedSkus.length === 1) {
                        selectedSku = selectedSkus[0];
                    }

                    // Return the sku id we found, or null otherwise
                    return selectedSku;
                };

                $scope.init($routeParams.productId, $routeParams.fromProductSearch);
            }]);
}(window.angular, window._));
