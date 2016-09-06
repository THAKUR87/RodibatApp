/*! AncillaryService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('ancillaryService', 
		['dataService', function (dataService) {

		return {
			
			emailSignup : function (emailSignup) {
				var serviceUrl = '/api/ancillary/emailsignup';

				return dataService.postData(serviceUrl, emailSignup);
			}
		};
	}]);
}(window.angular));
