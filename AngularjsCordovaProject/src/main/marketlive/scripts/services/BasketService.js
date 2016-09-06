/*! BasketService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('basketService', 
		['$q', 'dataService', 'configService',
		function ($q, dataService, configService) {

		return {

			isAutoSaveBag : function () {
				var isAutoSaveBag = configService.
					getConfig('app.ppos.basket.autoSaveCart');

				return isAutoSaveBag;
			},
			
			saveBag : function (basketId, csrId) {
				var serviceUrl = '/api/baskets/' + basketId + '/markAsSaved?csrID=' + csrId;

				return dataService.putData(serviceUrl);
			},

			/**
			 * This function returns baskets created by given CSR
			 * 
			 * @param {Number} csrId - The ID of the CSR.
			 */
			getBasketsForCSRByDateRange : function (csrId, hourRange) {
				var serviceUrl = 
					'/api/baskets/csrs/' + csrId + '?hourRange=' + hourRange;

				return dataService.getData(serviceUrl);
			},

			/**
			 * This function creates new basket for the given customer ID.
			 * 
			 * @param {Number} customerId - The ID of the customer to create basket for.
			 * @param {Number} csrId - The ID of the CSR creating basket for customer.
			 */
			createBasket : function (customerId, csrId) {
                var serviceUrl = '/api/baskets/customers/' + customerId;

				if (csrId) {
					serviceUrl = serviceUrl + '?csrID=' + csrId;
				}

                return dataService.postData(serviceUrl);
            },

            /**
			 * This function creates new guest customer and basket for that guest customer.
			 * 
			 * @param {Number} storeId - The ID of the store.
			 * @param {Number} csrId - The ID of the CSR creating basket for customer.
			 * @param {String} phone - The phone of the customer.
			 */
			createGuestBasket : function (storeId, csrId, phone) {
                var serviceUrl = '/api/baskets/newGuestBasket?phone=' + phone;

				if (storeId) {
					serviceUrl = serviceUrl + '&storeID=' + storeId;
				}

				if (csrId) {
					serviceUrl = serviceUrl + '&csrID=' + csrId;
				}

                return dataService.postData(serviceUrl);
            },
			
			/**
			 * This function deletes basket based on the given basket ID.
			 * 
			 * @param {Number} basketId - The ID of the basket to delete.
			 */
			deleteBasket : function (basketId) {
                var serviceUrl = '/api/baskets/' + basketId;

                return dataService.deleteData(serviceUrl);
            },

			/**
			 * This function gets basket details based on the given basket ID.
			 * 
			 * @param {Number} basketId - The ID of the basket to get details.
			 */
			getBasketById : function (basketId) {
				var serviceUrl = '/api/baskets/' + basketId;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function adds the given item to basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to add item to.
			 * @param {Object} {
			 *			productID: Number,
			 *			skuID: Number,
			 *			qty: Number,
			 *			storeID: Number
			 *		} itemToAdd - The item to add object.
			 */
			addItemToBasket : function (basketId, itemToAdd) {
				var serviceUrl = '/api/baskets/' + basketId;

				return dataService.postData(serviceUrl, itemToAdd);
			},
			
			/**
			 * This function updates the given basket items.
			 * 
			 * @param {Number} basketId - The ID of the basket to update items.
			 * @param {Object} {basketItems: [].{
			 *			basketItemID: Number,
			 *			productID: Number,
			 *			skuID: Number,
			 *			qty: Number,
			 *			storeID: Number
			 *		}} basketItems - An array of basket items to update.
			 */
			updateBasketItems : function (basketId, basketItems) {
				var serviceUrl = '/api/baskets/' + basketId + '/items';

				return dataService.putData(serviceUrl, basketItems);
			},
			
			/**
			 * This function deletes item from basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to delete basket item from.
			 * @param {Number} basketItemId - The ID of the basket item to delete.
			 */
			removeItemFromBasket : function (basketId, basketItemId) {
				var serviceUrl = '/api/baskets/' + basketId + '/items/' + basketItemId;

				return dataService.deleteData(serviceUrl);
			},
			
			/**
			 * This function applies given source code to basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to apply source code.
			 * @param {String} sourceCode - The source code to apply.
			 */
			addSourceCode : function (basketId, sourceCode) {
				var sourceCodeDetail = {
					sourceCode : sourceCode
				};

				var serviceUrl = '/api/baskets/' + basketId + '/sourcecode';

				return dataService.postData(serviceUrl, sourceCodeDetail);
			},
			
			/**
			 * This function removes given source code from basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to remove source code.
			 * @param {String} sourceCode - The source code to remove.
			 */
			removeSourceCode : function (basketId, sourceCode) {
				var serviceUrl = '/api/baskets/' + basketId + '/sourcecode/' + sourceCode;

				return dataService.deleteData(serviceUrl);
			}
		};
	}]);
}(window.angular));
