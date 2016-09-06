/*! ProductCatalogService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('productCatalogService',
		['$q', '$log', 'dataService', function ($q, $log, dataService) {

		return {

			getProductById : function (productId) {
                var serviceUrl = '/api/products/' + productId;

				return dataService.getData(serviceUrl);
			},

            getProductDetailsById: function (productId) {
                var serviceUrl = '/api/products/' + productId,
                    deferred = $q.defer();

                // Debug logging
                $log.debug('productCatalogService: getProductDetailsById: ' + productId);

                dataService.getData(serviceUrl).then(
                    function (successResult) {
                        deferred.resolve(successResult);
                    }, function (errorResult) {
                        deferred.reject(errorResult);
                        $log.error(errorResult);
                    });

                return deferred.promise;
            },

            getProductCrossSells: function (productId, storeId) {
                var serviceUrl = '/api/products/' + productId + '/stores/' + storeId + '/crosssells',
                    deferred = $q.defer();

                // Debug logging
                $log.debug('productCatalogService: getProductCrossSells: ' + productId);

                dataService.getData(serviceUrl).then(
                    function (successResult) {
                        deferred.resolve(successResult);
                    }, function (errorResult) {
                        deferred.reject(errorResult);
                        $log.error(errorResult);
                    });

                return deferred.promise;
            },

            getProductViewData : function (productIDs, storeID) {

                var serviceUrl =
                    '/api/view/products/' + productIDs + '/stores/' + storeID;

                return dataService.getData(serviceUrl);
            },

            getPriceMessages : function (priceInfo, wasIs, onSale) {

                function isMinMaxPriceEqual(priceInfo){
                    return (priceInfo.minPrice === priceInfo.maxPrice);
                }

                function getSinglePrice(priceInfo){
                    return  priceInfo.minPrice;
                }

                function getPriceRange(priceInfo){
                    return (priceInfo.minPrice + ' - ' + priceInfo.maxPrice);
                }

                // Sale Price

                function isMinMaxSalePriceEqual(priceInfo){
                    return (priceInfo.minSalePrice === priceInfo.maxSalePrice);
                }

                function getSingleSalePrice(priceInfo){
                    return  priceInfo.minSalePrice;
                }

                function getSalePriceRange(priceInfo){
                    return (priceInfo.minSalePrice + ' - ' + priceInfo.maxSalePrice);
                }

                var priceMsg = '';
                var priceWasMsg = '';
                var priceNowMsg = '';

                if (priceInfo){
                    //console.log('wasIs = ' + wasIs + ';');
                    //console.log('onSale = ' + onSale + ';');
                    //console.log(priceInfo);
                    if (wasIs){
                        if (isMinMaxSalePriceEqual(priceInfo)){
                            priceWasMsg = getSinglePrice(priceInfo);
                            priceNowMsg = getSingleSalePrice(priceInfo);
                        }else{
                            // price range
                            priceWasMsg = getPriceRange(priceInfo);
                            priceNowMsg = getSalePriceRange(priceInfo);
                        }
                    }else if (onSale){
                        if (isMinMaxSalePriceEqual(priceInfo)){
                            priceMsg = getSingleSalePrice(priceInfo);
                        }else{
                            // price range
                            priceMsg = getSalePriceRange(priceInfo);
                        }
                    }else{
                        if (isMinMaxPriceEqual(priceInfo)){
                            priceMsg = getSinglePrice(priceInfo);
                        }else{
                            // price range
                            priceMsg = getPriceRange(priceInfo);
                        }
                    }
                }

                var priceMessages = {
                    priceMsg : priceMsg,
                    priceWasMsg : priceWasMsg,
                    priceNowMsg : priceNowMsg
                };

                //console.log(priceMessages);
                return priceMessages;
            },
			
            getPriceInfoForProduct : function (productIDs, includeSkuPriceInfo) {
                var serviceUrl =
                    '/api/prices/products/?productIDs=' + productIDs + '&includeSkuPriceInfo=' + includeSkuPriceInfo;

                return dataService.getData(serviceUrl);
            },
			
			getInventory : function (skuId, storeId) {
				var serviceUrl;

				if (storeId) {
					serviceUrl = '/api/inventory/skus/' + skuId + '?storeID=' + storeId;
				} else {
					serviceUrl = '/api/inventory/skus/' + skuId;
				}

                return dataService.getData(serviceUrl);
            }
		};
	}]);
}(window.angular));
