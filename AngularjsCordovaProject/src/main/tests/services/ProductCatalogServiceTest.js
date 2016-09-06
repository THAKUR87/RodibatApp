describe('Product Catalog Service', function(){

    var mockBackend;
    var injectedProductCatalogService;
    var requestSuccessResponse, requestFailureResponse;

    //var customerTestDetailData = 'Test Customer Detail';
    var getProductByIdResponse = 'GetProductByIdResponse';

    //Construct a mock application with the same name as the target
    beforeEach(module('pointOfSaleApplication'));

    //Set up the Http mock backend to trap http requests
    beforeEach(inject(function($httpBackend){
        mockBackend = $httpBackend;

        //This value must match the request
        var getProductByIdUrl = '/api/products/12365';

        mockBackend.when('GET', getProductByIdUrl).respond(getProductByIdResponse);

    }));

    //Inject the basket service to be tested
    beforeEach(inject(function(productCatalogService){
        injectedProductCatalogService = productCatalogService;
    } ));

    //Invoke the service and  verify the results
    it('Tests the getProductById method for success', function(){
        //This is done in the loginController
        var productCatalogPromise = injectedProductCatalogService.getProductById(12365);

        //Set values from the promise that can be tested later - to prove success was seen
        productCatalogPromise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(getProductByIdResponse);
        expect(requestFailureResponse).not.toBeDefined();

    });

    it('Tests the getPriceMessages method for success', function(){
        // On sale, price range, wasIs = true
        var wasIs = true, onSale = true;
        var priceInfo = {minPrice: '$168.09', minSalePrice: '$99.99', maxPrice: '$168.09', maxSalePrice: '$168.09'};
        requestSuccessResponse = {priceMsg: '', priceWasMsg: '$168.09 - $168.09', priceNowMsg: '$99.99 - $168.09'};
        var getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);

        // On sale, single price, wasIs = true
        wasIs = true;
        onSale = true;
        priceInfo = {minPrice: '$48.00', minSalePrice: '$45.00', maxPrice: '$49.59', maxSalePrice: '$45.00'};
        requestSuccessResponse = {priceMsg: '', priceWasMsg: '$48.00', priceNowMsg: '$45.00'};
        getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);

        // On sale, single price, wasIs = false
        wasIs = false;
        onSale = true;
        priceInfo = {minPrice: '$29.49', minSalePrice: '$19.99', maxPrice: '$29.49', maxSalePrice: '$19.99'};
        requestSuccessResponse = {priceMsg: '$19.99', priceWasMsg: '', priceNowMsg: ''};
        getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);

        // On sale, price range, wasIs = false
        wasIs = false;
        onSale = true;
        priceInfo = {minPrice: '$40.00', minSalePrice: '$0.67', maxPrice: '$12,369.00', maxSalePrice: '$1,000.00'};
        requestSuccessResponse = {priceMsg: '$0.67 - $1,000.00', priceWasMsg: '', priceNowMsg: ''};
        getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);

        // Not on sale, price range
        wasIs = false;
        onSale = false;
        priceInfo = {minPrice: '$15.50', minSalePrice: '$14.50', maxPrice: '$24.40', maxSalePrice: '$23.32'};
        requestSuccessResponse = {priceMsg: '$15.50 - $24.40', priceWasMsg: '', priceNowMsg: ''};
        getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);

        // Not on sale, single price
        wasIs = false;
        onSale = false;
        priceInfo = {minPrice: '$8.49', minSalePrice: '$0.00', maxPrice: '$8.49', maxSalePrice: '$0.00'};
        requestSuccessResponse = {priceMsg: '$8.49', priceWasMsg: '', priceNowMsg: ''};
        getPriceMessagesResponse = injectedProductCatalogService.getPriceMessages(priceInfo, wasIs, onSale);
        expect(requestSuccessResponse).toEqual(getPriceMessagesResponse);
    });

});