/*! AppSpinnerTest.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */
describe('App Spinner Directive Test', function () {
    var compile, scope, directiveElem, isolatedScope, timeout, rootScope;

    beforeEach(module('ppos.templates'));

    beforeEach(function () {
        module('pointOfSaleApplication');

        inject(function ($compile, $rootScope, $timeout) {
            compile = $compile;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            timeout = $timeout;
        });

        directiveElem = getCompiledElement();
    });

    function getCompiledElement() {
        var html = '<ml-app-spinner></ml-app-spinner>';
        var element = angular.element(html);
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    describe('verify main DOM elements were added', function () {
        it('should have added a main spinner element', function () {
            var divElement = directiveElem.find('.ppos-app-spinner');
            expect(divElement).toBeDefined();
        });

        it('should have added a background overlay element', function () {
            var divElement = directiveElem.find('.ppos-app-spinner-bg');
            expect(divElement).toBeDefined();
        });

        it('should have added a spinner icon element', function () {
            var divElement = directiveElem.find('.ppos-app-spinner-icon');
            expect(divElement).toBeDefined();
        });

        it('should have added a error message element ', function () {
            var divElement = directiveElem.find('.ml-ppos-error-message');
            expect(divElement).toBeDefined();
        });
    });

    describe('verify init', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.displaySpinner = 'incorrect value';
            isolatedScope.timer = 'incorrect value';
            isolatedScope.timerLimit = 'incorrect value';
            isolatedScope.timerLimitExceeded = 'incorrect value';
            isolatedScope.$digest();
        });

        it('calling init should reset properties to their defaults', function () {
            isolatedScope.init();

            expect(isolatedScope.displaySpinner).toEqual(false);
            expect(isolatedScope.timer).toEqual(null);
            expect(isolatedScope.timerLimit).toEqual(30000);
            expect(isolatedScope.timerLimitExceeded).toEqual(false);
        });
    });

    describe('verify timedOut', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.timerLimitExceeded = false;
            isolatedScope.$digest();
        });

        it('calling *timedOut* should set the *timerLimitExceeded* boolean to true', function () {
            isolatedScope.timedOut();

            expect(isolatedScope.timerLimitExceeded).toEqual(true);
        });
    });

    describe('verify close', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.timerLimitExceeded = false;
            isolatedScope.cancelTimer = jasmine.createSpy('cancelTimer');
            isolatedScope.init = jasmine.createSpy('init');
            isolatedScope.$digest();
        });

        it('calling *close* should not call *cancel* or *init* if not *timerLimitExceeded*', function () {
            isolatedScope.close();

            expect(isolatedScope.cancelTimer).not.toHaveBeenCalled();
            expect(isolatedScope.init).not.toHaveBeenCalled();
        });

        it('calling *close* should call *cancel* or *init* if *timerLimitExceeded*', function () {
            isolatedScope.timedOut();
            isolatedScope.close();

            expect(isolatedScope.cancelTimer).toHaveBeenCalled();
            expect(isolatedScope.init).toHaveBeenCalled();
        });
    });

    describe('verify setMessages', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.$digest();
        });

        it('default messages should be set for both the close button and the error messsage', function () {
            expect(isolatedScope.closeBtnTxt).toEqual('Close');
            expect(isolatedScope.requestTimedOut).toEqual('Request timed out. Please try again.');
        });
    });

    describe('verify *toggleSpinner* handler', function () {
        beforeEach(function () {
            isolatedScope = directiveElem.isolateScope();
            isolatedScope.displaySpinner = false;
            isolatedScope.timer = null;
            isolatedScope.init = jasmine.createSpy('init');
            isolatedScope.cancelTimer = jasmine.createSpy('cancelTimer');

            isolatedScope.$digest();
        });

        it('should set *displaySpinner* to true when a true *active* value is passed', function () {
            rootScope.$broadcast('toggleSpinner', {active: true});
            isolatedScope.$digest();

            expect(isolatedScope.displaySpinner).toEqual(true);
        });

        it('should call cancel timer to clear old timer values when a true *active* value is passed', function () {
            rootScope.$broadcast('toggleSpinner', {active: true});
            isolatedScope.$digest();

            expect(isolatedScope.cancelTimer).toHaveBeenCalled();
        });

        it('should set the timer when a true *active* value is passed', function () {
            rootScope.$broadcast('toggleSpinner', {active: true});
            isolatedScope.$digest();

            expect(isolatedScope.timer).not.toBe(null);
        });

        it('should set re-init the scope when a false *active* value is passed', function () {
            rootScope.$broadcast('toggleSpinner', {active: false});
            isolatedScope.$digest();

            expect(isolatedScope.init).toHaveBeenCalled();
        });
    });
});

