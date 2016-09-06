/*! ScanBarcodeTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('Scan Barcode Directive Test', function () {
    var compile, scope, directiveElem, isolatedScope, timeout, mockScanBarcodeService;


    module(function ($provide) {
        $provide.factory('scanBarcodeService', function ($q) {
            var getAllItems = jasmine.createSpy('getScannedValue').andCallFake(function () {
                var data = {'upc': '2155'};

                if (passPromise) {
                    return $q.when(data);
                }
                else {
                    return $q.reject('something went wrong');
                }
            });

            return {
                getAllItems: getAllItems
            };
        });
    });

    beforeEach(module('ppos.templates'));

    beforeEach(function () {
        module('pointOfSaleApplication');

        inject(function ($compile, $rootScope, $timeout, scanBarcodeService) {
            compile = $compile;
            scope = $rootScope.$new();
            timeout = $timeout;
            mockScanBarcodeService = scanBarcodeService;
        });

        directiveElem = getCompiledElement();
    });

    function getCompiledElement() {
        var html = '<ml-barcode-search ' +
            'data-display-as-modal="true" ' +
            'data-modal-title="Product Scan" ' +
            'data-service-url="/api/scan/skus/UPC_CODE" ' +
            'data-service-post-data="skuBarcodeSearchPostData" ' +
            'data-create-basket="true" ' +
            'data-forward-url="/basket" ' +
            'data-scan-callback="skuBarcodeScanCallback(code)" ' +
            'data-scan-success-callback="skuBarcodeScanSuccessCallback(code)" ' +
            '></ml-barcode-search>';
        var element = angular.element(html);
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    it('should have a title', function () {
        var spanElement = directiveElem.find('.modal-title');
        expect(spanElement).toBeDefined();
        expect(spanElement.text()).toEqual('Product Scan');
    });


    describe('test scope', function () {
        beforeEach(function () {
            scope.modalTitle = 'default';
            scope.serviceUrl = 'default';
            scope.forwardUrl = 'default';
            scope.displayAsModal = '@';
            scope.createBasket = '@';
            scope.skuBarcodeScanCallback = jasmine.createSpy('skuBarcodeScanCallback');
            scope.skuBarcodeScanSuccessCallback = jasmine.createSpy('skuBarcodeScanSuccessCallback');
            isolatedScope = directiveElem.isolateScope();
            scope.skuBarcodeSearchPostData = {
                basketId: '111111',
                csrId: '222222',
                storeId: '333333'
            };

            scope.$digest();
        });

        it('modalTitle on isolated scope should match passed in value', function () {
            expect(isolatedScope.modalTitle).toEqual('Product Scan');
        });

        it('serviceUrl on isolated scope should match passed in value', function () {
            expect(isolatedScope.serviceUrl).toEqual('/api/scan/skus/UPC_CODE');
        });

        it('forwardUrl on isolated scope should match passed in value', function () {
            expect(isolatedScope.forwardUrl).toEqual('/basket');
        });

        it('displayAsModal on isolated scope should match passed in value', function () {
            expect(isolatedScope.displayAsModal).toEqual('true');
        });

        it('createBasket on isolated scope should match passed in value', function () {
            expect(isolatedScope.createBasket).toEqual('true');
        });

        it('servicePostData on isolated scope should match passed in value', function () {
            expect(isolatedScope.servicePostData.basketId).toEqual('111111');
            expect(isolatedScope.servicePostData.csrId).toEqual('222222');
            expect(scope.skuBarcodeSearchPostData.storeId).toEqual('333333');
        });

        it('scanCallback should be a function', function () {
            expect(typeof(isolatedScope.scanCallback)).toEqual('function');
        });

        it('scanSuccessCallback should be a function', function () {
            expect(typeof(isolatedScope.scanSuccessCallback)).toEqual('function');
        });

        it('scanCallback should call skuBarcodeScanCallback method ' +
        'of scope when invoked from isolated scope', function () {
            isolatedScope.scanCallback({code: '12345'});

            expect(scope.skuBarcodeScanCallback).toHaveBeenCalled();
        });

        it('scanSuccessCallback should call skuBarcodeScanSuccessCallback method ' +
        'of scope when invoked from isolated scope', function () {
            isolatedScope.scanSuccessCallback({code: '12345'});

            expect(scope.skuBarcodeScanSuccessCallback).toHaveBeenCalled();
        });

        it('modalTitle on isolated scope should be one-way bound', function () {
            expect(isolatedScope.modalTitle).not.toEqual(scope.modalTitle);
        });

        it('serviceUrl on isolated scope should be one-way bound', function () {
            expect(isolatedScope.serviceUrl).not.toEqual(scope.serviceUrl);
        });

        it('forwardUrl on isolated scope should be one-way bound', function () {
            expect(isolatedScope.forwardUrl).not.toEqual(scope.forwardUrl);
        });

        it('displayAsModal on isolated scope should be one-way bound', function () {
            expect(isolatedScope.displayAsModal).not.toEqual(scope.displayAsModal);
        });

        it('createBasket on isolated scope should be one-way bound', function () {
            expect(isolatedScope.createBasket).not.toEqual(scope.createBasket);
        });

        it('servicePostData on isolated scope should be two-way bound', function () {
            isolatedScope.servicePostData.storeId = '444444';

            expect(isolatedScope.servicePostData.storeId).toEqual(scope.skuBarcodeSearchPostData.storeId);
        });
    });

    describe('verify init', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.deviceStatus = 'incorrect value';
            isolatedScope.deviceConnected = 'incorrect value';
            isolatedScope.scanningValue = 'incorrect value';
            isolatedScope.scannedValue = 'incorrect value';
            isolatedScope.stopPolling = 'incorrect value';
            isolatedScope.searchInProgress = 'incorrect value';
            isolatedScope.searchError = 'incorrect value';
            isolatedScope.pollForConnection = jasmine.createSpy('pollForConnection');

            isolatedScope.$digest();
        });

        it('calling init should reset properties to their defaults', function () {
            isolatedScope.init();

            expect(isolatedScope.deviceStatus).toEqual('');
            expect(isolatedScope.deviceConnected).toEqual(false);
            expect(isolatedScope.scanningValue).toEqual('');
            expect(isolatedScope.scannedValue).toEqual('');
            expect(isolatedScope.stopPolling).toEqual(false);
            expect(isolatedScope.searchInProgress).toEqual(false);
            expect(isolatedScope.searchError).toEqual(false);
        });

        it('calling init should call pollForConnection', function () {
            isolatedScope.init();
            isolatedScope.$digest();

            expect(isolatedScope.pollForConnection).toHaveBeenCalled();
        });

    });

    describe('watch for changes', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.pollForScannedValue = jasmine.createSpy('pollForScannedValue');
            isolatedScope.deviceConnected = false;
            isolatedScope.sendBarcode = jasmine.createSpy('sendBarcode');
            isolatedScope.scanningValue = '';
            isolatedScope.scannedValue = '';
            isolatedScope.searchInProgress = false;

            isolatedScope.$digest();
        });

        it('should call pollForScannedValue when deviceConnected value changes to true', function () {
            isolatedScope.deviceConnected = true;
            isolatedScope.$digest();

            expect(isolatedScope.pollForScannedValue).toHaveBeenCalled();
        });

        it('should not call pollForScannedValue when deviceConnected value is false', function () {
            isolatedScope.deviceConnected = false;
            isolatedScope.$digest();

            expect(isolatedScope.pollForScannedValue).not.toHaveBeenCalled();
        });

        it('should not call sendBarcode if we have no previous scanningValue', function () {
            isolatedScope.scanningValue = 'New_UPC';
            isolatedScope.$digest();

            expect(isolatedScope.scannedValue).not.toEqual('New_UPC');
            expect(isolatedScope.sendBarcode).not.toHaveBeenCalled();
        });

        it('should call sendBarcode when scanningValue value changes', function () {
            isolatedScope.scanningValue = 'no value';
            isolatedScope.$digest();

            isolatedScope.scanningValue = '2155_UPC';
            isolatedScope.$digest();

            expect(isolatedScope.scannedValue).toEqual('2155_UPC');
            expect(isolatedScope.sendBarcode).toHaveBeenCalled();

        });

        it('should not call sendBarcode when scanningValue value changes if *searchInProgress*', function () {
            isolatedScope.scanningValue = 'New_UPC';
            isolatedScope.searchInProgress = true;
            isolatedScope.$digest();

            isolatedScope.scanningValue = '2155_UPC';
            isolatedScope.$digest();

            expect(isolatedScope.scannedValue).not.toEqual('2155_UPC');
            expect(isolatedScope.sendBarcode).not.toHaveBeenCalled();
        });
    });

    describe('pollForConnection', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.getDeviceStatus = jasmine.createSpy('getDeviceStatus');
            isolatedScope.deviceConnected = false;
            isolatedScope.stopPolling = false;

            isolatedScope.$digest();
        });

        it('should call getDeviceStatus', function () {
            isolatedScope.pollForConnection();
            timeout.flush();

            expect(isolatedScope.getDeviceStatus).toHaveBeenCalled();
        });
    });

    describe('pollForScannedValue', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.getScannedValue = jasmine.createSpy('getScannedValue');
            isolatedScope.deviceConnected = true;
            isolatedScope.stopPolling = false;

            isolatedScope.$digest();
        });

        it('should call getScannedValue', function () {
            isolatedScope.pollForScannedValue();
            timeout.flush();

            expect(isolatedScope.getScannedValue).toHaveBeenCalled();
        });
    });

    describe('showScanDialog', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.init = jasmine.createSpy('init');

            isolatedScope.$digest();
        });

        it('should call init', function () {
            isolatedScope.showScanDialog();

            expect(isolatedScope.init).toHaveBeenCalled();
        });

        it('should display the dialog', function () {
            isolatedScope.showScanDialog();

            expect(directiveElem.find('.modal:first').hasClass('in')).toEqual(true);
        });
    });

    describe('hideScanDialog', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.stopPolling = false;

            isolatedScope.$digest();
        });

        it('should stop polling', function () {
            isolatedScope.hideScanDialog();

            expect(isolatedScope.stopPolling).toEqual(true);
        });

        it('should hide the dialog', function () {
            isolatedScope.hideScanDialog();

            expect(directiveElem.find('.modal:first').hasClass('in')).toEqual(false);
        });
    });

    describe('hidden.bs.modal event', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.stopPolling = false;

            isolatedScope.$digest();
        });

        it('should stop polling', function () {
            directiveElem.find('.modal:first').trigger('hidden.bs.modal');

            expect(isolatedScope.stopPolling).toEqual(true);
        });
    });

});

