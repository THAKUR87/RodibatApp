/*! CustomerSearchModalControllerTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('CustomerSearchModalControllerTest', function () {

    var mockBackend, mockScope, controller;
    var compile;

    var response = {"data":[{"primaryContact":{"address":{"country":"US","postOfficeBox":false,"street3":null,"city":"adf","postalCode":"94952-0000","street1":"sd","street2":"sdf","state":"US/CA","region":null,"apartmentNumber":null},"person":{"firstName":"dataspec","lastName":"dataspec","middleName":null},"id":"200001","phone1":"1111111111"},"accountSet":"1","guest":false,"id":"100001","hintQuestion":"What is your city of birth?","email":"dataspec@dataspec.com","contacts":[{"person":{"firstName":"dataspec","lastName":"dataspec","middleName":null},"id":"200001"}],"hintAnswer":"city"},{"primaryContact":{"address":{"country":"US","postOfficeBox":false,"street3":null,"city":"City","postalCode":"27514","street1":"123 AuthorizeMeIn Ct.","street2":null,"state":"US/NC","region":null,"apartmentNumber":null},"person":{"firstName":"Many Credit Cards","lastName":"Many O' Credit Cards","middleName":null},"id":"200002","phone1":"1111111111"},"accountSet":"1","guest":false,"id":"100002","hintQuestion":"What is your city of birth?","email":"dataspec2@dataspec2.com","contacts":[{"person":{"firstName":"Many Credit Cards","lastName":"Many O' Credit Cards","middleName":null},"id":"200002"},{"person":{"firstName":"Other","lastName":"L'ast N'ame","middleName":"I"},"id":"200003"},{"person":{"firstName":"other","lastName":"other","middleName":null},"id":"200004"}],"hintAnswer":"city"}]};
    var phone = "1111111111";

    var injectedAppService, injectedCustomerSearchService, injectedLocation;

    //Construct a mock application with the same name as the target
    beforeEach(module('pointOfSaleApplication'));

    var storeId = 'SC12';
    var csrId = '123';

    var store = {
        id: storeId
    };
    var loggedInCSR = {
        id: csrId
    };

    beforeEach(inject(function($compile, $httpBackend, $rootScope, $controller, $log, $location, dataStorageService, customerSearchService, appService, basketService, newOrderService){
        compile = $compile;
        mockBackend = $httpBackend;
        mockScope = $rootScope.$new();
        controller = $controller('customerSearchModalController', {
            $log:$log,
            $scope:mockScope,
            $location:$location,
            dataStorageService:dataStorageService,
            customerSearchService:customerSearchService,
            appService:appService,
            basketService:basketService,
            newOrderService:newOrderService
        });

        injectedAppService = appService;
        injectedCustomerSearchService = customerSearchService;
        injectedLocation = $location;

        dataStorageService.setStore(store);
        dataStorageService.setLoggedInCSR(loggedInCSR);
    }));

    beforeEach(angular.mock.inject(function(){
        mockScope.customerSearchDataModel = {};
        mockScope.removeGuestCustomer = function(successResult){

        };
    }));

    beforeEach(function () {
        injectedAppService.activateSpinner = jasmine.createSpy('activateSpinner');
        mockScope.$digest();
    });

    describe('search customer phone (no phone number)', function () {
        it('test', function () {
            mockScope.searchCustomer();
            mockScope.$digest();
            expect(mockScope.showPhoneNumberRequiredMessage).toEqual(true);
            expect(mockScope.showInValidPhoneNumberMessage).toEqual(false);
        });
    });
    describe('search customer phone (invalid)', function () {
        beforeEach(angular.mock.inject(function(){
            mockScope.customerSearchDataModel.customerPhoneNumber = phone + '1';
        }));
        it('test', function () {
            mockScope.searchCustomer();
            mockScope.$digest();
            expect(mockScope.showPhoneNumberRequiredMessage).toEqual(false);
            expect(mockScope.showInValidPhoneNumberMessage).toEqual(true);
        });
    });
    describe('search customer phone (valid)', function () {
        var tmpResponse;
        beforeEach(angular.mock.inject(function(){
            mockScope.customerSearchDataModel.customerPhoneNumber = phone;
        }));
        beforeEach(function () {
            mockScope.startNewOrder = jasmine.createSpy('startNewOrder');
            mockScope.$digest();
        });
        beforeEach(function () {
            var url = '/api/account/customers?q=' + phone + '&query_fields=phone';
            // response has 2 phone number so just take the first one
            tmpResponse = {
                data :   [response.data[0]]
            };
            mockBackend.when("GET", url).respond(tmpResponse);
        });
        it('test single phone number', function () {
            mockScope.searchCustomer();
            mockBackend.flush();
            expect(mockScope.showPhoneNumberRequiredMessage).toEqual(false);
            expect(mockScope.showInValidPhoneNumberMessage).toEqual(false);
            expect(injectedAppService.activateSpinner).toHaveBeenCalled();
            expect(mockScope.startNewOrder).toHaveBeenCalledWith(tmpResponse.data[0].id);
        });
    });
    describe('search customer phone (valid)', function () {
        beforeEach(function () {
            injectedAppService.deactivateSpinner = jasmine.createSpy('deactivateSpinner');
            mockScope.$digest();
        });
        beforeEach(angular.mock.inject(function(){
            mockScope.customerSearchDataModel = {};
            mockScope.customerSearchDataModel.customerPhoneNumber = phone;
        }));
        beforeEach(function () {
            var url = '/api/account/customers?q=' + phone + '&query_fields=phone';
            mockBackend.when("GET", url).respond(response);
        });
        it('test multiple phone number', function () {
            mockScope.searchCustomer();
            mockBackend.flush();
            expect(mockScope.customerSearchDataModel.customerSearchResult).toEqual(response);
            expect(injectedAppService.deactivateSpinner).toHaveBeenCalled();
        });
    });
    describe('skipCustomerSearchAndStartNewOrder', function () {
        beforeEach(angular.mock.inject(function(){
            mockScope.customerSearchDataModel = {};
        }));
        beforeEach(function () {
            mockScope.startNewOrder = jasmine.createSpy('startNewOrder');
            mockScope.$digest();
        });
        it('skipCustomerSearchAndStartNewOrder', function () {
            mockScope.skipCustomerSearchAndStartNewOrder();
            mockScope.$digest();
            expect(mockScope.customerSearchDataModel.customerPhoneNumber).toEqual(null);
            expect(mockScope.startNewOrder).toHaveBeenCalledWith(null);
        });
    });

    describe('startNewOrder', function () {
        var customerId = '123456';

        beforeEach(angular.mock.inject(function(){
            mockScope.customerSearchDataModel = {};
        }));
        beforeEach(function () {
            var tmpResponse = 'response';
            var url = '/api/baskets/newGuestBasket?phone=&storeID=SC1&csrID=' + csrId;
            mockBackend.when("POST", url).respond(tmpResponse);
        });
        beforeEach(function () {
            var tmpResponse = {
                data: '/api/baskets/100309'
            };
            var url = '/api/baskets/customers/' + customerId + '?csrID=' + csrId;
            mockBackend.when("POST", url).respond(tmpResponse);
        });
        beforeEach(function () {
            var tmpResponse = {
                data: ''
            };
            var url = '/api/baskets/newGuestBasket?phone=&storeID=SC12';
            mockBackend.when("POST", url).respond(tmpResponse);
        });
        beforeEach(angular.mock.inject(function(){
            var html = '<div id="customerSearchModal"><div id="customerPhoneNumber"></div></div>';
            addElement(html);
        }));
        beforeEach(function () {
            injectedLocation.path = jasmine.createSpy('path');
            mockScope.$digest();
        });
        it('showCustomerSearchModal', function () {
            mockScope.showCustomerSearchModal();
            mockScope.$digest();
            expect(angular.element('#customerSearchModal').attr('aria-hidden')).toEqual('false');
        });
        it('startNewOrder', function () {
            mockScope.startNewOrder(customerId);
            mockBackend.flush();
            // Clear customer search data
            expect(mockScope.customerSearchDataModel.customerPhoneNumber).toEqual(null);
            expect(mockScope.customerSearchDataModel.customerSearchResult).toEqual(null);
            expect(mockScope.showPhoneNumberRequiredMessage).toEqual(false);
            expect(mockScope.showInValidPhoneNumberMessage).toEqual(false);
            // Hide customer search modal.
            expect(angular.element('#customerSearchModal').attr('aria-hidden')).toEqual('true');
            // Navigate to basket page.
            expect(injectedLocation.path).toHaveBeenCalledWith('/basket');
        });
    });

    function addElement(html){
        var element = angular.element(html);
        var compiledElement = compile(element)(mockScope);
        angular.element(document.body).append(compiledElement);
        mockScope.$digest();
    }
});

