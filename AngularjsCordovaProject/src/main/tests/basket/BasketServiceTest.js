describe("Basket Service", function(){

    var mockBackend;
    var applicationConfiguration;
    var injectedBasketService;
    var requestSuccessResponse, requestFailureResponse;


    var createBasketTestSuccessResponse = "createBasketResponse";
    var getBasketByIdTestSuccessResponse = "getBasketByIdResponse";
    var addItemToBasketTestSuccessResponse = "addItemToBasketResponse";

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module("pointOfSaleApplication"));


    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend, ApplicationConfiguration){
        applicationConfiguration = ApplicationConfiguration;
        mockBackend = $httpBackend;

        //This value must match the request
        var baseUrl = ApplicationConfiguration.urlBase;
        var createBasketMockUrl = baseUrl + "/api/baskets/customers/1001";
        var getBasketByIdMockUrl = baseUrl + "/api/baskets/1002";
        var addItemToBasketMockUrl = baseUrl + "/api/baskets/1003";

        mockBackend.when("POST", createBasketMockUrl).respond(createBasketTestSuccessResponse);
        mockBackend.when("GET", getBasketByIdMockUrl).respond(getBasketByIdTestSuccessResponse);
        mockBackend.when("POST", addItemToBasketMockUrl).respond(addItemToBasketTestSuccessResponse);

    }));

    //Inject the basket service to be tested
    beforeEach(angular.mock.inject(function(basketService){
        injectedBasketService = basketService;
    } ));


    //Invoke the service and  verify the results
    it("Tests the createBasket method for success", function(){
        //This is done in the loginController
        var basketPromise = injectedBasketService.createBasket(1001);

        //Set values from the promise that can be tested later - to prove success was seen
        basketPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(createBasketTestSuccessResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });


    it("Tests the getBasketById method for success", function(){
        //This is done in the loginController
        var basketPromise = injectedBasketService.getBasketById(1002);

        //Set values from the promise that can be tested later - to prove success was seen
        basketPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(getBasketByIdTestSuccessResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });

    it("Tests the addItemToBasket method for success", function(){
        //This is done in the loginController
        var basketPromise = injectedBasketService.addItemToBasket(1003);

        //Set values from the promise that can be tested later - to prove success was seen
        basketPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(addItemToBasketTestSuccessResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });

});