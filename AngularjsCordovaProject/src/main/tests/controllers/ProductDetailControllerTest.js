/*! ProductDetailController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('ProductDetailController Test', function () {

    var mockBackend, mockScope;
    var injectedProductCatalogService, injectedDataStorageService, injectedBasketService, injectedConfigService, injectedNewOrderService;
    var controller;
    var productIDsA = '100A';
    var productIDsB = '100B';
    var store = {
        id: 'SC1'
    };
    var loggedInCSR = {
        id: '9999'
    };
    var pathValue = '';
    var singleOptionResponse;
    var multipleOptionResponse;
    var crossSellsResponseA, crossSellsResponseB;

    //Construct a mock application with the same name as the target
    beforeEach(module('pointOfSaleApplication'));

    beforeEach(inject(function ($controller, $rootScope, $route, $log, $routeParams,
                                productCatalogService, dataStorageService, basketService, configService, newOrderService) {
        injectedProductCatalogService = productCatalogService;
        injectedDataStorageService = dataStorageService;
        injectedBasketService = basketService;
        injectedConfigService = configService;
        injectedNewOrderService = newOrderService;

        mockScope = $rootScope.$new();

        var mockLocation = {
            path : function path(arg1){
                pathValue = arg1;
            }
        };

        controller = $controller('productDetailController', {
            $scope: mockScope,
            $location: mockLocation,
            $route: $route,
            $log: $log,
            $routeParams: $routeParams,
            productCatalogService: injectedProductCatalogService,
            dataStorageService : injectedDataStorageService,
            basketService : injectedBasketService,
            configService : injectedConfigService,
            newOrderService : injectedNewOrderService
        });

        dataStorageService.setBasketId('1000');
    }));

        //Set up the Http mock backend to trap http requests
    beforeEach(inject(function($httpBackend){
        mockBackend = $httpBackend;

        var properties = {
            'app.ppos.ProductDetail.show_short_description' : 'short description',
            'app.ppos.ProductDetail.show_long_description' : 'long description',
            'app.ppos.ProductDetail.show_name' : 'show name'
        };

        injectedConfigService.setProperties('configuration', properties);

        //This value must match the request
        injectedDataStorageService.setStore(store);
        // Unsure why this request is happening while running the test
        mockBackend.when('GET', 'views/provisioning/Provisioning.html').respond('success');
    }));

    beforeEach(inject(function(){
        var serviceUrl = '/api/view/products/' + productIDsA + '/stores/' + store.id;
        singleOptionResponse = {
            data: {"image":{"thumbBadge":null,"thumb":"https://localhost:8445/images//products/en_us/thumb/2155.jpg","detail":"https://localhost:8445/images//products/en_us/detail/2155.jpg","detailBadge":null},"code":"2155","skus":[{"code":"2155","salePrice":"$0.00","price":"$65.59","options":[],"id":"179"}],"optionsWithAssociatedSkuIDs":[],"name":"[en_US] English Submersible Light Kit UPC[en_US]","description":{"longDescription":null,"keywords":"[en_US]   English Submersible Light Kit UPC (ÄèÖßÉçñéüÁ)","shortDescription":"[en_US] English Pondmaster Submersible Light Kit UPC (ÄèÖßÉçñéüÁ)","moreInfo":null},"wasIs":false,"onSale":false,"id":"141","prices":{"displayPrice":{"price":"$65.59","priceWas":""},"minPrice":"$65.59","minSalePrice":"$0.00","maxPrice":"$65.59","sku":{"179":{"displayPrice":{"price":"$65.59","priceWas":""},"minPrice":"$65.59","minSalePrice":"$0.00","maxPrice":"$65.59","maxSalePrice":"$0.00"}},"maxSalePrice":"$0.00"},"stock":{"179":{"quantity":999,"available":true}}}
        };
        mockBackend.when('GET', serviceUrl).respond(singleOptionResponse);
        mockScope.model = {};
    }));

    beforeEach(inject(function(){
        var serviceUrl = '/api/products/' + productIDsA + '/stores/SC1/crosssells';
        crossSellsResponseA = {
            data: {
                response : 'crossSellsResponseA'
            }
        };
        mockBackend.when('GET', serviceUrl).respond(crossSellsResponseA);
    }));

    beforeEach(inject(function(){
        var serviceUrl = '/api/products/' + productIDsB + '/stores/SC1/crosssells';
        crossSellsResponseB = {
            data: {
                response : 'crossSellsResponseB'
            }
        };
        mockBackend.when('GET', serviceUrl).respond(crossSellsResponseB);
    }));

    it('Test init product detail and cross sells for single sku (productIDsA)', function(){
        mockScope.init(productIDsA);
        mockBackend.flush();
        expect(mockScope.model.crossSells).toEqual(crossSellsResponseA.data);
    });

    it('Test init product detail for single sku (productIDsA)', function(){
        var skuId = '179';
        mockScope.init(productIDsA);
        mockBackend.flush();
        testStockInfo(skuId);
        expect(mockScope.model.initialized).toEqual(true);

        var addToBasketItem = mockScope.model.addToBasketItem;
        expect(addToBasketItem.productID).toEqual(mockScope.model.product.id);
        expect(addToBasketItem.thumb).toEqual(mockScope.model.product.image.thumb);
        expect(addToBasketItem.skuID).toEqual(null);
        expect(addToBasketItem.qty).toEqual(1);

        // enable stores button
        expect(mockScope.model.disableStoresButton).toEqual(false);
        // enable add to cart button
        expect(mockScope.model.disableAddToCartButton).toEqual(false);
    });

    it('Test getSelectedSku for single sku (productIDsA)', function(){
        mockScope.init(productIDsA);
        mockBackend.flush();
        mockScope.model.product.optionsWithAssociatedSkuIDs = [];
        var selectedSku = mockScope.getSelectedSku();
        expect(mockScope.model.product.skus[0].id).toEqual(selectedSku);
    });

    beforeEach(inject(function(){
        var serviceUrl = '/api/view/products/' + productIDsB + '/stores/' + store.id;
        var multipleSkusResponse = {
            data: {"image":{"thumbBadge":null,"thumb":"https://localhost:8445/images//products/en_us/thumb/TSHIRT000X_th.jpg","detail":"https://localhost:8445/images//products/en_us/detail/TSHIRT000X_dt.jpg","detailBadge":null},"code":"TSHIRT000A","skus":[{"code":"green-0002","salePrice":"$21.00","price":"$22.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","ordinal":2},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N1[en_US]","ordinal":2}],"id":"100166"},{"code":"purple-0001","salePrice":"$22.10","price":"$23.25","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_purple_sw.jpg","name":"[en_US]Purple[en_US]","ordinal":4},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100168"},{"code":"blue-0001","salePrice":"$18.50","price":"$19.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","ordinal":1},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100163"},{"code":"taupe-0001","salePrice":"$23.32","price":"$24.40","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_taupe_sw.jpg","name":"[en_US]Taupe[en_US]","ordinal":6},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N2[en_US]","ordinal":3}],"id":"100170"},{"code":"green-0001","salePrice":"$19.50","price":"$20.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","ordinal":2},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_medium_sw.jpg","name":"[en_US]Medium[en_US]","ordinal":1},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N1[en_US]","ordinal":2}],"id":"100165"},{"code":"orange-0001","salePrice":"$14.50","price":"$15.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_orange_sw.jpg","name":"[en_US]Orange[en_US]","ordinal":3},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100167"},{"code":"blue-0002","salePrice":"$21.75","price":"$22.75","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","ordinal":1},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]W2[en_US]","ordinal":1}],"id":"100164"},{"code":"red-0001","salePrice":"$18.00","price":"$19.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_red_sw.jpg","name":"[en_US]Red's Wild[en_US]","ordinal":5},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]W2[en_US]","ordinal":1}],"id":"100169"}],"optionsWithAssociatedSkuIDs":[{"optionType":"[en_US]Shirt Color[en_US]","options":[{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","skuIDs":["100163","100164"],"ordinal":1},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","skuIDs":["100166","100165"],"ordinal":2},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_orange_sw.jpg","name":"[en_US]Orange[en_US]","skuIDs":["100167"],"ordinal":3},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_purple_sw.jpg","name":"[en_US]Purple[en_US]","skuIDs":["100168"],"ordinal":4},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_red_sw.jpg","name":"[en_US]Red's Wild[en_US]","skuIDs":["100169"],"ordinal":5},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_taupe_sw.jpg","name":"[en_US]Taupe[en_US]","skuIDs":["100170"],"ordinal":6}],"selectedOption":null},{"optionType":"[en_US]Size[en_US]","options":[{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","skuIDs":["100166","100163","100167","100164"],"ordinal":0},{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_medium_sw.jpg","name":"[en_US]Medium[en_US]","skuIDs":["100165"],"ordinal":1},{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","skuIDs":["100168","100170","100169"],"ordinal":2}],"selectedOption":null},{"optionType":"[en_US]Width[en_US]","options":[{"image":null,"name":"[en_US]R[en_US]","skuIDs":["100168","100163","100167"],"ordinal":0},{"image":null,"name":"[en_US]W2[en_US]","skuIDs":["100164","100169"],"ordinal":1},{"image":null,"name":"[en_US]N1[en_US]","skuIDs":["100166","100165"],"ordinal":2},{"image":null,"name":"[en_US]N2[en_US]","skuIDs":["100170"],"ordinal":3}],"selectedOption":null}],"name":"[en_US]Colored T-Shirt (global swatches,product detail,product alt large image,product option swatch detail & alt large images)[en_US]","description":{"longDescription":"[en_US] (ÄèÖßÉçñéüÁ)","keywords":"[en_US] (ÄèÖßÉçñéüÁ)","shortDescription":"[en_US]Billabong Mens Casual Cotton Crew / LongSleeve T-Shirt","moreInfo":"[en_US] (ÄèÖßÉçñéüÁ)"},"wasIs":false,"onSale":false,"id":"100223","prices":{"displayPrice":{"price":"$15.50 - $24.40","priceWas":""},"minPrice":"$15.50","minSalePrice":"$14.50","maxPrice":"$24.40","sku":{"100170":{"displayPrice":{"price":"$24.40","priceWas":""},"minPrice":"$24.40","minSalePrice":"$23.32","maxPrice":"$24.40","maxSalePrice":"$23.32"},"100163":{"displayPrice":{"price":"$19.50","priceWas":""},"minPrice":"$19.50","minSalePrice":"$18.50","maxPrice":"$19.50","maxSalePrice":"$18.50"},"100164":{"displayPrice":{"price":"$22.75","priceWas":""},"minPrice":"$22.75","minSalePrice":"$21.75","maxPrice":"$22.75","maxSalePrice":"$21.75"},"100165":{"displayPrice":{"price":"$20.50","priceWas":""},"minPrice":"$20.50","minSalePrice":"$19.50","maxPrice":"$20.50","maxSalePrice":"$19.50"},"100166":{"displayPrice":{"price":"$22.50","priceWas":""},"minPrice":"$22.50","minSalePrice":"$21.00","maxPrice":"$22.50","maxSalePrice":"$21.00"},"100167":{"displayPrice":{"price":"$15.50","priceWas":""},"minPrice":"$15.50","minSalePrice":"$14.50","maxPrice":"$15.50","maxSalePrice":"$14.50"},"100168":{"displayPrice":{"price":"$23.25","priceWas":""},"minPrice":"$23.25","minSalePrice":"$22.10","maxPrice":"$23.25","maxSalePrice":"$22.10"},"100169":{"displayPrice":{"price":"$19.50","priceWas":""},"minPrice":"$19.50","minSalePrice":"$18.00","maxPrice":"$19.50","maxSalePrice":"$18.00"}},"maxSalePrice":"$23.32"},"stock":{"100170":{"quantity":999,"available":true},"100163":{"quantity":994,"available":true},"100164":{"quantity":979,"available":true},"100165":{"quantity":999,"available":true},"100166":{"quantity":999,"available":true},"100167":{"quantity":999,"available":true},"100168":{"quantity":999,"available":true},"100169":{"quantity":999,"available":true}}}
        };
        mockBackend.when('GET', serviceUrl).respond(multipleSkusResponse);
        mockScope.model = {};
    }));

    it('Test init product detail for multiple skus (productIDsB)', function(){
        mockScope.init(productIDsB);
        mockBackend.flush();
        // more than one sku, price is not displayed until options are selected
        testStockInfoEmpty();
        expect(mockScope.model.initialized).toEqual(true);
        var addToBasketItem = mockScope.model.addToBasketItem;
        expect(addToBasketItem.productID).toEqual(mockScope.model.product.id);
        // disable stores button
        expect(mockScope.model.disableStoresButton).toEqual(true);
        // disable add to cart button
        expect(mockScope.model.disableAddToCartButton).toEqual(true);
    });

    it('Test getSelectedSku for multiple skus (productIDsB)', function(){
        mockScope.init(productIDsB);
        mockBackend.flush();

        // Get selected sku.
        // Select first option for each option type.
        selectFirstOption(0);
        selectFirstOption(1);
        selectFirstOption(2);

        var selectedSku = mockScope.getSelectedSku();
        var index0 = mockScope.model.product.optionsWithAssociatedSkuIDs[0].selectedOption.skuIDs.indexOf(selectedSku);
        var index1 = mockScope.model.product.optionsWithAssociatedSkuIDs[1].selectedOption.skuIDs.indexOf(selectedSku);
        var index2 = mockScope.model.product.optionsWithAssociatedSkuIDs[2].selectedOption.skuIDs.indexOf(selectedSku);
        // Find selected sku
        var result = (index0 > -1 && index1 > -1 && index2 > -1);
        expect(result).toEqual(true);
    });

    beforeEach(inject(function(){
        var serviceUrl = '/api/baskets/1000';
        var response = 'success';
        mockBackend.when('POST', serviceUrl).respond(response);
        serviceUrl = 'views/basket/Basket.html';
        response = 'success';
        mockBackend.when('GET', serviceUrl).respond(response);
    }));

    it('Test add item (no options) to basket', function(){
        mockScope.init(productIDsA);
        mockBackend.flush();

        mockScope.addItemToBasket();
        mockBackend.flush();

        expect(mockScope.model.addToBasketItem.storeID).toEqual(store.id);
        expect(mockScope.model.addToBasketItem.skuID).toEqual(singleOptionResponse.data.skus[0].id);
        expect(pathValue).toEqual('/basket');

    });

    beforeEach(inject(function(){
        // new order
        var serviceUrl = '/api/baskets/newGuestBasket?phone=&storeID=SC1';
        multipleOptionResponse = {
            data : {
                customerId : '101',
                basketId : '201'
            }
        };
        mockBackend.when('POST', serviceUrl).respond(multipleOptionResponse);

        // create basket
        serviceUrl = '/api/baskets/201';
        mockBackend.when('POST', serviceUrl).respond(multipleOptionResponse);
    }));


    it('Test add item (no options) to basket (new customer/basket)', function(){
        pathValue = '';
        mockScope.init(productIDsA);
        mockBackend.flush();

        injectedDataStorageService.setLoggedInCSR(loggedInCSR);
        injectedDataStorageService.removeItem('basketId');
        injectedDataStorageService.removeItem('customerId');
        mockScope.addItemToBasket();
        mockBackend.flush();

        // Existing customer does not exist
        expect(multipleOptionResponse.data.customerId).toEqual(injectedDataStorageService.getCustomerId());
        expect(multipleOptionResponse.data.basketId).toEqual(injectedDataStorageService.getBasketId());
        expect(pathValue).toEqual('/basket');
    });

    it('Test productOptionChanged (productIDsB)', function(){
        mockScope.init(productIDsB);
        mockBackend.flush();

        // select first option
        var selectedOption = selectFirstOption(0);
        mockScope.$emit('productOptionChanged', { selectedSkus:selectedOption });
        // disable
        expect(mockScope.model.disableStoresButton).toEqual(true);
        expect(mockScope.model.disableAddToCartButton).toEqual(true);
        testStockInfoEmpty();

        // select second option
        selectedOption = selectFirstOption(1);
        mockScope.$emit('productOptionChanged', { selectedSkus:selectedOption });
        // disable
        expect(mockScope.model.disableStoresButton).toEqual(true);
        expect(mockScope.model.disableAddToCartButton).toEqual(true);
        testStockInfoEmpty();

        // select final option
        selectedOption = selectFirstOption(2);
        mockScope.$emit('productOptionChanged', { selectedSkus:selectedOption });
        // enable
        expect(mockScope.model.disableStoresButton).toEqual(false);
        expect(mockScope.model.disableAddToCartButton).toEqual(false);
        testStockInfo(mockScope.getSelectedSku());
    });

    function testStockInfo(skuId){
        var stockInfo = mockScope.model.product.stock[skuId];
        // only one sku
        expect(mockScope.model.priceSkuMsg).toEqual(mockScope.model.product.prices.sku[skuId].displayPrice.price);
        expect(mockScope.model.stockAvailable).toEqual(stockInfo.available);
        expect(mockScope.model.stockQty).toEqual(stockInfo.quantity);
        expect(mockScope.model.stockUnavailable).toEqual(!mockScope.model.stockAvailable);
    }
    function testStockInfoEmpty(){
        expect(mockScope.model.priceSkuMsg).toEqual('');
        expect(mockScope.model.stockAvailable).toEqual('');
        expect(mockScope.model.stockQty).toEqual('');
        expect(mockScope.model.stockUnavailable).toEqual('');
    }
    function selectFirstOption(i){
        mockScope.model.product.optionsWithAssociatedSkuIDs[i].selectedOption =
            mockScope.model.product.optionsWithAssociatedSkuIDs[i].options[0];
    }
});

