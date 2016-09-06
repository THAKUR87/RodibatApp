describe('Pagination Service Unit Tests', function () {

    var injectedTestPaginationService;

    // Ensure application module is available.
    beforeEach(module('pointOfSaleApplication'));

    // Inject the service that we intend to test and store it locally for access.
    beforeEach(inject(function (paginationService) {
        injectedTestPaginationService = paginationService;
    }));

	it ('No Pagination Component', function () { // []
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 1,
			numberOfRecords : 5,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		var pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(false);
		expect(pagingModel.numberOfPages).toEqual(0);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(false);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(false);
		expect(pagingModel.pages.length).toEqual(0);
	});

	it ('Pagination Component With Just One Page Group (No Previous and No Next)', function () { // CASE 1 : [12345]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 1,
			numberOfRecords : 12,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(2);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(false);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(false);
		expect(pagingModel.pages.length).toEqual(2);
	});

	it ('Pagination Component With Just One Page Group (No Previous and No Next)', function () { // CASE 2 : [12345]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 1,
			numberOfRecords : 30,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(5);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(false);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(false);
		expect(pagingModel.pages.length).toEqual(5);
	});

	it ('Pagination Component Without Previous Page Group But With Next Page Group', function () { // CASE 1 : [12345>]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 1,
			numberOfRecords : 122,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(21);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(false);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(true);
		expect(pagingModel.pages.length).toEqual(5);
	});

	it ('Pagination Component Without Previous Page Group But With Next Page Group', function () { // CASE 2 : [12345>]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 5,
			numberOfRecords : 122,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(21);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(false);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(true);
		expect(pagingModel.pages.length).toEqual(5);
	});

	it ('Pagination Component With Previous Page Group and Without Next Page Group', function () { // [<12345]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 21,
			numberOfRecords : 122,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(21);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(true);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(false);
		expect(pagingModel.pages.length).toEqual(1);
	});

	it ('Pagination Component With Previous Page Group and With Next Page Group', function () { // [<12345>]
		// Paging model request.
		var pagingModelRequest = {
			currentPage : 8,
			numberOfRecords : 122,
			recordsPerPage : 6,
			pagesPerPageGroup : 5
		};

		pagingModel = injectedTestPaginationService.getPagingModel(pagingModelRequest);

		expect(pagingModel.numberOfPages).toEqual(21);
		expect(pagingModel.pagesPerPageGroup).toEqual(5);
		
		expect(pagingModel.showPagination).toEqual(true);
		expect(pagingModel.numberOfPages).toEqual(21);
		expect(pagingModel.previousPageGroup.hasPreviousPageGroup).toEqual(true);
		expect(pagingModel.nextPageGroup.hasNextPageGroup).toEqual(true);
		expect(pagingModel.pages.length).toEqual(5);
	});
});
