/*! PaymentCashTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('Payment Cash Directive Test', function () {
    var compile, scope, directiveElem, timeout, mockBackend;
    var isolatedScope;

    beforeEach(module('ppos.templates'));

    beforeEach(function () {
        module('pointOfSaleApplication');

        inject(function ($httpBackend, $compile, $rootScope, $timeout, $window, paymentService) {
            mockBackend = $httpBackend;
            compile = $compile;
            scope = $rootScope.$new();
            timeout = $timeout;
            scope.model = {
                payments : {}
            };
            scope.paymentService = paymentService;
            scope.addPayment = jasmine.createSpy('addPayment');
        });
        directiveElem = getCompiledElement();
        isolatedScope = directiveElem.isolateScope();
        scope.$digest();
    });

    function getCompiledElement() {
        var html = '<ml-payment-cash data-ml-payment-model="model" data-ml-parent-submit="addPayment()" data-payment-service="paymentService"></ml-payment-cash>';
        var element = angular.element(html);
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    describe('test init', function () {
        it('test init and cash key values', function () {
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('0');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.00');
            var i;
            for (i=0; i < 9; i++) {
                expect(isolatedScope.mlPaymentModel.cash.buttons[i].value).toEqual((i+1).toString());
            }
            expect(isolatedScope.mlPaymentModel.cash.buttons[10].value).toEqual('00');
            expect(isolatedScope.mlPaymentModel.cash.buttons[11].value).toEqual('Delete');
        });
    });

    describe('test select cash key', function () {
        it('select cash key', function () {
            isolatedScope.selectCashKey('1');
            scope.$digest();
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('01');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.01');
            isolatedScope.selectCashKey('2');
            scope.$digest();
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('012');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.12');
            isolatedScope.selectCashKey('3');
            scope.$digest();
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('0123');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('1.23');

            describe('test delete key', function () {
                it('select delete key', function () {
                    isolatedScope.selectCashKey('Delete');
                    scope.$digest();
                    expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('012');
                    expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.12');
                    isolatedScope.selectCashKey('Delete');
                    scope.$digest();
                    expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('01');
                    expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.01');
                    isolatedScope.selectCashKey('Delete');
                    scope.$digest();
                    expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('0');
                    expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.00');
                });
            });
        });
    });

    describe('test clear cash', function () {
        it('test clear cash', function () {
            isolatedScope.selectCashKey('1');
            scope.$digest();
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('01');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.01');

            isolatedScope.clearCash();
            scope.$digest();
            expect(isolatedScope.mlPaymentModel.cash.amount).toEqual('0');
            expect(isolatedScope.mlPaymentModel.cash.amountDisplay).toEqual('0.00');
        });
    });

    describe('test apply payment', function () {
        it('apply payment', function () {
            isolatedScope.selectCashKey('1');
            scope.$digest();
            var paymentTypesData = {
                'data':[{'code':'CREDITCARD','displayName':'Credit Card','name':'CREDIT CARD','description':'A Credit Card.'},
                    {'code':'GIFTCERT','displayName':'Gift Certificate','name':'GIFT CERTIFICATE','description':'A Gift Certificate.'},
                    {'code':'PAYPAL','displayName':'Paypal','name':'PAYPAL','description':'PAYPAL'},
                    {'code':'AMAZON','displayName':'Amazon','name':'AMAZON','description':'AMAZON'},
                    {'code':'CASH','displayName':'Cash','name':'CASH','description':'Cash'},
                    {'code':'CARDPRESENT','displayName':'Credit Card','name':'CARD PRESENT','description':'A Card Present.'}]
            };
            isolatedScope.mlPaymentModel.paymentTypes = paymentTypesData.data;
            isolatedScope.applyPayment();
            scope.$digest();
            var code = 'CASH';
            var cashPayment = isolatedScope.mlPaymentModel.payments[code];
            expect(cashPayment.name).toEqual(code);
            expect(cashPayment.paymentType).toEqual(code);
            expect(cashPayment.paymentAmount).toEqual('0.01');
            expect(scope.addPayment).toHaveBeenCalled();
        });
    });

    describe('test process payment', function () {
        beforeEach(function () {
            isolatedScope.submitForm = jasmine.createSpy('submitForm');
            scope.$digest();
        });
        it('process payment', function () {
            var code = 'CASH';
            isolatedScope.selectionType = code;
            var data = code;
            isolatedScope.$emit('processPayment', data);
            scope.$digest();
            expect(isolatedScope.submitForm).toHaveBeenCalled();
        });
    });

    describe('test resetPaymentDisplay', function () {
        beforeEach(function () {
            isolatedScope.clearCash = jasmine.createSpy('clearCash');
            scope.$digest();
        });
        it('resetPaymentDisplay', function () {
            var code = 'CASH';
            isolatedScope.selectionType = code;
            var data = code;
            isolatedScope.$emit('resetPaymentDisplay', data);
            scope.$digest();
            expect(isolatedScope.clearCash).toHaveBeenCalled();
        });
        it('resetPaymentDisplay', function () {
            var code = 'CASH';
            isolatedScope.selectionType = code;
            var data = undefined;
            isolatedScope.$emit('resetPaymentDisplay', data);
            scope.$digest();
            expect(isolatedScope.clearCash).toHaveBeenCalled();
        });
    });
});

