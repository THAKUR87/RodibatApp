describe("Account Service", function(){

    var mockBackend;
    var applicationConfiguration;
    var injectedAccountService;
    var requestSuccessResponse, requestFailureResponse;

    var customerTestDetailData = "Test Customer Detail";
    var createCustomerResponse = "createGuestCustomerResponse";

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));


    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        applicationConfiguration = ApplicationConfiguration;
        mockBackend = $httpBackend;

        //This value must match the request
        var baseUrl = ApplicationConfiguration.urlBase;
        var createGuestCustomerUrl = baseUrl + "/api/account/customers";

        mockBackend.when("POST", createGuestCustomerUrl, customerTestDetailData).respond(createCustomerResponse);

    }));

    //Inject the basket service to be tested
    beforeEach(angular.mock.inject(function(accountService){
        injectedAccountService = accountService;
    } ));

    //Invoke the service and  verify the results
    it("Tests the createGuestCustomer method for success", function(){
        //This is done in the loginController
        var accountPromise = injectedAccountService.createGuestCustomer(customerTestDetailData);

        //Set values from the promise that can be tested later - to prove success was seen
        accountPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(createCustomerResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });


});