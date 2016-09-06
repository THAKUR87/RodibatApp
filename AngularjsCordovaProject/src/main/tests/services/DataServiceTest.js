describe('Data/Http Service Unit Tests', function () {

	var injectedTestDataStorageService;

    var injectedTestDataService;

	var testGetBasketByIdSuccessResponse = '/api/baskets/customers/123';
	var testGetBasketByIdErrorResponse = '/api/baskets/customers/123/invalid';

	var testPostCreateBasketSuccessResponse = '/api/baskets/customers/101101';
	var testPostCreateBasketErrorResponse = '/api/baskets/customers/101101/invalid';

	var testPutUpdateBasketItemSuccessResponse = '/api/baskets/111222/items';
	var testPutUpdateBasketItemErrorResponse = '/api/baskets/111222/items/invalid';

	var testDeleteBasketItemSuccessResponse = '/api/baskets/111222/items/1001';
	var testDeleteBasketItemErrorResponse = '/api/baskets/111222/items/1001/invalid';

    // Ensure application module is available.
    beforeEach(module('pointOfSaleApplication'));

    // Inject the service that we intend to test and store it locally for access.
    beforeEach(inject(function ($injector, dataService, dataStorageService) {
		injectedTestDataStorageService = dataStorageService;
		injectedTestDataStorageService.setUrlBase('');

        injectedTestDataService = dataService;

		$httpBackend = $injector.get('$httpBackend');

		var mockResponse = {'id' : 123};

		$httpBackend.when('GET', testGetBasketByIdSuccessResponse).respond(mockResponse);
		$httpBackend.when("GET", testGetBasketByIdErrorResponse).respond(400, "Failure");

		$httpBackend.when("POST", testPostCreateBasketSuccessResponse).respond(mockResponse);
        $httpBackend.when("POST", testPostCreateBasketErrorResponse).respond(400, "Failure");

		$httpBackend.when("PUT", testPutUpdateBasketItemSuccessResponse).respond(mockResponse);
        $httpBackend.when("PUT", testPutUpdateBasketItemErrorResponse).respond(400, "Failure");

		$httpBackend.when("DELETE", testDeleteBasketItemSuccessResponse).respond(mockResponse);
		$httpBackend.when("DELETE", testDeleteBasketItemErrorResponse).respond(400, "Failure");
    }));

	it ('Test GET Success Request', function () {
		var successResponseData, failureRespnseData;

		var getRequestPromiseResponse = injectedTestDataService.getData(testGetBasketByIdSuccessResponse);

		getRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            id = successResult.id;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(id).toEqual(123);
	});

	it ('Test GET Failure Request', function () {
		var successResponseData, failureRespnseData;

		var getRequestPromiseResponse = injectedTestDataService.getData(testGetBasketByIdErrorResponse);
		
		getRequestPromiseResponse.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureRespnseData = errorResult;
        });

        $httpBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();
	});

	it ('Test POST Success Request', function () {
		var successResponseData, failureRespnseData;

		var postRequestPromiseResponse = injectedTestDataService.postData(testPostCreateBasketSuccessResponse);

		postRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            id = successResult.id;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(id).toEqual(123);
	});

	it ('Test POST Failure Request', function () {
		var successResponseData, failureRespnseData;

		var postRequestPromiseResponse = injectedTestDataService.postData(testPostCreateBasketErrorResponse);

		postRequestPromiseResponse.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureRespnseData = errorResult;
        });

        $httpBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();
	});

	it ('Test PUT Success Request', function () {
		var successResponseData, failureRespnseData;

		var putRequestPromiseResponse = injectedTestDataService.putData(testPutUpdateBasketItemSuccessResponse);

		putRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            id = successResult.id;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(id).toEqual(123);
	});

	it ('Test PUT Failure Request', function () {
		var successResponseData, failureRespnseData;

		var putRequestPromiseResponse = injectedTestDataService.putData(testPutUpdateBasketItemErrorResponse);

		putRequestPromiseResponse.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureRespnseData = errorResult;
        });

        $httpBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();
	});

	it ('Test DELETE Success Request', function () {
		var successResponseData, failureRespnseData;

		var deleteRequestPromiseResponse = injectedTestDataService.deleteData(testDeleteBasketItemSuccessResponse);

		deleteRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            id = successResult.id;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(id).toEqual(123);
	});

	it ('Test DELETE Failure Request', function () {
		var successResponseData, failureRespnseData;

		var deleteRequestPromiseResponse = injectedTestDataService.deleteData(testDeleteBasketItemErrorResponse);

		deleteRequestPromiseResponse.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureRespnseData = errorResult;
        });

        $httpBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();
	});
});
