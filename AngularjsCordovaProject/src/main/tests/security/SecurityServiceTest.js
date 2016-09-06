describe("Security Service", function(){

    var injectedSecurityService, mockBackend;
    var applicationConfiguration;


    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));


    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        applicationConfiguration = ApplicationConfiguration
        mockBackend = $httpBackend;
        var mockResponse = {
            "access_token":"3c67d5b4-6339-47f2-b4ea-791e0ef43303",
            "token_type":"bearer",
            "refresh_token":"ebd78c06-0ac8-438a-af85-cc8c3c8c1b56",
            "expires_in":43124,
            "scope":"read write"};
        //This value must match the request
        var baseUrl = ApplicationConfiguration.urlBase;
        var successUrl = baseUrl + "/oauth/token?grant_type=password&username=test-user&password=test-password";
        var failureUrl = baseUrl + "/oauth/token?grant_type=password&username=fail-user&password=fail-password";
        mockBackend.when("POST", successUrl).respond(mockResponse);
        mockBackend.when("POST", failureUrl).respond(400, "failure");

    }));

    //Inject the security service that we intend to test, and store it locally for access
    beforeEach(angular.mock.inject(function(securityService) {
        injectedSecurityService = securityService;
    }));


    //Invoke the service and  verify the results
    it("Tests the service for Successful authentication", function(){
        var testAccessToken, testFailureMessage;

        var successUserCredentials = {
            loginId : "test-user",
            password: "test-password"
        };

        //This is done in the loginController
        var requestPromise = injectedSecurityService.getToken(successUserCredentials);

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            testAccessToken = successResult.access_token;
        }, function (errorResult) {
            testFailureMessage = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(testAccessToken).toEqual('3c67d5b4-6339-47f2-b4ea-791e0ef43303');
        expect(testFailureMessage).not.toBeDefined();

    });

    it("Tests the service for authentication failure", function(){
        var testAccessToken, testFailureMessage;

        var failureUserCredentials = {
            loginId : "fail-user",
            password: "fail-password"
        };

        //This is done in the loginController
        var requestPromise = injectedSecurityService.getToken(failureUserCredentials);

        //Set values from the promise that can be tested later - to prove success was seen
        requestPromise.then(function (successResult) {
            testAccessToken = successResult;
        }, function (errorResult) {
            testFailureMessage = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(testAccessToken).not.toBeDefined();
        expect(testFailureMessage).toBeDefined();

    });

});