/*! ProductSearchModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('productSearchModalController',
		['$log', '$scope', '$location', '$translate', 'productSearchService', 'appService',
		function ($log, $scope, $location, $translate, productSearchService, appService) {

			/**
			 * Model object for product search modal.
			 */
			$scope.productSearchDataModel = {
				productSearchKeyword : null,
				searchTerm : null,
				showProductSearchError : false,
				productSearchErrorMessage : null
			};
			
			/**
			 * Clears product search data.
			 */
			$scope.clearProductSearchData = function () {
				$scope.productSearchDataModel.productSearchKeyword = null;
				$scope.productSearchDataModel.searchTerm = null;
				$scope.productSearchDataModel.showProductSearchError = false;
				$scope.productSearchDataModel.productSearchErrorMessage = null;
			};

			/**
			 * Close product search modal.
			 */
			$scope.closeProductSearchModal = function () {
				$scope.clearProductSearchData();
			};

			/**
			 * Search product.
			 */
			$scope.searchProduct = function () {
				var isValid = productSearchService.validateProductSearchKeywordRequired(
					$scope.productSearchDataModel.productSearchKeyword);

				if (!isValid) {
					// Show error message.
					$scope.productSearchDataModel.showProductSearchError = true;
					$translate('msg.ppos.shortSearchTerm', { minLength : 3 })
						.then(function (shortSearchTerm) {
							$scope.productSearchDataModel.productSearchErrorMessage = shortSearchTerm;
						});

					angular.element('#productSearchKeyword').focus();
				} else {
					appService.activateSpinner();

					// Initial request so start doc should be zero.
					var offSet = 0;
					
					// TODO: This value is not configurable as per requirement.
					var productsPerPage = 6;

					// Initial request so page number should be one.
					var pageNumber = 1;

					var productSearchRequest = {
						productSearchKeyword : $scope.productSearchDataModel.productSearchKeyword,
						offSet : offSet,
						productsPerPage : productsPerPage,
						pageNumber : pageNumber
					};

					// Product search result promise.
					var productSearchResultPromise = 
						productSearchService.searchProduct(productSearchRequest);

					productSearchResultPromise
						.then(
						function (successResult) {
							var productSearchResponse = successResult;

							appService.deactivateSpinner();

							if (productSearchResponse.searchResult.searchResultSize === 1) {
								// Just one product.
								$scope.clearProductSearchData();
									
								// Hide product search modal.
								angular.element('#productSearchModal').modal('hide');
								
								// Open product detail modal.
								$scope.productId = productSearchResponse.searchResult.productInfo[0].id;
								angular.element('#productDetailModal').modal('show');
							} else if (productSearchResponse.searchResult.searchResultSize > 1) {
								// More than one product
								// Set the product search result response in cache (localstorage or shared service).
								productSearchService.setProductSearchResult(productSearchResponse);

								$scope.clearProductSearchData();

								// Hide product search modal.
								angular.element('#productSearchModal').modal('hide');
								
								// Navigate to product search result page.
								$location.path('/productSearchResult');
							}
						}, function (errorResult) {
							var productSearchResponse = errorResult;

							appService.deactivateSpinner();

							if (productSearchResponse.searchResult.responseCode === '404') {
								// Zero products.
								$scope.productSearchDataModel.searchTerm = 
									$scope.productSearchDataModel.productSearchKeyword;

								// Show error message.
								$scope.productSearchDataModel.showProductSearchError = true;

								$translate('msg.ppos.searchNoResults', 
									{ searchTerm : $scope.productSearchDataModel.searchTerm })
									.then(function (searchNoResults) {
										$scope.productSearchDataModel.productSearchErrorMessage = searchNoResults;
									});
								
								angular.element('#productSearchKeyword').focus();
							} else {
								$log.error('An error occured during product search : ' + angular.toJson(errorResult));
							}
						});
				}
			};
		}]);
}(window.angular));
