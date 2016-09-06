/*! OrderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('orderService',
        ['dataService', 
		function (dataService) {

			return {

				/**
				 * This function gets order details for the given order id.
				 * 
				 * @param {Number} orderId - The id of the order to get details.
				 */
				getOrderById : function (orderId) {
					var serviceUrl = '/api/orders/' + orderId + '?includeDiscounts=true';
					
					return dataService.getData(serviceUrl);
				},
				
				/**
				 * This function gets order details for the given order code.
				 * 
				 * @param {String} orderCode - The code of the order to get details.
				 */
				getOrderByCode : function (orderCode) {
					var serviceUrl = '/api/orders/search?q=' + orderCode;
					
					return dataService.getData(serviceUrl);
				},
				
				getInStorePickupOrderShipments : function (storeId, sortParam) {
					var serviceUrl = '/api/pickupinstores/shipments/stores/' + storeId;

					if (sortParam) {
						serviceUrl = serviceUrl + '?sortParam=' + sortParam;
					}

					return dataService.getData(serviceUrl);
				},
				
				groupBySku : function (storeId) {
					var serviceUrl = '/api/pickupinstores/skus/stores/' + storeId;

					return dataService.getData(serviceUrl);
				},
				
				associateCSRtoShipment : function (csrId, orderId, orderShipmentId) {
					var serviceUrl = 
						'/api/csrs/' + csrId +
						'/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupInProcessState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=PICK_UP_IN_PROCESS';

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupReadyState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=PICK_UP_READY';

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupDoneState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=SHIPPED';

					return dataService.putData(serviceUrl);
				},
				
				addShipmentNoteForPickup : function (orderId, orderShipmentId, noteToAdd) {
					var serviceUrl = 
						'/api/pickupinstores/notes/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.postData(serviceUrl, noteToAdd);
				},
				
				// Edit Note - Phase 2
				/*editShipmentNoteForPickup : function (orderId, orderShipmentId, noteId, noteToEdit) {
					var serviceUrl = 
						'/api/pickupinstores/notes/' + noteId + 
						'/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.putData(serviceUrl, noteToEdit);
				},*/

				/*reset : function (orderId, orderShipmentId, storeId, status) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=' + status;

					return dataService.putData(serviceUrl);
				}*/
			};
        }]);

}(window.angular));
