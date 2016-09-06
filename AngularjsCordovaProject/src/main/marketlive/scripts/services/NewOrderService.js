/*! NewOrderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('newOrderService', 
		['$q', 'dataStorageService', 'basketService',
		function ($q, dataStorageService, basketService) {

		function getBasketIdFromBasketURI (basketURI) {
			var position = basketURI.lastIndexOf('/');
			var basketId = basketURI.substring(position + 1, basketURI.length);
			return basketId;
		}

		return {

			startNewOrder : function (customerId, storeId, csrId, phone) {
				if (!basketService.isAutoSaveBag()) {
					csrId = null;
				}

				var deferred = $q.defer();

				if (!customerId) {
					// Create guest Customer and Basket.
					basketService.createGuestBasket(storeId, csrId, phone)
						.then(
						function (successResult) {
							var data = successResult.data;

							// Set Customer ID in storage.
							var customerId = data.customerId;
							dataStorageService.setCustomerId(customerId);

							// Set Basket ID in storage.
							var basketId = data.basketId;
							dataStorageService.setBasketId(basketId);

							var newOrderResponse =  {
								'customerId' : customerId,
								'basketId' : basketId
							};
							
							/*if (basketService.isAutoSaveBag()) {
								basketService.saveBag(basketId);
							}*/

							// Resolve the promise.
							deferred.resolve(newOrderResponse);
						}, function (errorResult) {
							console.log(
								'An error occurred while creating guest Customer ' + 
								'and Basket : ' + errorResult);

							var newOrderResponse =  {
								'customerId' : '',
								'basketId' : ''
							};
							
							// Reject the promise.
							deferred.reject(newOrderResponse);
						});
				} else {
					// Create Basket for given Customer.
					basketService.createBasket(customerId, csrId)
						.then(
						function (successResult) {
							var basketURI = successResult.data;
							var basketId = getBasketIdFromBasketURI(basketURI);

							// Set Customer ID in storage.
							dataStorageService.setCustomerId(customerId);
					
							// Set Basket ID in storage.
							dataStorageService.setBasketId(basketId);

							var newOrderResponse =  {
								'customerId' : customerId,
								'basketId' : basketId
							};
							
							/*if (basketService.isAutoSaveBag()) {
								basketService.saveBag(basketId);
							}*/
							
							// Resolve the promise.
							deferred.resolve(newOrderResponse);
						}, function (errorResult) {
							console.log(
								'An error occurred while creating Basket : ' + errorResult);

							var newOrderResponse =  {
								'customerId' : '',
								'basketId' : ''
							};
							
							// Reject the promise.
							deferred.reject(newOrderResponse);
						});
				}

				// Return product search result promise.
				return deferred.promise;
			}
		};
	}]);
}(window.angular));
