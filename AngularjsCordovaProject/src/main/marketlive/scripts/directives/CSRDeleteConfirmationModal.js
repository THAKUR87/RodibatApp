/*! PaymentModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('csrDeleteConfirmationModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/csr/CSRDeleteConfirmationModal.html';

		return directive;
	});
}(window.angular));
