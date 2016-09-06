describe('Payment Service', function(){

    var mockBackend;
    var injectedPaymentService, injectedConfigService, injectedDataStorageService;
    var requestSuccessResponse, requestFailureResponse;
    var mockSuccessScope, controller, log;
    var compile;

    var paymentTypes = {
        'app.ppos.checkout.available_payment_types':'CASH'
    };
    var getPaymentsResponse = {
        'data':[{'code':'CREDITCARD','displayName':'Credit Card','name':'CREDIT CARD','description':'A Credit Card.'},
            {'code':'GIFTCERT','displayName':'Gift Certificate','name':'GIFT CERTIFICATE','description':'A Gift Certificate.'},
            {'code':'PAYPAL','displayName':'Paypal','name':'PAYPAL','description':'PAYPAL'},
            {'code':'AMAZON','displayName':'Amazon','name':'AMAZON','description':'AMAZON'},
            {'code':'CASH','displayName':'Cash','name':'CASH','description':'Cash'},
            {'code':'CARDPRESENT','displayName':'Credit Card','name':'CARD PRESENT','description':'A Card Present.'}]
    };
    var getPaymentsExpectedResponse = [{code: 'CASH', displayName: 'Cash', name: 'cash', description: 'Cash', active: true}];
    var addPaymentResponse = {
        data:{'placeOrder':true,'payments':[
            {'name':'CASH','description':'Cash','displayAmount':'$100.00','amount':{'asString':'100.00'},'code':'CASH','displayName':'Cash'},
            {'name':'CARD PRESENT','description':'A Card Present.','displayAmount':'$100.00','amount':{'asString':'100.00'},'code':'CARDPRESENT','displayName':'Credit Card'}
        ],'change':'$129.82','displayTotal':'$70.18'}
    };

    var getBasketResponse = {
        data: {
            'total' : '$20.00'
        }
    };

    // Signature
    var isSignatureEmpty = true;
    var isSignatureCleared = false;
    var broadcastValue = '';
    var penColor = '';
    var broadcastSelection = '';

    //Checkout
    var mockOrderId = '100303';
    var checkoutResponse = {
        data: 'https://localhost:8445/api/orders/' + mockOrderId
    };

    //Construct a mock application with the same name as the target
    beforeEach(module('pointOfSaleApplication'));

    //Set up the Http mock backend to trap http requests
    beforeEach(inject(function($httpBackend){
        mockBackend = $httpBackend;
        //This value must match the request
        var url = '/api/payments';
        mockBackend.when('GET', url).respond(getPaymentsResponse);
    }));

    beforeEach(inject(function(paymentService){
        injectedPaymentService = paymentService;
    } ));

    beforeEach(angular.mock.inject(function(configService){
        injectedConfigService = configService;
        injectedConfigService.setProperties('configuration', paymentTypes);
    } ));

    //Invoke the service and  verify the results
    it('Test getPayments', function(){
        var promise = injectedPaymentService.getPayments();
        //Set values from the promise that can be tested later - to prove success was seen
        promise.then(function (successResult) {
            requestSuccessResponse = successResult;
        }, function (errorResult) {
            requestFailureResponse = errorResult;
        }, function (notify) {
            // Add notification logic here if required.
        });

        mockBackend.flush();

        expect(requestSuccessResponse).toBeDefined();
        expect(requestSuccessResponse).toEqual(getPaymentsExpectedResponse);
        expect(requestFailureResponse).not.toBeDefined();
    });

    beforeEach(inject(function ($controller, $rootScope, $log, $location, $timeout, paymentService, dataStorageService, basketService, starPrinter) {

        injectedPaymentService = paymentService;
        injectedDataStorageService = dataStorageService;

        log = $log;
        mockSuccessScope = $rootScope.$new();

        controller = $controller('paymentController', {
            $log: $log,
            $timeout: $timeout,
            $scope: mockSuccessScope,
            $location: $location,
            paymentService: paymentService,
            dataStorageService : dataStorageService,
            basketService : basketService,
            starPrinter : starPrinter
        });

        mockSuccessScope.selection = 'CASH';
        mockSuccessScope.model = {
            'id': '1000',
            'total': null,
            'paymentTypes': null,
            'payments': {'CASH' : {name: 'cash', paymentType: 'cash', paymentAmount: '100.00', code: 'CASH'},
                        'CARDPRESENT' : {name: 'CARD PRESENT', paymentType: 'creditCard', paymentAmount: '100.00', code: 'CARDPRESENT'}},
            'creditCard': {},
            'cash': {},
            'signature': {
                clear: function clear(){
                    isSignatureCleared = true;
                    isSignatureEmpty = isSignatureCleared;
                    penColor = mockSuccessScope.model.signature.penColor;
                },
                isEmpty: function isEmpty(){
                    isSignatureEmpty = isSignatureCleared;
                }
            },
            'lastSection': '',
            'orderInProgress': false,
            'data': {}
        };
    }));

    beforeEach(inject(function($httpBackend){
        mockBackend = $httpBackend;
        //This value must match the request
        var url = '/api/baskets/1000/payment';
        mockBackend.when('POST', url).respond(addPaymentResponse);
    }));

    it('Test add payment and remove payment', function(){
        mockSuccessScope.addPayment();
        mockBackend.flush();
        //expect(mockSuccessScope.selection).toEqual('PAYMENT_SELECTION');
        expect(mockSuccessScope.model.data).toEqual(addPaymentResponse.data);
        expect(mockSuccessScope.model.displayBalance).toEqual(mockSuccessScope.model.data.displayBalance);
        expect(mockSuccessScope.model.placeOrder).toEqual(mockSuccessScope.model.data.placeOrder);
        // model.data.payment is set by returned request
        expect(mockSuccessScope.model.data.payments[0].code).toEqual('CASH');
        expect(mockSuccessScope.model.data.payments[1].code).toEqual('CARDPRESENT');
        // remove payment
        mockSuccessScope.removePayment('CARDPRESENT');
        expect(mockSuccessScope.model.payments.CARDPRESENT).toEqual(undefined);
        mockSuccessScope.removePayment('CASH');
        expect(mockSuccessScope.model.payments.CASH).toEqual(undefined);
    });

    beforeEach(inject(function( $compile){
        compile = $compile;
        //This value must match the request
        var url = '/api/baskets/1000';
        // Get basket
        mockBackend.when('GET', url).respond(getBasketResponse);
        injectedDataStorageService.setBasketId('1000');
        // Insert html
        var html = '<div id="paymentModal"></div>';
        addElement(html);
    }));

    function addElement(html){
        var element = angular.element(html);
        var compiledElement = compile(element)(mockSuccessScope);
        angular.element(document.body).append(compiledElement);
        mockSuccessScope.$digest();
    }

    beforeEach(inject(function(){
        mockSuccessScope.$broadcast = function broadcast (arg1, arg2){
            broadcastValue = arg1;
            broadcastSelection = arg2;
        };
    }));

    it('Test show payment modal', function(){
        var emptyMap = {};
        var basketId = '1000';

        expect(angular.element('#paymentModal').attr('aria-hidden')).toEqual(undefined);

        mockSuccessScope.showPaymentModal(basketId, '200.00');
        mockBackend.flush();

        // check data
        expect(mockSuccessScope.orderPlaced).toEqual(false);
        expect(mockSuccessScope.selection).toEqual('PAYMENT_SELECTION');
        expect(broadcastValue).toEqual('resetPaymentDisplay');
        expect(broadcastSelection).toEqual(null);
        expect(penColor).toEqual('rgb(255,255,255)');
        expect(isSignatureCleared).toEqual(true);
        expect(mockSuccessScope.model.id).toEqual(basketId);
        expect(mockSuccessScope.model.paymentTypes).toEqual(getPaymentsExpectedResponse);
        expect(mockSuccessScope.model.payments).toEqual(emptyMap);
        expect(mockSuccessScope.model.placeOrder).toEqual(false);
        expect(mockSuccessScope.model.data).toEqual(emptyMap);
        // check data - get basket
        expect(mockSuccessScope.model.total).toEqual(getBasketResponse.data.total);
        expect(mockSuccessScope.model.displayBalance).toEqual(getBasketResponse.data.total);
        // check show modal
        expect(angular.element('#paymentModal').attr('aria-hidden')).toEqual('false');
    });

    beforeEach(inject(function($httpBackend){
        var store = {
            id: 'SC1'
        };
        injectedDataStorageService.setStore(store);

        mockBackend = $httpBackend;
        //This value must match the request
        var basketId = '1000';
        var storeId = 'SC1';
        var serviceUrl = '/api/baskets/' + basketId + '/checkout'+ '?storeId=' + storeId;
        mockBackend.when('POST', serviceUrl).respond(checkoutResponse);
    }));

    it('Test checkout', function(){
        var emitValue = '';
        mockSuccessScope.$emit = function emit (arg1){
            emitValue = arg1;
        };

        mockSuccessScope.basketCheckout();
        mockBackend.flush();

        expect(mockOrderId).toEqual(injectedDataStorageService.getFinalizedOrderId());
        expect(false).toEqual(mockSuccessScope.model.checkoutInProgress);
        expect(true).toEqual(mockSuccessScope.orderPlaced);
        expect(undefined).toEqual(mockSuccessScope.model.basketId);
        expect(undefined).toEqual(mockSuccessScope.model.customerId);
        expect('order').toEqual(emitValue);
        // hide modal
        expect(angular.element('#paymentModal').attr('aria-hidden')).toEqual('true');
    });

    it('Test show default layout', function(){
        // not default
        mockSuccessScope.selection = 'SIGNATURE';
        var result = mockSuccessScope.showDefaultLayout();
        expect(false).toEqual(result);
        // not default
        mockSuccessScope.selection = 'CREDIT_CARD_SWIPE';
        result = mockSuccessScope.showDefaultLayout();
        expect(false).toEqual(result);
        // show default
        mockSuccessScope.selection = 'PAYMENT_SELECTION';
        result = mockSuccessScope.showDefaultLayout();
        expect(true).toEqual(result);
        // show default
        mockSuccessScope.selection = 'CASH';
        result = mockSuccessScope.showDefaultLayout();
        expect(true).toEqual(result);
    });

    it('Test select', function(){
        var previousSelection = 'CASH';
        var currentSelection = 'PAYMENT_SELECTION';
        mockSuccessScope.model.lastSection = '';
        mockSuccessScope.selection = previousSelection;
        mockSuccessScope.model.placeOrder = true;

        mockSuccessScope.select(currentSelection);
        expect(previousSelection).toEqual(mockSuccessScope.model.lastSection);
        expect(currentSelection).toEqual(mockSuccessScope.selection);
        expect(false).toEqual(mockSuccessScope.model.placeOrder);
    });

    it('Test cancel', function(){
        isSignatureCleared = false;
        mockSuccessScope.selection = 'CASH';
        mockSuccessScope.model.placeOrder = true;
        mockSuccessScope.model.data.placeOrder = false;
        mockSuccessScope.cancel();
        expect(mockSuccessScope.model.placeOrder).toEqual(mockSuccessScope.model.data.placeOrder);
        expect(isSignatureCleared).toEqual(true);
        expect(broadcastValue).toEqual('resetPaymentDisplay');
        expect(broadcastSelection).toEqual('CASH');
        expect('PAYMENT_SELECTION').toEqual(mockSuccessScope.selection);
    });

    it('Test apply', function(){
        mockSuccessScope.selection = 'CASH';
        mockSuccessScope.apply();
        expect(broadcastValue).toEqual('processPayment');
        expect(broadcastSelection).toEqual('CASH');
    });

    it('Test capture signature', function(){
        isSignatureCleared = false;
        mockSuccessScope.selection = 'TEST';
        mockSuccessScope.captureSignature();
        expect(mockSuccessScope.selection).toEqual('SIGNATURE');
        expect(isSignatureCleared).toEqual(true);
    });

    it('Test acceptSignature signature', function(){
        mockSuccessScope.model.lastSection = 'TEST';
        broadcastValue = '';
        broadcastSelection = '';
        isSignatureCleared = false;
        isSignatureEmpty = false;
        mockSuccessScope.acceptSignature();
        // signature is no longer cleared here, instead rely on signature being cleared on payment modal init
        expect(broadcastValue).toEqual('processPayment');
        expect(broadcastSelection).toEqual('TEST');
    });
});