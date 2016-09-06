/*! ProductSearchService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('productSearchService', 
		['$log', '$q', 'dataService', 'productCatalogService', 'paginationService', 'configService',

			function ($log, $q, dataService, productCatalogService, paginationService, configService) {

				return {

					/**
					 * This function returns configurations for the
					 * product search result page.
					 *
					 * @returns (Object) productSearchConfigModel
					 */
					getProductSearchConfigModel : function () {
						var sortOptions = configService.
							getConfig('app.ppos.productSearch.sort_options');

						var showName = configService.
							getConfig('app.ppos.productSearch.show_name');

						var showShortDescription = configService.
							getConfig('app.ppos.productSearch.show_short_description');

						var showCode = configService.
							getConfig('app.ppos.productSearch.show_code');

						var showPrices = configService.
							getConfig('app.ppos.productSearch.show_prices');
						
						var productSearchConfigModel = {
							sortOptions : sortOptions,
							showName : showName,
							showShortDescription : showShortDescription,
							showCode : showCode,
							showPrices : showPrices
						};

						return productSearchConfigModel;
					},

					/**
					 * This function validates the given product search keyword
					 * for empty/null and minimum characters required.
					 * 
					 * @param {String} productSearchKeyword - The product search keyword to validate.
					 *
					 * @returns (Boolean) true if keyword is valid else false.
					 */
					validateProductSearchKeywordRequired : function (productSearchKeyword) {
						if (!productSearchKeyword) {
							return false;
						} 

						if (productSearchKeyword.length < 3) {
							return false;
						}

						return true;
					},
					
					/**
					 * This function returns as array of product sort option object.
					 *
					 * @returns (Array) {
					 *			sortOptionObject: Object {
					 *				sortOptionConfig: String,
					 *				sortOptionParam: String,
					 *				sortOptionOrder: String
					 *			}
					 *		} sortOptionsArray - Returns an array of sort options.
					 */
					getSortOptions : function () {
						var productSearchConfigModel = this.getProductSearchConfigModel();

						var sortOptionsConfigValue = productSearchConfigModel.sortOptions;

						var sortOptionsArray = [];

						if (sortOptionsConfigValue) {
							var sortOptionsConfigValueArray = sortOptionsConfigValue.split(',');
							if (sortOptionsConfigValueArray) {
								angular.forEach(sortOptionsConfigValueArray, function (sortOptionConfigValue) {
									if (sortOptionConfigValue)	{
										var sortOptionConfig = sortOptionConfigValue;
										var sortOptionParam = '';
										var sortOptionOrder = '';

										var position = sortOptionConfigValue.search('Ascend');
										if (position !== -1) {
											sortOptionOrder = 'asc';
										} else {
											position = sortOptionConfigValue.search('Descend');
											if (position !== -1 ) {
												sortOptionOrder = 'desc';
											}
										}

										if (position !== -1) {
											sortOptionParam = sortOptionConfigValue.substring(0, position);

											var sortOptionObject = {
												'sortOptionConfig' : sortOptionConfig,
												'sortOptionParam' : sortOptionParam,
												'sortOptionOrder' : sortOptionOrder
											};

											sortOptionsArray.push(sortOptionObject);
										}
									}
								});
							}
						}

						return sortOptionsArray;
					},
					
					/**
					 * This function returns the default product sort option.
					 *
					 * @returns (Object) {
					 *			sortOptionObject: Object {
					 *				sortOptionParam: String,
					 *				sortOptionOrder: String
					 *			}
					 *		} sortOptionObject - Returns an array of sort options.
					 */
					getDefaultSortOption : function () {
						var defaultSortOption = null;

						var sortOptionsArray = this.getSortOptions();

						if (sortOptionsArray) {
							if (sortOptionsArray.length > 0) {
								defaultSortOption = sortOptionsArray[0];
							}
						}

						return defaultSortOption;
					},
					
					/**
					 * This function search for products based on the given criteria.
					 * 
					 * @param {Object} {
					 *			productSearchKeyword: String,
					 *			offSet: Number,
					 *			productsPerPage: Number,
					 *			pageNumber: Number,
					 *			currentSortOrder: String,
					 *			currentSortParam: String
					 *		} productSearchRequest - The product search request object.
					 *
					 * @returns {Object} {
					 *			productSearchKeyword: String,
					 *			searchResult: Object,
					 *			pagingModel: Object,
					 *			sortOptions: Array,
					 *			defaultSortOption: String,
					 *          currentSortOrder: String,
					 *			currentSortParam: String,
					 *			currentSortOptionConfig: String
					 *		} productSearchResponse - The product search response object.
					 */
					searchProduct : function (productSearchRequest) {
						// List of available sort options.
						var sortOptions = this.getSortOptions();

						// Default sort option.
						var defaultSortOption = this.getDefaultSortOption();

						// Current sort order.
						var currentSortOrder = productSearchRequest.currentSortOrder || 
							defaultSortOption.sortOptionOrder;

						// Current sort param.
						var currentSortParam = productSearchRequest.currentSortParam || 
							defaultSortOption.sortOptionParam;

						// Current sort option config.
						var currentSortOptionConfig = '';
						if (sortOptions) {
							for (var i = 0; i < sortOptions.length; i++) {
								if ((sortOptions[i].sortOptionParam === currentSortParam) && 
									(sortOptions[i].sortOptionOrder === currentSortOrder)) {
									currentSortOptionConfig = sortOptions[i].sortOptionConfig;
								}
							}
						}

						// TODO: This value is not configurable as per requirement.
						var pagesPerPageGroup = 5;
						
						// Product search URL.
						var serviceUrl = '/api/products?' + 
							'q=' + encodeURIComponent(productSearchRequest.productSearchKeyword) + 
							'&families=' + 'none' + 
							'&offset=' + productSearchRequest.offSet + 
							'&pagesize=' + productSearchRequest.productsPerPage + 
							'&sortOrder=' + currentSortOrder + 
							'&sortParam=' + currentSortParam;
						
						var deferred = $q.defer();
						
						// Send product search request to server.
						dataService.getData(serviceUrl)
							.then(
							function (successResult) {
								if (successResult) {
									// Paging model request.
									var pagingModelRequest = {
										currentPage : productSearchRequest.pageNumber,
										numberOfRecords : successResult.data.searchResultSize,
										recordsPerPage : productSearchRequest.productsPerPage,
										pagesPerPageGroup : pagesPerPageGroup
									};

									// Prepare paging model.
									var pagingModel = paginationService.getPagingModel(pagingModelRequest);
									
									// Prepare product search result response object.
									var productSearchResponse = {
										productSearchKeyword : productSearchRequest.productSearchKeyword,
										searchResult : successResult.data,
										pagingModel : pagingModel,
										sortOptions : sortOptions,
										defaultSortOption : defaultSortOption,
										currentSortOrder : currentSortOrder,
										currentSortParam : currentSortParam,
										currentSortOptionConfig : currentSortOptionConfig
									};

									// Resolve the promise.
									deferred.resolve(productSearchResponse);
								}
							}, function (errorResult) {
								// Prepare product search result response object.
								var productSearchResponse = {
									productSearchKeyword : productSearchRequest.productSearchKeyword,
									searchResult : errorResult.data,
									pagingModel : null,
									sortOptions : null,
									defaultSortOption : null
								};
								
								// Reject the promise.
								deferred.reject(productSearchResponse);
							});
						
						// Return product search result promise.
						return deferred.promise;
					},
					
					/**
					 * 
					 * 
					 */
					getProductSearchResult : function () {
						var productSearchResultCache = JSON.parse(sessionStorage.getItem('productSearchResultCache'));
						return productSearchResultCache;
					},
					
					/**
					 * 
					 * 
					 */
					setProductSearchResult : function (productSearchDataModel) {
						var productSearchResultCache = JSON.stringify(productSearchDataModel);
						sessionStorage.setItem('productSearchResultCache', productSearchResultCache);
					}
				};
	}]);
}(window.angular));
