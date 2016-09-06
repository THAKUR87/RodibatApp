/*! ShippingService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('shippingService', 
		['dataService', 
		function (dataService) {
		
		return {

			/**
			 * This function gets list of states of a country
			 * 
			 * @param {String} countryCode - The code of the country to get states.
			 */
			getStates : function (countryCode) {
				var serviceUrl = '/api/shippings/states?countryCode=' + countryCode;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function gets list of countries
			 * 
			 */
			getCountries : function () {
				var serviceUrl = '/api/shippings/countries';

				return dataService.getData(serviceUrl);
			},

			getShippingMethods : function(basketId, basketShipmentId, countryCode, stateCode) {
				var serviceUrl = '/api/shippings/shippingMethods/basket/'+basketId+'/shipments/'+basketShipmentId+
					'?countryCode='+countryCode+'&stateCode='+stateCode;

				return dataService.getData(serviceUrl);
			},

			updateShippingMethod : function(basketId, shipmentId, shipMethodId) {
				var serviceUrl = '/api/shippings/basket/' + basketId +
					'/shipments/' + shipmentId + '?shippingMethodID=' + shipMethodId;

				return dataService.putData(serviceUrl, '');
			}
		};
	}]);
}(window.angular));
