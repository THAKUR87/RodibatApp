/*! InStorePickupOrdersController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('inStorePickupOrderShipmentsController',
        ['$log', '$scope', '$location', 'dataStorageService', 'orderService',
			'csrService', 'receiptService','appService',
		function ($log, $scope, $location, dataStorageService, orderService, csrService, receiptService, appService) {
			
			$scope.inStorePickupOrderShipmentsDataModel = {
			};

			$scope.groupBySkuDataModel = {
			};

			$scope.currentSortParam = '';

			$scope.noteMaxLength = 1000;

			$scope.activeCSRs = [];

			$scope.inStorePickupHeaderDataModel = {
				pickupNewOrderShipmentsState : 0,
				pickupInProcessOrderShipmentsState : 0,
				pickupReadyOrderShipmentsState : 0,
				pickupDoneOrderShipmentsState : 0
			};
			
			/**
			 * Initialize model for view.
			 */
			$scope.initializeInStorePickupOrderShipmentsDataModel = function (sortParam) {
				appService.activateSpinner();

				if (sortParam) {
					$scope.currentSortParam = sortParam;
				} else {
					// Default sort parameter
					$scope.currentSortParam = 'orderDate';
				}

				$scope.initializeInStorePickupHeaderDataModel();

				$scope.initializeActiveCSRs();

				if ($scope.currentSortParam === 'itemSKUNumber') {
					orderService.groupBySku(dataStorageService.getStoreId())
						.then(
						function (successResult) {
							if (successResult) {
								$scope.groupBySkuDataModel = successResult.data;
							}
							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							appService.deactivateSpinner();
						});
				} else {
					orderService.getInStorePickupOrderShipments(dataStorageService.getStoreId(), sortParam)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.inStorePickupOrderShipmentsDataModel = successResult.data;

								if ($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess) {
									angular.forEach($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess, 
										function (pickupInProcessOrderShipment) {
											pickupInProcessOrderShipment.canMoveToPickupReady = 
												$scope.canMoveToPickupReady(pickupInProcessOrderShipment);
									});
								}

								if ($scope.inStorePickupOrderShipmentsDataModel.PickupReady) {
									angular.forEach($scope.inStorePickupOrderShipmentsDataModel.PickupReady, 
										function (pickupReadyOrderShipment) {
											pickupReadyOrderShipment.noteTextToAdd = '';
									});
								}
							}

							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							appService.deactivateSpinner();
						});
				}
			};

			$scope.initializeInStorePickupHeaderDataModel = function () {
				var currentUrlPath = $location.path();

				if (currentUrlPath === '/pickupNewOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupInProcessOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupReadyOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupDoneOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 1;
				} else if (currentUrlPath === '/inStorePickupOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				}
			};

			$scope.initializeActiveCSRs = function () {
				csrService.getActiveCSRs()
					.then(
					function (successResult) {
						if (successResult) {
							var activeCSRs = successResult.data;

							$scope.activeCSRs = [];

							var loggedInCSR = dataStorageService.getLoggedInCSR();

							// Only Store Managers and Admin can assign to other CSR's
							if ((loggedInCSR.typePPOS === 'Store Manager') || 
								(loggedInCSR.typePPOS === 'Admin')) {

								if (activeCSRs) {
									angular.forEach(activeCSRs, function (activeCSR) {
										if (activeCSR.permissions) {
											angular.forEach(activeCSR.permissions, function (csrPermission) {
												if (csrPermission.code === 'INSTORE_PICKUP') {
													$scope.activeCSRs.push(activeCSR);
												}
											});
										}
									});
								}
							}
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.viewOrderDetail = function (orderId) {
				// Navigate to order detail page.
				$location.url('/orderDetail?orderId=' + orderId);
			};

			$scope.toggleIcon = function (shipmentId) {
				var elmt = angular.element('#arrow_'+shipmentId);
				if(elmt.hasClass('ml-ppos-arrow-down')) {
					elmt.addClass('ml-ppos-arrow-up');
					elmt.removeClass('ml-ppos-arrow-down');
					document.getElementById('orderShipmentDetail_'+shipmentId).style.display = 'block';
				} else {
					elmt.addClass('ml-ppos-arrow-down');
					elmt.removeClass('ml-ppos-arrow-up');
					document.getElementById('orderShipmentDetail_'+shipmentId).style.display = 'none';
				}
			};

			$scope.sortInStorePickupOrderShipmentsDataModel = function (sortParam) {
				$scope.initializeInStorePickupOrderShipmentsDataModel(sortParam);
				if(angular.element('#lstSortByMenu').hasClass('open')) {
					angular.element('#lstSortByMenu').removeClass('open');
				}
			};

			$scope.canMoveToPickupReady = function (pickupInProcessOrderShipment) {
				var canMoveToPickupReady = false;

				var loggedInCSR = dataStorageService.getLoggedInCSR();

				if (pickupInProcessOrderShipment) {
					if ((pickupInProcessOrderShipment.CSR.id === loggedInCSR.id) || 
						(loggedInCSR.typePPOS === 'Store Manager') || 
						(loggedInCSR.typePPOS === 'Admin')) {

						canMoveToPickupReady = true;
					}
				}

				return canMoveToPickupReady;
			};

			$scope.associateCSRtoShipment = function (csrId, orderId, orderShipmentId) {
				orderService.associateCSRtoShipment(csrId, orderId, orderShipmentId)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.moveToPickupInProcessState = function (orderId, orderShipmentId) {
				orderService.moveToPickupInProcessState(orderId, orderShipmentId, dataStorageService.getStoreId())
					.then(
					function (successResult) {
						if (successResult) {
							var loggedInCSR = dataStorageService.getLoggedInCSR();

							$scope.associateCSRtoShipment(loggedInCSR.id, orderId, orderShipmentId);

							//$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.moveToPickupReadyState = function (orderId, orderShipmentId) {
				orderService.moveToPickupReadyState(orderId, orderShipmentId, dataStorageService.getStoreId())
					.then(
					function (successResult) {
						if (successResult) {
							receiptService.emailPickupReady(
								orderId, dataStorageService.getStoreId(), dataStorageService.getLoggedInCSR().id)
								.then(
								function (emailPickupReadySuccessResult) {
									if (emailPickupReadySuccessResult) {
										$scope.initializeInStorePickupOrderShipmentsDataModel();
									}
								}, function (emailPickupReadyErrorResult) {
									$log.error(emailPickupReadyErrorResult);
									$scope.initializeInStorePickupOrderShipmentsDataModel();
								});
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.addShipmentNoteForPickup = function (orderId, orderShipmentId, customerId, noteText) {
				var noteToAdd = {
					'noteType' : 'ORDER_SHIPMENT_NOTE',
					'csrID' : dataStorageService.getLoggedInCSR().id,
					'customerID' : customerId,
					'orderID' : orderId,
					'orderShipmentID' : orderShipmentId,
					'processName' : 'InStorePickup',
					'subProcessName' : 'PickupReady',
					'note' : noteText
				};
				
				orderService.addShipmentNoteForPickup(orderId, orderShipmentId, noteToAdd)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			// Edit Note - Phase 2
			/*$scope.editShipmentNoteForPickup = function (orderId, orderShipmentId, customerId, noteId, noteText) {
				var noteToEdit = {
					'noteType' : 'ORDER_SHIPMENT_NOTE',
					'csrID' : dataStorageService.getLoggedInCSR().id,
					'customerID' : customerId,
					'orderID' : orderId,
					'orderShipmentID' : orderShipmentId,
					'processName' : 'InStorePickup',
					'subProcessName' : 'PickupReady',
					'note' : noteText
				};
				
				orderService.editShipmentNoteForPickup(orderId, orderShipmentId, noteId, noteToEdit)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};*/

			/*$scope.reset = function () {
				for (var i = 0; i < $scope.inStorePickupOrderShipmentsDataModel.Ordered.length; i++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.Ordered[i]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.Ordered[i].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.Ordered[i].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var j = 0; j < $scope.inStorePickupOrderShipmentsDataModel.PickupInProcess.length; j++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var k = 0; k < $scope.inStorePickupOrderShipmentsDataModel.PickupReady.length; k++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.PickupReady[k]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.PickupReady[k].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.PickupReady[k].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var l = 0; l < $scope.inStorePickupOrderShipmentsDataModel.Shipped.length; l++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.Shipped[l]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.Shipped[l].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.Shipped[l].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}
			};*/
			
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
			
			// Initialize model for view.
			$scope.initializeInStorePickupOrderShipmentsDataModel();
        }]);
}(window.angular));
