/*! StoreService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('storeService', 
		['dataService', 
		function (dataService) {
		
		return {

			/**
			 * This function gets store details based on the given store code.
			 * 
			 * @param {String} storeCode - The code of the store to get details.
			 */
			getStoreByCode : function (storeCode) {
				var serviceUrl = '/api/stores/code/' + storeCode;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function search for near by stores based on the given criteria.
			 * 
			 * @param {String} skuId - The ID of the sku.
			 * @param {Double} latitude
			 * @param {Double} longitude
			 * @param {Double} distance
			 */
			getNearByStores : function (skuId, latitude, longitude, distance) {
				var serviceUrl = '/api/stores/nearby/skus/' + skuId + 
					'?latitude=' + latitude + 
					'&longitude=' + longitude + 
					'&distance=' + distance;

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
