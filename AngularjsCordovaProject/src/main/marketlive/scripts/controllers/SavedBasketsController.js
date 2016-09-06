/*! SavedBasketsController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('savedBasketsController',
        ['$log', '$scope', '$location', 'configService', 'dataStorageService', 'basketService',
		function ($log, $scope, $location, configService, dataStorageService, basketService) {
			
			$scope.savedBasketsDataModel = {
				baskets : []
			};
			
			/**
			 * Initialize model for view.
			 */
			$scope.initializeSavedBasketsDataModel = function () {
				var hourRange = configService.getConfig('app.ppos.savedCarts.hourRange');

				basketService.getBasketsForCSRByDateRange(dataStorageService.getLoggedInCSR().id, hourRange)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.savedBasketsDataModel.baskets = successResult.data;
						}
					}, function (errorResult) {
						$log.error(errorResult);

						$scope.savedBasketsDataModel.baskets = [];
					});
			};

			$scope.openSavedBasket = function (customerId, basketId) {
				dataStorageService.setCustomerId(customerId);

				dataStorageService.setBasketId(basketId);

				// Navigate to basket page.
				$location.path('/basket');
			};

			$scope.deleteSavedBasket = function (basketId) {
				basketService.deleteBasket(basketId)
					.then(
					function (successResult) {
						if (successResult) {
							// If CSR has deleted current basket that is in session, 
							// then remove basket ID and customer ID from session.
							if (basketId === dataStorageService.getBasketId()) {
								dataStorageService.setCustomerId('');

								dataStorageService.setBasketId('');
							}

							$scope.initializeSavedBasketsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);

						$scope.initializeSavedBasketsDataModel();
					});
			};

			// Initialize model for view.
			$scope.initializeSavedBasketsDataModel();
        }]);
}(window.angular));
