/*! OrderDetailController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('orderDetailController',
        ['$log', '$scope', '$routeParams', 'orderService', 'dataStorageService',
		function ($log, $scope, $routeParams, orderService, dataStorageService) {
			
			$scope.orderDetailDataModel = {
			};

			$scope.orderShipmentDataModel = [];

			$scope.orderPickupDataModel = [];

			$scope.thisStore = dataStorageService.getStore();

			/**
			 * Initialize model for view.
			 */
			$scope.initializeOrderDetailDataModel = function () {
				// Get order data
				orderService.getOrderById($routeParams.orderId)
					.then(
					function (successResult) {
						$scope.orderDetailDataModel = successResult.data;

						var shipment;
						var i = 0;
						var	j = 0; 
						for (var idx = 0; idx < successResult.data.shipments.length; idx++) {
							shipment = successResult.data.shipments[idx];
							if	(shipment.isPickupFromStore === true) {
								$scope.orderPickupDataModel[i] = shipment;

								// PEBL-16312 This code is for PPOS phase 1 only.
								// There is no pattern for order status. See IOrderManager.OrderStatus enum
								// You will find space, underscore, etc..
								// In the next release we will make these statuses localized as well.
								if ($scope.orderPickupDataModel[i].status) {
									if ($scope.orderPickupDataModel[i].status === 'PickupInProcess') {
										$scope.orderPickupDataModel[i].status = 'Pickup In Process';
									} else if ($scope.orderPickupDataModel[i].status === 'PickupReady') {
										$scope.orderPickupDataModel[i].status = 'Pickup Ready';
									}
								}

								i++;
							} else if (shipment.isPickupFromStore === false) {
								$scope.orderShipmentDataModel[j] = shipment;
								j++;
							}
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};
			
			// Toggle Arrow
			$scope.toggleChevron = function (e) {
				//angular.element
				angular.element(e.target)
				.prev('.panel-heading')
				.find('i.ml-ppos-mini-white-icon, i.ml-ppos-mini-grey-icon')
				.toggleClass('ml-ppos-arrow-up ml-ppos-arrow-down');
				angular.element(e.target).prev('.panel-heading').toggleClass('');
			};
			angular.element('#accordion').on('hidden.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion').on('shown.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion1').on('hidden.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion1').on('shown.bs.collapse', $scope.toggleChevron);

			// Initialize model for view.
			$scope.initializeOrderDetailDataModel();
        }]);
}(window.angular));
