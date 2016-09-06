describe("LoginController test",function(){

    var mockSuccessScope, loginSuccessController, rootScope, location;
    var mockFailScope, loginFailController, mockBackend;
    var mockSuccessSecurityService, mockFailSecurityService;


    //Create a mock module with the same name as the target module
    beforeEach(angular.mock.module("pointOfSaleApplication"));

    //Set up the Http mock backend to trap http requests
    beforeEach(angular.mock.inject(function($httpBackend){
        mockBackend = $httpBackend;
        var mockResponse = {
            "access_token":"3c67d5b4-6339-47f2-b4ea-791e0ef43303",
            "token_type":"bearer",
            "refresh_token":"ebd78c06-0ac8-438a-af85-cc8c3c8c1b56",
            "expires_in":43124,
            "scope":"read write"};
        mockBackend.when("POST", "https://mock.marketlive.com/oauth/token").respond(mockResponse);
        mockBackend.when("POST", "https://mock.marketlive.com/oauth/illegalAction").respond(400, "failure");
    }));

    //Define the Mock Security Service
    beforeEach(angular.mock.inject(function ($q, $http) {
        mockSuccessSecurityService = {
            getToken: function (userCreds) {
                var deferred = $q.defer();

                $http({
                    method : "POST",
                    url : "https://mock.marketlive.com/oauth/token"
                }).success(function(data, status, headers, config){
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        };

        mockFailSecurityService = {
            getToken: function (userCreds) {
                var deferred = $q.defer();

                $http({
                    method : "POST",
                    url : "https://mock.marketlive.com/oauth/illegalAction"
                }).success(function(data, status, headers, config){
                    deferred.resolve(data);
                }).error(function(data, status, headers, config){
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        };

    }));


    //Construct a loginController that we intend to test Successfully, injecting the mockScope and mock Security service
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $location) {
        mockSuccessScope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        loginSuccessController = $controller("loginController", {
            $rootScope: $rootScope,
            $scope: mockSuccessScope,
            $location: $location,
            securityService: mockSuccessSecurityService

        });

    }));

    //Construct a loginController that we intend to test for Failure, injecting the mockScope and mock security service
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $location) {
        mockFailScope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        loginFailController = $controller("loginController", {
            $rootScope: $rootScope,
            $scope: mockFailScope,
            $location: $location,
            securityService: mockFailSecurityService
        });

    }));


    //Now confirm that the results are as expected
    it("Confirms Successful Login settings from controller", function(){
        mockSuccessScope.login("");
        mockBackend.flush();

        expect(location.path()).toEqual("/dashboard");
        expect(sessionStorage.access_token).toEqual("3c67d5b4-6339-47f2-b4ea-791e0ef43303");
        expect(mockSuccessScope.userCredentials.loginId).toEqual('');
    });


    it("Confirms Failure login settings from controller", function(){
        mockFailScope.login("");
        mockBackend.flush();
        expect(mockFailScope.loginFailureMessage).toEqual('Invalid username/password!');
    });

});