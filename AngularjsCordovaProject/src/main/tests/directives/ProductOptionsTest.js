/*! ProductOptionsTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('ProductOptionsTest', function () {
    var compile, scope, directiveElem, mockBackend;
    var isolatedScope;

    beforeEach(module('ppos.templates'));

    beforeEach(function () {
        module('pointOfSaleApplication');

        inject(function ($httpBackend, $compile, $rootScope) {
            mockBackend = $httpBackend;
            compile = $compile;
            scope = $rootScope.$new();
        });

        var multipleSkusData = {
            data: {"image":{"thumbBadge":null,"thumb":"https://localhost:8445/images//products/en_us/thumb/TSHIRT000X_th.jpg","detail":"https://localhost:8445/images//products/en_us/detail/TSHIRT000X_dt.jpg","detailBadge":null},"code":"TSHIRT000A","skus":[{"code":"green-0002","salePrice":"$21.00","price":"$22.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","ordinal":2},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N1[en_US]","ordinal":2}],"id":"100166"},{"code":"purple-0001","salePrice":"$22.10","price":"$23.25","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_purple_sw.jpg","name":"[en_US]Purple[en_US]","ordinal":4},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100168"},{"code":"blue-0001","salePrice":"$18.50","price":"$19.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","ordinal":1},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100163"},{"code":"taupe-0001","salePrice":"$23.32","price":"$24.40","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_taupe_sw.jpg","name":"[en_US]Taupe[en_US]","ordinal":6},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N2[en_US]","ordinal":3}],"id":"100170"},{"code":"green-0001","salePrice":"$19.50","price":"$20.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","ordinal":2},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_medium_sw.jpg","name":"[en_US]Medium[en_US]","ordinal":1},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]N1[en_US]","ordinal":2}],"id":"100165"},{"code":"orange-0001","salePrice":"$14.50","price":"$15.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_orange_sw.jpg","name":"[en_US]Orange[en_US]","ordinal":3},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]R[en_US]","ordinal":0}],"id":"100167"},{"code":"blue-0002","salePrice":"$21.75","price":"$22.75","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","ordinal":1},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","ordinal":0},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]W2[en_US]","ordinal":1}],"id":"100164"},{"code":"red-0001","salePrice":"$18.00","price":"$19.50","options":[{"optionType":"[en_US]Shirt Color[en_US]","image":"/products/en_us/swatches/SHIRT_COLOR_red_sw.jpg","name":"[en_US]Red's Wild[en_US]","ordinal":5},{"optionType":"[en_US]Size[en_US]","image":"/products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","ordinal":2},{"optionType":"[en_US]Width[en_US]","image":null,"name":"[en_US]W2[en_US]","ordinal":1}],"id":"100169"}],"optionsWithAssociatedSkuIDs":[{"optionType":"[en_US]Shirt Color[en_US]","options":[{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_blue_sw.jpg","name":"[en_US]Blue[en_US]","skuIDs":["100163","100164"],"ordinal":1},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_green_sw.jpg","name":"[en_US]Green[en_US]","skuIDs":["100166","100165"],"ordinal":2},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_orange_sw.jpg","name":"[en_US]Orange[en_US]","skuIDs":["100167"],"ordinal":3},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_purple_sw.jpg","name":"[en_US]Purple[en_US]","skuIDs":["100168"],"ordinal":4},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_red_sw.jpg","name":"[en_US]Red's Wild[en_US]","skuIDs":["100169"],"ordinal":5},{"image":"https://localhost:8445/images//products/en_us/swatches/SHIRT_COLOR_taupe_sw.jpg","name":"[en_US]Taupe[en_US]","skuIDs":["100170"],"ordinal":6}],"selectedOption":null},{"optionType":"[en_US]Size[en_US]","options":[{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_small_sw.jpg","name":"[en_US]Small[en_US]","skuIDs":["100166","100163","100167","100164"],"ordinal":0},{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_medium_sw.jpg","name":"[en_US]Medium[en_US]","skuIDs":["100165"],"ordinal":1},{"image":"https://localhost:8445/images//products/en_us/swatches/SIZE_large_sw.jpg","name":"[en_US]Large[en_US]","skuIDs":["100168","100170","100169"],"ordinal":2}],"selectedOption":null},{"optionType":"[en_US]Width[en_US]","options":[{"image":null,"name":"[en_US]R[en_US]","skuIDs":["100168","100163","100167"],"ordinal":0},{"image":null,"name":"[en_US]W2[en_US]","skuIDs":["100164","100169"],"ordinal":1},{"image":null,"name":"[en_US]N1[en_US]","skuIDs":["100166","100165"],"ordinal":2},{"image":null,"name":"[en_US]N2[en_US]","skuIDs":["100170"],"ordinal":3}],"selectedOption":null}],"name":"[en_US]Colored T-Shirt (global swatches,product detail,product alt large image,product option swatch detail & alt large images)[en_US]","description":{"longDescription":"[en_US] (ÄèÖßÉçñéüÁ)","keywords":"[en_US] (ÄèÖßÉçñéüÁ)","shortDescription":"[en_US]Billabong Mens Casual Cotton Crew / LongSleeve T-Shirt","moreInfo":"[en_US] (ÄèÖßÉçñéüÁ)"},"wasIs":false,"onSale":false,"id":"100223","prices":{"displayPrice":{"price":"$15.50 - $24.40","priceWas":""},"minPrice":"$15.50","minSalePrice":"$14.50","maxPrice":"$24.40","sku":{"100170":{"displayPrice":{"price":"$24.40","priceWas":""},"minPrice":"$24.40","minSalePrice":"$23.32","maxPrice":"$24.40","maxSalePrice":"$23.32"},"100163":{"displayPrice":{"price":"$19.50","priceWas":""},"minPrice":"$19.50","minSalePrice":"$18.50","maxPrice":"$19.50","maxSalePrice":"$18.50"},"100164":{"displayPrice":{"price":"$22.75","priceWas":""},"minPrice":"$22.75","minSalePrice":"$21.75","maxPrice":"$22.75","maxSalePrice":"$21.75"},"100165":{"displayPrice":{"price":"$20.50","priceWas":""},"minPrice":"$20.50","minSalePrice":"$19.50","maxPrice":"$20.50","maxSalePrice":"$19.50"},"100166":{"displayPrice":{"price":"$22.50","priceWas":""},"minPrice":"$22.50","minSalePrice":"$21.00","maxPrice":"$22.50","maxSalePrice":"$21.00"},"100167":{"displayPrice":{"price":"$15.50","priceWas":""},"minPrice":"$15.50","minSalePrice":"$14.50","maxPrice":"$15.50","maxSalePrice":"$14.50"},"100168":{"displayPrice":{"price":"$23.25","priceWas":""},"minPrice":"$23.25","minSalePrice":"$22.10","maxPrice":"$23.25","maxSalePrice":"$22.10"},"100169":{"displayPrice":{"price":"$19.50","priceWas":""},"minPrice":"$19.50","minSalePrice":"$18.00","maxPrice":"$19.50","maxSalePrice":"$18.00"}},"maxSalePrice":"$23.32"},"stock":{"100170":{"quantity":999,"available":true},"100163":{"quantity":994,"available":true},"100164":{"quantity":979,"available":true},"100165":{"quantity":999,"available":true},"100166":{"quantity":999,"available":true},"100167":{"quantity":999,"available":true},"100168":{"quantity":999,"available":true},"100169":{"quantity":999,"available":true}}}
        };
        scope.model = {
            product : multipleSkusData.data
        };

        directiveElem = getCompiledElement();
        isolatedScope = directiveElem.isolateScope();
        scope.$digest();
    });

    function getCompiledElement() {
        var html = '<div class="ml-product-detail-options-wrapper" data-ml-product-options data-options="model.product.optionsWithAssociatedSkuIDs"></div>';
        var element = angular.element(html);
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    describe('verify DOM elements were added', function () {
        it('should have added product option container', function () {
            var divElement = directiveElem.find('.ml-product-option-container');
            expect(divElement).toBeDefined();
            divElement = directiveElem.find('.ml-product-option-type');
            expect(divElement).toBeDefined();
            divElement = directiveElem.find('.ml-product-option-text');
            expect(divElement).toBeDefined();
        });
    });

    describe('test option selection', function () {
        var emitArg1, emitArg2;
        beforeEach(function () {
            isolatedScope.$emit = function (arg1, arg2) {
                emitArg1 = arg1;
                emitArg2 = arg2;
            };
        });
        it('test single selection', function () {
            var optionType = scope.model.product.optionsWithAssociatedSkuIDs[0];
            var option = optionType.options[0];
            // objects should be null before selecting options
            expect(optionType.selectedOption).toEqual(null);
            expect(isolatedScope.activeOptionType).toEqual(null);
            expect(isolatedScope.selectedSkus).toEqual(null);
            // select objects
            isolatedScope.selectOption(optionType, option);
            scope.$digest();
            // verify scope variables are correctly set
            expect(optionType.selectedOption).toEqual(option);
            expect(isolatedScope.activeOptionType).toEqual(optionType);
            expect(isolatedScope.selectedSkus).toEqual(option.skuIDs);

            // one or fewer options selected
            expect(isolatedScope.firstOptionSelect()).toEqual(true);
        });
        it('test multiple selection', function () {
            var optionType = scope.model.product.optionsWithAssociatedSkuIDs[0];
            var option = optionType.options[0];
            // first selection
            isolatedScope.selectOption(optionType, option);
            scope.$digest();

            optionType = scope.model.product.optionsWithAssociatedSkuIDs[1];
            option = optionType.options[0];
            // second selection
            isolatedScope.selectOption(optionType, option);
            scope.$digest();
            expect(isolatedScope.firstOptionSelect()).toEqual(false);
        });
        it('test emit productOptionChanged', function () {
            var optionType = scope.model.product.optionsWithAssociatedSkuIDs[0];
            var option = optionType.options[0];

            isolatedScope.selectOption(optionType, option);
            scope.$digest();
            // test emit productOptionChanged
            expect(emitArg1).toEqual('productOptionChanged');
            expect(emitArg2.selectedSkus).toEqual(isolatedScope.selectedSkus);
        });
    });
});

