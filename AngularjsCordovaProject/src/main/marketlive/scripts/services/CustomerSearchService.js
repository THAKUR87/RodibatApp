/*! CustomerSearchService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('customerSearchService', 
		['dataService', function (dataService) {

		return {

			/**
			* search customers having phone number supplied as arguement.
			**/
			searchCustomerByPhoneNumber : function (customerPhoneNumber) {
				var serviceUrl = '/api/account/customers?q=' + customerPhoneNumber + '&query_fields=phone';

				return dataService.getData(serviceUrl);
			},

			/**
			*search existing customer having same email as supplied in arguement.
			**/
			searchCustomerByEmail : function (customerEmail) {
				var serviceUrl = '/api/account/customers?q=' + customerEmail + '&query_fields=email';

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
