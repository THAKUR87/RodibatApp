/*! AddCouponCodeModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('addCouponCodeModal', function() {
		return {
			restrict : 'E',

			templateUrl : 'views/basket/AddCouponCodeModal.html',
			
			controller : 'addCouponCodeModalController',

			link : function () {
				angular.element('#addCouponCodeModal').on('shown.bs.modal', function () {
					angular.element('#couponCode').focus();
				});
			}
		};
	});
}(window.angular));
