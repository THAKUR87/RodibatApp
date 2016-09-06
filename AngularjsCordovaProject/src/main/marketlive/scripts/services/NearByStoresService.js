/*! NearByStoresService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('nearByStoresService',
		['$log', '$q', 'storeService', 'configService', 'dataStorageService',
		function ($log, $q, storeService, configService, dataStorageService) {

			return {

				/**
				 * This function returns an array of radius to limit the store search result.
				 *
				 * @returns (Array) an array of radius to limit the store search result.
				 */
				getRadiusArray : function () {
					var radiusConfigValue = configService.
							getConfig('app.ppos.nearByStores.storeRadiusList');

					var radiusArray = [];

					if (radiusConfigValue) {
						var radiusConfigValueArray = radiusConfigValue.split(',');
						if (radiusConfigValueArray) {
							angular.forEach(radiusConfigValueArray, function (radiusConfigValue) {
								if (radiusConfigValue)	{
									radiusArray.push(radiusConfigValue);
								}
							});
						}
					}

					return radiusArray;
				},

				/**
				 * This function returns the default radius to limit the store search result.
				 *
				 * @returns (Integer) the default radius to limit the store search result.
				 */
				getDefaultRadius : function () {
					var defaultRadius = null;
					var userPosSettings = dataStorageService.getLoggedInUsersPosSettings();
					if (userPosSettings === null || userPosSettings === '') {
						var radiusArray = this.getRadiusArray();
						if (radiusArray) {
							if (radiusArray.length > 0) {
								defaultRadius = radiusArray[0];
							}
						}
					} else {
						defaultRadius = userPosSettings.userSetRadius;
					}

					return defaultRadius;
				},
				
				/**
				 * This function search for products based on the given criteria.
				 * 
				 * @param {Object} {
				 *			skuId: String,
				 *			latitude: Double,
				 *			longitude: Double,
				 *			distance: Double
				 *		} nearByStoresSearchRequest - The near by stores search request object.
				 *
				 * @returns {Object} the promise object.
				 */
				searchNearByStores : function (nearByStoresSearchRequest) {
					var deferred = $q.defer();

					var nearByStoresSearchResponse = [];

					if (nearByStoresSearchRequest) {
						storeService.getNearByStores(
							nearByStoresSearchRequest.skuId,
							nearByStoresSearchRequest.latitude,
							nearByStoresSearchRequest.longitude,
							nearByStoresSearchRequest.distance)
							.then(
							function (successResult) {
								var storeSkuList = successResult.data;

								if (storeSkuList) {
									angular.forEach(storeSkuList, function (storeSku) {
										var store = storeSku.store;

										var storeDetails = {
											address : {
												name : store.details.name,
												street1 : store.details.street1,
												street2 : store.details.street2,
												street3 : store.details.street3,
												city : store.details.city,
												state : store.details.state,
												zipCode : store.details.zipCode,
												phone : store.details.phone
											},
											id : store.details.id,
											pickupEnabled : store.details.pickupEnabled,
											hours : store.details.hours,
											distance : store.distance,
											availableQty : storeSku.availableQty
										};

										nearByStoresSearchResponse.push(storeDetails);
									});
								}

								// Resolve the promise.
								deferred.resolve(nearByStoresSearchResponse);
							}, function (errorResult) {
								$log.error(errorResult);
								// Reject the promise.
								deferred.reject(nearByStoresSearchResponse);
							});
					}

					// Return product search result promise.
					return deferred.promise;
				}
			};
	}]);
}(window.angular));
