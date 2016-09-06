describe("Product Search Service", function(){

    var mockBackend;
    var applicationConfiguration;
    var injectedProductSearchService;
    var requestSuccessResponse, requestFailureResponse;

    var searchProductResponse = "SearchProductResponse";
    var testDataToCache = [{ 'key' : "Some Test Data"}];

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));


    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        applicationConfiguration = ApplicationConfiguration;
        mockBackend = $httpBackend;

        //This value must match the request
        var baseUrl = ApplicationConfiguration.urlBase;
        var searchProductUrl = baseUrl + "/api/products?q=testProductKeyword";

        mockBackend.when("GET", searchProductUrl).respond(searchProductResponse);

    }));

    //Inject the basket service to be tested
    beforeEach(angular.mock.inject(function(productSearchService){
        injectedProductSearchService = productSearchService;
    } ));

    //Invoke the service and  verify the results
    it("Tests the searchProduct method for success", function(){
        var searchProductPromise = injectedProductSearchService.searchProduct("testProductKeyword");

        //Set values from the promise that can be tested later - to prove success was seen
        searchProductPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(searchProductResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });

    //Invoke the getProductSearchResult method, verify the result
    it("Tests the getProductSearchResult method for success", function(){
        injectedProductSearchService.setProductSearchResult(testDataToCache);
        var resultCache = injectedProductSearchService.getProductSearchResult();

        expect(resultCache).toBeDefined();
        expect(resultCache).toEqual(testDataToCache);


    });

});