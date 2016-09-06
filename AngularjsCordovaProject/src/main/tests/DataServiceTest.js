describe("Security Service", function(){

    var testDataService, mockBackend;

    var id, sourceCode, subTotal, tax, total, paymentMethod;

    //Add more services to test
    var testBasketServiceUri = "/api/baskets/1001";
    var testProductServiceUri = "/api/products/1002";
    var testIllegalUri = "/api/illegal/action";
    var testAccessToken = "3c67d5b4-6339-47f2-b4ea-791e0ef43303";

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));

    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        mockBackend = $httpBackend;
        var mockResponse = {"id": 1001, "sourcecode": "SC1234", "items" : ["tstOrder"], "subTotal": 10.00, "tax" : 10.00, "total" : 20.00, "paymentMethod":[{type: 'cc', num: '1234' }]};

        var baseUrl = ApplicationConfiguration.urlBase;
        var testGetService = baseUrl + testBasketServiceUri;
        var testPostService = baseUrl +  testProductServiceUri;
        var testIllegalService = baseUrl + testIllegalUri;

        var testHeaders = { 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + testAccessToken }

        mockBackend.when("GET", testGetService, testHeaders  ).respond(mockResponse);
        mockBackend.when("GET", testIllegalService  ).respond(400, "Failure");

        mockBackend.when("POST", testPostService, testHeaders  ).respond(mockResponse);
        mockBackend.when("POST", testIllegalService  ).respond(400, "Failure");

    }));

    //Inject the service that we intend to test, and store it locally for access
    beforeEach(angular.mock.inject(function(dataService) {
        testDataService = dataService;
        sessionStorage.access_token = testAccessToken;
    }));

    //Invoke the service and  verify the results
    it("Test the GET dataService for Success", function(){

        var requestPromise = testDataService.getData(testBasketServiceUri);

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            id = successResult.id;
            sourceCode = successResult.sourcecode;
            subTotal = successResult.subTotal;
            tax = successResult.tax;
            total = successResult.total;
            paymentMethod = successResult.paymentMethod;
        }, function (errorResult) {
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(id).toEqual(1001);
        expect(sourceCode).toEqual('SC1234');
        expect(subTotal).toEqual(10.00);
        expect(tax).toEqual(10.00);
        expect(total).toEqual(20.00);
        expect(paymentMethod[0].type).toEqual('cc');

    });


    it("Test the GET dataService for Failure", function(){

        var requestPromise = testDataService.getData(testIllegalUri);
        var successResponseData, failureRespnseData;

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureRespnseData = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();

    });

    it("Test the POST dataService for Success", function(){

        var requestPromise = testDataService.postData(testProductServiceUri);

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            id = successResult.id;
            sourceCode = successResult.sourcecode;
            subTotal = successResult.subTotal;
            tax = successResult.tax;
            total = successResult.total;
            paymentMethod = successResult.paymentMethod;
        }, function (errorResult) {
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(id).toEqual(1001);
        expect(sourceCode).toEqual('SC1234');
        expect(subTotal).toEqual(10.00);
        expect(tax).toEqual(10.00);
        expect(total).toEqual(20.00);
        expect(paymentMethod[0].type).toEqual('cc');

    });


    it("Test the POST dataService for Failure", function(){

        var requestPromise = testDataService.postData(testIllegalUri);

        var successResponseData, failureResponseData;

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            successResponseData = successResult;
        }, function (errorResult) {
            failureResponseData = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(successResponseData).not.toBeDefined();
        expect(failureResponseData).toBeDefined();


    });

});
