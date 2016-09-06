/*! PaginationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('paginationService', 
		[function () {
		
		var paginationServiceOperations = {

			/**
			 * This function prepares the paging model for pagination 
			 * based on the given input.
			 * 
			 * @param {Object} {
			 *			currentPage: Number,
			 *			numberOfRecords: Number,
			 *			recordsPerPage: Number,
			 *			pagesPerPageGroup: Number,
			 *		} pagingModelRequest - The paging model request object.
			 *
			 * @returns {Object} {
			 *			currentPage: Number,
			 *			numberOfRecords: Number,
			 *			recordsPerPage: Number,
			 *			pagesPerPageGroup: Number,
			 *			showPagination: Boolean,
			 *			numberOfPages: Number,
			 *			previousPageGroup: Object {
			 *				hasPreviousPageGroup: Boolean,
			 *				previousPageGroupPageNumber: Number,
			 *				previousPageGroupPageNumberOffSet: Number
			 *			},
			 *			nextPageGroup: Object {
			 *				hasNextPageGroup: Boolean,
			 *				nextPageGroupPageNumber: Number,
			 *				nextPageGroupPageNumberOffSet: Number
			 *			},
			 *			pages: Array {
			 *				pageNumber: Number,
			 *				offSet: Number
			 *			}
			 *		} pagingModel - The paging model object.
			 */
			getPagingModel : function (pagingModelRequest) {

				var pagingModel = {

					currentPage : 0,
					
					numberOfRecords : 0,

					recordsPerPage : 0,

					pagesPerPageGroup : 0,
					
					showPagination : false,
					
					numberOfPages : 0,
					
					previousPageGroup : {
						hasPreviousPageGroup : false,
					
						previousPageGroupPageNumber : 0,
					
						previousPageGroupPageNumberOffSet : 0,
					},
					
					nextPageGroup : {
						hasNextPageGroup : false,

						nextPageGroupPageNumber : 0,
					
						nextPageGroupPageNumberOffSet : 0,
					},
					
					pages : []
				};
				
				pagingModel.currentPage = pagingModelRequest.currentPage;
				
				pagingModel.numberOfRecords = pagingModelRequest.numberOfRecords;
				
				pagingModel.recordsPerPage = pagingModelRequest.recordsPerPage;

				pagingModel.pagesPerPageGroup = pagingModelRequest.pagesPerPageGroup;

				pagingModel.showPagination = isShowPagination(
					pagingModelRequest.numberOfRecords, pagingModelRequest.recordsPerPage);

				if (pagingModel.showPagination)	{
					pagingModel.numberOfPages = getNumberOfPages(
						pagingModelRequest.numberOfRecords, pagingModelRequest.recordsPerPage);
					
					var beginPageIndex = getBeginPageIndex(
						pagingModelRequest.currentPage, pagingModelRequest.pagesPerPageGroup);

					var endPageIndex = getEndPageIndex(
						pagingModelRequest.currentPage, pagingModelRequest.numberOfRecords, 
						pagingModelRequest.recordsPerPage, pagingModelRequest.pagesPerPageGroup);

					for (var i = beginPageIndex; i <= endPageIndex; i++) {
						var offSet = pagingModelRequest.recordsPerPage * (i - 1);
						pagingModel.pages.push({ 'pageNumber' : i, 'offSet' : offSet });
					}

					// Previous Page Group
					var previousPageGroupAvailable = hasPreviousPageGroup(
						pagingModelRequest.currentPage, pagingModelRequest.pagesPerPageGroup);

					if (previousPageGroupAvailable) {
						var previousPageGroupPageNumber = beginPageIndex - 1;
						
						var previousPageGroupPageNumberOffSet = 
							pagingModelRequest.recordsPerPage * (previousPageGroupPageNumber - 1);

						pagingModel.previousPageGroup = {
							hasPreviousPageGroup : previousPageGroupAvailable,
							
							previousPageGroupPageNumber : previousPageGroupPageNumber,
							
							previousPageGroupPageNumberOffSet : previousPageGroupPageNumberOffSet,
						};
					}
					
					// Next Page Group
					var nextPageGroupAvailable = hasNextPageGroup(
						pagingModelRequest.currentPage, pagingModelRequest.numberOfRecords, 
						pagingModelRequest.recordsPerPage, pagingModelRequest.pagesPerPageGroup);

					if (nextPageGroupAvailable) {
						var nextPageGroupPageNumber = endPageIndex + 1;
						
						var nextPageGroupPageNumberOffSet = 
							pagingModelRequest.recordsPerPage * (nextPageGroupPageNumber - 1);

						pagingModel.nextPageGroup = {
							hasNextPageGroup : nextPageGroupAvailable,

							nextPageGroupPageNumber : nextPageGroupPageNumber,
						
							nextPageGroupPageNumberOffSet : nextPageGroupPageNumberOffSet,
						};
					}
				}

				return pagingModel;
			}
		};
		
		function isShowPagination (numberOfRecords, recordsPerPage) {
			if (numberOfRecords <= recordsPerPage) {
				return false;
			}
			
			return true;
		}
		
		function getNumberOfPages (numberOfRecords, recordsPerPage) {
			var numberOfPages = Math.ceil(numberOfRecords / recordsPerPage);

			return numberOfPages;
		}

		function getNumberOfPageGroups (numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var numberOfPages = getNumberOfPages(numberOfRecords, recordsPerPage);

			if (numberOfPages <= pagesPerPageGroup) {
				return 1;
			}
			
			var numberOfPageGroups = Math.floor(numberOfPages / pagesPerPageGroup);

			if ((numberOfPages % pagesPerPageGroup) > 0) { 
				++numberOfPageGroups;
			}

			return numberOfPageGroups;
		}

		function getCurrentPageGroup (currentPage, pagesPerPageGroup) {
			var currentPageGroup = 1;

			if ((currentPage % pagesPerPageGroup) === 0) {
				currentPageGroup = currentPage / pagesPerPageGroup;
			} else {
				//currentPageGroup = (currentPage / pagesPerPageGroup) + 1;
				currentPageGroup = Math.ceil(currentPage / pagesPerPageGroup);
			}
			
			return currentPageGroup;
		}

		function getBeginPageIndex (currentPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			var beginPageIndex = ((currentPageGroup * pagesPerPageGroup) - pagesPerPageGroup) + 1;

			return beginPageIndex;
		}

		function getEndPageIndex (currentPage, numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var numberOfPages = getNumberOfPages(numberOfRecords, recordsPerPage);
				
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			if (currentPage === numberOfPages) {
				return currentPage;
			}
			
			if (numberOfPages < (currentPageGroup * pagesPerPageGroup)) {
				return numberOfPages;
			}
			
			var endPageIndex = (currentPageGroup * pagesPerPageGroup);
			
			return endPageIndex;
		}

		function hasPreviousPageGroup (currentPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			if (currentPageGroup > 1) {
				return true;
			}
				
			return false;
		}

		function hasNextPageGroup (currentPage, numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			var numberOfPageGroups = getNumberOfPageGroups(numberOfRecords, recordsPerPage, pagesPerPageGroup);

			if (currentPageGroup < numberOfPageGroups) {
				return true;
			}
			
			return false;
		}

		return paginationServiceOperations;
	}]);
}(window.angular));
