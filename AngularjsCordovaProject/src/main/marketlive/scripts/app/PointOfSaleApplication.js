/*! PointOfSaleApplication.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    /**
     * Module to initialize application. This main module is used to inject all other modules as dependencies.
     */
    var pointOfSaleApplication = angular.module('pointOfSaleApplication',
        ['pascalprecht.translate', 'ngRoute', 'ngSignaturePad', 'ngTouch', 'ngIOS9UIWebViewPatch']);

    // Enable/Disable debugging...
    pointOfSaleApplication.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }]);

    pointOfSaleApplication.factory('authHttpResponseInterceptor',
        ['$q', '$injector', '$location', 'dataStorageService', 'redirectBridgeService',
            function ($q, $injector, $location, dataStorageService, redirectBridgeService) {
                return {
                    response: function (response) {
                        return response;
                    },
                    responseError: function (response) {
                        // Error - was it 401 or something else?
                        if (response.status === 401 && response.data.error && response.data.error === 'invalid_token') {
                            var deferred = $q.defer(); // Defer until we can re-request a new token.

                            var refreshTokenPromise = $injector.get('securityService').refreshToken();

                            refreshTokenPromise.then(
                                function (successResult) {
                                    dataStorageService.setAccessToken(successResult.data['access_token']);
                                    dataStorageService.setRefreshToken(successResult.data['refresh_token']);

                                    // Now let's retry the original request.
                                    response.config.headers['Authorization'] =
                                        'Bearer ' + dataStorageService.getAccessToken();

                                    $injector.get('$http')(response.config).then(
                                        function (response) {
                                            // We have a successful response - resolve it using deferred.
                                            deferred.resolve(response);
                                        }, function (response) {
                                            // Something went wrong.
                                            deferred.reject(response);
                                        });
                                }, function (errorResult) {
                                    console.log(
                                        'Refresh token request failed so navigate to login screen. ' + errorResult);
                                    // Token retry failed, redirect so user can login again.
                                    deferred.reject();
                                    redirectBridgeService.goTo('/home');
                                    return;
                                });

                            return deferred.promise; // Return the deferred promise.
                        }

                        return $q.reject(response); // Not a recoverable error.
                    }
                };
            }]);

    pointOfSaleApplication.factory('applicationResourceLoader', 
		['$q',
		function ($q) {
			return function () {
				var mergedTranslations = {};

				var translations = {
					'msg.ppos.application.title' : 'MarketLive Point of Sale',
					'msg.ppos.provisioning.header' : 'Point of Sale Application Provisioning',
					'lbl.ppos.provisioning.serverUrl' : 'Server URL',
					'lbl.ppos.provisioning.storeCode' : 'Store Code',
					'msg.ppos.provisioning.enterServerUrl' : 'Enter server URL',
					'msg.ppos.provisioning.enterStoreCode' : 'Enter store code',
					'err.ppos.provisioning.urlBase.required' : 'Server URL is required.',
					'err.ppos.provisioning.storeCode.required' : 'Store code is required.',
					'btn.ppos.provisioning.submit' : 'Submit',
					'msg.ppos.provisioning.changeStore' : 'Change Store',
					'lbl.ppos.login.username' : 'Username',
					'lbl.ppos.login.password' : 'Password',
					'msg.ppos.login.enterUsername' : 'Enter username',
					'msg.ppos.login.enterPassword' : 'Enter password',
					'err.ppos.login.username.required' : 'Username is required.',
					'err.ppos.login.password.required' : 'Password is required.',
					'err.ppos.login.invalidUsernamePassword' : 'Invalid username/password!',
					'btn.ppos.login.loginButton' : 'Login',
				};

				var deferred = $q.defer();

				if (sessionStorage.getItem('resources')) {
					var newTranslations = JSON.parse(sessionStorage.getItem('resources'));

					angular.extend(mergedTranslations, translations, newTranslations);

					// Resolve with translation data.
					deferred.resolve(mergedTranslations);
				} else {
					angular.extend(mergedTranslations, translations);

					// Resolve with translation data.
					deferred.resolve(mergedTranslations);
				}

				return deferred.promise;
			};
	}]);

	/**
     * Define routes on the main application module.
     */
    pointOfSaleApplication.config(
        ['$translateProvider', '$routeProvider', '$httpProvider', 
		function ($translateProvider, $routeProvider, $httpProvider) {

			$translateProvider.useSanitizeValueStrategy(null);

			$translateProvider.useLoader('applicationResourceLoader');

			$translateProvider.preferredLanguage('en_us');

			$translateProvider.fallbackLanguage('en_us');

            $routeProvider
                .when('/provisioning', {
                    templateUrl: 'views/provisioning/Provisioning.html',
					controller: 'provisioningController'
                })
                .when('/home', {
                    templateUrl: 'views/home/Home.html',
					controller: 'homeController'
                })
                .when('/dashboard', {
                    templateUrl: 'views/dashboard/Dashboard.html',
                    controller: 'dashboardController'
                })
				.when('/csrList', {
                    templateUrl: 'views/csr/CSRList.html',
					controller: 'csrListController'
                })
				.when('/csrAdd', {
                    templateUrl: 'views/csr/CSRAdd.html',
					controller: 'csrController'
                })
				.when('/csrEdit', {
                    templateUrl: 'views/csr/CSREdit.html',
					controller: 'csrEditController'
                })
                .when('/productSearchResult', {
                    templateUrl: 'views/search/ProductSearchResult.html'
                })
				.when('/inStorePickupOrderShipments', {
                    templateUrl: 'views/instorepickup/InStorePickupOrderShipments.html',
					controller: 'inStorePickupOrderShipmentsController',
					access: {
						requiresLogin: true,
						requiredPermissions: ['INSTORE_PICKUP']
					}
                })
				.when('/pickupNewOrderShipments', {
                    templateUrl: 'views/instorepickup/PickupNewOrderShipments.html',
					controller: 'inStorePickupOrderShipmentsController',
					access: {
						requiresLogin: true,
						requiredPermissions: ['INSTORE_PICKUP']
					}
                })
				.when('/pickupInProcessOrderShipments', {
                    templateUrl: 'views/instorepickup/PickupInProcessOrderShipments.html',
					controller: 'inStorePickupOrderShipmentsController',
					access: {
						requiresLogin: true,
						requiredPermissions: ['INSTORE_PICKUP']
					}
                })
				.when('/pickupReadyOrderShipments', {
                    templateUrl: 'views/instorepickup/PickupReadyOrderShipments.html',
					controller: 'inStorePickupOrderShipmentsController',
					access: {
						requiresLogin: true,
						requiredPermissions: ['INSTORE_PICKUP']
					}
                })
				.when('/pickupDoneOrderShipments', {
                    templateUrl: 'views/instorepickup/PickupDoneOrderShipments.html',
					controller: 'inStorePickupOrderShipmentsController',
					access: {
						requiresLogin: true,
						requiredPermissions: ['INSTORE_PICKUP']
					}
                })
				.when('/orderDetail', {
                    templateUrl: 'views/order/OrderDetail.html',
					controller: 'orderDetailController'
                })
                .when('/productDetail', {
                    templateUrl: 'views/product/ProductDetail.html',
                    controller: 'productDetailController'
                })
                .when('/basket', {
                    templateUrl: 'views/basket/Basket.html'
                })
				.when('/csrChangePassword', {
                    templateUrl: 'views/csr/CSRChangePassword.html',
					controller: 'changePasswordController'
                })
				.when('/csrChangePin', {
                    templateUrl: 'views/csr/CSRChangePIN.html',
					controller: 'changePinController'
                })
				.when('/management', {
                    templateUrl: 'views/management/Management.html',
					controller: 'managementController'
                })
				.when('/posSettings', {
                    templateUrl: 'views/settings/POSSettings.html',
					controller: 'posSettingsController'
                })
				.when('/unlockScreen', {
                    templateUrl: 'views/login/UnlockScreen.html'
                })
                .otherwise({
                    redirectTo: '/provisioning'
                });

            $httpProvider.interceptors.push('authHttpResponseInterceptor');
        }]);

		pointOfSaleApplication.run(
        ['$log', '$rootScope', 'dataStorageService', 'securityService',
		function ($log, $rootScope, dataStorageService, securityService) {
			$rootScope.$on('$routeChangeStart', function (event, next) {
				if (next.access) {
					if (next.access.requiresLogin) {
						if (dataStorageService.isLoggedIn()) {
							var requiredPermissions = next.access.requiredPermissions;

							var hasPermission = securityService.authorize(
								dataStorageService.getLoggedInCSR(), requiredPermissions);

							if (!hasPermission) {
								$log.warn('Not Permitted');
								event.preventDefault();
							}
						}
					} else {
						$log.warn('Not Logged In!');
					}
				}
			});
		}]);
}(window.angular));
