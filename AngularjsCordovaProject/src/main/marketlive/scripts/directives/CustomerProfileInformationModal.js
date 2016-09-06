/*! CustomerProfileInformationModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('customerProfileInformationModal',  
		['$timeout', function ($timeout) {
		return {

			restrict : 'E',

			controller : 'customerProfileInformationController',

			templateUrl : 'views/customer/CustomerProfileInformationModal.html',

			link : function (scope) {
				angular.element('#customerProfileInformation').on('shown.bs.modal', function () {
					angular.element('#phoneNumber').focus();
				});
				angular.element('#customerProfileInformation').on('hidden.bs.modal', function () {
					$timeout(scope.closeProfileInformationModal, 0);
				});
			}
		};
	}]);
}(window.angular));
