describe("Customer Search Service", function(){

    var mockBackend;
    var applicationConfiguration;
    var injectedCustomerSearchService;
    var requestSuccessResponse, requestFailureResponse;

    var searchCustomerResponse = "SearchCustomerResponse";
    var testCustomerPhoneNumber = "7071231234";

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));


    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        applicationConfiguration = ApplicationConfiguration;
        mockBackend = $httpBackend;

        //This value must match the request
        var baseUrl = ApplicationConfiguration.urlBase;
        var searchCustomerByPhoneNumberUrl = baseUrl + '/api/account/customers?q=' + testCustomerPhoneNumber + '&query_fields=phone';

        mockBackend.when("GET", searchCustomerByPhoneNumberUrl).respond(searchCustomerResponse);

    }));

    //Inject the basket service to be tested
    beforeEach(angular.mock.inject(function(customerSearchService){
        injectedCustomerSearchService = customerSearchService;
    } ));

    //Invoke the service and  verify the results
    it("Tests the searchProduct method for success", function(){
        var searchCustomerPromise = injectedCustomerSearchService.searchCustomerByPhoneNumber(testCustomerPhoneNumber);

        //Set values from the promise that can be tested later - to prove success was seen
        searchCustomerPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(searchCustomerResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });

});