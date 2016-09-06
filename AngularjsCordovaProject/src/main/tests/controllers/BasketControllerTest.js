/*! BasketControllerTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('BasketControllerTest Test', function () {

    var mockBackend, mockScope;
    var injectedDataStorageService,injectedBasketService,injectedAccountService,injectedScanBarcodeService,injectedProductCatalogService;
    var injectedConfigService;
    var controller;
    var store = {
        id: 'SC1'
    };
    var loggedInCSR = {
        id: '9999'
    };
    var basketId = '1000';
    var locationValue = '';
    var getInventorySkus = {
        'data':{'qtyAvailable':10000,'sku':'179'}
    };
    var mockLocation;
    var compile;

    //Construct a mock application with the same name as the target
    beforeEach(module('pointOfSaleApplication'));

    beforeEach(inject(function ($controller, $httpBackend, $rootScope, $location, $route, dataStorageService, basketService,
                                accountService, scanBarcodeService, $log, $q, $compile, productCatalogService) {

        compile = $compile;
        mockBackend = $httpBackend;
        mockBackend.when('GET', 'views/provisioning/Provisioning.html').respond('success');
        mockScope = $rootScope.$new();
        mockLocation = {
            path : function path(arg1){
                locationValue = arg1;
            }
        };

        injectedDataStorageService = dataStorageService;
        injectedBasketService = basketService;
        injectedAccountService = accountService;
        injectedScanBarcodeService = scanBarcodeService;
        injectedProductCatalogService = productCatalogService

        injectedDataStorageService.setBasketId(basketId);
        injectedDataStorageService.setStore(store);
        injectedDataStorageService.setLoggedInCSR(loggedInCSR);

        controller = $controller('basketController', {
            $scope: mockScope,
            $location: mockLocation,
            $route: $route,
            $log: $log,
            $q : $q,
            dataStorageService: injectedDataStorageService,
            basketService : injectedBasketService,
            accountService : injectedAccountService,
            scanBarcodeService : injectedScanBarcodeService,
            productCatalogService : injectedProductCatalogService
        });
    }));

    var getBasketResponse = {
        'data':{'shippingStateTotal':'$0.00','additionalAddressTotal':'$0.00','shippingMethodTotal':'$0.00','weightSurchargeTotal':'$0.00','taxTotal':'$4.59','dateModified':1441061753477,'subTotal':'$65.59','shippingWeightTotal':'$0.00','merchandiseTotal':'$65.59','shipments':[{'discounts':[],'contact':{'address':{'country':'US','postOfficeBox':false,'street3':null,'city':'Petaluma','postalCode':'94958','street1':'508 Petaluma Boulevard South','street2':null,'state':'US/CA','region':null,'apartmentNumber':null},'person':{'firstName':'Guest','lastName':'Guest','middleName':null},'id':'200201'},'shippingMethod':{'cost':'$0.00','name':'Standard','description':'Arrives within 7-10 business days.'},'discountedShippingTotal':'$0.00','id':'100202','items':[{'adjustmentNote':null,'product':{'image':{'thumbBadge':null,'thumb':'https://localhost:8445/images//products/en_us/thumb/2155.jpg','detail':'https://localhost:8445/images//products/en_us/detail/2155.jpg','detailBadge':null},'name':'[en_US] English Submersible Light Kit UPC[en_US]','id':'141'},'adjustmentType':null,'regularPrice':'$65.59','sellPrice':'$65.59','subTotal':'$65.59','store':{'zipCode':'94958','code':'SC1','street3':null,'city':'Petaluma','street1':'508 Petaluma Boulevard South','id':'1','street2':null,'state':'CA'},'skuRegularPrice':'$65.59','freeProduct':false,'discounts':[],'discountTotal':'$0.00','freeGift':false,'qty':1,'isPickupFromStore':true,'options':[],'subTotalWithoutAdjustment':'$65.59','adjustmentValue':null,'id':'100401','adjustmentAmount':null,'skuID':'179','skuCode':'2155'}]}],'summarizedShippingTotal':'$0.00','shippingTotal':'$0.00','total':'$70.18','discounts':[],'discountTotal':'$0.00','discountItemTotal':'$0.00','discountedShippingTotal':'$0.00','additionalChargesTotal':'$0.00','id':'100201','giftWrapTotal':'$0.00','sourceCodeInfoList':[],'shippingLocationTotal':'$0.00','shippingCostTotal':'$0.00','customer':{'primaryContact':{'address':{'country':'US','postOfficeBox':false,'street3':null,'city':'Petaluma','postalCode':'94958','street1':'508 Petaluma Boulevard South','street2':null,'state':'US/CA','region':null,'apartmentNumber':null},'person':{'firstName':'Guest','lastName':'Guest','middleName':null},'id':'200201','phone1':null},'guest':true,'id':'100201'}}
    };
    var customerId = '10001';
    var guest = 'Guest';
    var getCustomerResponse = {
        data: {
            primaryContact :{
                id: '10001',
                person : {
                    firstName : guest,
                    lastName : guest
                }
            }
        }
    };

    beforeEach(inject(function(){
        injectedDataStorageService.setCustomerId(customerId);
        var url = '/api/account/customers/' + customerId;
        mockBackend.when('GET', url).respond(getCustomerResponse);
    }));

    beforeEach(inject(function(){
        var result = {};
        var url = '/api/baskets/1000/items';
        mockBackend.when('PUT', url).respond(result);
    }));

    beforeEach(inject(function(){
        var url = '/api/baskets/' + basketId;
        mockBackend.when('GET', url).respond(getBasketResponse);
    }));

    describe('Test reload basket - sku found', function () {

        beforeEach(inject(function(){
            var url = '/api/inventory/skus/179';
            mockBackend.when('GET', url).respond(getInventorySkus);
        }));
        beforeEach(inject(function(configService){
            injectedConfigService = configService;
            var configuration = {
                'app.ppos.basket.autoSaveCart' : true
            };
            injectedConfigService.setProperties('configuration', configuration);
        }));
        it('Test reload basket - sku found', function(){
            mockBackend.flush();
            expect(mockScope.customerInformation).toEqual(null);
            expect(mockScope.basketId).toEqual(basketId);
            expect(mockScope.storeId).toEqual(store.id);
            expect(mockScope.loggedInCSR.id).toEqual(loggedInCSR.id);
            expect(mockScope.skuBarcodeSearchPostData.basketId).toEqual(basketId);
            expect(mockScope.skuBarcodeSearchPostData.storeId).toEqual(store.id);
            expect(mockScope.skuBarcodeSearchPostData.csrId).toEqual(loggedInCSR.id);
            expect(mockScope.basketDetailDataModel.data.total).toEqual(getBasketResponse.data.total);

            // trigger initializeBasketDetailDataModel function with reloadBasket
            mockScope.$emit('reloadBasket');
            mockBackend.flush();

            expect(mockScope.basketDetailDataModel.data.total).toEqual(getBasketResponse.data.total);
            expect(mockScope.basketDetailDataModel.isAutoSaveBag).toEqual(true);
            // check shipment info
            var item = mockScope.basketDetailDataModel.data.shipments[0].items[0];
            expect(item.isAvailableInStore).toEqual(true);
            expect(item.isAvailableOnline).toEqual(true);
        });
    });

    describe('Test reload basket - sku not found', function () {
        beforeEach(inject(function(){
            var url = '/api/baskets/' + basketId;
            mockBackend.when('GET', url).respond(getBasketResponse);
        }));
        beforeEach(inject(function(){
            getInventorySkus = {
                'data':{'qtyAvailable':10000,'sku':'178'}
            };
            var url = '/api/inventory/skus/179';
            mockBackend.when('GET', url).respond(getInventorySkus);
        }));
        it('Test reload basket - sku not found', function(){
            mockBackend.flush();
            mockScope.basketDetailDataModel = {};
            // trigger initializeBasketDetailDataModel function with reloadBasket
            mockScope.$emit('reloadBasket');
            mockBackend.flush();

            // sku not found
            var item = mockScope.basketDetailDataModel.data.shipments[0].items[0];
            expect(item.isAvailableInStore).toEqual(undefined);
            expect(item.isAvailableOnline).toEqual(undefined);
        });
    });

    describe('Test reload basket - qty zero', function () {
        beforeEach(inject(function(){
            var url = '/api/baskets/' + basketId;
            mockBackend.when('GET', url).respond(getBasketResponse);
        }));
        beforeEach(inject(function(){
            getInventorySkus = {
                'data':{'qtyAvailable':0,'sku':'179'}
            };
            var url = '/api/inventory/skus/179';
            mockBackend.when('GET', url).respond(getInventorySkus);
        }));
        it('Test reload basket - qty zero', function(){
            mockBackend.flush();
            mockScope.basketDetailDataModel = {};
            // trigger initializeBasketDetailDataModel function with reloadBasket
            mockScope.$emit('reloadBasket');
            mockBackend.flush();

            var item = mockScope.basketDetailDataModel.data.shipments[0].items[0];
            // sku found - in store
            expect(item.isAvailableInStore).toEqual(true);
            // bu quantity is zero
            expect(item.isAvailableOnline).toEqual(false);
        });
    });

    beforeEach(inject(function(){
        getInventorySkus = {
            'data':{'qtyAvailable':1,'sku':'179'}
        };
        var url = '/api/inventory/skus/179?storeID=SC1';
        mockBackend.when('GET', url).respond(getInventorySkus);
    }));

    describe('Test basket controller - isPickupFromStore false', function () {
        beforeEach(inject(function(){
            getBasketResponse.data.shipments[0].items[0].isPickupFromStore = false;
            var url = '/api/baskets/' + basketId;
            mockBackend.when('GET', url).respond(getBasketResponse);
        }));
        it('Test basket controller - isPickupFromStore false', function(){
            mockBackend.flush();
            mockScope.basketDetailDataModel = {};
            mockScope.$emit('reloadBasket');
            mockBackend.flush();
            // trigger initializeBasketDetailDataModel function with reloadBasket
        });
    });

    describe('Test initializeCustomerDetail', function () {
        beforeEach(inject(function(){
            var url = '/api/baskets/' + basketId;
            mockBackend.when('GET', url).respond(getBasketResponse);
        }));
        describe('Test initializeCustomerDetail', function () {
            it('Test initializeCustomerDetail', function(){
                mockScope.initializeCustomerDetail(customerId);
                mockBackend.flush();
                expect(mockScope.customerInformation).toEqual(guest);
            });
        });
        describe('Test initializeCustomerDetail', function () {
            var firstName = 'first';
            var lastName = 'last';
            beforeEach(inject(function(){
                getCustomerResponse.data.primaryContact.person.firstName = firstName;
                getCustomerResponse.data.primaryContact.person.lastName = lastName;
                injectedDataStorageService.setCustomerId(customerId);
                var url = '/api/account/customers/' + customerId;
                mockBackend.when('GET', url).respond(getCustomerResponse);
            }));
            it('Test initializeCustomerDetail', function(){
                mockScope.initializeCustomerDetail(customerId);
                mockBackend.flush();
                expect(mockScope.customerInformation).toEqual(firstName + ' ' + lastName);
            });
        });
    });
    describe('Test updateBasketItem', function () {
        var isRemoveItemFromBasket = false;
        var isInitializeBasketDetailDataModel = false;
        var basketItemId, productId, skuId, qty, store;
        basketItemId = null;
        productId = null;
        skuId = null;
        store = null;
        beforeEach(inject(function(){
            mockScope.removeItemFromBasket = function(){
                isRemoveItemFromBasket = true;
            };
            mockScope.initializeBasketDetailDataModel = function(){
                isInitializeBasketDetailDataModel = true;
            };
            var basketId = '1000';
            var url = '/api/baskets/' + basketId;
            mockBackend.when('GET', url).respond(getBasketResponse);
        }));
        it('Test updateBasketItem', function(){
            qty = 0;
            // unable to remove item because of null basketId, null basketItemId
            mockScope.updateBasketItem(basketId, basketItemId, productId, skuId, qty, store);
            mockBackend.flush();
            expect(isRemoveItemFromBasket).toEqual(false);
            basketItemId = '1';
            // remove item
            mockScope.updateBasketItem(basketId, basketItemId, productId, skuId, qty, store);
            //mockBackend.flush();
            expect(isRemoveItemFromBasket).toEqual(true);
            qty = 1;
            // item added and call initializeBasketDetailDataModel to update basket model
            mockScope.updateBasketItem(basketId, basketItemId, productId, skuId, qty, store);
            mockBackend.flush();
            expect(isInitializeBasketDetailDataModel).toEqual(true);
        });
    });
    describe('Test removeSourceCode', function () {
        var sourceCode = 'TEST_SOURCE_CODE';
        var isInitializeBasketDetailDataModel = false;
        beforeEach(inject(function(){
            mockScope.initializeBasketDetailDataModel = function(){
                isInitializeBasketDetailDataModel = true;
            };
        }));
        beforeEach(inject(function(){
            var removeSourceCodeResponse = {};
            var url = '/api/baskets/' + basketId + '/sourcecode/' + sourceCode;
            mockBackend.when('GET', url).respond(removeSourceCodeResponse);
        }));
        beforeEach(inject(function(){
            var removeSourceCodeResponse = {};
            var url = '/api/baskets/1000/sourcecode/TEST_SOURCE_CODE';
            mockBackend.when('DELETE', url).respond(removeSourceCodeResponse);
        }));
        it('Test removeSourceCode', function(){
            mockScope.removeSourceCode(basketId, sourceCode);
            mockBackend.flush();
            expect(isInitializeBasketDetailDataModel).toEqual(true);
        });
    });
    describe('Test saveBag', function () {
        beforeEach(inject(function(){
            var html = '<div id="saveBagSuccessModal"></div>';
            addElement(html);
        }));
        var isInitializeBasketDetailDataModel = false;
        beforeEach(inject(function(){
            mockScope.initializeBasketDetailDataModel = function(){
                isInitializeBasketDetailDataModel = true;
            };
        }));
        beforeEach(inject(function(){
            var response = {};
            var url = '/api/baskets/1000/markAsSaved?csrID=9999';
            mockBackend.when('PUT', url).respond(response);
        }));
        it('Test removeSourceCode', function(){
            // saveBagSuccessModal is NOT displayed
            expect(angular.element('#saveBagSuccessModal').attr('aria-hidden')).toEqual(undefined);
            mockScope.saveBag(basketId);
            mockBackend.flush();
            expect(isInitializeBasketDetailDataModel).toEqual(true);
            // saveBagSuccessModal is displayed
            expect(angular.element('#saveBagSuccessModal').attr('aria-hidden')).toEqual('false');
        });
    });
    function addElement(html){
        var element = angular.element(html);
        var compiledElement = compile(element)(mockScope);
        angular.element(document.body).append(compiledElement);
        mockScope.$digest();
    }
    describe('Test setItemAsShipTo', function () {
        var basketItem = {
            isPickupFromStore : true,
            product : {
                id : '200'
            }
        };
        var isInitializeBasketDetailDataModel = false;
        beforeEach(inject(function(){
            mockScope.initializeBasketDetailDataModel = function(){
                isInitializeBasketDetailDataModel = true;
            };
        }));
        it('Test setItemAsShipTo', function(){
            mockScope.setItemAsShipTo(basketId, basketItem);
            mockBackend.flush();
            expect(isInitializeBasketDetailDataModel).toEqual(true);
        });
    });
    describe('Test setItemAsPickup', function () {
        var basketItem = {
            isPickupFromStore : false,
            product : {
                id : '200'
            }
        };
        var isInitializeBasketDetailDataModel = false;
        beforeEach(inject(function(){
            mockScope.initializeBasketDetailDataModel = function(){
                isInitializeBasketDetailDataModel = true;
            };
        }));
        it('Test setItemAsPickup', function(){
            mockScope.setItemAsPickup(basketId, basketItem);
            mockBackend.flush();
            expect(isInitializeBasketDetailDataModel).toEqual(true);
        });
    });
});

