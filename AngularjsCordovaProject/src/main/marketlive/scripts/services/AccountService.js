/*! AccountService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('accountService', 
		['dataService', function (dataService) {

		return {
			createGuestCustomer : function (customerDetail) {
				var serviceUrl = '/api/account/customers';

                return dataService.postData(serviceUrl, customerDetail);
            },
			
			createCustomer : function (customerDetail) {
				var serviceUrl = '/api/account/customers';

                return dataService.postData(serviceUrl, customerDetail);
            },
			
			createContact : function (customerId, contactDetail) {
				var serviceUrl = '/api/account/customers/' + customerId + '/contacts';

				return dataService.postData(serviceUrl, contactDetail);
			},

			updateCustomer : function (customerId, customerDetail) {
				var serviceUrl = '/api/account/customers/' + customerId;

				return dataService.putData(serviceUrl, customerDetail);
			},
			
			
			getCustomerById : function (customerId) {
				var serviceUrl = '/api/account/customers/' + customerId;

				return dataService.getData(serviceUrl);
			},
			
			getContactById : function (contactId) {
				var serviceUrl = '/api/account/contacts/' + contactId;

				return dataService.getData(serviceUrl);
			},

			updateContact : function(customerId, contactId, contactToUpdate) {
				var serviceUrl = '/api/account/customers/' + customerId + '/contacts/' + contactId;
				
				return dataService.putData(serviceUrl, contactToUpdate);
			},

			getSecurityQuestions : function () {
				var serviceUrl = '/api/account/hints';

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
