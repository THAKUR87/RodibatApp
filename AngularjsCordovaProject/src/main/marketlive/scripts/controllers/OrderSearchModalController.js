/*! OrderSearchModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('orderSearchModalController',
		['$log', '$scope', '$location', '$translate', 'orderService', 'appService',
		function ($log, $scope, $location, $translate, orderService, appService) {

			/**
			 * Model object for order search modal.
			 */
			$scope.orderSearchDataModel = {
				orderCode : null,
				showOrderSearchError : false,
				orderSearchErrorMessage : null
			};
			
			/**
			 * Clears order search data.
			 */
			$scope.clearOrderSearchData = function () {
				$scope.orderSearchDataModel.orderCode = null;
				$scope.orderSearchDataModel.showOrderSearchError = false;
				$scope.orderSearchDataModel.orderSearchErrorMessage = null;
			};

			/**
			 * Close order search modal.
			 */
			$scope.closeOrderSearchModal = function () {
				$scope.clearOrderSearchData();
			};

			/**
			 * Search order by code.
			 */
			$scope.searchOrderByCode = function () {
				if (!$scope.orderSearchDataModel.orderCode) {
					// Show error message.
					$scope.orderSearchDataModel.showOrderSearchError = true;

					$translate('msg.ppos.orderNumberRequired', { minLength : 3 })
						.then(function (orderNumberRequired) {
							$scope.orderSearchDataModel.orderSearchErrorMessage = orderNumberRequired;
						});

					angular.element('#orderCode').focus();
				} else {
					appService.activateSpinner();

					orderService.getOrderByCode($scope.orderSearchDataModel.orderCode)
						.then(
						function (successResult) {
							appService.deactivateSpinner();

							// Hide order search modal.
							angular.element('#orderSearchModal').modal('hide');
						
							// Navigate to order detail page.
							$location.url('/orderDetail?orderId=' + successResult.data[0].id);
						}, function (errorResult) {
							appService.deactivateSpinner();

							if (errorResult.data.responseCode === '404' ||
									errorResult.data.responseCode === '400') {
								// Zero orders.
								// Show error message.
								$scope.orderSearchDataModel.showOrderSearchError = true;

								$translate('msg.ppos.orderNotFound', 
									{ orderCode : $scope.orderSearchDataModel.orderCode })
									.then(function (orderNotFound) {
										$scope.orderSearchDataModel.orderSearchErrorMessage = orderNotFound;
									});

								angular.element('#orderCode').focus();
							}
						});
				}
			};
		}]);
}(window.angular));
