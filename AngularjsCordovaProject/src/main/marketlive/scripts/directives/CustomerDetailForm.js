
/**
 * Customer Detail Modal Directive.
 *
 * @author Keshav 
 *
 */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('customerDetailFormModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/basket/CustomerDetailForm.html';

		return directive;
	});
}(window.angular));
