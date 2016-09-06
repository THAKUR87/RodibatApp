/*! CustomerSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('customerSearchModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/search/CustomerSearchModal.html';

		return directive;
	});
}(window.angular));
