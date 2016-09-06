
/**
 * Shipping Address And Method Modal Directive
 *
 *
 */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('shippingAddressAndMethodModal', function() {
		return {
			restrict : 'E',

			templateUrl : 'views/basket/ShippingAddressAndMethodModal.html',
			
			controller : 'shippingAddressAndMethodModalController',

			link : function () {
				angular.element('#shippingAddressAndMethodModal').on('shown.bs.modal', function () {
				
				});
			}
		};
	});
}(window.angular));
