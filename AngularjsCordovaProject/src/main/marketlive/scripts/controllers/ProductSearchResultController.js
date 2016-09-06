/*! ProductSearchResultController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('productSearchResultController', 
		['$log', '$scope', 'productSearchService', 'productCatalogService',

			function ($log, $scope, productSearchService, productCatalogService) {

				/** Product search keyword entered by the user. */
				$scope.productSearchKeyword = null;
				
				// TODO: This value is not configurable as per requirement.
				/** */
				$scope.productsPerPage = 6;

				/** Product search configurations. */
				$scope.productSearchConfigModel = productSearchService.getProductSearchConfigModel();
				
				/** The model object containing the product search result used in view. */
				$scope.productSearchResultDataModel = {
					searchTerm : null,
					showKeywordRequiredErrorMessage : false,
					showProductNotFoundErrorMessage : false,
					showSorting : false,
					productSearchKeyword : null,
					searchResult : null,
					pagingModel : null,
					sortOptions : null,
					defaultSortOption : null,
					currentSortOrder : null,
					currentSortParam : null,
					currentSortOptionConfig : null
				};

				/**
				 * This function search for products based on the given keyword.
				 * 
				 * @param {String} productSearchKeyword - The keyword to search.
				 * @param {Number} offSet - The offset (i.e. start doc).
				 * @param {Number} pageNumber - The requested page number.
				 * @param {String} sortOrder - The sort order (desc or asc).
				 * @param {String} sortParam - The sort param.
				 */
				$scope.searchProduct = function (productSearchKeyword, offSet, pageNumber, sortOrder, sortParam) {
					$scope.productSearchKeyword = productSearchKeyword;

					var isValid = productSearchService.validateProductSearchKeywordRequired(productSearchKeyword);

					if (!isValid) {
						// Show error message.
						$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = true;
						$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = false;

						/*if ($scope.productSearchResultDataModel.searchResult.searchResultSize > 1) {
							$scope.productSearchResultDataModel.showSorting = true;
						} else {
							$scope.productSearchResultDataModel.showSorting = false;	
						}*/

						// PEBL-14854 
						// In PPOS phase 2 improve ProductSearchService.js to handle more these kind of scenarios.
						$scope.productSearchResultDataModel.showSorting = false;
						$scope.productSearchResultDataModel.pagingModel = null;
						$scope.productSearchResultDataModel.searchResult.productInfo = [];
					} else {
						// Product search request.
						var productSearchRequest = {
							productSearchKeyword : productSearchKeyword,
							offSet : offSet,
							productsPerPage : $scope.productsPerPage,
							pageNumber : pageNumber,
							currentSortOrder: sortOrder,
							currentSortParam: sortParam
						};

						// Product search result promise.
						var productSearchResultPromise = 
							productSearchService.searchProduct(productSearchRequest);

						productSearchResultPromise
							.then(
							function (successResult) {
								var productSearchResponse = successResult;

								// Set the product search result response in cache (localstorage or shared service).
								productSearchService.setProductSearchResult(productSearchResponse);

								$scope.initializeProductSearchResultDataModel(productSearchResponse);
							}, function (errorResult) {
								$scope.productSearchResultDataModel = errorResult;

								if ($scope.productSearchResultDataModel.searchResult.data === null || 
									$scope.productSearchResultDataModel.searchResult.responseCode === '404') {

									// Zero products - show error message.
									$scope.productSearchResultDataModel.searchTerm = 
										$scope.productSearchKeyword;
									$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = 
										false;
									$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = 
										true;

									$scope.productSearchResultDataModel.showSorting = false;
								}
							});
					}
				};

				/**
				 * Initialize model for view.
				 * 
				 * @param {Object} productSearchResponse - The product search response object.
				 */
				$scope.initializeProductSearchResultDataModel = function (productSearchResponse) {
					$scope.productSearchKeyword = '';

					// Set the result in scope model for view.
					$scope.productSearchResultDataModel.productSearchKeyword = 
						productSearchResponse.productSearchKeyword;
					$scope.productSearchResultDataModel.searchResult = 
						productSearchResponse.searchResult;
					$scope.productSearchResultDataModel.pagingModel = 
						productSearchResponse.pagingModel;
					$scope.productSearchResultDataModel.sortOptions = 
						productSearchResponse.sortOptions;
					$scope.productSearchResultDataModel.defaultSortOption = 
						productSearchResponse.defaultSortOption;
					$scope.productSearchResultDataModel.currentSortOrder = 
						productSearchResponse.currentSortOrder;
					$scope.productSearchResultDataModel.currentSortParam = 
						productSearchResponse.currentSortParam;
					$scope.productSearchResultDataModel.currentSortOptionConfig = 
						productSearchResponse.currentSortOptionConfig;
					
					// Clear error messages as the search result is success.
					$scope.productSearchResultDataModel.searchTerm = 
						null;
					$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = 
						false;
					$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = 
						false;
					
					if ($scope.productSearchResultDataModel.searchResult.searchResultSize > 1) {
						$scope.productSearchResultDataModel.showSorting = true;
					} else {
						$scope.productSearchResultDataModel.showSorting = false;	
					}

					///////////////// Product Price Info /////////////////
					var productIds = '';
					var products = productSearchResponse.searchResult.productInfo;
		
					for (var i = 0; i < products.length; i++) {
						productIds = productIds + products[i].id;
						if (i <= (products.length - 2)) {
							productIds = productIds + ',';
						}
					}

					if (productIds)	{
						productCatalogService.getPriceInfoForProduct(productIds, false)
							.then(
							function (successResult) {
								angular.forEach(products, function (product) {
									var priceInfo = successResult.data[product.id];
									var priceMessages = productCatalogService.
										getPriceMessages(priceInfo, product.wasIs, product.onSale);

									product.priceInfo = priceMessages;
								});
							}, function (errorResult) {
								$log.error(errorResult);
							});
					}
					///////////////// Product Price Info /////////////////
				};

				// Initialize model for view.
				$scope.initializeProductSearchResultDataModel(productSearchService.getProductSearchResult());
			}]);
}(window.angular));
