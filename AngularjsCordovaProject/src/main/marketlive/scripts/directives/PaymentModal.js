/*! PaymentModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('paymentModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/basket/PaymentModal.html';

		return directive;
	});
}(window.angular));
