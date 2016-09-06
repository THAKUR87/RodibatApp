describe('Config Service Test', function(){

    var mockBackend;
    var requestSuccessResponse, requestFailureResponse;
    var injectedConfigService;
    var responseData = {
        'app.b2c.images.secureImagePath' : 'https://localhost:8445'
    };
    var type = 'configuration', bootstrapPath = 'ppos.bootstrap.properties';

    //Construct a mock application with the same name as the target
    beforeEach(angular.mock.module('pointOfSaleApplication'));

    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend){
        mockBackend = $httpBackend;
        //This value must match the request
        var serviceUrl = '/api/registry/configs/bootstrap?' +
            'path=' + bootstrapPath + '&configType=' + type;
        var initPropertiesResponse = {
            data: {
                'app.b2c.images.secureImagePath' : 'https://localhost:8445'
            }
        };
        mockBackend.when('GET', serviceUrl).respond(initPropertiesResponse);
    }));

    //Inject the basket service to be tested
    beforeEach(angular.mock.inject(function(configService){
        injectedConfigService = configService;
        injectedConfigService.reset('configuration');
    } ));

    beforeEach(angular.mock.inject(function(dataStorageService){
        dataStorageService.setUrlBase('');
    }));

    //Invoke the service and  verify the results
    it('Tests configService', function(){
        var promise = injectedConfigService.initProperties(type, bootstrapPath);
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
        expect(requestSuccessResponse).toEqual(responseData);
        expect(requestFailureResponse).not.toBeDefined();
    });
});