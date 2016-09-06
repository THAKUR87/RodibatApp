/*! AddCouponCodeModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('addCouponCodeModalController', 
		['$scope', '$location', '$route', '$translate', 'dataStorageService', 'basketService',
		function ($scope, $location, $route, $translate, dataStorageService, basketService) {

			/**
			 * Model object for add coupon code modal.
			 */
			$scope.addCouponCodeDataModel = {
				couponCode : null,
				showAddCouponCodeError : false,
				addCouponCodeErrorMessage : null
			};
			
			/**
			 * Clears add coupon code data.
			 */
			$scope.clearAddCouponCodeData = function () {
				$scope.addCouponCodeDataModel.couponCode = null;
				$scope.addCouponCodeDataModel.showAddCouponCodeError = false;
				$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = null;
			};

			/**
			 * Close add coupon code modal.
			 */
			$scope.closeAddCouponCodeModal = function () {
				// Hide add coupon code modal.
				angular.element('#addCouponCodeModal').modal('hide');

				$scope.clearAddCouponCodeData();
			};

			/**
			 * Add couon code.
			 */
			$scope.addCouponCode = function () {
				if (!$scope.addCouponCodeDataModel.couponCode) {
					// Show error message.
					$scope.addCouponCodeDataModel.showAddCouponCodeError = true;
					/*$translate('msg.ppos.orderNumberRequired', { minLength : 3 })
						.then(function (orderNumberRequired) {
							$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = orderNumberRequired;
						});*/
					$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = 'Please enter coupon code.';

					angular.element('#couponCode').focus();
				} else {
					basketService.addSourceCode(
						dataStorageService.getBasketId(), $scope.addCouponCodeDataModel.couponCode)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.clearAddCouponCodeData();
									
								// Hide add coupon code modal.
								angular.element('#addCouponCodeModal').modal('hide');

								// Navigate to basket page.
								//$location.path('/basket');

								// Fire basket reload event back upwards using $scope.$emit
								$scope.$emit('reloadBasket');
							}
						}, function (errorResult) {
							if (errorResult.data.responseCode === '422') {
								$scope.addCouponCodeDataModel.showAddCouponCodeError = true;

								/*$translate('msg.ppos.orderNotFound', 
									{ couponCode : $scope.addCouponCodeDataModel.couponCode })
									.then(function (orderNotFound) {
										$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = orderNotFound;
									});*/
								$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = 
			'The coupon code you have entered is not valid. Please check the code you have entered and try again.';

								angular.element('#couponCode').focus();
							}
						});
				}
			};
		}]);
}(window.angular));
