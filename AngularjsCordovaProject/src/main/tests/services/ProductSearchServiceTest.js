describe('Product Search Service', function() {

    var injectedProductSearchService;

	var injectedTestDataService;

	var testGetProductByCodeSuccessResponse = '/api/products?q=106d&families=none&offset=0&pagesize=6&sortOrder=desc&sortParam=bestMatchesDescend';

	var testGetProductByCodeSuccessResponseMultiple = '/api/products?q=1100&families=none&offset=0&pagesize=6&sortOrder=desc&sortParam=bestMatchesDescend';

	var testGetNoProductByCodeNoResultResponse = '/api/products?q=thisisnosearchresult&families=none&offset=0&pagesize=6&sortOrder=desc&sortParam=bestMatchesDescend' ;


    var requestSuccessResponse, requestFailureResponse;

    // Ensure application module is available.
    beforeEach(module('pointOfSaleApplication'));

	// Inject the service that we intend to test and store it locally for access.
    beforeEach(inject(function ($injector, dataService, productSearchService) {
		injectedProductSearchService = productSearchService;
		injectedTestDataService = dataService;

		$httpBackend = $injector.get('$httpBackend');

		var mockResponse = {'data' :	{'searchResultSize':1,'alternateTermsQueryEncoded':null,'alternateTermsQuery':null,'productInfo':[{'image':{'thumbBadge':null,'thumb':'/products/en_us/thumb/noimage.gif','detail':'/products/en_us/detail/noimage.gif','detailBadge':null},'code':'106d','skus':[{'code':'106d','salePrice':'$31.79','price':'$31.79','options':[],'id':'2'}],'name':'[en_US] US English - Pond Salt 50lb (Treats 6208 gal.)[en_US]','description':{'longDescription':null,'keywords':'[en_US] US English - Pond Salt 50lb (Treats 6208 gal.) (ÄèÖßÉçñéüÁ)','shortDescription':'[en_US] US English - Pond Care&reg; Pond Salt (ÄèÖßÉçñéüÁ)','moreInfo':null},'wasIs':false,'onSale':false,'id':'2'}]}};

		var mockResponseMultiple = {'data' :
			{'searchResultSize':2,'alternateTermsQueryEncoded':null,'alternateTermsQuery':null,'productInfo':[{'image':{'thumbBadge':null,'thumb':'/products/en_us/thumb/noimage.gif','detail':'/products/en_us/detail/noimage.gif','detailBadge':null},'code':'1100','skus':[{'code':'1100-sand','salePrice':'$73.19','price':'$73.19','options':[{'optionType':'[en_US]Color[en_US]','image':null,'name':'[en_US]Sandstone[en_US]','ordinal':4}],'id':'4'},{'code':'1100-sunset','salePrice':'$73.19','price':'$73.19','options':[{'optionType':'[en_US]Color[en_US]','image':null,'name':'[en_US]Sunset Red[en_US]','ordinal':0}],'id':'6'},{'code':'1100-granite','salePrice':'$73.19','price':'$73.19','options':[{'optionType':'[en_US]Color[en_US]','image':null,'name':'[en_US]Light Granite[en_US]','ordinal':3}],'id':'3'}],'name':'[en_US]Inter-Fab Landscape Boulder # 1100[en_US]','description':{'longDescription':null,'keywords':'[en_US]Inter-Fab Landscape Boulder # 1100, personalization (ÄèÖßÉçñéüÁ)','shortDescription':'[en_US]Inter-Fab\'s echoes of nature Landscape Boulder # 1100&lt;br&gt;30&quot; x 18&quot; x 10&quot; (ÄèÖßÉçñéüÁ)','moreInfo':null},'wasIs':false,'onSale':false,'id':'3'},{'image':{'thumbBadge':null,'thumb':'/products/en_us/thumb/noimage.gif','detail':'/products/en_us/detail/noimage.gif','detailBadge':null},'code':'3350','skus':[{'code':'3350','salePrice':'$0.00','price':'$151.29','options':[],'id':'245'}],'name':'[en_US]Cascade 1100 (1100 gph)[en_US]','description':{'longDescription':null,'keywords':'[en_US]Cascade 1100 (ÄèÖßÉçñéüÁ)','shortDescription':'[en_US]Hozelock Cyprio Cascade All Purpose Pumps (ÄèÖßÉçñéüÁ)','moreInfo':null},'wasIs':false,'onSale':false,'id':'198'}]}};

		$httpBackend.when('GET', testGetProductByCodeSuccessResponse).respond(mockResponse);
		$httpBackend.when('GET', testGetProductByCodeSuccessResponseMultiple).respond(mockResponseMultiple);
		$httpBackend.when('GET', testGetNoProductByCodeNoResultResponse).respond(404, 'Entity Not Found');

    }));

	it ('Test GET Success Request', function () {

		var productSearchRequest = {
			productSearchKeyword : '106d',
			offSet : 0,
			productsPerPage : 6,
			pageNumber : 1,
			currentSortOrder: 'desc',
			currentSortParam: 'bestMatchesDescend'
		};

		var successResponseData, failureRespnseData;

		var getRequestPromiseResponse = injectedProductSearchService.searchProduct(productSearchRequest);

        getRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            id = successResult.searchResult.productInfo[0].id;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(id).toEqual('2');

	});

	it ('Test GET Success Request', function () {

		var productSearchRequest = {
			productSearchKeyword : '1100',
			offSet : 0,
			productsPerPage : 6,
			pageNumber : 1,
			currentSortOrder: 'desc',
			currentSortParam: 'bestMatchesDescend'
		};

		var successResponseData, failureRespnseData;

		var getRequestPromiseResponse = injectedProductSearchService.searchProduct(productSearchRequest);

        getRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
            searchResultSize = successResult.searchResult.searchResultSize;
        }, function (errorResult) {
			failureRespnseData = errorResult;
        });

        $httpBackend.flush();

		expect(successResponseData).toBeDefined();
        expect(failureRespnseData).not.toBeDefined();
		expect(searchResultSize).toEqual(2);

	});

	it ('Test GET Failure Request', function () {

		var productSearchRequest = {
			productSearchKeyword : 'thisisnosearchresult',
			offSet : 0,
			productsPerPage : 6,
			pageNumber : 1,
			currentSortOrder: 'desc',
			currentSortParam: 'bestMatchesDescend'
		};

		var successResponseData, failureRespnseData;

		var getRequestPromiseResponse = injectedProductSearchService.searchProduct(productSearchRequest);

        getRequestPromiseResponse.then(function (successResult) {
			successResponseData = successResult;
        }, function (errorResult) {
			failureRespnseData = errorResult;
			error = errorResult.searchResult
        });

        $httpBackend.flush();

		expect(successResponseData).not.toBeDefined();
        expect(failureRespnseData).toBeDefined();
		expect(error).toEqual('Entity Not Found');

	});

});