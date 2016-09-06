/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('customerDetailController', 
		['$scope',	function ($scope) {


				
				$scope.customerDetailForm = function () {
					alert('..............');
					angular.element('#customerDetailFormModal').modal('show');

				};
			}]);
				
			
}(window.angular));
