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
;(function () {
    'use strict';

    var application = {

        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            // Bind 'deviceready' event listeners
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        // 'deviceready' Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedDeviceReadyEvent'
        // function, we must explicitly call 'application.receivedDeviceReadyEvent(...);'
        onDeviceReady: function () {
            // TODO:
            //application.receivedDeviceReadyEvent('deviceready');

            // Hide the status bar
            window.StatusBar.hide();
        },

        // Update DOM on a Received Event
        receivedDeviceReadyEvent: function (id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received deviceready Event: ' + id);
        }
    };

    application.initialize();
}());
;/*! AddCouponCodeModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('addCouponCodeModalController', 
		['$scope', '$location', '$route', '$translate', 'dataStorageService', 'basketService',
		function ($scope, $location, $route, $translate, dataStorageService, basketService) {

			/**
			 * Model object for add coupon code modal.
			 */
			$scope.addCouponCodeDataModel = {
				couponCode : null,
				showAddCouponCodeError : false,
				addCouponCodeErrorMessage : null
			};
			
			/**
			 * Clears add coupon code data.
			 */
			$scope.clearAddCouponCodeData = function () {
				$scope.addCouponCodeDataModel.couponCode = null;
				$scope.addCouponCodeDataModel.showAddCouponCodeError = false;
				$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = null;
			};

			/**
			 * Close add coupon code modal.
			 */
			$scope.closeAddCouponCodeModal = function () {
				// Hide add coupon code modal.
				angular.element('#addCouponCodeModal').modal('hide');

				$scope.clearAddCouponCodeData();
			};

			/**
			 * Add couon code.
			 */
			$scope.addCouponCode = function () {
				if (!$scope.addCouponCodeDataModel.couponCode) {
					// Show error message.
					$scope.addCouponCodeDataModel.showAddCouponCodeError = true;
					/*$translate('msg.ppos.orderNumberRequired', { minLength : 3 })
						.then(function (orderNumberRequired) {
							$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = orderNumberRequired;
						});*/
					$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = 'Please enter coupon code.';

					angular.element('#couponCode').focus();
				} else {
					basketService.addSourceCode(
						dataStorageService.getBasketId(), $scope.addCouponCodeDataModel.couponCode)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.clearAddCouponCodeData();
									
								// Hide add coupon code modal.
								angular.element('#addCouponCodeModal').modal('hide');

								// Navigate to basket page.
								//$location.path('/basket');

								// Fire basket reload event back upwards using $scope.$emit
								$scope.$emit('reloadBasket');
							}
						}, function (errorResult) {
							if (errorResult.data.responseCode === '422') {
								$scope.addCouponCodeDataModel.showAddCouponCodeError = true;

								/*$translate('msg.ppos.orderNotFound', 
									{ couponCode : $scope.addCouponCodeDataModel.couponCode })
									.then(function (orderNotFound) {
										$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = orderNotFound;
									});*/
								$scope.addCouponCodeDataModel.addCouponCodeErrorMessage = 
			'The coupon code you have entered is not valid. Please check the code you have entered and try again.';

								angular.element('#couponCode').focus();
							}
						});
				}
			};
		}]);
}(window.angular));
;/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('applicationController',
		['$scope', '$location', '$timeout', 'dataStorageService', 'redirectBridgeService', 'starPrinter', '$translate',

			function ($scope, $location, $timeout, dataStorageService, redirectBridgeService, starPrinter, $translate) {

				$scope.applicationModel = {
					toggleValue : false,
					isCSRLoggedIn : false,
					csrFirstName : '',
					csrLastName : '',
					isScreenLocked : false,
					csrUserName : ''
				};

				$scope.initializeApplicationModel = function () {
					$scope.applicationModel.toggleValue = false;

					$scope.applicationModel.isCSRLoggedIn = dataStorageService.isLoggedIn();

					$scope.applicationModel.isScreenLocked = dataStorageService.isScreenLocked();

					if (dataStorageService.getLoggedInCSR()) {
						$scope.applicationModel.csrFirstName = dataStorageService.getLoggedInCSR().firstName;
					} else {
						$scope.applicationModel.csrFirstName = '';
					}

					if (dataStorageService.getLoggedInCSR()) {
						$scope.applicationModel.csrLastName = dataStorageService.getLoggedInCSR().lastName;
					} else {
						$scope.applicationModel.csrLastName = '';
					}

					$scope.applicationModel.csrUserName = $scope.processCsrUserName();
				};

				$scope.processCsrUserName = function () {
					var csrFullUserName = $scope.applicationModel.csrFirstName +' '+
						$scope.applicationModel.csrLastName;
					if (csrFullUserName.length >= 12) {
						csrFullUserName = csrFullUserName.substring(0, 12)+'...';
						csrFullUserName = csrFullUserName.trim();
					}
					return csrFullUserName;
				};

				// Listen to login event and react on that.
				$scope.$on('login', function() {
					$scope.applicationModel.isCSRLoggedIn = true;
					$scope.applicationModel.isScreenLocked = false;
					$scope.applicationModel.csrFirstName = dataStorageService.getLoggedInCSR().firstName;
					$scope.applicationModel.csrLastName = dataStorageService.getLoggedInCSR().lastName;
					$scope.applicationModel.csrUserName = $scope.processCsrUserName();

                    $scope.initPrinter();

                });

				// Listen to logout event and react on that.
				$scope.$on('logout', function() {
					$scope.applicationModel.isCSRLoggedIn = false;
				});

				// Listen to screen locked event and react on that.
				$scope.$on('screenLocked', function() {
					$scope.applicationModel.isScreenLocked = true;
				});

				// Listen to screen unlocked event and react on that.
				$scope.$on('screenUnlocked', function() {
					$scope.applicationModel.isScreenLocked = false;
				});

				// Listen to the *redirectTo* event and react to that.
				$scope.$on('redirectTo', function (event, data) {
					// Unfortunately updates to the location path do not always work, for example when triggered
					// from a non-angular event, so we'll use the timeout-hack as a way around this for now.
					$timeout(function(){
						$location.path(data.path);
					},1);
				});

				$scope.openDashboardPage = function () {
					if (!dataStorageService.isScreenLocked()) {
						if (dataStorageService.isLoggedIn()) {
							// Navigate to dashboard.
							$location.path('/dashboard');
						} else {
							// Navigate to login.
							redirectBridgeService.goTo('/home');
						}
					}
				};

				$scope.lockScreen = function () {
					dataStorageService.setScreenLocked('true');

					// Fire screen lock event back upwards using $scope.$emit
					$scope.$emit('screenLocked');

					// Navigate to unlock screen page.
					$location.path('/unlockScreen');
				};

				$scope.openBasketPage = function () {
					// TODO: For now only go to basket page if basketId is available.
					// The actual requirement per Bhavin and Sku is :
					// If - basketId is available in device then open that basket.
					// Else If - at least one saved basket is available then open that basket.
					// Else - Start 'New Order' transaction.
					if (dataStorageService.getBasketId()) {
						// Navigate to basket page.
						$location.path('/basket');
					} else {
						angular.element('#noShoppingBagModal').modal('show');
					}
				};

				/**
				 * Navigate to CSR change password page if user clicks on change 
				 * password link on CSR user setting overlay.
				 */
				$scope.openCSRChangePasswordPage = function () {
					// Navigate to CSR  change password screen.
					$location.path('/csrChangePassword');
				};
				
				/**
				 * Navigate to CSR change password page if user clicks on change 
				 * password link on CSR user setting overlay.
				 */
				$scope.openCSRChangePINPage = function () {
					// Navigate to CSR  change password screen.
					$location.path('/csrChangePin');
				};

				/**
				 * Navigate to management page if user clicks on settings/ 
				 * management link on overlay.
				 */
				$scope.openManagementPage = function () {
					// Navigate to management screen
					$location.path('/management');
				};

				/**
				 * Toggle the overlay of CSR user settings.
				 */
				$scope.toggleOverlay = function () {
					if ($scope.applicationModel.toggleValue) {
						$scope.applicationModel.toggleValue = false;
					} else {
						$scope.applicationModel.toggleValue = true;
					}

					return $scope.applicationModel.toggleValue;
				};

				/**
				 * Hide overlay of CSR user settings.
				 */
				$scope.hideOverlay = function () {
					$scope.applicationModel.toggleValue = false;
				};


                $scope.pollForNameSpace = function(){

                    if ( window.ppos === undefined) {
                        $timeout($scope.initPrinter, 500);
                    }


                };

                $scope.initPrinter =function(){
                    if ( window.ppos !== undefined) {
                        starPrinter.getDeviceName().then(
                            function(data){
                                //actual devce bt issues
                                if(data === 'NoDevice') {
                                    dataStorageService.setPrinterConnected(false);
                                    $translate('lbl.ppos.noDevice').
                                        then(function (msg) {
                                            dataStorageService.setStarMicronicsPrinterName(msg);
                                        });
                                }
                                else{
                                    dataStorageService.setStarMicronicsPrinterName(data);
                                    dataStorageService.setPrinterConnected(true);
                                }
                            },
                            function(){
                                //typically when we dont even have the driver running
                                dataStorageService.setPrinterConnected(false);

                                $translate('lbl.ppos.noDevice').
                                    then(function (msg) {
                                        dataStorageService.setStarMicronicsPrinterName(msg);
                                    });
                            }
                        );


                    }else{
                        $scope.pollForNameSpace();
                    }


                };

				// Initialize customer details.
				$scope.initializeApplicationModel();

			}]);
}(window.angular));
;/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('basketController', 
		['$scope', '$location', '$route', 'dataStorageService', 'basketService',
			'accountService', 'scanBarcodeService', '$log', '$q', 'productCatalogService',

			function ($scope, $location, $route, dataStorageService, basketService, 
				accountService, scanBarcodeService, $log, $q, productCatalogService) {
		
				$scope.barcodeService = scanBarcodeService;

				$scope.customerInformation = null;
				
				$scope.basketDetailDataModel = null;

				$scope.currentStore = dataStorageService.getStore();

				$scope.basketId = dataStorageService.getBasketId();

				$scope.storeId = dataStorageService.getStoreId();

				$scope.loggedInCSR = dataStorageService.getLoggedInCSR();

				$scope.skuBarcodeSearchPostData = {
					basketId: $scope.basketId || null,
					csrId: $scope.loggedInCSR.id || null,
					storeId: $scope.storeId || null
				};

				// Listen to basket reload and react on that.
				$scope.$on('reloadBasket', function() {
					$scope.initializeCustomerDetail(dataStorageService.getCustomerId());
					$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
				});

				/**
				 * This function gets basket details based on the given basket ID.
				 * 
				 * @param {Number} basketId - The ID of the basket to get details.
				 */
				$scope.initializeBasketDetailDataModel = function (basketId) {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = false;
					if (basketId) {
						basketService.getBasketById(basketId)
							.then(
							function (successResult) {
								$scope.basketDetailDataModel = successResult;

								$scope.basketDetailDataModel.isAutoSaveBag = basketService.isAutoSaveBag();
								
								var skuAvailabilityAtOnlinePromises = [];
								var skuAvailabilityAtStorePromises = [];

								angular.forEach($scope.basketDetailDataModel.data.shipments, function (shipment) {
									angular.forEach(shipment.items, function (item) {
										if(item.isPickupFromStore === true) {
											skuAvailabilityAtOnlinePromises.push(
											$scope.isSkuAvailableOnline(item.skuID));
										} else {
											sessionStorage.showShippingModal = true;
											var storeId = dataStorageService.getStoreId();
											skuAvailabilityAtStorePromises.push(
												$scope.isSkuAvailableAtStore(item.skuID, storeId));
										}
									});
								});

								$q.all(skuAvailabilityAtOnlinePromises)
									.then(
									function (result) {
										angular.forEach(result, function (response) {
											angular.forEach($scope.basketDetailDataModel.data.shipments, 
												function (shipment) {
													angular.forEach(shipment.items, function (item) {
														if(item.isPickupFromStore === true) {
															if(response.data.sku === item.skuID) {
																item['isAvailableInStore'] = true;
																// modify basket response to accomodate availability
																if(response.data.qtyAvailable >= item.qty) {
																	item['isAvailableOnline'] = true;
																} else {
																	item['isAvailableOnline'] = false;
																}
															}
														}
													});
											});
										});
								});

								$q.all(skuAvailabilityAtStorePromises)
									.then(
									function (result) {
										angular.forEach(result, function (response) {
											angular.forEach($scope.basketDetailDataModel.data.shipments, 
												function (shipment) {
													angular.forEach(shipment.items, function (item) {
														if(item.isPickupFromStore === false) {
															if(response.data.sku === item.skuID) {
																item['isAvailableOnline'] = true;
																// modify basket response to accomodate availability
																if(response.data.qtyAvailable >= item.qty) {
																	item['isAvailableInStore'] = true;
																} else {
																	item['isAvailableInStore'] = false;
																}
															}
														}
													});
											});
										});
								});
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};

				$scope.isSkuAvailableOnline = function (skuId) {
					return productCatalogService.getInventory(skuId, null);
				};
				
				$scope.isSkuAvailableAtStore = function (skuId, storeId) {
					return productCatalogService.getInventory(skuId, storeId);
				};

				/**
				 * This function gets customer details based on the given customer ID.
				 * 
				 * @param {Number} customerId - The ID of the customer to get details.
				 */
				$scope.initializeCustomerDetail = function (customerId) {
					if (customerId) {
						accountService.getCustomerById(customerId)
							.then(
							function (successResult) {
								var customerDetail = successResult.data;
								if (customerDetail.primaryContact.person.firstName === 'Guest' && 
									customerDetail.primaryContact.person.lastName === 'Guest') {
									$scope.customerInformation = 'Guest';
								} else {
									$scope.customerInformation = customerDetail.primaryContact.person.firstName + 
										' ' + customerDetail.primaryContact.person.lastName;
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};
				
				/**
				 * This function updates the basket item.
				 * 
				 * @param {Number} basketId - The basket ID.
				 * @param {Number} basketItemId - The basket item ID.
				 * @param {Number} productId - The prodicy ID.
				 * @param {Number} skuId - The Sku ID.
				 * @param {Number} qty - The quantity to update.
				 */
				$scope.updateBasketItem = function (basketId, basketItemId, productId, skuId, qty, store) {
					var storeId = null;
					if (store !== null) {
						storeId = store.id;
					}
					var basketItems = {
						'basketItems' : [
							{
								'basketItemID' : basketItemId,
								'productID' : productId,
								'skuID' : skuId,
								'qty' : qty,
								'storeID' : storeId
							}
						]
					};
					
					if (basketId && basketItemId) {
						if (qty === 0) {
							// PEBL-14659 If entered quantity is equal to 0 then remove item from basket.
							$scope.removeItemFromBasket(basketId, basketItemId);
						} else {
							basketService.updateBasketItems(basketId, basketItems)
								.then(
								function (successResult) {
									if (successResult) {
										$scope.initializeBasketDetailDataModel(basketId);
									}
								}, function (errorResult) {
									console.log(errorResult);
								});
						}
					}
				};

				/**
				 * This function deletes item from basket.
				 * 
				 * @param {Number} basketId - The ID of the basket to delete basket item from.
				 * @param {Number} basketItemId - The ID of the basket item to delete.
				 */
				$scope.removeItemFromBasket = function (basketId, basketItemId) {
					if (basketId && basketItemId) {
						basketService.removeItemFromBasket(basketId, basketItemId)
							.then(
							function (successResult) {
								if (successResult) {
									$scope.initializeBasketDetailDataModel(basketId);
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};
				
				/**
				 * This function removes given source code from basket.
				 * 
				 * @param {Number} basketId - The ID of the basket to remove source code.
				 * @param {String} sourceCode - The source code to remove.
				 */
				$scope.removeSourceCode = function (basketId, sourceCode) {
					if (basketId && sourceCode) {
						basketService.removeSourceCode(basketId, sourceCode)
							.then(
							function (successResult) {
								if (successResult) {
									$scope.initializeBasketDetailDataModel(basketId);
								}
							}, function (errorResult) {
								console.log(errorResult);
							});
					}
				};

				$scope.saveBag = function (basketId) {
					basketService.saveBag(basketId, dataStorageService.getLoggedInCSR().id)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.initializeBasketDetailDataModel(basketId);

								angular.element('#saveBagSuccessModal').modal('show');
							}
						}, function (errorResult) {
							console.log(errorResult);
						});
				};

				$scope.setItemAsShipTo = function (basketId, basketItem) {
					// Set the received basket item as ship to item
					if (basketItem.isPickupFromStore) {
						accountService.getCustomerById(
							dataStorageService.getCustomerId()).then(function (successResult) {
						if (successResult.data.primaryContact.id) {
							var basketItemToUpdate = prepareBasketItem(basketItem, 
									successResult.data.primaryContact.id, null);
							var shipToBasketItems = {
								'basketItems' : [basketItemToUpdate],
							};
							basketService.updateBasketItems(basketId, shipToBasketItems).then(function (successResult) {
								$log.info(successResult);
								$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
							}, function(errorResult) {
								$log.error(errorResult);
							});
						}
						}, function (errorResult) {
							$log.error(errorResult);
						});
					}
				};

				$scope.setItemAsPickup = function (basketId, basketItem) {
					// Set the received basket item as pickup item
					/*store id not null
					contact id = -1*/
					if (!basketItem.isPickupFromStore) {
						var basketItemToUpdate = prepareBasketItem(basketItem, null,
							dataStorageService.getStoreId());
						var shipToBasketItems = {
							'basketItems' : [basketItemToUpdate],
						};
						basketService.updateBasketItems(basketId, shipToBasketItems).then(function (successResult) {
							$log.info(successResult);
							$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
						}, function(errorResult) {
							$log.error(errorResult);
						});
					}
				};

				function prepareBasketItem (basketItem, shipToContactId, storeId) {
					var shipTobasketItem = {
						'basketItemID' : basketItem.id,
						'productID' : basketItem.product.id,
						'skuID' : basketItem.skuID,
						'qty' : basketItem.qty,
						'storeID' : storeId,
						'shipToContactID' : shipToContactId
					};

					return shipTobasketItem;
				}

				$scope.scanSuccessHandler = function () {
					var scrollContainer = angular.element('.ml-ppos-basket-detail-container .ml-ppos-scroll-container'),
						itemsContainer = scrollContainer.find('div:first');

					$scope.reinitializeBasketDetailDataModel();
					scrollContainer.animate({ scrollTop: itemsContainer.height() }, 'slow');
				};

				$scope.viewProductDetail = function (productId) {
					// Navigate to product detail page.
					$location.url('/productDetail?productId=' + productId + '&fromProductSearch=false');
				};

				$scope.reinitializeBasketDetailDataModel = function () {
					$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());
				};
				
				// Initialize basket model for view.
				$scope.initializeBasketDetailDataModel(dataStorageService.getBasketId());

				// Initialize customer details.
				$scope.initializeCustomerDetail(dataStorageService.getCustomerId());

			}]);
}(window.angular));
;/*! CSRController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('csrController', 
		['$scope', 'csrService', '$location', '$translate', 'dataStorageService', 'csrValidationService',
			function ($scope, csrService, $location, $translate, dataStorageService, csrValidationService) {
				// Constants for default roles
				$scope.storeAssociateRoleCode = 'Store Associates';
				$scope.storeManagerRoleCode = 'Store Manager';
				$scope.csr = {
						employeeId : null,
						firstName : null,
						lastName : null,
						email : null,
						password : null,
						confirmPassword : null,
						unlockPosPin : null,
						roleType : null,
						selectedRole : '',
						activeStatus : null,
						pin1 : null,
						pin2 : null,
						pin3 : null,
						pin4 : null,
						pin5 : null,
						pin6 : null,
						showCsrOpFailureMessage : false,
						csrOpFailureMessage : null
					};
				
				$scope.init = function () {
					csrService.getCSRTypes().then(
						function (successResult) {
							if(successResult.data.length !== 2) { 
								// More than 2 roles returned, add a default select option
								$translate('sel.ppos.selectRole').
									then(function (selectOption) {
										var defaultItem = {
											'id' : '',
											'code' : selectOption,
										};
										successResult.data.splice(0, 0, defaultItem);
									});
							}
							$scope.csr.roleType = successResult.data;
							if ($scope.csr.roleType.length === 2) {
								// Select store associate by default for radio case
								$scope.csr.selectedRole = 
									csrService.getStoreAssociateRoleName($scope.csr.roleType, 
																$scope.storeAssociateRoleCode);
								csrService.populateCSRTypeDetails($scope.csr.selectedRole);
							} else {
								csrService.populateCSRTypeDetails('');
							}
						}, function (errorResult) {
							console.log('ErrorResult - An error occurred while getting CSRType list : ' + errorResult);
						}
					);
					$scope.csr.activeStatus = 'false'; //select inactive by default
					$scope.csr.pin1 = '0';
					$scope.csr.pin2 = '0';
					$scope.csr.pin3 = '0';
					$scope.csr.pin4 = '0';
					$scope.csr.pin5 = '0';
					$scope.csr.pin6 = '0';
				};

			    
				/**
				 * Performs add CSR
				 */
				$scope.addCSR = function (csr) {
					//Hide soft keyboard
					$('input').blur();$('select').blur();
					var isValid =  csrValidationService.validateCSR(csr, 'add');
					if (isValid) { // client side ok, now hit server
						// Get CSRType code from value as API expects code
						var csrCode = '';
						for(var idx = 0; idx < $scope.csr.roleType.length; idx++ ) {
							if($scope.csr.roleType[idx].id.toString() === csr.selectedRole.toString()) {
								csrCode = $scope.csr.roleType[idx].code;
								break;
							}
						}

						// Set DATE_ACTIVE or DATE_DEACTIVE based on selection
						var dateActivated = null;
						var dateDeactivated = null;
						if (csr.activeStatus === true || csr.activeStatus === 'true') {
							dateActivated = new Date().getTime();
						} else {
							dateDeactivated = new Date().getTime();
						}
						// Associate the CSR with this store
						var csrStores = [];
						csrStores.push(dataStorageService.getStoreId());
						// call save csr method on service with JSON object
						var csrToAdd = {
							'firstName' : csr.firstName,
							'lastName' : csr.lastName,
							'status' : csr.activeStatus,
							'employeeID' : csr.employeeId,
							'email' : csr.email,
							'password' : csr.password,
							'pin' : csr.unlockPosPin,
							'codeCSRType' : csrCode,
							'dateActivate' : dateActivated,
							'dateDeactivate' : dateDeactivated,
							'stores' : csrStores,
						};
						csrService.createCSR(csrToAdd).then(
							function (successResult) {
								console.log('CSR added ' + successResult);
								csrService.clearCSR($scope.storeAssociateRoleCode, $scope.storeManagerRoleCode, csr);
								csrValidationService.showMessageAndFocus('msg.ppos.userAdded', $scope.csr);
								if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
									angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
									angular.element('#divMsgIconContainer').addClass('ml-icon-success');
								}
							}, function (errorResult) {
								var msg = ''; var serverMsg = '';
								var errorMessage = errorResult.data.errorMessage;
								if (errorResult.data.responseCode === '422' || 
									errorResult.data.responseCode === '409') {
									for (var key in errorMessage) {
										if(errorMessage[key] !== '') {
											serverMsg = errorMessage[key].toString().trim();
											if (serverMsg.lastIndexOf('.') === serverMsg.length - 1) {
												// Full stop already received from server, dont append
												msg += serverMsg + ' ';
											} else {
												// Full stop NOT received from server, append full stop
												msg += serverMsg + '. ';
											}
										}
									}
									csrValidationService.showMessageAndFocus(msg, $scope.csr);
								} else {
									console.log('ErrorResult - An error occurred while adding CSR : ' + errorResult);
									csrValidationService.showMessageAndFocus('msg.ppos.userNotAdded', $scope.csr);
								}
							}
						);
					}
				};


				/**
				On unlock pin text boxes, this method checks if entered value is a digit,
				if yes, then it moves the focus to next text box.
				*/
				$scope.moveOnNext = function (txtValue, currentFieldId, nextFieldID) {
					csrService.moveOnNext(txtValue, currentFieldId, nextFieldID, $scope.csr);
				};
				
				/**
				Method to move to management screen
				*/
				$scope.goToManagementScreen = function () {
					csrService.goToManagementScreen();
				};

				$scope.clearContent = function (elementId) {
					csrService.clearContent(elementId, $scope.csr);
				};

				$scope.clearPIN = function (elementId) {
					csrService.clearPIN(elementId, $scope.csr);
				};
				
				/**
				This method gets role's (CSRType's) permissions from REST & populate that on UI
				*/
				$scope.populateCSRTypeDetails = function (csrTypeId) {
					csrService.populateCSRTypeDetails(csrTypeId);
				};
				
				/**
				* Method to set active status
				*/
				$scope.setStatus = function (activeStatus) {
					$scope.csr.activeStatus = activeStatus;
				};
				
				/**
				* Method to show hide the permission div
				*/
				$scope.showHidePermission = function () {
					csrService.showHidePermission();
				};

				$scope.cancel = function () {
					window.history.back();
				};

				$scope.$watch(
					function() {
						return $scope.csr.pin1 + $scope.csr.pin2 + $scope.csr.pin3 + 
							$scope.csr.pin4 + $scope.csr.pin5 + $scope.csr.pin6; 
					}, function(value) {
							$scope.csr.unlockPosPin = value;
						}
				);
				
				$scope.init();
				angular.element('#employeeId').focus();
			}
		]);
}(window.angular));;/*! CSRController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('csrEditController', 
		['$scope', 'csrService', '$location', '$translate', 'csrValidationService',
		'dataStorageService',
			function ($scope, csrService, $location, $translate, csrValidationService, dataStorageService) {
				// Constants for default roles
				$scope.storeAssociateRoleCode = 'Store Associates';
				$scope.storeManagerRoleCode = 'Store Manager';
				$scope.csr = {
						csrId : null,
						employeeId : null,
						firstName : null,
						lastName : null,
						email : null,
						password : null,
						confirmPassword : null,
						unlockPosPin : null,
						roleType : null,
						selectedRole : '',
						activeStatus : null,
						typePPOS : null,
						typePPOSId : null,
						showCsrOpFailureMessage : false,
						csrOpFailureMessage : null
					};
			
				$scope.init = function () {

					$scope.csr.activeStatus = 'false'; //select inactive by default
					$scope.csrId = JSON.parse(sessionStorage.lastEditCsrId);
					csrService.getCSRById($scope.csrId).then(
						function (successResult) {
							var pin = successResult.data.pin;
							$scope.csr.employeeId = successResult.data.employeeID;
							$scope.csr.firstName = successResult.data.firstName;
							$scope.csr.lastName = successResult.data.lastName;
							$scope.csr.email = successResult.data.email;
							$scope.csr.activeStatus = successResult.data.active;
							$scope.csr.unlockPosPin = pin;
							$scope.csr.typePPOS = successResult.data.typePPOS;				
							if (successResult.data.active && !angular.element('#lblActive').hasClass('active')) {
								angular.element('#lblInactive').toggleClass('active');
								angular.element('#lblActive').toggleClass('active');
							}

							csrService.getCSRTypes().then(
									function (successResult) {
										$scope.csr.roleType = successResult.data;
										$scope.csr.selectedRole = 
												csrService.getStoreAssociateRoleName($scope.csr.roleType,
																			$scope.csr.typePPOS);
										$scope.populateCSRTypeDetails($scope.csr.selectedRole);
										if(successResult.data.length !== 2) { 
											// More than 2 roles returned, add a default select option
											$translate('sel.ppos.selectRole').
												then(function (selectOption) {
													var defaultItem = {
														'id' : '',
														'code' : selectOption,
													};
													successResult.data.splice(0, 0, defaultItem);
												});
										} else {
											$scope.populateCSRTypeDetails('');
										}
										
									}, function (errorResult) {
										console.log('ErrorResult - An error occurred while getting' +
										' CSRType list : ' + errorResult);
									}
								);

						}, function (errorResult) {
							console.log('ErrorResult - An error occurred while getting CSR : ' + errorResult);
						}
					);

					

					
				};

				/**
				 * Performs update CSR
				 */
				$scope.updateCSR = function (csr) {
					//Hide soft keyboard
					$('input').blur();$('select').blur();
					var isValid = csrValidationService.validateCSR(csr, 'edit');
					if (isValid) { // client side ok, now hit server
						// Get CSRType code from value as API expects code
						var csrCode = '';
						//var csrTypeId = document.getElementById('roleTypeRadio').value;
						for(var idx = 0; idx < $scope.csr.roleType.length; idx++ ) {
							if($scope.csr.roleType[idx].id.toString() === csr.selectedRole.toString()) {
								csrCode = $scope.csr.roleType[idx].code;
								break;
							}
						}

						// Set DATE_ACTIVE or DATE_DEACTIVE based on selection
						var dateActivated = null;
						var dateDeactivated = null;
						if (csr.activeStatus === true || csr.activeStatus === 'true') {
							dateActivated = new Date().getTime();
						} else {
							dateDeactivated = new Date().getTime();
						}
						// Associate the CSR with this store
						var csrStores = [];
						csrStores.push(dataStorageService.getStoreId());
						// call save csr method on service with JSON object
						var csrToUpdate = {
							'firstName' : csr.firstName,
							'lastName' : csr.lastName,
							'status' : csr.activeStatus,
							'employeeID' : csr.employeeId,		
							'email' : csr.email,
							'pin' : csr.unlockPosPin,
							'codeCSRType' : csrCode,
							'dateActivate' : dateActivated,
							'dateDeactivate' : dateDeactivated,
							'stores' : csrStores,
						};
						csrService.updateCSR($scope.csrId, csrToUpdate).then(							
							function (successResult) {
								console.log('CSR updated ' + successResult);								
								csrValidationService.showMessageAndFocus('msg.ppos.userUpdated', $scope.csr);
								$scope.init();
								if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
									angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
									angular.element('#divMsgIconContainer').addClass('ml-icon-success');
								}
							}, function (errorResult) {
								var msg = ''; var serverMsg = '';
								var errorMessage = errorResult.data.errorMessage;
								if (errorResult.data.responseCode === '422' || 
									errorResult.data.responseCode === '409') {
									for (var key in errorMessage) {
										if(errorMessage[key] !== '') {
											serverMsg = errorMessage[key].toString().trim();
											if (serverMsg.lastIndexOf('.') === serverMsg.length - 1) {
												// Full stop already received from server, dont append
												msg += serverMsg + ' ';
											} else {
												// Full stop NOT received from server, append full stop
												msg += serverMsg + '. ';
											}
										}
									}
									csrValidationService.showMessageAndFocus(msg, $scope.csr);
								} else {
									console.log('ErrorResult - An error occurred while adding CSR : ' + errorResult);
									csrValidationService.showMessageAndFocus('msg.ppos.userNotUpdated', $scope.csr);
								}
							}
						);
					}
				};

				/**
				* This method gets role's (CSRType's) permissions from REST & populate that on UI
				*/
				$scope.populateCSRTypeDetails = function (csrTypeId) {
					csrService.populateCSRTypeDetails(csrTypeId);
				};

				/**
				* Method to move to CSR list screen
				*/
				$scope.goToCsrListScreen = function () {
					csrService.goToCsrListScreen();
				};

				/**
				* Method to move to management screen
				*/
				$scope.goToManagementScreen = function () {
					csrService.goToManagementScreen();
				};

				/**
				* Method to show hide the permission div
				*/
				$scope.showHidePermission = function () {
					csrService.showHidePermission();
				};

				/**
				* On unlock pin text boxes, this method checks if entered value is a digit,
				* if yes, then it moves the focus to next text box.
				*/
				$scope.moveOnNext = function (txtValue, currentFieldId, nextFieldID) {
					csrService.moveOnNext(txtValue, currentFieldId, nextFieldID, $scope.csr);
				};

				$scope.clearContent = function (elementId) {
					csrService.clearContent(elementId, $scope.csr);
				};

				$scope.clearPIN = function (elementId) {
					csrService.clearPIN(elementId, $scope.csr);
				};

				$scope.$watch(
					function() {
						return $scope.csr.pin1 + $scope.csr.pin2 + $scope.csr.pin3 + 
							$scope.csr.pin4 + $scope.csr.pin5 + $scope.csr.pin6; 
					}, function(value) {
							$scope.csr.unlockPosPin = value;
						}
				);

				/**
				* Method to set active status
				*/
				$scope.setStatus = function (activeStatus) {
					$scope.csr.activeStatus = activeStatus;
				};
			
				$scope.init();
				angular.element('#employeeId').focus();
			}
			
		]);
}(window.angular));
;/*! CSRListController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('csrListController', 
		['$log', '$scope', '$location', 'csrService', 'dataStorageService',
		function ($log, $scope, $location, csrService, dataStorageService) {

			$scope.csrListDataModel = {
				userData : null,
				csrDeleteId : null,
				csrDeleteUser : null,
				csrListType : null
			};

			$scope.init = function () {
				$scope.getAllCSRs();
			};
			
			/**
			* To get all CSR (active + inactive) user list.
			*/
			$scope.getAllCSRs = function () {
				$scope.csrListDataModel.csrListType = 'ALL';
				csrService.getAllCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = '';
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* To get only active CSR user list.
			*/
			$scope.getActiveCSRs = function () {
				$scope.csrListDataModel.csrListType = 'ACTIVE';
				csrService.getActiveCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* To get only inactive CSR user list.
			*/
			$scope.getInActiveCSRs = function () {
				$scope.csrListDataModel.csrListType = 'INACTIVE';
				csrService.getInActiveCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* Navigate to CSR management screen if clicks on management button\link.
			*/
			$scope.goToManagementScreen = function () {
					$location.path('/management');
			};

			/**
			* Navigate to CSR add screen if clicks on add icon\button.
			*/
			$scope.goToCsrAddScreen = function () {
				$location.path('/csrAdd');
			};

			/**
			 * Navigate to CSR edit screen if clicks on edit button.
			 *
			 */
			$scope.goToCsrEditScreen = function (csrId) {
				sessionStorage.lastEditCsrId = csrId;				
				$location.path('/csrEdit');
 			};

			
			$scope.deleteUser = function (csrId, csrUser) {
				$scope.csrListDataModel.csrDeleteId = csrId;
				$scope.csrListDataModel.csrDeleteUser = csrUser;
				angular.element('#csrDeleteConfirmationModal').modal('show');
			};

			$scope.closeDelConfirmModal = function () {
				angular.element('#csrDeleteConfirmationModal').modal('hide');
			};

			/**
			 * Delete CSR user if clicks on delete button.
			 *
			 */
			$scope.deleteCsrUser = function () {
				angular.element('#csrDeleteConfirmationModal').modal('hide');
				csrService.deleteCSR($scope.csrListDataModel.csrDeleteId)
					.then(
					function (successResult) {
						console.log('CSR deleted : ' + successResult);
						$scope.init();
					}, function (errorResult) {
						$log.error(errorResult);
					});
 			};
 
			/**
			* toggle active\inactive status of the user to be shown for csr user.
			*/
			$scope.isActive = function(active, showActiveInactive) {
				var isActive = false;
				if (active === 'true' && showActiveInactive === 'showActive') {
					return true;
				} else if (active === 'false' && showActiveInactive === 'showInactive') {
					return true;
				}
				return isActive;
			};
 
			/**
			* To find if delete icon should be active or not for the user listing, 
			* delete icon is visible only if csr user is in inactive state.
			*/
			$scope.showDelete = function(active, typePPOS) {
				if (active === 'true' || typePPOS === 'Admin') {
					return false;
				} else {
					return true;
				}
			};

			/**
			* To find if edit icon should be visible or not for the user listing, 
			* edit icon will not be visible for the user row with admin role.
			*/
			$scope.showEdit = function(typePPOS) {
				if (typePPOS === 'Admin') {
					return false;
				} else {
					return true;
				}
			};

			/**
			* To find if user row should be visible or not, 
			* user row will be visible according to roles, admin row will be visible 
			* only if logged in user also have admin role.
			*/
			$scope.showUserRow = function(typePPOS) {
				var loggedInUserType = dataStorageService.getLoggedInCSR().typePPOS; 
				if (typePPOS === 'Admin' && loggedInUserType !== 'Admin') {
					return false;
				} else {
					return true;
				}
			};


			$scope.init();
		}]);
}(window.angular));

;/*! ChangePINController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('changePinController',
		['$scope', '$location', 'dataStorageService', 'csrService', '$translate', '$log',

			function ($scope, $location, dataStorageService, csrService, $translate, $log) {

				$scope.init = function () {
				var loggedInCSR = dataStorageService.getLoggedInCSR();
					if (loggedInCSR && loggedInCSR.email) {
						csrService.getCSRByEmail(loggedInCSR.email).then(
						function (successResult) {
							$scope.changePinModel.csrJsonBeforeSave = successResult.data;
							dataStorageService.setLoggedInCSR(successResult.data);
						}, function (errorResult) {
							$scope.changePinModel.csrJsonBeforeSave = null;
							$log.error('ErrorResult - An error occurred while getting CSR : ' + errorResult);
						});
					}
				};

				$scope.changePinModel = {
					csrJsonBeforeSave : null,
					currentPin : null,
					newPin : null,
					confirmPin : null,
					showMessage : false,
					message : null,
					inputType : 'text'
				};

				/**
				 * Save changed PIN.
				 */
				$scope.changePIN = function (changePinModel) {
					if (changePinModel.csrJsonBeforeSave !== null) {
						var isValid = validatePINs(changePinModel);
						if(isValid) {
							// Make Rest Call to save new PIN
							var csrStores = [];
							csrStores.push(dataStorageService.getStoreId());
							var csrToModify = {
								'firstName' : changePinModel.csrJsonBeforeSave.firstName,
								'lastName' : changePinModel.csrJsonBeforeSave.lastName,
								'status' : changePinModel.csrJsonBeforeSave.active,
								'employeeID' : changePinModel.csrJsonBeforeSave.employeeID,
								'email' : changePinModel.csrJsonBeforeSave.email,
								'pin' : changePinModel.newPin,
								'stores' : csrStores,
								'codeCSRType' : changePinModel.csrJsonBeforeSave.typePPOS
							};
							csrService.updateCSR(changePinModel.csrJsonBeforeSave.id, csrToModify).then(
								function (successResult) {
									$log.info('CSR Modified ' + successResult);
									clearPINs();
									showMessage('msg.ppos.pinChanged');
									if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
										angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
										angular.element('#divMsgIconContainer').addClass('ml-icon-success');
									}
									// Re-init so that if user wants to change again without refresh, 
									// then it has latest values, also for screen lock/unlock
									$scope.init();
								}, function (errorResult) {
									$log.error('ErrorResult - An error occurred while changing CSR PIN: ' + errorResult);
									showMessage('msg.ppos.pinNotChanged','currentPin');
								}
							);
						}
					} else {
						$log.error('ErrorResult - An error occurred while changing CSR PIN');
						showMessage('msg.ppos.pinNotChanged','currentPin');
					}
				};

				/**
				 * Toggling of password character display according to selected type, 
				 * like display of entered password characters in text or masked (astrix) characters.
				 *
				 */
				$scope.showHidePin = function(showHideType){
				    if (showHideType === 'text') {
					    $scope.changePinModel.inputType = 'text';
					}
				    else if (showHideType === 'masked') {
					    $scope.changePinModel.inputType = 'password';
					}
			    };

				/**
				 * Navigate to profile dashboard page if user clicks on cancel button.
				 *
				 */
				$scope.openDashboardPage = function () {
					// Navigate to dashboard.
					$location.path('/dashboard');
				};
				
				$scope.isNumber = function (elementId, elementValue) {
					if(null != elementValue && !elementValue.match(/^[0-9]+$/)) {
						return false;
					} else {
						return true;
					}
				};

				/**
				 * Clears password fields.
				 */
				function clearPINs () {
					$scope.changePinModel.currentPin = null;
					$scope.changePinModel.newPin = null;
					$scope.changePinModel.confirmPin = null;
				}

				/**
				* Validate CSR fields
				*/
				function validatePINs (changePinModel) {
					//TODO $viewValue is not working for failed patterns
					// Thats why using undefined check
					if (changePinModel.currentPin === undefined) {
						showMessage('msg.ppos.invalidCurrentAccessPIN');
						return false;
					} else if (changePinModel.newPin === undefined) {
						showMessage('msg.ppos.invalidNewAccessPIN');
						return false;
					} else if (changePinModel.confirmPin === undefined) {
						showMessage('msg.ppos.invalidConfirmAccessPIN');
						return false;
					} else if (!changePinModel.currentPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.currentAccessPin');
						return false;
					} else if (!changePinModel.newPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.newAccessPin');
						return false;
					} else if (!changePinModel.confirmPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.confirmAccessPin');
						return false;
					} else if (!$scope.isNumber(changePinModel.currentPin) || 
							changePinModel.currentPin.length !== 6) {
						showMessage('msg.ppos.invalidCurrentAccessPIN');
						return false;
					} else if (!$scope.isNumber(changePinModel.newPin) || 
							changePinModel.newPin.length !== 6) {
						showMessage('msg.ppos.invalidNewAccessPIN');
						return false;
					} else if (!$scope.isNumber(changePinModel.confirmPin) || 
							changePinModel.confirmPin.length !== 6) {
						showMessage('msg.ppos.invalidConfirmAccessPIN');
						return false;
					} else if (changePinModel.newPin !== changePinModel.confirmPin) {
						showMessage('msg.ppos.pinNotMatch');
						return false;
					} else if (changePinModel.currentPin === changePinModel.newPin) {
						showMessage('msg.ppos.currentNewPinSame');
						return false;
					} else if (changePinModel.csrJsonBeforeSave && changePinModel.csrJsonBeforeSave.pin 	&& 
						changePinModel.csrJsonBeforeSave.pin !== changePinModel.currentPin) {
						showMessage('msg.ppos.currentPinNoMatch');
						return false;
					}
					return true;
				}

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				function showMessage (msgPath) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						$scope.changePinModel.showMessage = true;
						$scope.changePinModel.message = msg;
						angular.element('#save').focus();
					});
				}

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				function createEmptyFieldMsgAndDisplay (fieldNamePath) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							$scope.changePinModel.showMessage = true;
							$scope.changePinModel.message = genericMessage;
							angular.element('#save').focus();
						});
					});
				}

				$scope.init();
				angular.element('#currentPin').focus();
			}]);
}(window.angular));;/*! ChangePasswordController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('changePasswordController',
		['$scope', '$location', 'dataStorageService', 'csrService', '$translate',

			function ($scope, $location, dataStorageService, csrService, $translate) {

				$scope.changePasswordModel = {
					currentPassword : null,
					newPassword : null,
					confirmPassword : null,
					showChangePasswordFailureMessage : false,
					changePasswordFailureMessage : null,
					inputType : 'text'

				};

				/**
				 * Save changed password.
				 */
				$scope.changePassword = function (changePasswordModel) {
					var isValid = validatePasswords(changePasswordModel);
					if (isValid) {
						var csrObject = dataStorageService.getLoggedInCSR();
						var csrId = csrObject.id;
						var csrObjectToUpdate = {
							'passwordOld' : changePasswordModel.currentPassword,
							'passwordNew' : changePasswordModel.newPassword,
							'passwordNewConfirm' : changePasswordModel.confirmPassword
						};
						csrService.updateCSRPassword(csrId, csrObjectToUpdate)	
						.then(
							function (successResult) {
								console.log(successResult);
								showMessage('msg.ppos.passwordChanged','');
								clearPasswords();
								angular.element('#currentPassword').focus();
								if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
									angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
									angular.element('#divMsgIconContainer').addClass('ml-icon-success');
								}
							}, function (errorResult) {
								var invalidInputErrorMessage = errorResult.data.error.error;
								var errorMessage = errorResult.data.errorMessage.CSR;
								if (errorResult.data.responseCode === '422') {
									if (errorMessage !== undefined && 
												 errorMessage.includes('password confirmation') > 0) {
										  showMessage('msg.ppos.passwordNotMatch','newPassword');
									} else if (errorMessage !== undefined && 
													errorMessage.includes('password incorrect.') > 0) {
										  showMessage('msg.ppos.currentPasswordMismatch','currentPassword');
									} else if (errorMessage !== undefined && 
													errorMessage.includes('same as old password') > 0) {
										  showMessage('msg.ppos.currentNewPasswordSame','newPassword');
									} else if (invalidInputErrorMessage !== undefined &&
													invalidInputErrorMessage.includes('missing input data') > 0) {
	   									  showMessage('msg.ppos.invalidPassword','currentPassword');
									}
								} else {
								   showMessage('msg.ppos.csrPasswordChangeError','currentPassword');
								   console.log('ErrorResult - An error occurred while changing password : '+errorResult);
								}
								
						  });
					}

				};

				/**
				 * Toggling of password character display according to selected type, 
				 * like display of entered password characters in text or masked (astrix) characters.
				 *
				 */
				$scope.showHidePassword = function(showHideType){
				    if (showHideType === 'text') {
					    $scope.changePasswordModel.inputType = 'text';
					}
				    else if (showHideType === 'masked') {
					    $scope.changePasswordModel.inputType = 'password';
					}
			    };

				/**
				 * Navigate to profile dashboard page if user clicks on cancel button.
				 *
				 */
				$scope.openDashboardPage = function () {
					// Navigate to dashboard.
					$location.path('/dashboard');
				};

				/**
				 * Clears password fields.
				 */
				function clearPasswords () {
					$scope.changePasswordModel = {
						currentPassword : null,
						newPassword : null,
						confirmPassword : null,
						showChangePasswordFailureMessage : false
					};
				}

				/**
				* Validate CSR fields
				*/
				function validatePasswords (changePasswordModel) {
					if (!changePasswordModel.currentPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.password','currentPassword');
						return false;
					} else if (!changePasswordModel.newPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.newPassword','newPassword');
						return false;
					} else if (!changePasswordModel.confirmPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword','confirmPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.currentPassword)) {
						showMessage('msg.ppos.invalidPassword','currentPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.newPassword)) {
						showMessage('msg.ppos.invalidPassword','newPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.confirmPassword)) {
						showMessage('msg.ppos.invalidPassword','confirmPassword');
						return false;
					} else if (changePasswordModel.newPassword !== changePasswordModel.confirmPassword) {
						showMessage('msg.ppos.passwordNotMatch','newPassword');
						return false;
					} else if (changePasswordModel.currentPassword === changePasswordModel.newPassword) {
						showMessage('msg.ppos.currentNewPasswordSame','newPassword');
						return false;
					}
					return true;
				}

				/**
				Method to check if password is valid, a combination of characters & digits.
				*/

				function isPasswordValid(password) {
					if (password.length < 7 || password.length > 50) {
						return false;
					} else if (!password.match(/(([0-9]+[a-zA-Z]+)|([a-zA-Z]+[0-9]+))([a-zA-Z0-9]*)/)) {
			  			return false;			
  					}
					return true;
				}

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				function showMessage (msgPath, elementIdToFocus) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						$scope.changePasswordModel.showChangePasswordFailureMessage = true;
						$scope.changePasswordModel.changePasswordFailureMessage = msg;
						angular.element('#' + elementIdToFocus).focus();
					});
				}

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				function createEmptyFieldMsgAndDisplay (fieldNamePath, elementIdToFocus) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							$scope.changePasswordModel.showChangePasswordFailureMessage = true;
							$scope.changePasswordModel.changePasswordFailureMessage = genericMessage;
							angular.element('#' + elementIdToFocus).focus();
						});
					});
				}
				angular.element('#currentPassword').focus();
			}]);
}(window.angular));;/*! CustomerProfileInformationController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('customerProfileInformationController',
		['$log', '$scope', '$location', '$q', 'dataStorageService', 'accountService', 'appService',
				'customerSearchService', '$translate', 'globalValidationService', 'newOrderService',
			function ($log, $scope, $location, $q, dataStorageService, accountService, appService,
				customerSearchService, $translate, globalValidationService, newOrderService) {

			$scope.customerDO = {
				id : '',
				accountSet : '',
				phoneNumber : '',
				firstName : '',
				lastName : '',
				email : '',
				userName : '',
				password : '',
				confirmPassword : '',
				securityQuestions : [],
				hint : '-1',
				hintAnswer : '',
				guest : true,
				showOpFailureMessage : false,
				opFailureMessage : null,
				street1 : dataStorageService.getStore().street1,
				city : dataStorageService.getStore().city,
				state : dataStorageService.getStore().country + '/' + dataStorageService.getStore().state,
				country : dataStorageService.getStore().country,
				postalCode : dataStorageService.getStore().zipCode
			};

			$scope.fromPage = '';

			$scope.customerSearchDataModel = {
				customerPhoneNumber : null,
				customerEmail : null,
				existingPhoneCustomerResult : null,
				existingEmailCustomerResult : null
			};
			
			$scope.primaryContact = '';
			$scope.customerID = '';
				
			$scope.customerProfileInformationModal = function (fromPage) {
				$scope.customerFormDiv = false;
				$scope.fromPage = fromPage;

				if ($scope.fromPage === 'update') {
					$scope.initCustomerProfileInformationModal().then(function(response){
						if (response) {
							angular.element('#customerProfileInformation').modal('show');			
						}
					});
				} else if($scope.fromPage === 'dashboard') {
					$scope.initCustomerProfileInformationModalNewCustomer();
					angular.element('#customerProfileInformation').modal('show');
				}
			};

			$scope.closeProfileInformationModal = function () {
				clearCustomerData();
				$('input').blur();
				$('select').blur();
				angular.element('#customerProfileInformation').modal('hide');
			};

			$scope.initCustomerProfileInformationModal = function () {
				clearCustomerData();
				if (dataStorageService.getCustomerId())	{
					return getCustomerData(dataStorageService.getCustomerId());
				}
			};

			$scope.initCustomerProfileInformationModalNewCustomer = function () {
				clearCustomerData();
				$scope.initSecurityQuestions();
			};

			// populate security questions
			$scope.initSecurityQuestions = function () {
				var deferred = $q.defer();
				$translate('Select a recovery question').then(function (translatedValue) {
					var optQuestion;
					optQuestion = {
						'id' : '-1',
						'question' : translatedValue
					};
					$scope.customerDO.securityQuestions.push(optQuestion);
					accountService.getSecurityQuestions().then(function (successResult) {
						for(var index = 0; index < successResult.data.length; index++) {
							optQuestion = {
								'id' : successResult.data[index].id,
								'question' : successResult.data[index].question
							};
							$scope.customerDO.securityQuestions.push(optQuestion);
						}
						deferred.resolve(successResult.data);
					}, function(errorResult) {
						$log.error(errorResult);
						deferred.reject(errorResult);
					});
				});
				return deferred.promise;
			};

			/**
			 * Save/Update Customer.
			*/
			$scope.saveOrUpdateCustomer = function (customerDO) {
				var isValid = validateCustomerProfileInformation(customerDO);
				if (isValid) {
					appService.activateSpinner();
					
					$scope.customerSearchDataModel.customerPhoneNumber = customerDO.phoneNumber;
					$scope.customerSearchDataModel.customerEmail = customerDO.email;
					//Check for firstName and lastName
					//If firstName and lastName not provided
					//We use email as firstName and lastName
					if (customerDO.firstName === '' || customerDO.firstName === 'Guest') {
						customerDO.firstName = customerDO.email;
					}

					if (customerDO.lastName === '' || customerDO.lastName === 'Guest') {
						customerDO.lastName = customerDO.email;
					}
					$scope.customerSearchDataModel.existingPhoneCustomerResult = null;
					$scope.customerSearchDataModel.existingEmailCustomerResult = null;
					$scope.existingPhoneCustomerInformation = true;
					$scope.existingEmailCustomerInformation = true;					
					customerSearchService.searchCustomerByEmail(customerDO.email)
						.then(
						function (successResult) {
							removeCurrentCustomer(successResult);
							if (successResult.data.length > 0) {
								$scope.customerFormDiv = true;
								$scope.customerSearchDataModel.existingEmailCustomerResult = successResult;
								$scope.customerSearchDataModel.existingEmail = customerDO.email;
							} else {
								saveUpdateCustomer(customerDO);								
							}	
							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							customerSearchService.searchCustomerByPhoneNumber(customerDO.phoneNumber)
								.then(
								function (successResult) {								   
									removeCurrentCustomer(successResult);
									if (successResult.data.length > 0) {
										$scope.customerFormDiv = true;
										$scope.customerSearchDataModel.existingPhoneCustomerResult = successResult;
										appService.deactivateSpinner();
									} else {
										saveUpdateCustomer(customerDO);								
									}
								}, function (errorResult) {
									$log.error(errorResult);
									saveUpdateCustomer(customerDO);
									appService.deactivateSpinner();							
							});
							appService.deactivateSpinner();	
					});
					
				}
			};

			/**
			* removes current customer from 
			**/
			function removeCurrentCustomer (successResult) {
				for (var idx = 0;idx < successResult.data.length ; idx++) {
					if ($scope.customerID === successResult.data[idx].id) {
						successResult.data.splice(idx, 1);
						break;
					}
				}
			}

			function saveUpdateCustomer (customerDO) {
				if ($scope.fromPage === 'update') {
					$scope.updateCustomer(customerDO);
				} else if ($scope.fromPage === 'dashboard') { 
					$scope.saveCustomer(customerDO);
				}
			}

			$scope.closeSearchModal = function () {
				$scope.customerSearchDataModel.existingEmailCustomerResult = null;
				$scope.customerSearchDataModel.existingPhoneCustomerResult = null;
				$scope.customerFormDiv = false; 
			};

			/**
			 * Get customer detail by given ID.
			**/
			function getCustomerData (customerId) {
				var defer = $q.defer();
				$scope.initSecurityQuestions().then(function (successResult) {
					$log.info('Security questions loaded ' + successResult);
					accountService.getCustomerById(customerId).then(
					function (successResult) {
						$scope.customerID = successResult.data.id;
						$scope.customerDO.accountSet = successResult.data.accountSet;
						if (successResult.data.primaryContact.id) {
							$scope.primaryContact = successResult.data.primaryContact.id;
							$scope.customerDO.hintAnswer = successResult.data.hintAnswer;
							// Set selected question from list
							if (null !== successResult.data.hintQuestion)	{
								for(var queIdx = 0; 
									queIdx < $scope.customerDO.securityQuestions.length; queIdx++) {
									if ($scope.customerDO.securityQuestions[queIdx].question === 
										successResult.data.hintQuestion) {
										$scope.customerDO.hint = $scope.customerDO.securityQuestions[queIdx].id;
										break;
									}
								}
							}
							accountService.getContactById(successResult.data.primaryContact.id)
								.then(
								function (successResult) {								
								 //Check if return contact is not a guest
								if (!successResult.data.guest) {
									$scope.customerDO.phoneNumber = successResult.data.phone1;
									$scope.customerDO.firstName = successResult.data.person.firstName;
									$scope.customerDO.lastName = successResult.data.person.lastName;
									$scope.customerDO.email = successResult.data.email;
									$scope.customerDO.street1 = successResult.data.address.street1;
									$scope.customerDO.city = successResult.data.address.city;
									$scope.customerDO.state = successResult.data.address.state;
									$scope.customerDO.country = successResult.data.address.country;
									$scope.customerDO.postalCode = successResult.data.address.postalCode;
								}
								defer.resolve(true);
								}, function (errorResult) {
									defer.reject(false);
									$log.error('Error while getting contact information ' + errorResult);
								});
						}
					}, function (errorResult) {
						defer.reject(false);
						$log.error('Error while getting customer information ' + errorResult);
					});
				}, function (errorResult) {
					defer.reject(false);
					$log.info('Error while loading security questions ' + errorResult);
				});
				return defer.promise;
			}

			/**
			 * Get customer detail by given ID.
			 */
			function setAddressAndAccountSet (customerId) {
				var defer = $q.defer();
				accountService.getCustomerById(customerId).then(
					function (successResult) {
						$scope.customerID = successResult.data.id;
						$scope.customerDO.id = successResult.data.id;
						$scope.customerDO.accountSet = successResult.data.accountSet;
						if (successResult.data.primaryContact.id) {
							$scope.primaryContact = successResult.data.primaryContact.id;
							accountService.getContactById(successResult.data.primaryContact.id)
								.then(
								function (successResult) {								
								 //Check if return contact is not a guest
								if (!successResult.data.guest) {
									$scope.customerDO.street1 = successResult.data.address.street1;
									$scope.customerDO.city = successResult.data.address.city;
									$scope.customerDO.state = successResult.data.address.state;
									$scope.customerDO.country = successResult.data.address.country;
									$scope.customerDO.postalCode = successResult.data.address.postalCode;
								}
									defer.resolve(true);
								}, function (errorResult) {
									defer.reject(false);
									$log.error(errorResult);
								});
						}
					}, function (errorResult) {
						$log.error(errorResult);
					}); 
					return defer.promise;
			}

			/**
			 * Validate customer fields
			*/ 
			function validateCustomerProfileInformation (customerDO) {
				$scope.customerDO.showOpFailureMessage = false;
				$scope.customerDO.opFailureMessage = '';
				if (!customerDO.phoneNumber) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.phoneNumber');
					return false;
				} else if (!globalValidationService.isValidPhoneNumber(customerDO.phoneNumber)) {
					$scope.showMessageAndFocus('msg.ppos.invalidPhoneNumber');
					return false;
				}if (!customerDO.firstName) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName');
					return false;
				} else if (!customerDO.lastName) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName');
					return false;
				} else if (customerDO.email === undefined || !customerDO.email ||
						!globalValidationService.isEmailValid(customerDO.email)) {
					$scope.showMessageAndFocus('msg.ppos.invalidEmail');
					return false;
				} else if (!customerDO.password) { 
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.password');
					return false;
				} else if (!customerDO.confirmPassword) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword');
					return false;
				} else if (customerDO.password !== customerDO.confirmPassword) {
					$scope.showMessageAndFocus('msg.ppos.passwordNotMatch');
					return false;
				} else if (!globalValidationService.isPasswordValid(customerDO.password)) {
					$scope.showMessageAndFocus('msg.ppos.invalidPassword'); 
					return false;
				} else if (!customerDO.hint || customerDO.hint === '-1') {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.securityQuestion');
					return false;
				} else if (!customerDO.hintAnswer) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.securityAnswer');
					return false;
				}
				return true;
			}

			/**
			This method accepts two resource path
			1. First parameter is the path of resource that is a generic message for blank field.
			2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
			3. Third parameter is the id of the html element on which the focus needs to be placed.
			*/
			$scope.createEmptyFieldMsgAndDisplay = function (fieldNamePath) {
				$translate(fieldNamePath).
				then(function (fieldNameVal) {
					$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
					then(function (genericMessage) {
						$scope.customerDO.showOpFailureMessage = true;
						$scope.customerDO.opFailureMessage = genericMessage;
						angular.element('#btnCloseCustomerProfileModal').focus();
					});
				});
			};

			/**
			This method accepts a resource path and element id,
			it displays the value of resource as error, and focus on element
			*/
			$scope.showMessageAndFocus = function (msgPath) {
				$translate(msgPath).
				then(function (msg) {
					$scope.customerDO.showOpFailureMessage = true;
					$scope.customerDO.opFailureMessage = msg;
					angular.element('#btnCloseCustomerProfileModal').focus();
				});
			};
			
			//function to prepare contact detail
			function prepareContactDetail (customerDO) {
				var contactDetail = {
					'phone1' : customerDO.phoneNumber,
					'email' : customerDO.email,
					'person' : {
						'firstName' : customerDO.firstName,
						'lastName' :customerDO.lastName
					},
					'address' : {
						'street1' : $scope.customerDO.street1,
						'city' : $scope.customerDO.city,
						'state' : $scope.customerDO.state,
						'country' : $scope.customerDO.country,
						'postalCode' : $scope.customerDO.postalCode
					}
				};
				return contactDetail;
			}

			/**
			 * Clears customer search data.
			 */
			function clearCustomerData () {
				$scope.customerDO.phoneNumber = null;
				$scope.customerDO.firstName = null;
				$scope.customerDO.lastName = null;
				$scope.customerDO.email= null;
				$scope.customerDO.password = null;
				$scope.customerDO.confirmPassword = null;
				$scope.customerDO.securityQuestions = [];
				$scope.customerDO.hint = '-1';
				$scope.customerDO.hintAnswer = null;
				$scope.customerDO.showOpFailureMessage = false;
				$scope.customerDO.opFailureMessage= null;
				$scope.primaryContact = null;
				$scope.customerID = null;
				$scope.customerSearchDataModel = {
					customerPhoneNumber : null,
					existingPhoneCustomerResult : null
				};
				$scope.existingPhoneCustomerInformation = true;
				$scope.existingEmailCustomerInformation = true;
			}

			/**
			* update selected contact from existing customer list.
			**/
			$scope.updateSelectedContact = function (customerId, contactId, customerDO) {
				dataStorageService.setCustomerId(customerId);
				customerDO.id = customerId;
				var defer = $q.defer();				
				setAddressAndAccountSet(customerId).then (
					function (successResult) {
						$log.info('Updated customer : '+successResult);
						$scope.primaryContact = contactId;
						customerDO.accountSet = $scope.customerDO.accountSet;
						$scope.updateCustomer(customerDO); 
					}, function (errorResult) {									
						$log.error('error during updating customer : '+errorResult);
				});
				$log.info(defer);
			};
			
			/**
			 * Updating a customer
			 * @param: customerDO
			 */
			$scope.updateCustomer = function (customerDO) {
				//Setting customer data
				$scope.customerDO.userName = customerDO.email;
				$scope.customerDO.guest = false;
				customerDO.id = dataStorageService.getCustomerId();
				//updating current customer
				accountService.updateCustomer(dataStorageService.getCustomerId(), customerDO).then(
					function (successResult) {
						$log.info('Customer with customerID: ' +
						dataStorageService.getCustomerId()  + ' is successfully updated ' + successResult);
						//update contact
						if ($scope.primaryContact) {
							accountService.getContactById($scope.primaryContact)
								.then(
								function (successResult) {
									var contactJSON = prepareContactDetail(customerDO);
									accountService.updateContact(dataStorageService.getCustomerId(),
										$scope.primaryContact, contactJSON).then(
										function (successResult) {
											$location.path('/basket');
											// Reload basket
											$scope.$emit('reloadBasket');
											// Hide customer search modal.
											$scope.closeProfileInformationModal();
											$log.info(successResult);
											appService.deactivateSpinner();
										}, function (errorResult) {
											$scope.showServerError(errorResult);
											$log.error('Contact with ContactID: ' +
											$scope.primaryContact  + ' is not updated ' +
											errorResult.data.errorMessage);
											appService.deactivateSpinner();
										});
									$log.info(successResult);
								}, function (errorResult) {	
									$scope.showServerError(errorResult);
									$log.error('Contact with ContactID: ' +
									$scope.primaryContact  + ' is not updated ' + errorResult.data.errorMessage);
									appService.deactivateSpinner();
								}); 
						} else {
							appService.deactivateSpinner();
						}
					}, function (errorResult) {
						appService.deactivateSpinner();
						$scope.showServerError(errorResult);
					});
			};

			$scope.showServerError = function(errorResult) {
				var errorMessage = errorResult.data.errorMessage;
				var msg = '';  var serverMsg = '';
				if (errorResult.data.responseCode === '422' ||
					errorResult.data.responseCode === '409') {
					for (var key in errorMessage) {
						if(errorMessage[key] !== '') {
							serverMsg = errorMessage[key].toString().trim();
							if (serverMsg.lastIndexOf('.') === serverMsg.length - 1) {
								// Full stop already received from server, dont append
								msg += serverMsg + ' ';
							} else {
								// Full stop NOT received from server, append full stop
								msg += serverMsg + '. ';
							}
						}
					}
					$scope.showMessageAndFocus(msg);
				}
			};

			/**
			 * Saving a customer
			 * @param: customerDO
			 */
			$scope.saveCustomer = function (customerDO) {
				//Updating customer if this is called from update
				if ($scope.fromPage === 'update') { 
					$scope.updateCustomer(customerDO);
					return;
				}
				//Setting customer data
				$scope.customerDO.userName = customerDO.email;
				$scope.customerDO.guest = false;
				//To-Do
				$scope.customerDO.accountSet = '1';
				//updating current customer
				accountService.createCustomer(customerDO).then(
					function (successResult) {
						var customerId = getCustomerIdFromCustomerURI(successResult.data);
						//Creating contact
						if (successResult) {
							var contactJSON = prepareContactDetail(customerDO);
							contactJSON.primary = true;
							accountService.createContact(customerId, contactJSON).then(
								function (successResult) {
									var storeId = dataStorageService.getStore().id;
									var csrId = dataStorageService.getLoggedInCSR().id;
									var phone = customerDO.phoneNumber;
									//Set newly created customer in dataStorageService
									dataStorageService.setCustomerId(customerId);
									newOrderService.startNewOrder (customerId, storeId, csrId, phone)
										.then(
										function (successResult) {
												// Navigate to basket page.
												$scope.$emit('reloadBasket');
												$location.path('/basket');
												appService.deactivateSpinner();
												$log.info(successResult);
												$scope.closeProfileInformationModal();
										}, function (errorResult) {
											appService.deactivateSpinner();
											$scope.showServerError(errorResult);
											$log.error('An error occured while starting new Order.' + errorResult);
										});
									$log.info(successResult);
								}, function (errorResult) {
									$scope.showServerError(errorResult);
									$log.error('Not able to create contact for customer ' +
										customerId + errorResult.data.errorMessage);
									appService.deactivateSpinner();
								});
								$log.info(successResult); 
						}
					}, function (errorResult) {
						$scope.showServerError(errorResult);
						appService.deactivateSpinner();
						$log.error(errorResult.data.errorMessage);
				});
			};
			
			/**
			 * Function to get CustomerId from customerURI
			 */
			function getCustomerIdFromCustomerURI (customerURI) {
				var position = customerURI.lastIndexOf('/');
				var customerId = customerURI.substring(position + 1, customerURI.length);
				return customerId;
			}

	}]);

}(window.angular));
;/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('customerSearchModalController',
		['$log', '$scope', '$location', 'dataStorageService', 'customerSearchService', 'appService',
		'basketService', 'newOrderService',

			function ($log, $scope, $location, dataStorageService, customerSearchService, appService,
				basketService, newOrderService) {

				$scope.customerSearchDataModel = {
					customerPhoneNumber : null,
					customerSearchResult : null
				};
				
				$scope.showPhoneNumberRequiredMessage = false;

				$scope.showInValidPhoneNumberMessage = false;

				$scope.showCustomerSearchModal = function () {
					angular.element('#customerSearchModal').modal('show');

					clearCustomerSearchData();

					angular.element('#customerPhoneNumber').focus();
					
					// PEBL-16348
					// Focus issue https://github.com/angular-ui/bootstrap/issues/2017
					// Adding plain JS for a work around
					document.getElementById('customerPhoneNumber').focus();
					angular.element('#customerPhoneNumber').select();

				};
				
				$scope.close = function () {
					clearCustomerSearchData();
					angular.element('#customerSearchModal').modal('hide');
				};

				$scope.cancel = function () {
					clearCustomerSearchData();
					angular.element('#customerSearchModal').modal('hide');
				};

				$scope.searchCustomer = function () {
					var isValid = true;

					if (!$scope.customerSearchDataModel.customerPhoneNumber) {
						isValid = false;
						$scope.showPhoneNumberRequiredMessage = true;
						$scope.showInValidPhoneNumberMessage = false;
						angular.element('#customerPhoneNumber').focus();
					} else if (!validateCustomerPhoneNumber($scope.customerSearchDataModel.customerPhoneNumber)) {
						isValid = false;
						$scope.showPhoneNumberRequiredMessage = false;
						$scope.showInValidPhoneNumberMessage = true;
						angular.element('#customerPhoneNumber').focus();
					}

					if (isValid) {
						if ($scope.customerSearchDataModel.customerPhoneNumber != null) {
							appService.activateSpinner();

							customerSearchService.searchCustomerByPhoneNumber(
								$scope.customerSearchDataModel.customerPhoneNumber)
								.then(
								function (successResult) {
									//removeGuestCustomer(successResult);
									if (successResult.data == null) {
										// If found 0 customer, it will start the 
										// basket with a phone number in a customer profile.
										// Customer provides phone number, sales associate 
										// enters and no record is found. Guest record is 
										// created with phone number only and 
										// store information for remaining required fields, 
										// and associated to the order. In this case, 
										// customer does not want to provide any further information.

										$scope.startNewOrder(null);
									} else if (successResult.data.length === 1) {
										// If found 1 customer, it will start the basket with customer's profile name.

										$scope.startNewOrder(successResult.data[0].id);
									} else if (successResult.data.length > 1) {
										// If found more than 1 customer, 
										// it will display customer list for the 
										// store associate to narrow down to a single customer.

										$scope.customerSearchDataModel.customerSearchResult = successResult;
										appService.deactivateSpinner();
									} else {
										appService.deactivateSpinner();
									}
								}, function (errorResult) {
									if (errorResult.data.responseCode === '404') {
										// If found 0 customer, it will start the 
										// basket with a phone number in a customer profile.
										// Customer provides phone number, sales associate 
										// enters and no record is found. Guest record is 
										// created with phone number only and 
										// store information for remaining required fields, 
										// and associated to the order. In this case, 
										// customer does not want to provide any further information.

										$scope.startNewOrder(null);
									} else {
										appService.deactivateSpinner();
									}
								});
						}
					}
				};


				/**
			* removes current customer from 
			**/
			/*function removeGuestCustomer (successResult) {
				for (var idx = 0;idx < successResult.data.length ; idx++) {
					// remove the customer record from the list if:
					// customer found is guest.
					if (successResult.data[idx].guest === true) {
						//alert('one');
						successResult.data.splice(idx, 1);
					}
				}
			}*/

				$scope.skipCustomerSearchAndStartNewOrder = function () {
					$scope.customerSearchDataModel.customerPhoneNumber = null;
					$scope.startNewOrder(null);
				};

				/**
				 * Start New Order.
                 *
				 * 1) Create Customer if not available.
				 * 2) Set Customer ID in storage.
				 * 3) Create Basket for Customer.
				 * 4) Set Basket ID in storage.
				 */
				$scope.startNewOrder = function (customerId) {
					var storeId = dataStorageService.getStore().id;

					var csrId = dataStorageService.getLoggedInCSR().id;

					var phone = $scope.customerSearchDataModel.customerPhoneNumber;
					if (!phone) {
						phone = '';
					}

					newOrderService.startNewOrder(customerId, storeId, csrId, phone)
						.then(
						function (successResult) {
							appService.deactivateSpinner();

							if (successResult) {
								$log.debug('New Order Response : ' + angular.toJson(successResult));

								// Clear customer search data
								clearCustomerSearchData();

								// Hide customer search modal.
								angular.element('#customerSearchModal').modal('hide');

								// Navigate to basket page.
								$location.path('/basket');
							}
						}, function (errorResult) {
							appService.deactivateSpinner();

							$log.error('An error occured while starting new Order.' + errorResult);
						});
				};

				$scope.searchAgain = function () {
					clearCustomerSearchData();
				};

				function validateCustomerPhoneNumber (customerPhoneNumber) {
					if (!customerPhoneNumber) {
						return false;
					} 

					var isPhoneNumberRegularExpression = /^\d{10}$/;
					return String(customerPhoneNumber).search(isPhoneNumberRegularExpression) !== -1;
				}

				/**
				 * Clears customer search data.
				 */
				function clearCustomerSearchData () {
					$scope.customerSearchDataModel = {
						customerPhoneNumber : null,
						customerSearchResult : null
					};
					$scope.showPhoneNumberRequiredMessage = false;
					$scope.showInValidPhoneNumberMessage = false;
				}
			}]);

			angular.module('pointOfSaleApplication').directive('showFocus', ['$timeout', function ($timeout) {
				return function(scope, element, attrs) {
					scope.$watch(attrs.showFocus, 
						function (newValue) {
							$timeout(function() {
								if (newValue) {
									element.focus();
								}
							});
						}, true);
				};    
			}]);
}(window.angular));
;/*! DashboardController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('dashboardController',
        ['$scope', '$log','dataStorageService',
            function ($scope, $log, dataStorageService) {

                $scope.init = function () {
                    $log.debug('dashboardController: init');

                    $scope.basketId = dataStorageService.getBasketId();
                    $scope.storeId = dataStorageService.getStoreId();
                    $scope.loggedInCSR = dataStorageService.getLoggedInCSR();

                    $scope.skuBarcodeSearchPostData = {
                        basketId: $scope.basketId || null,
                        csrId: $scope.loggedInCSR.id || null,
                        storeId: $scope.storeId || null
                    };

                    $log.debug('basketId: ' + $scope.basketId);
                };

                $scope.scanSuccessHandler = function () {
                    var saveBasketsScope = angular.element('.ml-ppos-dashboard-saved-bag-widget-content')
                        .find('div:first').scope();

                    if (saveBasketsScope) {
                        saveBasketsScope.initializeSavedBasketsDataModel();
                    }
                };

                $scope.init();
            }]);
}(window.angular));
;/*! EmailSignupController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('emailSignupController',
        ['$log', '$scope', '$translate', 'ancillaryService', 'globalValidationService',
		function ($log, $scope, $translate, ancillaryService, globalValidationService) {

			$scope.emailSignupDataModel = {
				hasValidationErrors : false,
				validationErrors : [],
				email : '',
				firstName : '',
				lastName : ''
			};

			$scope.initializeEmailSignupDataModel = function () {
				$scope.emailSignupDataModel.hasValidationErrors = false;
				$scope.emailSignupDataModel.validationErrors = [];
				$scope.emailSignupDataModel.email = '';
				$scope.emailSignupDataModel.firstName = '';
				$scope.emailSignupDataModel.lastName = '';
			};

			$scope.emailSignup = function () {
				// Assume there are no validation errors.
				$scope.emailSignupDataModel.hasValidationErrors = false;
				$scope.emailSignupDataModel.validationErrors = [];

				var isValid = $scope.validateEmailSignupFields();

				if (isValid) {
					var emailSignup = {
						email : $scope.emailSignupDataModel.email,
						firstName : $scope.emailSignupDataModel.firstName,
						lastName : $scope.emailSignupDataModel.lastName
					};
					
					ancillaryService.emailSignup(emailSignup)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.initializeEmailSignupDataModel();

								angular.element('#emailSignupSuccessModal').modal('show');
							}
						}, function (errorResult) {
							$log.error(errorResult);

							if (errorResult.data.responseCode === '422') {
								$scope.emailSignupDataModel.hasValidationErrors = true;

								var errorMessageObj = errorResult.data.errorMessage;

								// Here, 'property' is field name.
								for (var property in errorMessageObj) {
									if (errorMessageObj.hasOwnProperty(property)) {

										var errorMessagesByField = errorMessageObj[property];

										for (var i = 0; i < errorMessagesByField.length; i++) {
											$scope.emailSignupDataModel.validationErrors.push(
												property + ' - ' + errorMessagesByField[i]);
										}

									}
								}
								
								angular.element('#emailSignupErrorModal').modal('show');
							}
						});
				} else {
					$scope.emailSignupDataModel.hasValidationErrors = true;

					angular.element('#emailSignupErrorModal').modal('show');
				}
			};

			$scope.validateEmailSignupFields = function () {
				var hasValidationErrors = false;

				// Email validation.
				if (angular.element('#emailId').hasClass('ng-invalid-email')) {
					// TODO: This is a hack... PEBL-15808

					// Invalid email format as per HTML5 and AngularJS.
					hasValidationErrors = true;
					
					$translate('msg.ppos.invalidEmail').
						then(function (invalidEmailMessage) {
							$scope.emailSignupDataModel.validationErrors.push(invalidEmailMessage);
						});
				} else if ($scope.emailSignupDataModel.email) {
					if (!globalValidationService.isEmailValid($scope.emailSignupDataModel.email)) {
						// Invalid email format as per MarketLive client side validation.
						hasValidationErrors = true;

						$translate('msg.ppos.invalidEmail').
							then(function (invalidEmailMessage) {
								$scope.emailSignupDataModel.validationErrors.push(invalidEmailMessage);
							});
					}
				} else if (!$scope.emailSignupDataModel.email) {
					hasValidationErrors = true;

					$translate('lbl.ppos.email').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (emailRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(emailRequiredMessage);
								});
						});
				}

				// First name validation - required.
				if (!$scope.emailSignupDataModel.firstName) {
					hasValidationErrors = true;

					$translate('lbl.ppos.firstName').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (firstNameRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(firstNameRequiredMessage);
								});
						});
				}

				// Last name validation - required.
				if (!$scope.emailSignupDataModel.lastName) {
					hasValidationErrors = true;

					$translate('lbl.ppos.lastName').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (lastNameRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(lastNameRequiredMessage);
								});
						});
				}

				if (hasValidationErrors) {
					$scope.emailSignupDataModel.hasValidationErrors = true;
					return false;
				} else {
					return true;
				}
			};

			// Initialize model for view.
			$scope.initializeEmailSignupDataModel();
        }]);
}(window.angular));
;/*! HomeController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('homeController', 
		['$scope', '$location', 'dataStorageService',
		function ($scope, $location, dataStorageService) {

			/**
			 * Model object for home page.
			 */
			$scope.homePageDataModel = {
				storeName : '',
				storeCode : ''
			};
			
			$scope.initializeHomePageDataModel = function () {
				$scope.homePageDataModel.storeName = dataStorageService.getStoreName();
				$scope.homePageDataModel.storeCode = dataStorageService.getStoreCode();
			};
			
			$scope.changeStore = function () {
				$location.path('/provisioning/').search({action: 'changeStore'});
			};

			$scope.initializeHomePageDataModel();
		}]);
}(window.angular));
;/*! InStorePickupOrdersController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('inStorePickupOrderShipmentsController',
        ['$log', '$scope', '$location', 'dataStorageService', 'orderService',
			'csrService', 'receiptService','appService',
		function ($log, $scope, $location, dataStorageService, orderService, csrService, receiptService, appService) {
			
			$scope.inStorePickupOrderShipmentsDataModel = {
			};

			$scope.groupBySkuDataModel = {
			};

			$scope.currentSortParam = '';

			$scope.noteMaxLength = 1000;

			$scope.activeCSRs = [];

			$scope.inStorePickupHeaderDataModel = {
				pickupNewOrderShipmentsState : 0,
				pickupInProcessOrderShipmentsState : 0,
				pickupReadyOrderShipmentsState : 0,
				pickupDoneOrderShipmentsState : 0
			};
			
			/**
			 * Initialize model for view.
			 */
			$scope.initializeInStorePickupOrderShipmentsDataModel = function (sortParam) {
				appService.activateSpinner();

				if (sortParam) {
					$scope.currentSortParam = sortParam;
				} else {
					// Default sort parameter
					$scope.currentSortParam = 'orderDate';
				}

				$scope.initializeInStorePickupHeaderDataModel();

				$scope.initializeActiveCSRs();

				if ($scope.currentSortParam === 'itemSKUNumber') {
					orderService.groupBySku(dataStorageService.getStoreId())
						.then(
						function (successResult) {
							if (successResult) {
								$scope.groupBySkuDataModel = successResult.data;
							}
							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							appService.deactivateSpinner();
						});
				} else {
					orderService.getInStorePickupOrderShipments(dataStorageService.getStoreId(), sortParam)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.inStorePickupOrderShipmentsDataModel = successResult.data;

								if ($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess) {
									angular.forEach($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess, 
										function (pickupInProcessOrderShipment) {
											pickupInProcessOrderShipment.canMoveToPickupReady = 
												$scope.canMoveToPickupReady(pickupInProcessOrderShipment);
									});
								}

								if ($scope.inStorePickupOrderShipmentsDataModel.PickupReady) {
									angular.forEach($scope.inStorePickupOrderShipmentsDataModel.PickupReady, 
										function (pickupReadyOrderShipment) {
											pickupReadyOrderShipment.noteTextToAdd = '';
									});
								}
							}

							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							appService.deactivateSpinner();
						});
				}
			};

			$scope.initializeInStorePickupHeaderDataModel = function () {
				var currentUrlPath = $location.path();

				if (currentUrlPath === '/pickupNewOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupInProcessOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupReadyOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 1;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				} else if (currentUrlPath === '/pickupDoneOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 1;
				} else if (currentUrlPath === '/inStorePickupOrderShipments') {
					$scope.inStorePickupHeaderDataModel.pickupNewOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState = 0;
					$scope.inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState = 0;
				}
			};

			$scope.initializeActiveCSRs = function () {
				csrService.getActiveCSRs()
					.then(
					function (successResult) {
						if (successResult) {
							var activeCSRs = successResult.data;

							$scope.activeCSRs = [];

							var loggedInCSR = dataStorageService.getLoggedInCSR();

							// Only Store Managers and Admin can assign to other CSR's
							if ((loggedInCSR.typePPOS === 'Store Manager') || 
								(loggedInCSR.typePPOS === 'Admin')) {

								if (activeCSRs) {
									angular.forEach(activeCSRs, function (activeCSR) {
										if (activeCSR.permissions) {
											angular.forEach(activeCSR.permissions, function (csrPermission) {
												if (csrPermission.code === 'INSTORE_PICKUP') {
													$scope.activeCSRs.push(activeCSR);
												}
											});
										}
									});
								}
							}
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.viewOrderDetail = function (orderId) {
				// Navigate to order detail page.
				$location.url('/orderDetail?orderId=' + orderId);
			};

			$scope.toggleIcon = function (shipmentId) {
				var elmt = angular.element('#arrow_'+shipmentId);
				if(elmt.hasClass('ml-ppos-arrow-down')) {
					elmt.addClass('ml-ppos-arrow-up');
					elmt.removeClass('ml-ppos-arrow-down');
					document.getElementById('orderShipmentDetail_'+shipmentId).style.display = 'block';
				} else {
					elmt.addClass('ml-ppos-arrow-down');
					elmt.removeClass('ml-ppos-arrow-up');
					document.getElementById('orderShipmentDetail_'+shipmentId).style.display = 'none';
				}
			};

			$scope.sortInStorePickupOrderShipmentsDataModel = function (sortParam) {
				$scope.initializeInStorePickupOrderShipmentsDataModel(sortParam);
				if(angular.element('#lstSortByMenu').hasClass('open')) {
					angular.element('#lstSortByMenu').removeClass('open');
				}
			};

			$scope.canMoveToPickupReady = function (pickupInProcessOrderShipment) {
				var canMoveToPickupReady = false;

				var loggedInCSR = dataStorageService.getLoggedInCSR();

				if (pickupInProcessOrderShipment) {
					if ((pickupInProcessOrderShipment.CSR.id === loggedInCSR.id) || 
						(loggedInCSR.typePPOS === 'Store Manager') || 
						(loggedInCSR.typePPOS === 'Admin')) {

						canMoveToPickupReady = true;
					}
				}

				return canMoveToPickupReady;
			};

			$scope.associateCSRtoShipment = function (csrId, orderId, orderShipmentId) {
				orderService.associateCSRtoShipment(csrId, orderId, orderShipmentId)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.moveToPickupInProcessState = function (orderId, orderShipmentId) {
				orderService.moveToPickupInProcessState(orderId, orderShipmentId, dataStorageService.getStoreId())
					.then(
					function (successResult) {
						if (successResult) {
							var loggedInCSR = dataStorageService.getLoggedInCSR();

							$scope.associateCSRtoShipment(loggedInCSR.id, orderId, orderShipmentId);

							//$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.moveToPickupReadyState = function (orderId, orderShipmentId) {
				orderService.moveToPickupReadyState(orderId, orderShipmentId, dataStorageService.getStoreId())
					.then(
					function (successResult) {
						if (successResult) {
							receiptService.emailPickupReady(
								orderId, dataStorageService.getStoreId(), dataStorageService.getLoggedInCSR().id)
								.then(
								function (emailPickupReadySuccessResult) {
									if (emailPickupReadySuccessResult) {
										$scope.initializeInStorePickupOrderShipmentsDataModel();
									}
								}, function (emailPickupReadyErrorResult) {
									$log.error(emailPickupReadyErrorResult);
									$scope.initializeInStorePickupOrderShipmentsDataModel();
								});
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			$scope.addShipmentNoteForPickup = function (orderId, orderShipmentId, customerId, noteText) {
				var noteToAdd = {
					'noteType' : 'ORDER_SHIPMENT_NOTE',
					'csrID' : dataStorageService.getLoggedInCSR().id,
					'customerID' : customerId,
					'orderID' : orderId,
					'orderShipmentID' : orderShipmentId,
					'processName' : 'InStorePickup',
					'subProcessName' : 'PickupReady',
					'note' : noteText
				};
				
				orderService.addShipmentNoteForPickup(orderId, orderShipmentId, noteToAdd)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			// Edit Note - Phase 2
			/*$scope.editShipmentNoteForPickup = function (orderId, orderShipmentId, customerId, noteId, noteText) {
				var noteToEdit = {
					'noteType' : 'ORDER_SHIPMENT_NOTE',
					'csrID' : dataStorageService.getLoggedInCSR().id,
					'customerID' : customerId,
					'orderID' : orderId,
					'orderShipmentID' : orderShipmentId,
					'processName' : 'InStorePickup',
					'subProcessName' : 'PickupReady',
					'note' : noteText
				};
				
				orderService.editShipmentNoteForPickup(orderId, orderShipmentId, noteId, noteToEdit)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.initializeInStorePickupOrderShipmentsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};*/

			/*$scope.reset = function () {
				for (var i = 0; i < $scope.inStorePickupOrderShipmentsDataModel.Ordered.length; i++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.Ordered[i]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.Ordered[i].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.Ordered[i].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var j = 0; j < $scope.inStorePickupOrderShipmentsDataModel.PickupInProcess.length; j++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.PickupInProcess[j].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var k = 0; k < $scope.inStorePickupOrderShipmentsDataModel.PickupReady.length; k++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.PickupReady[k]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.PickupReady[k].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.PickupReady[k].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}

				for (var l = 0; l < $scope.inStorePickupOrderShipmentsDataModel.Shipped.length; l++) {
					$log.debug($scope.inStorePickupOrderShipmentsDataModel.Shipped[l]);

					orderService.reset(
						$scope.inStorePickupOrderShipmentsDataModel.Shipped[l].order.id, 
						$scope.inStorePickupOrderShipmentsDataModel.Shipped[l].id, 
						dataStorageService.getStoreId(),
						'ORDERED');
				}
			};*/
			
			// Toggle Arrow
			$scope.toggleChevron = function (e) {
				//angular.element
				angular.element(e.target)
				.prev('.panel-heading')
				.find('i.ml-ppos-mini-white-icon, i.ml-ppos-mini-grey-icon')
				.toggleClass('ml-ppos-arrow-up ml-ppos-arrow-down');
					angular.element(e.target).prev('.panel-heading').toggleClass('');
				};
				angular.element('#accordion').on('hidden.bs.collapse', $scope.toggleChevron);
				angular.element('#accordion').on('shown.bs.collapse', $scope.toggleChevron);
			
			// Initialize model for view.
			$scope.initializeInStorePickupOrderShipmentsDataModel();
        }]);
}(window.angular));
;/*! LoginController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('loginController',
		['$scope', '$location', '$log', '$q', 'dataStorageService', 'securityService',
			'csrService', 'configService', 'storeService', 'redirectBridgeService', 'starPrinter', 'appService',

			function ($scope, $location, $log, $q, dataStorageService, securityService,
				csrService, configService, storeService, redirectBridgeService, starPrinter, appService) {

				$scope.userCredentials = {
					loginId : null,
					password : null
				};

				$scope.showLoginFailureMessage = false;

				$scope.loginFailureMessage = null;

				/**
				 * Performs user login.
				 */
				$scope.login = function (userCredentials) {
					var isValid = validateUserCredentials(userCredentials);

					if (isValid) {
						appService.activateSpinner();

                        var getTokenPromise = securityService.getToken(userCredentials);

						getTokenPromise.then(
							function (successResult) {
								// CSR authenticated successfully.
								
								dataStorageService.setAccessToken(successResult.data['access_token']);
								dataStorageService.setRefreshToken(successResult.data['refresh_token']);
								dataStorageService.setLoggedIn('true');

								// Step 1 : Get logged in CSR details by email.
								csrService.getCSRByEmail(userCredentials.loginId)
									.then(
									function (successResult) {
										dataStorageService.setLoggedInCSR(successResult.data);

										// Step 2 : Get configurations and resources.
										configService.init()
											.then(
											function () {
												// Step 3 : Get store details by store code.
												var storeCode = dataStorageService.getStoreCode();

												storeService.getStoreByCode(storeCode)
													.then(
													function (successResult) {
														var store = successResult.data,
															assetUrl = configService.
																getConfig('app.ppos.remote_asset_url');
														dataStorageService.setStore(store);

														dataStorageService.setRemoteAssetUrl(assetUrl);

                                                        starPrinter.uploadVendorImage(
                                                            dataStorageService.getRemoteAssetUrl()+
                                                            '/images/','app-logo-print.png');

														// Fire login event back upwards using $scope.$emit
														$scope.$emit('login');

														dataStorageService.setScreenLocked('false');

														// Fire screen unlocked event back upwards using $scope.$emit
														$scope.$emit('screenUnlocked');

														if (!assetUrl || assetUrl.length === 0) {
															clearUserCredentials();
														}

														redirectBridgeService.goTo('/dashboard');
													}, function (errorResult) {
														$log.error('Error finding store by code : ' + storeCode);
														$log.error(angular.toJson(errorResult));

														dataStorageService.setUrlBase('');
														dataStorageService.setStoreCode('');

														appService.deactivateSpinner();
														$location.path('/provisioning');
													});
											}, function (errorResult) {
												$log.error('Error loading configurations and resources');
												$log.error(angular.toJson(errorResult));
											});
									}, function (errorResult) {
										$log.error('Error finding CSR by email : ' + userCredentials.loginId);
										$log.error(angular.toJson(errorResult));
									});
                            }, function (errorResult) {
								appService.deactivateSpinner();

								if (!errorResult.data || !errorResult.data.responseCode) {
									// Invalid server url...

									dataStorageService.setUrlBase('');
									dataStorageService.setStoreCode('');

									$location.path('/provisioning');
								} else if (errorResult.data.responseCode === '422') {
									// Invalid credentials...

									$log.error('Error while login - Invalid username/password');

									$scope.showLoginFailureMessage = true;

									$scope.loginFailureMessage = 'err.ppos.login.invalidUsernamePassword';

									$scope.userCredentials = {
										loginId : null,
										password : null
									};
									
									angular.element('#loginId').focus();
								}
							});
					}
				};

				/**
				 * Validates user credentials.
				 */
				function validateUserCredentials (userCredentials) {
					if (!userCredentials.loginId) {
						$scope.showLoginFailureMessage = true;
						$scope.loginFailureMessage = 'err.ppos.login.username.required';
						angular.element('#loginId').focus();
						return false;
					} else if (!userCredentials.password) {
						$scope.showLoginFailureMessage = true;
						$scope.loginFailureMessage = 'err.ppos.login.password.required';
						angular.element('#password').focus();
						return false;
					}

					return true;
				}

				/**
				 * Clears user credentials.
				 */
				function clearUserCredentials () {
					$scope.userCredentials = {
						loginId : null,
						password : null
					};
					
					$scope.showLoginFailureMessage = false;
				}

				angular.element('#loginId').focus();
			}]);
}(window.angular));
;/*! LoginController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('logoutController',
		['$scope', '$location', 'dataStorageService', 'securityService', 'redirectBridgeService',

			function ($scope, $location, dataStorageService, securityService, redirectBridgeService) {
			
				/**
				 * Logs out the user.
				 */
				$scope.logout = function () {
					var terminateTokenPromise = securityService.terminateToken();

					terminateTokenPromise.then(
						function (successResult) {
							if (successResult) {
								dataStorageService.setLoggedIn('false');

								dataStorageService.setLoggedInCSR(null);

								dataStorageService.setScreenLocked('false');

								dataStorageService.setAccessToken('');
								
								dataStorageService.setRefreshToken('');
								
								dataStorageService.setCustomerId('');

								dataStorageService.setBasketId('');

								dataStorageService.setLoggedInUsersPosSettings('');

								dataStorageService.setProperties('resources', null);

								// Fire logout event back upwards using $scope.$emit
								$scope.$emit('logout');

                                redirectBridgeService.goTo('/home');
							}
						}, function (errorResult) {
							console.log(errorResult);
						});
				};
			}]);
}(window.angular));
;/*! ManagementController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('managementController', 
		['$scope',  'dataStorageService', 'csrService', '$location',
		function ($scope, dataStorageService, csrService, $location) {

			$scope.init = function () {
				var loggedInCSR = dataStorageService.getLoggedInCSR();
				csrService.getCSRByEmail(loggedInCSR.email).then(
					function (successResult) {
						var permissionList = successResult.data.permissions;
						for (var idx = 0; idx < permissionList.length; idx++) {
							if (permissionList[idx].code === 'ADD_EDIT_CSR') {
								$scope.managementDataModel.isUserCanAddEmp = true;
								$scope.managementDataModel.isUserCanListEmp = true;
								break;
							}
						}
					}, function (errorResult) {
						console.log('ErrorResult - An error occurred while fetching CSR : ' + errorResult);
					}
				);
				// following is true for all
				$scope.managementDataModel.isUserCanDoPosSettings = true;
			};

			/**
			Method to move to Add CSR screen
			*/
			$scope.goToCsrAddScreen = function () {
				$location.path('/csrAdd');
			};

			/**
			Method to move to POS Settings screen
			*/
			$scope.goToPposSettingsScreen = function () {
				$location.path('/posSettings');
			};

			$scope.goToCsrListScreen = function () {
				$location.path('/csrList');
			};

			$scope.managementDataModel = {
				isUserCanSearchEmp : false,
				isUserCanAddEmp : false,
				isUserCanListEmp : false,
				isUserCanDoPosSettings : false,
				isUserCanDoPaymentSettings : false,
				isUserCanViewSaleSettlement : false,
				isUserCanViewOrderReturn : false,
				isUserCanViewOrderTransaction : false,
				isUserCanViewShipmentStatus : false,
				isUserCanViewEmpActivity : false,
			};
		
			$scope.init();

		}]);
}(window.angular));
;/*jshint bitwise: false*/
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('orderConfirmationModalController',
        ['$scope', '$location', 'dataStorageService', 'orderService',

            function ($scope, $location, dataStorageService, orderService) {

                $scope.orderConfirmationDataModel = {
                    deviceName: '',
                    printSelected: false,
                    emailSelected: false ,
                    showMessage: false
                };


                $scope.$on('order-confirm',function(x, y){
                    $scope.showConfirmModal(y);
                });



                $scope.showConfirmModal = function (data) {
                    $scope.orderConfirmationDataModel.printSelected = data.printSelected;
                    $scope.orderConfirmationDataModel.deviceName = data.deviceName;
                    $scope.orderConfirmationDataModel.emailSelected = data.emailSelected;

                    if( !$scope.orderConfirmationDataModel.emailSelected &&
						!$scope.orderConfirmationDataModel.printSelected) {
                        $scope.orderConfirmationDataModel.showMessage = true;
                    }
                    $scope.orderConfirmationDataModel.email = data.email;

                   orderService.getOrderById(data.orderId).then(
                      function(result){
                          $scope.orderConfirmationDataModel.orderid = result.data.code;
                          angular.element('#orderConfirmationtModal').modal('show');

                          dataStorageService.removeItem('customerId');
                      }
                    );



                };

                $scope.close = function () {
                    angular.element('#orderConfirmationtModal').modal('hide');
                    $location.path('/dashboard');


                    //TODO cleanup we shouldnt have to do this - would also be better in the directive
                    angular.element(angular.element('.modal-backdrop')[0].remove());


                };





            }]);



}(window.angular));
;/*! OrderDetailController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('orderDetailController',
        ['$log', '$scope', '$routeParams', 'orderService', 'dataStorageService',
		function ($log, $scope, $routeParams, orderService, dataStorageService) {
			
			$scope.orderDetailDataModel = {
			};

			$scope.orderShipmentDataModel = [];

			$scope.orderPickupDataModel = [];

			$scope.thisStore = dataStorageService.getStore();

			/**
			 * Initialize model for view.
			 */
			$scope.initializeOrderDetailDataModel = function () {
				// Get order data
				orderService.getOrderById($routeParams.orderId)
					.then(
					function (successResult) {
						$scope.orderDetailDataModel = successResult.data;

						var shipment;
						var i = 0;
						var	j = 0; 
						for (var idx = 0; idx < successResult.data.shipments.length; idx++) {
							shipment = successResult.data.shipments[idx];
							if	(shipment.isPickupFromStore === true) {
								$scope.orderPickupDataModel[i] = shipment;

								// PEBL-16312 This code is for PPOS phase 1 only.
								// There is no pattern for order status. See IOrderManager.OrderStatus enum
								// You will find space, underscore, etc..
								// In the next release we will make these statuses localized as well.
								if ($scope.orderPickupDataModel[i].status) {
									if ($scope.orderPickupDataModel[i].status === 'PickupInProcess') {
										$scope.orderPickupDataModel[i].status = 'Pickup In Process';
									} else if ($scope.orderPickupDataModel[i].status === 'PickupReady') {
										$scope.orderPickupDataModel[i].status = 'Pickup Ready';
									}
								}

								i++;
							} else if (shipment.isPickupFromStore === false) {
								$scope.orderShipmentDataModel[j] = shipment;
								j++;
							}
						}
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};
			
			// Toggle Arrow
			$scope.toggleChevron = function (e) {
				//angular.element
				angular.element(e.target)
				.prev('.panel-heading')
				.find('i.ml-ppos-mini-white-icon, i.ml-ppos-mini-grey-icon')
				.toggleClass('ml-ppos-arrow-up ml-ppos-arrow-down');
				angular.element(e.target).prev('.panel-heading').toggleClass('');
			};
			angular.element('#accordion').on('hidden.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion').on('shown.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion1').on('hidden.bs.collapse', $scope.toggleChevron);
			angular.element('#accordion1').on('shown.bs.collapse', $scope.toggleChevron);

			// Initialize model for view.
			$scope.initializeOrderDetailDataModel();
        }]);
}(window.angular));
;/*! OrderSearchModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('orderSearchModalController',
		['$log', '$scope', '$location', '$translate', 'orderService', 'appService',
		function ($log, $scope, $location, $translate, orderService, appService) {

			/**
			 * Model object for order search modal.
			 */
			$scope.orderSearchDataModel = {
				orderCode : null,
				showOrderSearchError : false,
				orderSearchErrorMessage : null
			};
			
			/**
			 * Clears order search data.
			 */
			$scope.clearOrderSearchData = function () {
				$scope.orderSearchDataModel.orderCode = null;
				$scope.orderSearchDataModel.showOrderSearchError = false;
				$scope.orderSearchDataModel.orderSearchErrorMessage = null;
			};

			/**
			 * Close order search modal.
			 */
			$scope.closeOrderSearchModal = function () {
				$scope.clearOrderSearchData();
			};

			/**
			 * Search order by code.
			 */
			$scope.searchOrderByCode = function () {
				if (!$scope.orderSearchDataModel.orderCode) {
					// Show error message.
					$scope.orderSearchDataModel.showOrderSearchError = true;

					$translate('msg.ppos.orderNumberRequired', { minLength : 3 })
						.then(function (orderNumberRequired) {
							$scope.orderSearchDataModel.orderSearchErrorMessage = orderNumberRequired;
						});

					angular.element('#orderCode').focus();
				} else {
					appService.activateSpinner();

					orderService.getOrderByCode($scope.orderSearchDataModel.orderCode)
						.then(
						function (successResult) {
							appService.deactivateSpinner();

							// Hide order search modal.
							angular.element('#orderSearchModal').modal('hide');
						
							// Navigate to order detail page.
							$location.url('/orderDetail?orderId=' + successResult.data[0].id);
						}, function (errorResult) {
							appService.deactivateSpinner();

							if (errorResult.data.responseCode === '404' ||
									errorResult.data.responseCode === '400') {
								// Zero orders.
								// Show error message.
								$scope.orderSearchDataModel.showOrderSearchError = true;

								$translate('msg.ppos.orderNotFound', 
									{ orderCode : $scope.orderSearchDataModel.orderCode })
									.then(function (orderNotFound) {
										$scope.orderSearchDataModel.orderSearchErrorMessage = orderNotFound;
									});

								angular.element('#orderCode').focus();
							}
						});
				}
			};
		}]);
}(window.angular));
;/*! POSSettingsController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('posSettingsController', 
		['$scope', 'settingsService' , '$log', '$location', 'dataStorageService', '$translate', 'nearByStoresService',
		function ($scope, settingsService, $log, $location, dataStorageService, $translate, nearByStoresService) {

			$scope.posSettingsModel = {
				timeoutArray : [],
				radiusArray : [],
				userSetTimeout : '',
				userSetRadius : '',
				storeLocation : '',
				showMessage : false,
				message : ''
			};

			$scope.init = function () {
				$scope.posSettingsModel.radiusArray = nearByStoresService.getRadiusArray();
				$scope.posSettingsModel.timeoutArray = settingsService.getTimeoutArray();
				var storeDetails = dataStorageService.getStore();
				$scope.posSettingsModel.storeLocation = storeDetails.name + ', ' +
					 storeDetails.street1 +  ', ' + storeDetails.city +  ', ' + storeDetails.state +
					 ' '  +  ' ' + storeDetails.zipCode;
				var userPosSettings = dataStorageService.getLoggedInUsersPosSettings();
				if (userPosSettings === null || userPosSettings === '') { // User coming to this screen for first time
					$scope.posSettingsModel.userSetTimeout = $scope.posSettingsModel.timeoutArray[0];
					$scope.posSettingsModel.userSetRadius = $scope.posSettingsModel.radiusArray[0];
					var userPosSettingsJson = {
						'userSetRadius' : $scope.posSettingsModel.userSetRadius,
						'userSetTimeout' : $scope.posSettingsModel.userSetTimeout
					};
					dataStorageService.setLoggedInUsersPosSettings(userPosSettingsJson);
				} else {
					$scope.posSettingsModel.userSetTimeout = userPosSettings.userSetTimeout;
					$scope.posSettingsModel.userSetRadius = userPosSettings.userSetRadius;
				}
			};

			/**
			Method to move to management screen
			*/
			$scope.goToManagementScreen = function () {
				$location.path('/management');
			};

			/**
			This method accepts a resource path,
			it displays the value of resource as a message.
			*/
			$scope.showMessage = function (msgPath) {
				$translate(msgPath).
				then(function (msg) {
					$scope.posSettingsModel.showMessage = true;
					$scope.posSettingsModel.message = msg;
				});
			};

			/**
			Method to save changes
			*/
			$scope.saveChanges = function (posSettingsModel) {
				// Clear the message banner first
				$scope.posSettingsModel.showMessage = false;
				$scope.posSettingsModel.message = '';
				var userPosSettings = {
					'userSetRadius' : posSettingsModel.userSetRadius,
					'userSetTimeout' : posSettingsModel.userSetTimeout
				};
				dataStorageService.setLoggedInUsersPosSettings(userPosSettings);
				$scope.showMessage('msg.ppos.posSettingsSaved');
				if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
					angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
					angular.element('#divMsgIconContainer').addClass('ml-icon-success');
				}
			};

			$scope.init();
		}]);
}(window.angular));
;/*! PaymentController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('paymentController',
        ['$log', '$scope', '$location', '$timeout', 'paymentService',
            'dataStorageService', 'basketService', 'starPrinter', 'appService',

            function ($log, $scope, $location, $timeout, paymentService,
                      dataStorageService, basketService, starPrinter, appService) {

                // Add the paymentService to the scope, so that it can be passed along to
                // the payment type directives
                $scope.paymentService = paymentService;

                $scope.selection = 'PAYMENT_SELECTION';

                /**
                 * The main model for this controller.
                 * @type {{
                 *      id: {(string|null)},
                 *      total: {(string|null)},
                 *      paymentTypes: {(object[]|null)},
                 *      payments: {(object|null)},
                 *      creditCard: {(object|null)},
                 *      cash: object,
                 *      signature: object,
                 *      lastSection: string
                 *      }}
                 */
                $scope.model = {
                    'id': null,
                    'total': null,
                    'paymentTypes': null,
                    'payments': {},
                    'creditCard': {},
                    'cash': {},
                    'signature': {},
                    'lastSection': '',
                    'orderInProgress': false,
                    'enableCashDrawer': true,
                    'authData': null
                };

                /**
                 * This function is used to display the payment modal.
                 * @param id The basket id.
                 * @param total The basket total
                 */
                $scope.showPaymentModal = function (id, total) {
                    appService.activateSpinner();

                    $scope.model.checkoutInProgress = false;
					// TODO : Remove shipping modal session storage in phase 2
					if (sessionStorage.showShippingModal === 'true') {
                        $timeout(function() {
                            angular.element('#hiddenOpener').trigger('click');
                        }, 0);
					} else {
						$log.debug('paymentController: showPaymentModal');

                        // make sure we clear out any possible remaining change values from previous payments
                        dataStorageService.removeItem('paymentChange');

						$scope.selection = 'PAYMENT_SELECTION';
						$scope.$broadcast('resetPaymentDisplay', null);

						$scope.orderPlaced = false;

						$scope.model.signature.penColor = 'rgb(255,255,255)';
						$scope.clearSignature();

						paymentService.getPayments().then(function (successResult) {
							var paymentTypes = successResult;

							$scope.model.id = id;
							$scope.model.total = total;
							$scope.model.paymentTypes = paymentTypes;
							$scope.model.payments = {};
							$scope.model.displayBalance = total;
							$scope.model.placeOrder = false;
							$scope.model.data = {};
                            $scope.model.authData = null;
							// TODO - remove in phase 2
							//Hit basketService to get updated total, 
							//total can change because of different shipping method
							basketService.getBasketById(dataStorageService.getBasketId())
							.then(
							function (successResult) {
								$scope.model.total = successResult.data.total;
								$scope.model.displayBalance = successResult.data.total;
								// TODO : In phase 2 this 'show' call will be out of this rest call
								// this call will not be required, as shipping modal will be per item
                                appService.deactivateSpinner();
                                angular.element('#paymentModal').modal('show');
							}, function (errorResult) {
                                $log.error(errorResult);
                                appService.deactivateSpinner();
							});
						}, function (errorResult) {
                            $log.error(errorResult);
                            appService.deactivateSpinner();
                        });
					}
                };

                /**
                 * This function is used by inline class selection 'ng-class' to determine what should be displayed.
                 * @returns {boolean}
                 */
                $scope.showDefaultLayout = function () {
                    var showDefaultLayout = true;

                    if ($scope.selection === 'SIGNATURE' || $scope.selection === 'CREDIT_CARD_SWIPE') {
                        showDefaultLayout = false;
                    }

                    return showDefaultLayout;
                };

                /**
                 * This function is used to select a view (*selection*) to display. It also sets the last view
                 * ('lastSection') displayed.
                 * @param type
                 */
                $scope.select = function (type) {
                    $log.debug('paymentController: select: ' + type);

                    $scope.model.lastSection = $scope.selection + '';
                    $scope.selection = type;
                    $scope.model.placeOrder = false;
                };

                /**
                 * This function is fired on click of the generic cancel button. It's used to preform cleanup
                 * operations and forward the user to the *PAYMENT_SELECTION* view.
                 */
                $scope.cancel = function () {
                    $log.debug('paymentController: cancel');
					
                    $scope.model.placeOrder = $scope.model.data.placeOrder;
                    $scope.clearSignature();
                    $scope.$broadcast('resetPaymentDisplay', $scope.selection);

                    $scope.selection = 'PAYMENT_SELECTION';

                };

                /**
                 * This function calls the *addPayment* service. All payments in the model's payments property are
                 * processed by this service call.
                 */
                $scope.addPayment = function () {
                    $log.debug('paymentController: addPayment');

                    paymentService.addPayment($scope.model.id, {'payments': _.toArray($scope.model.payments)}).then(
                        function (successResult) {
                            if (successResult) {

                                $scope.model.data = successResult.data;
                                $scope.model.displayBalance = $scope.model.data.displayBalance;
                                $scope.model.placeOrder = $scope.model.data.placeOrder;
                                if ($scope.model.placeOrder) {
                                    // Open the cash register on successfully adding/modifying a cash payment.
                                    if ($scope.model.enableCashDrawer &&
                                        $scope.selection === 'CASH' && $scope.model.payments['CASH']) {
                                        starPrinter.openCashDrawer();
                                    }

                                    if ($scope.model.data.change) {
                                        dataStorageService.setPaymentChange($scope.model.data.change);
                                    }

                                    appService.activateSpinner();

                                    $scope.basketCheckout();
                                } else {
                                    $scope.selection = 'PAYMENT_SELECTION';
                                }
                            }
                        }, function (errorResult) {
                            $log.error(errorResult.data);
                            $log.error(errorResult.data.errorMessage);
                        }
                    );
                };

                /**
                 * This function is fired on click of the generic 'Add Payment' button. It broadcasts a *processPayment*
                 * event for the current *selection* view to pickup and process (processPayment)
                 */
                $scope.apply = function () {
                    $log.debug('paymentController: apply');

                    $scope.$broadcast('processPayment', $scope.selection);
                };

                /**
                 * This function removes a payment, for the given payment code, from the model's *payments* property.
                 * @param code A payment code.
                 */
                $scope.removePayment = function (code) {
                    $log.debug('paymentController: removePayment');

                    delete $scope.model.payments[code];

                    $scope.$broadcast('resetPaymentDisplay', code);

                    $scope.selection = 'PAYMENT_SELECTION';

                    $scope.addPayment();
                };

                /**
                 * This function is used to call the basketCheckout service.
                 */
                $scope.basketCheckout = function () {
                    if ($scope.model.checkoutInProgress !== true){

                        $scope.model.checkoutInProgress = true;
                        $log.debug('paymentController: basketCheckout');
                        var store = dataStorageService.getStore();

                        paymentService.basketCheckout(store.id,
                            $scope.model.id, {'payments': _.toArray($scope.model.payments)}).then(
                            function (successResult) {
                                if (successResult) {
                                    $scope.orderPlaced = true;

                                    angular.element('#paymentModal').modal('hide');
                                    dataStorageService.removeItem('basketId');
                                    dataStorageService.setFinalizedOrderId($scope.parseOrderId(successResult.data));

                                    appService.deactivateSpinner();

                                    $scope.$emit('order');
                                }
                                $scope.model.checkoutInProgress = false;
                            }, function (errorResult) {
                                $scope.model.checkoutInProgress = false;
                                appService.deactivateSpinner();

                                $log.error(errorResult.data);
                                $log.error(errorResult.data.errorMessage);
                            }
                        );
                    }
                };

                /**
                 * This function is used to parse the order id from the *basketCheckout* service call.
                 * @param data The data returned from the *basketCheckout* service call.
                 * @returns {string} The order id.
                 */
                $scope.parseOrderId = function (data) {
                    $log.debug('paymentController: parseOrderId');

                    return data.substr(data.lastIndexOf('/') + 1);
                };

                /**
                 * This function is used to 1) clear any previous signature gathered and 2) switch to the
                 * signature view.
                 */
                $scope.captureSignature = function () {
                    $log.debug('paymentController: captureSignature');

                    $scope.clearSignature();
                    $scope.selection = 'SIGNATURE';
                };

                /**
                 * This function is used to clear the signature data in the model
                 */
                $scope.clearSignature = function () {
                    $log.debug('paymentController: clearSignature');

                    $scope.model.signature.clear();
                };

                /**
                 * This function is called on signature accept and fires a broadcast for the last directive's controller
                 * (lastSelection) to pick up and process (processPayment)
                 */
                $scope.acceptSignature = function () {
                    $log.debug('paymentController: acceptSignature');

                    var hasSignature = !$scope.model.signature.isEmpty();

                    if (hasSignature) {
                        $scope.$broadcast('processPayment', $scope.model.lastSection);
                    }
                };

                /**
                 * This function is called on clicking the cancel button on the signature screen.
                 */
                $scope.cancelSignature = function () {
                    $scope.releaseAuthorization();
                    $scope.cancel();
                };

                /**
                 * This function is used to release any *authorized* payments and
                 * is called when the payment dialog is canceled.
                 */
                $scope.releaseAuthorization = function () {
                    $log.debug('paymentController: releaseAuthorization');

                    // Only continue if we have auth data to release
                    if ($scope.model.authData && $scope.model.authData.authRequestIDs &&
                        $scope.model.authData.authRequestIDs.length) {

                        paymentService.releaseAuthorization($scope.model.id,
                            $scope.model.authData).then(
                            function () {
                                $log.debug('paymentController: releaseAuthorization: Success');
                                $scope.model.authData = null;
                            },
                            function (errorResult) {
                                $log.error('paymentController: releaseAuthorization: Failed');
                                $log.error(errorResult);
                            }
                        );
                    }
                };

                /**
                 * This attaches an even to the Modal Dialog's *hidden* event, so we can do some
                 * cleanup after it's hidden.
                 */
                angular.element('#paymentModal').on('hidden.bs.modal', function () {
                    if ($scope.orderPlaced === false) {
                        $scope.releaseAuthorization();
                    }
                });

            }]);
}(window.angular, window._));
;/*! ProductDetailController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('productDetailController',
        ['$scope', '$location', '$route', '$log', '$routeParams',
            'productCatalogService', 'dataStorageService', 'basketService', 'configService', 'newOrderService',
            function ($scope, $location, $route, $log, $routeParams,
                      productCatalogService, dataStorageService, basketService, configService, newOrderService) {

                $scope.model = {
                    product: {},
                    addToBasketItem: {
                        productID: null,
                        skuID: null,
                        qty: null
                    },
                    priceSkuMsg: '',
                    stockQty: '',
                    stockAvailable: '',
                    stockUnavailable: '',
					fromProductSearch: '',
					crossSells : []
                };

				function resetModel () {
					$scope.model.product = {};
                    $scope.model.addToBasketItem = {
                        productID : null,
                        skuID : null,
                        qty : null
                    };
					$scope.model.priceSkuMsg = '';
					$scope.model.stockQty = '';
					$scope.model.stockAvailable = '';
					$scope.model.stockUnavailable = '';
					$scope.model.fromProductSearch = '';
					$scope.model.crossSells = [];
				}

                function skuChangedUpdatePrice (skus) {
                    var skuId = skus[0];

                    // Reset/clear the sku price display
                    $scope.model.priceSkuMsg = '';

                    // Only update the sku price display if we only have 'a' selected sku
                    if (skus.length === 1){
                        $scope.model.priceSkuMsg = $scope.model.product.prices.sku[skuId].displayPrice.price;
                    }
                }

                function skuChangedUpdateStock (skus) {
                    $scope.model.stockQty = '';
                    $scope.model.stockAvailable = '';
                    $scope.model.stockUnavailable = '';
                    var skuId = skus[0];
                    if (skus.length === 1){
                        var stockInfo = $scope.model.product.stock[skuId];

                        if (stockInfo){
                            $scope.model.stockAvailable = stockInfo.available;
                            $scope.model.stockQty = stockInfo.quantity;
                        }
                        $scope.model.stockUnavailable = !$scope.model.stockAvailable;
                    }
                }

				$scope.backToProductSearchResult = function () {
					// Navigate to product search result page.
					$location.path('/productSearchResult');
				};

				$scope.$on('quantityChanged', function (event, quantity) {
					$log.debug('quantity : ' + quantity);

					if ($scope.model.initialized) {
						$scope.enableDisableStoresButton();
					}
				});

                $scope.$on('productOptionChanged', function () {
                    var skuID = $scope.getSelectedSku();

                    if (skuID !== null) {
                        skuChangedUpdatePrice([skuID]);
                        skuChangedUpdateStock([skuID]);
                    } else {
                        $scope.model.stockQty = '';
                        $scope.model.stockAvailable = '';
                        $scope.model.stockUnavailable = '';
                        $scope.model.priceSkuMsg = '';
                    }

					$scope.enableDisableStoresButton();
					$scope.enableDisableAddToCartButton();
                });

				$scope.enableDisableStoresButton = function () {
					if ($scope.model.product.optionsWithAssociatedSkuIDs.length) {
						// More than one SKU
						var skuID = $scope.getSelectedSku();
						if (skuID) {
							// Selected all options
							$scope.model.disableStoresButton = false;
						} else {
							// Not yet selected all options
							$scope.model.disableStoresButton = true;
						}
					} else {
						// Single SKU
						$scope.model.disableStoresButton = false;
					}

					if ($scope.model.addToBasketItem.qty === 0) {
						$scope.model.disableStoresButton = true;
					}
				};

				$scope.enableDisableAddToCartButton = function () {
					if ($scope.model.product.optionsWithAssociatedSkuIDs.length) {
						// More than one SKU
						var skuID = $scope.getSelectedSku();
						if (skuID && $scope.model.stockAvailable) {
							// Selected all options and available
							$scope.model.disableAddToCartButton = false;
						} else {
							// Not yet selected all options
							$scope.model.disableAddToCartButton = true;
						}
					} else {
						if ($scope.model.stockAvailable) {
							// Single SKU and available
							$scope.model.disableAddToCartButton = false;
						} else {
							// Single SKU and unavailable
							$scope.model.disableAddToCartButton = true;
						}
					}
				};

                /**
                 * Initialize the model data.
                 */
                $scope.init = function (productId, fromProductSearch) {
					if (productId) {

						// Reset model values.
						resetModel();

						var storeID = dataStorageService.getStoreId();

						$scope.model.fromProductSearch = fromProductSearch;

						$scope.model.showShortDescription =
							configService.getConfig('app.ppos.ProductDetail.show_short_description');

						$scope.model.showLongDescription =
							configService.getConfig('app.ppos.ProductDetail.show_long_description');

						$scope.model.showName =
							configService.getConfig('app.ppos.ProductDetail.show_name');

						// Get the cross sell product data
						productCatalogService.getProductCrossSells(productId, storeID).then(
							function (successResult) {
								$log.debug(successResult);
								$scope.model.crossSells = successResult.data;

							}, function (errorResult) {
								$log.error(errorResult);
							});

						// Get the product data
						productCatalogService.getProductViewData(productId, storeID).then(
							function (successResult) {
								$log.debug(successResult);
								$scope.model.product = successResult.data;

								// If we already have a sku selected, update the stock display
								if ($scope.model.product.skus.length === 1){
									skuChangedUpdatePrice([$scope.model.product.skus[0].id]);
									skuChangedUpdateStock([$scope.model.product.skus[0].id]);
								}

								$scope.model.initialized = true;
								$scope.enableDisableStoresButton();
								$scope.enableDisableAddToCartButton();
                                $scope.model.addToBasketItem = {
									storeID: null,
									productID: $scope.model.product.id,
                                    thumb: $scope.model.product.image.thumb,
                                    skuID: null,
									qty: 1
								};

							}, function (errorResult) {
								$log.error(errorResult);
							});

					}
                };

                /**
                 * Attempt to add the product to the basket.
                 */
                $scope.addItemToBasket = function () {
					$scope.model.addToBasketItem.storeID = dataStorageService.getStoreId();

					// Get the selected sku Id
					$scope.model.addToBasketItem.skuID = $scope.getSelectedSku();

					// Only continue if we have a selected sku
					if ($scope.model.addToBasketItem.skuID !== null && 
							$scope.model.stockAvailable && 
							$scope.model.addToBasketItem.qty > 0) {
						
						if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
							// Customer and Basket are not in session. So create guest Customer and its Basket.

							var customerId = '';
							var storeId = dataStorageService.getStore().id;
							var csrId = dataStorageService.getLoggedInCSR().id;
							var phone = '';

							newOrderService.startNewOrder(customerId, storeId, csrId, phone)
								.then(
								function (successResult) {
									if (successResult) {
										$log.debug('New Order Response : ' + angular.toJson(successResult));

										// Get the basket Id from data storage
										var basketId = dataStorageService.getBasketId();

										// Make the service call to addItemToBasket
										basketService.addItemToBasket(basketId, $scope.model.addToBasketItem).then(
											function (successResult) {
												if (successResult) {
													// Navigate to basket page.
													$location.path('/basket');
												}
											}, function (errorResult) {
												$log.error('An error occurred while adding item to the Basket.' + 
													errorResult);
											}
										);
									}
								}, function (errorResult) {
									$log.error('An error occured while starting new Order.' + errorResult);
								});
						} else {
							// Get the basket Id from data storage
							var basketId = dataStorageService.getBasketId();

							// Make the service call to addItemToBasket
							basketService.addItemToBasket(basketId, $scope.model.addToBasketItem).then(
								function (successResult) {
									if (successResult) {
										// Navigate to basket page.
										$location.path('/basket');
									}
								}, function (errorResult) {
									$log.error('An error occurred while adding item to the Basket.' + 
										errorResult);
								}
							);
						}
					}
                };

                /**
                 * Returns the selected sku Id or null if one is not found
                 * @returns {*} The selected sku Id as a string or null if not found
                 */
                $scope.getSelectedSku = function () {
                    var selectedSku = null,
                        selectedSkus = [],
                        selectedOptions = _.filter($scope.model.product.optionsWithAssociatedSkuIDs, function (n) {
                            return n.selectedOption !== null;
                        });

                    // If we don't have any options, just return the product's first sku Id
                    if ($scope.model.product.optionsWithAssociatedSkuIDs.length === 0) {
                        return $scope.model.product.skus[0].id;
                    }

                    // Only continue if we have the same number of selected options as we do available option types
                    if (selectedOptions.length === $scope.model.product.optionsWithAssociatedSkuIDs.length) {
                        // Loop through the selected options sku Ids and find the intersections
                        for (var i = 0; i < selectedOptions.length; i++) {
                            var skuIDs = selectedOptions[i].selectedOption.skuIDs;
                            if (i === 0) {
                                // If it's our first trip through, just update the selectedSkus
                                selectedSkus = skuIDs;
                            } else {
                                // Otherwise, find the sku Ids intersection
                                selectedSkus = _.intersection(selectedSkus, skuIDs);
                            }
                        }
                    }

                    // At this point, we should only have one sku intersection, if so, set the selectedSku
                    if (selectedSkus.length === 1) {
                        selectedSku = selectedSkus[0];
                    }

                    // Return the sku id we found, or null otherwise
                    return selectedSku;
                };

                $scope.init($routeParams.productId, $routeParams.fromProductSearch);
            }]);
}(window.angular, window._));
;/*! ProductSearchModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('productSearchModalController',
		['$log', '$scope', '$location', '$translate', 'productSearchService', 'appService',
		function ($log, $scope, $location, $translate, productSearchService, appService) {

			/**
			 * Model object for product search modal.
			 */
			$scope.productSearchDataModel = {
				productSearchKeyword : null,
				searchTerm : null,
				showProductSearchError : false,
				productSearchErrorMessage : null
			};
			
			/**
			 * Clears product search data.
			 */
			$scope.clearProductSearchData = function () {
				$scope.productSearchDataModel.productSearchKeyword = null;
				$scope.productSearchDataModel.searchTerm = null;
				$scope.productSearchDataModel.showProductSearchError = false;
				$scope.productSearchDataModel.productSearchErrorMessage = null;
			};

			/**
			 * Close product search modal.
			 */
			$scope.closeProductSearchModal = function () {
				$scope.clearProductSearchData();
			};

			/**
			 * Search product.
			 */
			$scope.searchProduct = function () {
				var isValid = productSearchService.validateProductSearchKeywordRequired(
					$scope.productSearchDataModel.productSearchKeyword);

				if (!isValid) {
					// Show error message.
					$scope.productSearchDataModel.showProductSearchError = true;
					$translate('msg.ppos.shortSearchTerm', { minLength : 3 })
						.then(function (shortSearchTerm) {
							$scope.productSearchDataModel.productSearchErrorMessage = shortSearchTerm;
						});

					angular.element('#productSearchKeyword').focus();
				} else {
					appService.activateSpinner();

					// Initial request so start doc should be zero.
					var offSet = 0;
					
					// TODO: This value is not configurable as per requirement.
					var productsPerPage = 6;

					// Initial request so page number should be one.
					var pageNumber = 1;

					var productSearchRequest = {
						productSearchKeyword : $scope.productSearchDataModel.productSearchKeyword,
						offSet : offSet,
						productsPerPage : productsPerPage,
						pageNumber : pageNumber
					};

					// Product search result promise.
					var productSearchResultPromise = 
						productSearchService.searchProduct(productSearchRequest);

					productSearchResultPromise
						.then(
						function (successResult) {
							var productSearchResponse = successResult;

							appService.deactivateSpinner();

							if (productSearchResponse.searchResult.searchResultSize === 1) {
								// Just one product.
								$scope.clearProductSearchData();
									
								// Hide product search modal.
								angular.element('#productSearchModal').modal('hide');
								
								// Open product detail modal.
								$scope.productId = productSearchResponse.searchResult.productInfo[0].id;
								angular.element('#productDetailModal').modal('show');
							} else if (productSearchResponse.searchResult.searchResultSize > 1) {
								// More than one product
								// Set the product search result response in cache (localstorage or shared service).
								productSearchService.setProductSearchResult(productSearchResponse);

								$scope.clearProductSearchData();

								// Hide product search modal.
								angular.element('#productSearchModal').modal('hide');
								
								// Navigate to product search result page.
								$location.path('/productSearchResult');
							}
						}, function (errorResult) {
							var productSearchResponse = errorResult;

							appService.deactivateSpinner();

							if (productSearchResponse.searchResult.responseCode === '404') {
								// Zero products.
								$scope.productSearchDataModel.searchTerm = 
									$scope.productSearchDataModel.productSearchKeyword;

								// Show error message.
								$scope.productSearchDataModel.showProductSearchError = true;

								$translate('msg.ppos.searchNoResults', 
									{ searchTerm : $scope.productSearchDataModel.searchTerm })
									.then(function (searchNoResults) {
										$scope.productSearchDataModel.productSearchErrorMessage = searchNoResults;
									});
								
								angular.element('#productSearchKeyword').focus();
							} else {
								$log.error('An error occured during product search : ' + angular.toJson(errorResult));
							}
						});
				}
			};
		}]);
}(window.angular));
;/*! ProductSearchResultController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('productSearchResultController', 
		['$log', '$scope', 'productSearchService', 'productCatalogService',

			function ($log, $scope, productSearchService, productCatalogService) {

				/** Product search keyword entered by the user. */
				$scope.productSearchKeyword = null;
				
				// TODO: This value is not configurable as per requirement.
				/** */
				$scope.productsPerPage = 6;

				/** Product search configurations. */
				$scope.productSearchConfigModel = productSearchService.getProductSearchConfigModel();
				
				/** The model object containing the product search result used in view. */
				$scope.productSearchResultDataModel = {
					searchTerm : null,
					showKeywordRequiredErrorMessage : false,
					showProductNotFoundErrorMessage : false,
					showSorting : false,
					productSearchKeyword : null,
					searchResult : null,
					pagingModel : null,
					sortOptions : null,
					defaultSortOption : null,
					currentSortOrder : null,
					currentSortParam : null,
					currentSortOptionConfig : null
				};

				/**
				 * This function search for products based on the given keyword.
				 * 
				 * @param {String} productSearchKeyword - The keyword to search.
				 * @param {Number} offSet - The offset (i.e. start doc).
				 * @param {Number} pageNumber - The requested page number.
				 * @param {String} sortOrder - The sort order (desc or asc).
				 * @param {String} sortParam - The sort param.
				 */
				$scope.searchProduct = function (productSearchKeyword, offSet, pageNumber, sortOrder, sortParam) {
					$scope.productSearchKeyword = productSearchKeyword;

					var isValid = productSearchService.validateProductSearchKeywordRequired(productSearchKeyword);

					if (!isValid) {
						// Show error message.
						$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = true;
						$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = false;

						/*if ($scope.productSearchResultDataModel.searchResult.searchResultSize > 1) {
							$scope.productSearchResultDataModel.showSorting = true;
						} else {
							$scope.productSearchResultDataModel.showSorting = false;	
						}*/

						// PEBL-14854 
						// In PPOS phase 2 improve ProductSearchService.js to handle more these kind of scenarios.
						$scope.productSearchResultDataModel.showSorting = false;
						$scope.productSearchResultDataModel.pagingModel = null;
						$scope.productSearchResultDataModel.searchResult.productInfo = [];
					} else {
						// Product search request.
						var productSearchRequest = {
							productSearchKeyword : productSearchKeyword,
							offSet : offSet,
							productsPerPage : $scope.productsPerPage,
							pageNumber : pageNumber,
							currentSortOrder: sortOrder,
							currentSortParam: sortParam
						};

						// Product search result promise.
						var productSearchResultPromise = 
							productSearchService.searchProduct(productSearchRequest);

						productSearchResultPromise
							.then(
							function (successResult) {
								var productSearchResponse = successResult;

								// Set the product search result response in cache (localstorage or shared service).
								productSearchService.setProductSearchResult(productSearchResponse);

								$scope.initializeProductSearchResultDataModel(productSearchResponse);
							}, function (errorResult) {
								$scope.productSearchResultDataModel = errorResult;

								if ($scope.productSearchResultDataModel.searchResult.data === null || 
									$scope.productSearchResultDataModel.searchResult.responseCode === '404') {

									// Zero products - show error message.
									$scope.productSearchResultDataModel.searchTerm = 
										$scope.productSearchKeyword;
									$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = 
										false;
									$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = 
										true;

									$scope.productSearchResultDataModel.showSorting = false;
								}
							});
					}
				};

				/**
				 * Initialize model for view.
				 * 
				 * @param {Object} productSearchResponse - The product search response object.
				 */
				$scope.initializeProductSearchResultDataModel = function (productSearchResponse) {
					$scope.productSearchKeyword = '';

					// Set the result in scope model for view.
					$scope.productSearchResultDataModel.productSearchKeyword = 
						productSearchResponse.productSearchKeyword;
					$scope.productSearchResultDataModel.searchResult = 
						productSearchResponse.searchResult;
					$scope.productSearchResultDataModel.pagingModel = 
						productSearchResponse.pagingModel;
					$scope.productSearchResultDataModel.sortOptions = 
						productSearchResponse.sortOptions;
					$scope.productSearchResultDataModel.defaultSortOption = 
						productSearchResponse.defaultSortOption;
					$scope.productSearchResultDataModel.currentSortOrder = 
						productSearchResponse.currentSortOrder;
					$scope.productSearchResultDataModel.currentSortParam = 
						productSearchResponse.currentSortParam;
					$scope.productSearchResultDataModel.currentSortOptionConfig = 
						productSearchResponse.currentSortOptionConfig;
					
					// Clear error messages as the search result is success.
					$scope.productSearchResultDataModel.searchTerm = 
						null;
					$scope.productSearchResultDataModel.showKeywordRequiredErrorMessage = 
						false;
					$scope.productSearchResultDataModel.showProductNotFoundErrorMessage = 
						false;
					
					if ($scope.productSearchResultDataModel.searchResult.searchResultSize > 1) {
						$scope.productSearchResultDataModel.showSorting = true;
					} else {
						$scope.productSearchResultDataModel.showSorting = false;	
					}

					///////////////// Product Price Info /////////////////
					var productIds = '';
					var products = productSearchResponse.searchResult.productInfo;
		
					for (var i = 0; i < products.length; i++) {
						productIds = productIds + products[i].id;
						if (i <= (products.length - 2)) {
							productIds = productIds + ',';
						}
					}

					if (productIds)	{
						productCatalogService.getPriceInfoForProduct(productIds, false)
							.then(
							function (successResult) {
								angular.forEach(products, function (product) {
									var priceInfo = successResult.data[product.id];
									var priceMessages = productCatalogService.
										getPriceMessages(priceInfo, product.wasIs, product.onSale);

									product.priceInfo = priceMessages;
								});
							}, function (errorResult) {
								$log.error(errorResult);
							});
					}
					///////////////// Product Price Info /////////////////
				};

				// Initialize model for view.
				$scope.initializeProductSearchResultDataModel(productSearchService.getProductSearchResult());
			}]);
}(window.angular));
;/*! ProvisioningController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('provisioningController', 
		['$scope', '$location', '$routeParams', 'dataStorageService', 
		function ($scope, $location, $routeParams, dataStorageService) {

			$scope.showProvisioningFailureMessage = false;

			$scope.provisioningFailureMessage = null;

			$scope.provisioningDetails = {
				urlBase : '',
				storeCode : ''
			};

			$scope.initializeProvisioningDetails = function () {
				if ($routeParams.action === 'changeStore') {
					// If changing url base or store code then prefilled existing url base and store code.
					$scope.provisioningDetails.urlBase = dataStorageService.getUrlBase();
					$scope.provisioningDetails.storeCode = dataStorageService.getStoreCode();
					angular.element('#storeCode').focus();
				} else if (dataStorageService.getUrlBase() && dataStorageService.getStoreCode()) {
					// Starting application as already provisioned - go to login page.
					$location.url('/home');
				} else {
					// Never provisioned or cleared session storage.
					angular.element('#urlBase').focus();
				}
			};

			/**
			 * Sets application provisioning details.
			 */
			$scope.provisionApplication = function (provisioningDetails) {
				var isValid = validateProvisioningDetails(provisioningDetails);

				if (isValid) {
					dataStorageService.setUrlBase(provisioningDetails.urlBase);
					dataStorageService.setStoreCode(provisioningDetails.storeCode);

					$location.url('/home');
				}
			};

			/**
			 * Validates provisioning details.
			 */
			function validateProvisioningDetails (provisioningDetails) {
				if (!provisioningDetails.urlBase) {
					$scope.showProvisioningFailureMessage = true;
					$scope.provisioningFailureMessage = 'err.ppos.provisioning.urlBase.required';
					angular.element('#urlBase').focus();
					return false;
				} else if (!provisioningDetails.storeCode) {
					$scope.showProvisioningFailureMessage = true;
					$scope.provisioningFailureMessage = 'err.ppos.provisioning.storeCode.required';
					angular.element('#storeCode').focus();
					return false;
				}

				return true;
			}

			$scope.initializeProvisioningDetails();
		}]);
}(window.angular));
;/*jshint bitwise: false*/
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('receiptModalController',
        ['$scope', '$location', 'dataStorageService', 'starPrinter',
            'receiptService', 'accountService', 'globalValidationService',  '$translate',

            function ($scope, $location, dataStorageService, starPrinter, receiptService, accountService,
                      globalValidationService, $translate ) {

                $scope.receiptDataModel = {
                    deviceName: '',
                    hasValidationErrors: false,
                    hasEmailValidationErrors: false,
                    validationErrors : [],
                    printSelected: false,
                    emailSelected: false
                };

                $scope.email =  undefined ;
                $scope.obj = undefined;

                $translate('lbl.ppos.noDevice').
                    then(function (msg) {
                        $scope.noDevice = msg;
                    });


                $scope.$on('order',function(){
                    $scope.showReceiptModal();
                });

                $scope.update = function(){

                    //create object to send out
                    $scope.obj = {
                        orderId:dataStorageService.getFinalizedOrderId(),
                        printSelected: $scope.receiptDataModel.printSelected,
                        deviceName: $scope.receiptDataModel.deviceName,
                        emailSelected: $scope.receiptDataModel.emailSelected,
                        email: $scope.email

                    };
                };

                $scope.showReceiptModal = function () {

                    $scope.receiptDataModel.paymentChange = dataStorageService.getPaymentChange();
                    $scope.receiptDataModel.deviceName  = dataStorageService.getStarMicronicsPrinterName();


                    if(!dataStorageService.isPrinterConnected()){

                          $scope.receiptDataModel.hasValidationErrors = true;

                          $translate('lbl.ppos.noDevice').
                            then(function (msg) {
                                $scope.receiptDataModel.validationErrors.push(msg);
                            });

                          $scope.buttonClicked  = true;
                    }

                    accountService.getCustomerById(dataStorageService.getCustomerId()).then(

                        function (successResult){
                            if(successResult.data.email != null){
                                $scope.email  = successResult.data.email;
                                dataStorageService.setOrderContactEmail = $scope.email;
                            }

                        }, function (errorResult) {
                            console.log(errorResult);
                        });

                    dataStorageService.removeItem('customerId');


                    $scope.buttonClicked = false;
                    $scope.receiptDataModel.orderid = dataStorageService.getFinalizedOrderId();
                    console.log( 'OrderId: ' + $scope.receiptDataModel.orderid);
                    angular.element('#receiptModal').modal('show');
                };

                $scope.cancel = function () {
                    $scope.receiptDataModel.emailSelected = false;
                    $scope.receiptDataModel.printSelected = false;

                    $scope.update();
                    $scope.obj.showMessage = true;

                    angular.element('#receiptModal').modal('hide');
                    $scope.$emit('order-confirm', $scope.obj);
                    angular.element('#orderConfirmationModal').modal('show');
                };

                $scope.processReceipt = function () {
                    $scope.receiptDataModel.hasEmailValidationErrors = false;
                    $scope.receiptDataModel.validationErrors = [];

                    $scope.validateEmail();
                    var isValid = !$scope.receiptDataModel.hasEmailValidationErrors;

                    if ($scope.receiptDataModel.emailSelected === true) {

                        if(isValid === false){
                            return;
                        }

                        $scope.update();
                        $scope.buttonClicked = true;
                        console.log('Calling email receipt service: order:' + dataStorageService.getFinalizedOrderId());
                        receiptService.emailOrderReceipt(dataStorageService.getFinalizedOrderId(),
                            dataStorageService.getStoreId(), dataStorageService.getLoggedInCSR().id,
                            $scope.email
                        ).then(
                            function(result){
                                angular.element('#receiptModal').modal('hide');
                                angular.element('#orderConfirmationModal').modal('show');
                                $scope.update();
                                $scope.showMessage = false;
                                $scope.$emit('order-confirm', $scope.obj);
                                console.log(result);
                            }
                        );

                    }
                    if ($scope.receiptDataModel.printSelected === true) {
                        $scope.buttonClicked = true;
                        console.log('Calling print receipt service: order:' + dataStorageService.getFinalizedOrderId());

                        receiptService.printOrderReceipt(
                            dataStorageService.getFinalizedOrderId(),dataStorageService.getStoreId(),
                            dataStorageService.getLoggedInCSR().id
                        ).then(
                            function(result){

                                $scope.assembleTestPage = [];
                                //split the template data
                                var tmp = $scope.scrubText(result.data);

                                $scope.assembleTestPage = tmp.split(',');
                                window.temp = $scope.assembleTestPage;

                                starPrinter.getDeviceName().then(function(data){
                                    if(data === 'NoDevice') {
                                        dataStorageService.setPrinterConnected(false);
                                        $translate('lbl.ppos.noDevice').
                                            then(function (msg) {
                                                //So after a failure we set the name to discon
                                                dataStorageService.setStarMicronicsPrinterName(msg);
                                                dataStorageService.setPrinterConnected(false);
                                                $scope.receiptDataModel.printSelected = false;
                                                $scope.receiptDataModel.deviceName =msg;
                                                $scope.receiptDataModel.validationErrors.push(msg);
                                                $scope.receiptDataModel.hasValidationErrors = true;
                                            });

                                    }else {
                                        starPrinter.printTestPage($scope.assembleTestPage).then();
                                        $scope.update();
                                        $scope.showMessage = false;
                                        angular.element('#receiptModal').modal('hide');
                                        angular.element('#orderConfirmationModal').modal('show');
                                        $scope.$emit('order-confirm', $scope.obj);
                                    }
                                    });



                            }
                        );
                    }
                };

                $scope.scrubText = function(textIn) {
                    var textOut ='';
                    var len = textIn.length;

                    for(var i = 0; i < len ; i++) {
                        var valToTest = (textIn.charCodeAt(i) & 0x80) >> 7;

                        if(valToTest !== 1) {
                            textOut += textIn.charAt(i);
                        }
                    }
                    return textOut;
                };


                $scope.validateEmail = function () {

                   // var hasValidationErrors = false;
                    // Email validation.
                    if (angular.element('#receiptModalEmail').hasClass('ng-invalid-email')) {
                        // TODO: This is a hack... PEBL-15808
                        // Invalid email format as per HTML5 and AngularJS.
                       $scope.receiptDataModel.hasEmailValidationErrors = true;

                        $translate('msg.ppos.invalidEmail').
                            then(function (invalidEmailMessage) {
                                $scope.receiptDataModel.validationErrors.push(invalidEmailMessage);
                            });
                    } else if ($scope.email) {

                        if (!globalValidationService.isEmailValid($scope.email)) {
                            // Invalid email format as per MarketLive client side validation.
                            $scope.receiptDataModel.hasEmailValidationErrors = true;
                            $translate('msg.ppos.invalidEmail').
                                then(function (invalidEmailMessage) {
                                    $scope.receiptDataModel.validationErrors.push(invalidEmailMessage);
                                });
                        }
                    }
                    else if ($scope.email === undefined || $scope.email === '') {

                        $scope.receiptDataModel.hasEmailValidationErrors = true;

                        $translate('lbl.ppos.email').
                            then(function (fieldNameVal) {
                                $translate('msg.ppos.isRequiredField', {fieldName: fieldNameVal}).
                                    then(function (emailRequiredMessage) {
                                        $scope.receiptDataModel.validationErrors.push(emailRequiredMessage);
                                    });
                            });
                    }

                };


                }]);



}(window.angular));
;/*! SavedBasketsController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('savedBasketsController',
        ['$log', '$scope', '$location', 'configService', 'dataStorageService', 'basketService',
		function ($log, $scope, $location, configService, dataStorageService, basketService) {
			
			$scope.savedBasketsDataModel = {
				baskets : []
			};
			
			/**
			 * Initialize model for view.
			 */
			$scope.initializeSavedBasketsDataModel = function () {
				var hourRange = configService.getConfig('app.ppos.savedCarts.hourRange');

				basketService.getBasketsForCSRByDateRange(dataStorageService.getLoggedInCSR().id, hourRange)
					.then(
					function (successResult) {
						if (successResult) {
							$scope.savedBasketsDataModel.baskets = successResult.data;
						}
					}, function (errorResult) {
						$log.error(errorResult);

						$scope.savedBasketsDataModel.baskets = [];
					});
			};

			$scope.openSavedBasket = function (customerId, basketId) {
				dataStorageService.setCustomerId(customerId);

				dataStorageService.setBasketId(basketId);

				// Navigate to basket page.
				$location.path('/basket');
			};

			$scope.deleteSavedBasket = function (basketId) {
				basketService.deleteBasket(basketId)
					.then(
					function (successResult) {
						if (successResult) {
							// If CSR has deleted current basket that is in session, 
							// then remove basket ID and customer ID from session.
							if (basketId === dataStorageService.getBasketId()) {
								dataStorageService.setCustomerId('');

								dataStorageService.setBasketId('');
							}

							$scope.initializeSavedBasketsDataModel();
						}
					}, function (errorResult) {
						$log.error(errorResult);

						$scope.initializeSavedBasketsDataModel();
					});
			};

			// Initialize model for view.
			$scope.initializeSavedBasketsDataModel();
        }]);
}(window.angular));
;/*! ShippingAddressAndMethodModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('shippingAddressAndMethodModalController', 
		['$scope', 'dataStorageService', 'accountService', '$log', '$translate', 'appService',
			'globalValidationService', 'basketService', 'shippingService', '$timeout', '$q',

			function ($scope, dataStorageService, accountService, $log, $translate, appService,
				globalValidationService, basketService, shippingService, $timeout, $q) {

				$scope.shipping = {
					customerObj : null,
					contactObj : null,
					firstName : null,
					lastName : null,
					streetAddress : null,
					optionalAddress : null,
					zipCode : null,
					city : null,
					states : [],
					selectedState : null,
					countries : [], 
					selectedCountry : null,
					phoneNumber : null,
					email : null,
					shippingMethods : [],
					selectedShippingMethod : null,
					showMessage : false,
					operationMessage : null
				};

				$scope.init = function () {
					$scope.clearModalData();
					var deferred = $q.defer();
					// populate countries
					shippingService.getCountries().then(function (successResult) {
						var optCountry;
						optCountry = {
							'id' : '-1',
							'description' : 'Select a Country'
						};
						$scope.shipping.countries.push(optCountry);
						for(var index = 0; index < successResult.data.length; index++) {
							optCountry = {
								'id' : successResult.data[index].code,
								'description' : successResult.data[index].code + 
									'-' + successResult.data[index].name
							};
							$scope.shipping.countries.push(optCountry);
						}
						if (dataStorageService.getCustomerId())	{ // get customer default address
							accountService.getCustomerById(dataStorageService.getCustomerId()).then(
							function (successResult) {
								$scope.shipping.customerObj = successResult.data;
								if (successResult.data.primaryContact.id) {
									accountService.getContactById(successResult.data.primaryContact.id)
										.then(
										function (successResult) {
										$scope.shipping.contactObj = successResult.data;
										//Check if return contact is not a guest
										if ($scope.shipping.customerObj.guest === false) { // Not guest
											$scope.shipping.firstName = successResult.data.person.firstName;
											$scope.shipping.lastName = successResult.data.person.lastName;
											$scope.shipping.streetAddress = successResult.data.address.street1;
											$scope.shipping.optionalAddress = successResult.data.address.street2;
											$scope.shipping.zipCode = successResult.data.address.postalCode;
											$scope.shipping.city = successResult.data.address.city;
											if (successResult.data.address.state === null) {
												$scope.shipping.selectedState = 'NA/NA';
											} else {
												$scope.shipping.selectedState = successResult.data.address.state;
											}
											$scope.shipping.selectedCountry = 
												successResult.data.address.country;
											$scope.shipping.phoneNumber = successResult.data.phone1;
											$scope.shipping.email = $scope.shipping.customerObj.email;
										} else { // Guest
											if (successResult.data.address.state === null) {
												$scope.shipping.selectedState = 'NA/NA';
											} else {
												$scope.shipping.selectedState = successResult.data.address.state;
											}
											$scope.shipping.selectedCountry = 
												successResult.data.address.country;
											$scope.shipping.phoneNumber = successResult.data.phone1;
										}
										var optState = {
											'id' : '-1',
											'description' : 'Select a State/Province'
										};
										$scope.shipping.states.push(optState);
										// Get US states
										$scope.populateStates('US').then(
											function (successResult) {
												$log.info('Got US state list with size : ' + successResult.length);
												// Get CA states
												$scope.populateStates('CA').then(
													function(successResult) {
														$log.info('Got CA state list with size : ' + 
															successResult.length);
														var optState = {
															'id' : 'NA/NA',
															'description' : 'NA-International'
														};
														$scope.shipping.states.push(optState);
														$scope.populateShippingMethods().then(
															function (successResult) {
															deferred.resolve(successResult);
															}, function (errorResult) {
																$log.error('Error in getting ship methods : '+ 
																	errorResult);
																deferred.reject(errorResult);
														});
													}, function(errorResult) {
														$log.error('Error in getting CA states ' + errorResult);
														deferred.reject(errorResult);
													});
											}, function (errorResult) {
												$log.error('Error in getting US states ' + errorResult);
												deferred.reject(errorResult);
											});
									}, function (errorResult) {
										$log.error('Error in getting contact :'+errorResult);
										deferred.reject(errorResult);
									});
								}
							}, function (errorResult) {
								$log.error('Error in getting customer ' + errorResult);
								deferred.reject(errorResult);
							});
						}
					}, function(errorResult) {
						$log.error('Error in getting countries : ' + errorResult);
						deferred.reject(errorResult);
					});
					return deferred.promise;
				};

				$scope.populateShippingMethods = function (selClicked) {
					$scope.shipping.shippingMethods = [];
					var countryCode = null; var stateCode = null;
					if (selClicked === 'selCountry') {
						// Country dropdown clicked, select state
						countryCode = $scope.shipping.selectedCountry;
						if (countryCode === 'US') {
							$scope.shipping.selectedState = 'US/AL';
						} else if (countryCode === 'CA') {
							$scope.shipping.selectedState = 'CA/AB';
						} else if (countryCode === '-1') {
							$scope.shipping.selectedState = '-1';
						} else {
							$scope.shipping.selectedState = 'NA/NA';
						}
					} else if (selClicked === 'selState')	{
						stateCode = $scope.shipping.selectedState;
						if(stateCode.length === 5) {
							if (stateCode.substring(0,2) === 'US') {
								$scope.shipping.selectedCountry = 'US';
							} else if (stateCode.substring(0,2) === 'CA') {
								$scope.shipping.selectedCountry = 'CA';
							} else {
								$scope.shipping.selectedCountry = '-1';
							}
						} else {
							$scope.shipping.selectedCountry = '-1';
						}
					}
					countryCode = $scope.shipping.selectedCountry;
					stateCode = $scope.shipping.selectedState;
					
					if(null !== stateCode && stateCode.length === 5) {
						stateCode = $scope.shipping.selectedState.substring(3);
					}
					if (!countryCode || !stateCode || stateCode === '-1' || countryCode === '-1') {
						$scope.shipping.selectedShippingMethod = null;
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						return false;
					}
					var deferred = $q.defer();
					var basketId = dataStorageService.getBasketId();
					var shipToShipments = [];
					basketService.getBasketById(basketId).then(function (successResult) {
						var shipment; var item;
						for (var idx = 0; idx < successResult.data.shipments.length;
							idx++) {
							shipment = successResult.data.shipments[idx];
							for(var index = 0; index < shipment.items.length; index++) {
								item = shipment.items[index];
								if(item.isPickupFromStore === false) {
									// ship to item, store in an array
									if (shipToShipments.indexOf(shipment.id) === -1) {
										shipToShipments.push(shipment.id);
									}
								}
							}
						}
						// For phase 1 there will be only one shipment
						shippingService.getShippingMethods(basketId, shipToShipments[0], 
							countryCode, stateCode).then(
						function (successResult) {
							var shipMethod = null;
							var lowestShipMethodId = null;
							var lowestShipMethodCost = 0;
							if (successResult.data.length > 0) {
								$scope.shipping.shippingMethods = [];
								lowestShipMethodId = successResult.data[0].shippingMethodItem.id;
								lowestShipMethodCost = 
									Number(successResult.data[0].discountedShipMethodCost.replace(/[^0-9\.]+/g,''));
								for (var idx = 0; idx < successResult.data.length; idx++) {
									if (successResult.data[idx].shippingMethodItem.active === true) {
										if (Number(successResult.data[idx].discountedShipMethodCost.
											replace(/[^0-9\.]+/g,'')) < lowestShipMethodCost) {
											lowestShipMethodId = successResult.data[idx].shippingMethodItem.id;
											lowestShipMethodCost = 
												Number(successResult.data[idx].discountedShipMethodCost.
												replace(/[^0-9\.]+/g,''));
										}
										shipMethod = {
											id : successResult.data[idx].shippingMethodItem.id,
											name : successResult.data[idx].shippingMethodItem.name,
											cost : successResult.data[idx].discountedShipMethodCost,
											description : successResult.data[idx].shippingMethodItem.description
										};
										$scope.shipping.shippingMethods.push(shipMethod);
									}
								}
								$scope.shipping.selectedShippingMethod = lowestShipMethodId;
								$scope.shipping.showMessage = false;
								$scope.shipping.operationMessage = null;
							} else {
								$scope.shipping.selectedShippingMethod = null;
								$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
							}
							deferred.resolve(successResult.data);
						}, function (errorResult) {
							$scope.shipping.selectedShippingMethod = null;
							$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
							$log.error('No shipping method found' + errorResult);
							deferred.reject(errorResult);
					});
					}, function (errorResult) {
						$scope.shipping.selectedShippingMethod = null;
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						$log.error('Cannot get basket : ' + errorResult);
						deferred.reject(errorResult);
					});
					return deferred.promise;
				};

				$scope.populateStates = function (countryCode) {
					var deferred = $q.defer();
					var optState;
					if (countryCode === 'US' || countryCode === 'CA')	{
						shippingService.getStates(countryCode).then(function (successResult) {
						for(var index = 0; index < successResult.data.length; index++) {
							optState = {
								'id' : successResult.data[index].stateCode,
								'description' : successResult.data[index].stateCode.substring(3) + '-' +
									successResult.data[index].name
							};
							$scope.shipping.states.push(optState);
						}
						deferred.resolve(successResult.data);
						}, function(errorResult) {
							deferred.reject(errorResult);
							$log.error(errorResult);
						});
					}
					return deferred.promise;
				};

				$scope.showShippingAddressAndMethodModal = function () {
					$scope.init().then(function (successResult) {
						$log.info('Data loaded with shipping method = ' + successResult.length);
						// TODO : Remove shipping modal session storage in phase 2
						sessionStorage.showShippingModal = true;
						angular.element('#shippingAddressAndMethodModal').modal('show');
						appService.deactivateSpinner();
					}, function (errorResult) {
						$log.error('Cannot load data ' + errorResult);
						appService.deactivateSpinner();
					});
				};
				
				$scope.closeShippingAddressAndMethodModal = function () {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = true;
					$scope.clearModalData();
					angular.element('#shippingAddressAndMethodModal').modal('hide');
				};

				$scope.cancelShippingAddressAndMethodModal = function () {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = true;
					$scope.clearModalData();
					angular.element('#shippingAddressAndMethodModal').modal('hide');
				};

				$scope.setOnlineItemShipToContact = function (basketId, basketItem, contactId) {
					var shipTobasketItem = {
						'basketItemID' : basketItem.id,
						'productID' : basketItem.product.id,
						'skuID' : basketItem.skuID,
						'qty' : basketItem.qty,
						'storeID' : null,
						'shipToContactID' : contactId
					};

					return shipTobasketItem;
				};

				$scope.saveShippingAddressAndMethod = function (shipping) {

					if (validateData(shipping)) {
						appService.activateSpinner();

						// create contact
						var contactJson;
						var basketId = dataStorageService.getBasketId();
						// 1. create contact
						// 2. Update shipTo items with new contact
						// 3. Update shipment with ship method selected
						// 4. Show payment modal
						//---------------------------//
						// Step 1: Create Contact
						contactJson = prepareContactDetail(shipping);
						accountService.createContact($scope.shipping.customerObj.id, 
							contactJson).then(
							function (successResult) {
								var createdContactId = successResult.data.substring(
									successResult.data.lastIndexOf('/') + 1);
								var basketItemToUpdate = [];
								// Step 2 - created, now do second step
								// Assign each ship to basket item, this contact id will be ship to contact id
								if (basketId) {
									basketService.getBasketById(basketId).then(function (successResult) {
										angular.forEach(successResult.data.shipments, function (shipment) {
											angular.forEach(shipment.items, function (item) {
												if(item.isPickupFromStore === false) {
													basketItemToUpdate.push($scope.
														setOnlineItemShipToContact(basketId, item, createdContactId));
												}
											});
										});
										var shipToBasketItems = {
											'basketItems' : basketItemToUpdate,
										};
										basketService.updateBasketItems(basketId, shipToBasketItems).
											then(function (successResult) {
											console.log(successResult);
											// Step 3 : Update ship method of all items - only one in Phase 1
											var shipToShipments = [];
											basketService.getBasketById(basketId).then(function (successResult) {
												var shipment; var item;
												for (var idx = 0; idx < successResult.data.shipments.length;
													idx++) {
													shipment = successResult.data.shipments[idx];
													for(var index = 0; index < shipment.items.length; index++) {
														item = shipment.items[index];
														if(item.isPickupFromStore === false) {
															// ship to item, store in an array
															if (shipToShipments.indexOf(shipment.id) === -1) {
																shipToShipments.push(shipment.id);
															}

														}
													}
												}
												// Step 3 - Rest Call - It will contain only one item/call
												angular.forEach(shipToShipments, function (shipmentId) {
												shippingService.updateShippingMethod(
													dataStorageService.getBasketId(),shipmentId,
														shipping.selectedShippingMethod).then(
													function (successResult) {
														// Step 4. Show payment modal
														$log.info(successResult);
														// basket refresh here to reflect shipping method changes
														$scope.$emit('reloadBasket');
														$timeout(function() {
															angular.element('#shippingAddressAndMethodModal').
															modal('hide');
															// TODO:Remove shipping modal session storage in phase 2
															sessionStorage.showShippingModal = false;
															angular.element('#btnOpenPymtModal').
																trigger('click');
															appService.deactivateSpinner();
														}, 0);
													}, function (errorResult) {
														$log.error(errorResult);
														appService.deactivateSpinner();
													});
												});
											}, function (errorResult) {
												$log.error(errorResult);
												appService.deactivateSpinner();
											});

										}, function(errorResult) {
											$log.error(errorResult);
										appService.deactivateSpinner();
										});
									}, function (errorResult) {
										$log.error(errorResult);
										appService.deactivateSpinner();
									});
								}
							}, function (errorResult) {
								appService.deactivateSpinner();

								var errorMessage = errorResult.data.errorMessage;
								var msg = '';  var serverMsg = '';
								if (errorResult.data.responseCode === '422' ||
									errorResult.data.responseCode === '409') {
									for (var key in errorMessage) {
										if(errorMessage[key] !== '') {
											serverMsg = errorMessage[key].toString().trim();
											if (serverMsg.lastIndexOf('.') === serverMsg.length - 1) {
												// Full stop already received from server, dont append
												msg += serverMsg + ' ';
											} else {
												// Full stop NOT received from server, append full stop
												msg += serverMsg + '. ';
											}
										}
									}
									$scope.showMessageAndFocus(msg);
								} else {
									// cannot save contact message
									$scope.showMessageAndFocus('msg.ppos.contactNotsaved');
								}
								$log.error(errorResult);
							}
						);
					}
				};

				$scope.clearModalData = function () {
					$scope.shipping.firstName = null;
					$scope.shipping.lastName = null;
					$scope.shipping.streetAddress = null;
					$scope.shipping.optionalAddress = null;
					$scope.shipping.zipCode = null;
					$scope.shipping.city = null;
					$scope.shipping.states = [];
					$scope.shipping.countries = [];
					$scope.shipping.selectedState = '-1';
					$scope.shipping.selectedCountry = '-1';
					$scope.shipping.phoneNumber = null;
					$scope.shipping.shippingMethods = [];
					$scope.shipping.email = null;
					$scope.shipping.selectedShippingMethod = null;
					$scope.shipping.showMessage = false;
					$scope.shipping.operationMessage = null;
				};

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				$scope.showMessageAndFocus = function (msgPath) {
					$translate(msgPath).
					then(function (msg) {
						$scope.shipping.showMessage = true;
						$scope.shipping.operationMessage = msg;
						angular.element('#btnCloseModal').focus();
					});
				};

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				$scope.createEmptyFieldMsgAndDisplay = function (fieldNamePath) {
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							$scope.shipping.showMessage = true;
							$scope.shipping.operationMessage = genericMessage;
							angular.element('#btnCloseModal').focus();
						});
					});
				};

				/**
				* Validate Address fields
				*/
				function validateData (shipping) {
					if (!shipping.firstName) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName');
						return false;
					} else if (!shipping.lastName) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName');
						return false;
					} else if (!shipping.streetAddress) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.streetAddress');
						return false;
					} else if (!shipping.city) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.city');
						return false;
					} else if (!shipping.selectedState || shipping.selectedState === '-1') {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.state');
						return false;
					}  else if (!shipping.zipCode) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.zipCode');
						return false;
					} else if (!globalValidationService.isValidPostalCode(shipping.zipCode, shipping.selectedCountry)) {
						$scope.showMessageAndFocus('msg.ppos.invalidzipCode');
						return false;
					} else if (!shipping.selectedCountry || shipping.selectedCountry === '-1') {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.country');
						return false;
					} else if (!shipping.phoneNumber) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.phoneNumber');
						return false;
					} else if (!globalValidationService.isValidPhoneNumber(shipping.phoneNumber)) {
						$scope.showMessageAndFocus('msg.ppos.invalidPhoneNumber');
						return false;
					} else if (shipping.email === undefined || !shipping.email || 
						!globalValidationService.isEmailValid(shipping.email)) {
						$scope.showMessageAndFocus('msg.ppos.invalidEmail');
						return false;
					} else if (!shipping.selectedShippingMethod) {
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						return false;
					}
					return true;
				}

				function prepareContactDetail (shipping) {
					var contactDetail = {
						'phone1' : shipping.phoneNumber.replace(/\D/g, ''), //send only numbers to API
						'email' : shipping.email,
						'person' : {
							'firstName' : shipping.firstName,
							'lastName' :shipping.lastName
						},
						'address' : {
							'street1' : shipping.streetAddress,
							'street2' : shipping.optionalAddress,
							'city' : shipping.city,
							'postalCode' : shipping.zipCode,
							'state' : shipping.selectedState,
							'country' : shipping.selectedCountry
						}
					};
					return contactDetail;
				}

			}]);
}(window.angular));
;/*! UnlockScreenController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('unlockScreenController',
        ['$log', '$scope', '$location', 'dataStorageService',
		function ($log, $scope, $location, dataStorageService) {

			$scope.unlockScreenDataModel = {
				loggedInCSR : null,
				pinEntered : '',
				pinButtons : [],
				showPinDoesNotMatchErrorMessage : false
			};

			$scope.initializeUnlockScreenDataModel = function () {
				$scope.unlockScreenDataModel.loggedInCSR = dataStorageService.getLoggedInCSR();
				$scope.unlockScreenDataModel.pinEntered = '';
				$scope.unlockScreenDataModel.pinButtons = [
					{
						'label': '1',
						'value': '1'
					},
					{
						'label': '2',
						'value': '2'
					},
					{
						'label': '3',
						'value': '3'
					},
					{
						'label': '4',
						'value': '4'
					},
					{
						'label': '5',
						'value': '5'
					},
					{
						'label': '6',
						'value': '6'
					},
					{
						'label': '7',
						'value': '7'
					},
					{
						'label': '8',
						'value': '8'
					},
					{
						'label': '9',
						'value': '9'
					},
					{
						'label': '0',
						'value': '0'
					},
					{
						'label': 'Delete',
						'value': 'Delete'
					}
				];
			};

			$scope.selectPin = function (pinButtonValue) {
				if (pinButtonValue === 'Delete') {
					$scope.deletePin();
				} else if (pinButtonValue !== 'Delete') {
					if ($scope.unlockScreenDataModel.pinEntered.length < 6) {
						$scope.unlockScreenDataModel.pinEntered = 
							$scope.unlockScreenDataModel.pinEntered + pinButtonValue;
					}

					if ($scope.unlockScreenDataModel.pinEntered.length === 6) {
						$scope.unlockScreen();
					}
				}
			};

			$scope.unlockScreen = function () {
				if ($scope.unlockScreenDataModel.pinEntered === dataStorageService.getLoggedInCSR().pin) {
					dataStorageService.setScreenLocked('false');

					// Fire screen unlocked event back upwards using $scope.$emit
					$scope.$emit('screenUnlocked');

					// Navigate to dashboard.
					$location.path('/dashboard');
				} else {
					$scope.unlockScreenDataModel.pinEntered = '';
					$scope.unlockScreenDataModel.showPinDoesNotMatchErrorMessage = true;
				}
			};

			$scope.deletePin = function () {
				if ($scope.unlockScreenDataModel.pinEntered.length) {
					// Remove last character.
					$scope.unlockScreenDataModel.pinEntered = 
						$scope.unlockScreenDataModel.pinEntered.substr(
							0, $scope.unlockScreenDataModel.pinEntered.length - 1);
				}
			};
			
			// Initialize model for view.
			$scope.initializeUnlockScreenDataModel();
        }]);
}(window.angular));
;/*! AccountService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('accountService', 
		['dataService', function (dataService) {

		return {
			createGuestCustomer : function (customerDetail) {
				var serviceUrl = '/api/account/customers';

                return dataService.postData(serviceUrl, customerDetail);
            },
			
			createCustomer : function (customerDetail) {
				var serviceUrl = '/api/account/customers';

                return dataService.postData(serviceUrl, customerDetail);
            },
			
			createContact : function (customerId, contactDetail) {
				var serviceUrl = '/api/account/customers/' + customerId + '/contacts';

				return dataService.postData(serviceUrl, contactDetail);
			},

			updateCustomer : function (customerId, customerDetail) {
				var serviceUrl = '/api/account/customers/' + customerId;

				return dataService.putData(serviceUrl, customerDetail);
			},
			
			
			getCustomerById : function (customerId) {
				var serviceUrl = '/api/account/customers/' + customerId;

				return dataService.getData(serviceUrl);
			},
			
			getContactById : function (contactId) {
				var serviceUrl = '/api/account/contacts/' + contactId;

				return dataService.getData(serviceUrl);
			},

			updateContact : function(customerId, contactId, contactToUpdate) {
				var serviceUrl = '/api/account/customers/' + customerId + '/contacts/' + contactId;
				
				return dataService.putData(serviceUrl, contactToUpdate);
			},

			getSecurityQuestions : function () {
				var serviceUrl = '/api/account/hints';

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
;/*! AncillaryService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('ancillaryService', 
		['dataService', function (dataService) {

		return {
			
			emailSignup : function (emailSignup) {
				var serviceUrl = '/api/ancillary/emailsignup';

				return dataService.postData(serviceUrl, emailSignup);
			}
		};
	}]);
}(window.angular));
;/*! AppService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    /**
     * A generic service used to communicate, at a global level, with the app's rootScope
     */
    angular.module('pointOfSaleApplication').service('appService',
        ['$rootScope', function ($rootScope) {

            return {
                /**
                 * This function activates/displays the application spinner.
                 */
                activateSpinner: function () {
                    $rootScope.$broadcast('toggleSpinner', {active: true});
                },

                /**
                 * This function de-activates/hides the application spinner.
                 */
                deactivateSpinner: function () {
                    $rootScope.$broadcast('toggleSpinner', {active: false});
                }
            };
        }]);
}(window.angular));
;/*! BasketService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('basketService', 
		['$q', 'dataService', 'configService',
		function ($q, dataService, configService) {

		return {

			isAutoSaveBag : function () {
				var isAutoSaveBag = configService.
					getConfig('app.ppos.basket.autoSaveCart');

				return isAutoSaveBag;
			},
			
			saveBag : function (basketId, csrId) {
				var serviceUrl = '/api/baskets/' + basketId + '/markAsSaved?csrID=' + csrId;

				return dataService.putData(serviceUrl);
			},

			/**
			 * This function returns baskets created by given CSR
			 * 
			 * @param {Number} csrId - The ID of the CSR.
			 */
			getBasketsForCSRByDateRange : function (csrId, hourRange) {
				var serviceUrl = 
					'/api/baskets/csrs/' + csrId + '?hourRange=' + hourRange;

				return dataService.getData(serviceUrl);
			},

			/**
			 * This function creates new basket for the given customer ID.
			 * 
			 * @param {Number} customerId - The ID of the customer to create basket for.
			 * @param {Number} csrId - The ID of the CSR creating basket for customer.
			 */
			createBasket : function (customerId, csrId) {
                var serviceUrl = '/api/baskets/customers/' + customerId;

				if (csrId) {
					serviceUrl = serviceUrl + '?csrID=' + csrId;
				}

                return dataService.postData(serviceUrl);
            },

            /**
			 * This function creates new guest customer and basket for that guest customer.
			 * 
			 * @param {Number} storeId - The ID of the store.
			 * @param {Number} csrId - The ID of the CSR creating basket for customer.
			 * @param {String} phone - The phone of the customer.
			 */
			createGuestBasket : function (storeId, csrId, phone) {
                var serviceUrl = '/api/baskets/newGuestBasket?phone=' + phone;

				if (storeId) {
					serviceUrl = serviceUrl + '&storeID=' + storeId;
				}

				if (csrId) {
					serviceUrl = serviceUrl + '&csrID=' + csrId;
				}

                return dataService.postData(serviceUrl);
            },
			
			/**
			 * This function deletes basket based on the given basket ID.
			 * 
			 * @param {Number} basketId - The ID of the basket to delete.
			 */
			deleteBasket : function (basketId) {
                var serviceUrl = '/api/baskets/' + basketId;

                return dataService.deleteData(serviceUrl);
            },

			/**
			 * This function gets basket details based on the given basket ID.
			 * 
			 * @param {Number} basketId - The ID of the basket to get details.
			 */
			getBasketById : function (basketId) {
				var serviceUrl = '/api/baskets/' + basketId;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function adds the given item to basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to add item to.
			 * @param {Object} {
			 *			productID: Number,
			 *			skuID: Number,
			 *			qty: Number,
			 *			storeID: Number
			 *		} itemToAdd - The item to add object.
			 */
			addItemToBasket : function (basketId, itemToAdd) {
				var serviceUrl = '/api/baskets/' + basketId;

				return dataService.postData(serviceUrl, itemToAdd);
			},
			
			/**
			 * This function updates the given basket items.
			 * 
			 * @param {Number} basketId - The ID of the basket to update items.
			 * @param {Object} {basketItems: [].{
			 *			basketItemID: Number,
			 *			productID: Number,
			 *			skuID: Number,
			 *			qty: Number,
			 *			storeID: Number
			 *		}} basketItems - An array of basket items to update.
			 */
			updateBasketItems : function (basketId, basketItems) {
				var serviceUrl = '/api/baskets/' + basketId + '/items';

				return dataService.putData(serviceUrl, basketItems);
			},
			
			/**
			 * This function deletes item from basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to delete basket item from.
			 * @param {Number} basketItemId - The ID of the basket item to delete.
			 */
			removeItemFromBasket : function (basketId, basketItemId) {
				var serviceUrl = '/api/baskets/' + basketId + '/items/' + basketItemId;

				return dataService.deleteData(serviceUrl);
			},
			
			/**
			 * This function applies given source code to basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to apply source code.
			 * @param {String} sourceCode - The source code to apply.
			 */
			addSourceCode : function (basketId, sourceCode) {
				var sourceCodeDetail = {
					sourceCode : sourceCode
				};

				var serviceUrl = '/api/baskets/' + basketId + '/sourcecode';

				return dataService.postData(serviceUrl, sourceCodeDetail);
			},
			
			/**
			 * This function removes given source code from basket.
			 * 
			 * @param {Number} basketId - The ID of the basket to remove source code.
			 * @param {String} sourceCode - The source code to remove.
			 */
			removeSourceCode : function (basketId, sourceCode) {
				var serviceUrl = '/api/baskets/' + basketId + '/sourcecode/' + sourceCode;

				return dataService.deleteData(serviceUrl);
			}
		};
	}]);
}(window.angular));
;/*! CSRService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('csrService',
		['dataService', 'dataStorageService', '$location', 'globalValidationService', 'csrValidationService',
		function (dataService, dataStorageService, $location, globalValidationService, csrValidationService) {

			return {
				getAllCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getActiveCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&status=1&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getInActiveCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&status=0&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getCSRById : function (csrId) {
					var serviceUrl = '/api/csrs/' + csrId;

					return dataService.getData(serviceUrl);
				},

				getCSRByEmail : function (email) {
					var serviceUrl = '/api/csrs/email/' + email +'/';

					return dataService.getData(serviceUrl);
				},
				
				createCSR : function (csrToAdd) {
					var serviceUrl = '/api/csrs';

					return dataService.postData(serviceUrl, csrToAdd);
				},
				
				updateCSR : function (csrId, updateData) {
					var serviceUrl = '/api/csrs/' + csrId;

					return dataService.putData(serviceUrl, updateData);
				},

				deleteCSR : function (csrId) {
					var serviceUrl = '/api/csrs/' + csrId + '/Application/PPOS';
 
					return dataService.deleteData(serviceUrl);
				},

				getCSRPermissions : function (csrTypeId) {
					var serviceUrl = '/api/csrs/permissions?typeID=' + csrTypeId;

					return dataService.getData(serviceUrl);
				},

				getCSRTypes : function() {
					// Get only PPOS Roles (CSRTypes) & exclude 'Admin' role from that list.
					var serviceUrl = '/api/csrs/types?application=PPOS&excludedTypeIDs=12';

					return dataService.getData(serviceUrl);
				},

				getCSRTypePermission : function(csrTypeCode) {
					var serviceUrl = '/api/csrs/permissions?typeID=' + csrTypeCode;

					return dataService.getData(serviceUrl);
				},

				updateCSRPassword : function (csrId, updateData) {
					var serviceUrl = '/api/csrs/password/' + csrId;

					return dataService.putData(serviceUrl, updateData);
				},


				/**
				* Method to move to management screen
				*/
				goToManagementScreen : function () {
					$location.path('/management');
				},

				/**
				* Method to move to management screen
				*/
				goToCsrListScreen : function () {
					$location.path('/csrList');
				},

				/**
				* This is to clear pre-populated content of element.
				*/
				clearContent : function (elementId, csr) {
					angular.element('#'+elementId).val('');
					this.clearPIN(elementId, csr);
				},

				/**
				* Method to clear pin values.
				*/
				clearPIN : function (elementId, csr) {
					if (elementId === 'pin1') {
						csr.pin1 = '';
					}
					if (elementId === 'pin2') {
						csr.pin2 = '';
					}
					if (elementId === 'pin3') {
						csr.pin3 = '';
					}
					if (elementId === 'pin4') {
						csr.pin4 = '';
					}
					if (elementId === 'pin5') {
						csr.pin5 = '';
					}
					if (elementId === 'pin6') {
						csr.pin6 = '';
					}
				},

				/**
				* Method to set active status
				*/
				setStatus : function (activeStatus, csr) {
					csr.activeStatus = activeStatus;
				},
				
				/**
				* Method to show hide the permission div
				*/
				showHidePermission : function () {
					var elmt = angular.element('#permissionDivElement');
					if(elmt.hasClass('ml-icon-plus')) {
						elmt.addClass('ml-icon-minus');
						elmt.removeClass('ml-icon-plus');
						document.getElementById('collapseDiv').style.display = 'block'; 
					} else {
						elmt.addClass('ml-icon-plus');
						elmt.removeClass('ml-icon-minus');
						document.getElementById('collapseDiv').style.display = 'none';
					}
				},

				/**
				* Clears CSR fields.
				*/
				clearCSR : function (storeAssociateRoleCode, storeManagerRoleCode, csr) {
					csr.employeeId = null;
					csr.firstName = null;
					csr.lastName = null;
					csr.email = null;
					csr.password = null;
					csr.confirmPassword = null;
					csr.unlockPosPin = '000000';
					csr.activeStatus = false;
					csr.pin1 = '0';
					csr.pin2 = '0';
					csr.pin3 = '0';
					csr.pin4 = '0';
					csr.pin5 = '0';
					csr.pin6 = '0';
					csr.showCsrOpFailureMessage = false;
					csr.csrOpFailureMessage = null;
					// Select inactive by default
					if(angular.element('#lblActive').hasClass('active')) {
						angular.element('#lblActive').toggleClass('active');
						angular.element('#lblInactive').toggleClass('active');
					}

					if (csr.roleType.length === 2) {
						var storeAssociateRoleId = 
						this.getStoreAssociateRoleName(csr.roleType, storeAssociateRoleCode);
						var storeManagerRoleId = 
						this.getStoreAssociateRoleName(csr.roleType, storeManagerRoleCode);
						csr.selectedRole = storeAssociateRoleId;
						if(angular.element('#lblRoleRadio' + storeManagerRoleId).hasClass('active')) {
							angular.element('#lblRoleRadio' + storeManagerRoleId).toggleClass('active');
							angular.element('#lblRoleRadio' + storeAssociateRoleId).toggleClass('active');
						}
					} else {
						csr.selectedRole = '';
						document.getElementById('roleTypeSelect').selectedIndex = '0';
					}
					this.populateCSRTypeDetails(csr.selectedRole);
				},

				/**
				* This method is returns the id of a roleType.
				*/
				getStoreAssociateRoleName : function (roleTypeList, roleType) {
					var csrRoleId = '';
					if(roleTypeList && roleTypeList.length > 0) {
						for (var index = 0; index < roleTypeList.length; index++) {
							if(roleTypeList[index].code === roleType) {
								csrRoleId =  roleTypeList[index].id;
								break;
							}
						}
					}
					return csrRoleId;
				},
				
				/**
				* On unlock pin text boxes, this method checks if entered value is a digit,
				* if yes, then it moves the focus to next text box.
				*/
				moveOnNext : function (txtValue, currentFieldId, nextFieldID, csr) {					
					// if the entered value is numeric, focus on next field
					if(globalValidationService.isNumber(txtValue)) {
						csr.showCsrOpFailureMessage = false;
						var elmtId = '#' + nextFieldID;
						angular.element(elmtId).focus();
					} else { // if the entered value is non numeric, remain on current field, clear non numeric value
						angular.element('#'+currentFieldId).val('');
						this.clearPIN(currentFieldId, csr);
						csrValidationService.showMessageAndFocus('msg.ppos.invalidUnlockPIN',currentFieldId, csr);
					}
				},

				
				/**
				This method gets role's (CSRType's) permissions from REST & populate that on UI
				*/
				populateCSRTypeDetails : function (csrTypeId) {
					if (csrTypeId === '')	{ //dont hit api (but do clear the html) if first one is selected
						document.getElementById('permissionListDiv').innerHTML = '';
					} else {
						document.getElementById('permissionListDiv').innerHTML = ''; 
						document.getElementById('permissionListDiv').style.display = 'none';
						var permissionHtml = ''; var idx = 0;
						this.getCSRTypePermission(csrTypeId).then(
							function (successResult) {
								document.getElementById('permissionListDiv').style.display = '';
								var orderAdministration = [];
								var productAdministration = [];
								var customerManagement = [];
								var storeManagement = [];
								for (var ctr = 0; ctr < successResult.data.length; ctr++) {
									if (successResult.data[ctr].permissionCategory === 'Order Administration') {
										orderAdministration.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Customer Management') {
										customerManagement.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Product Administration') {
										productAdministration.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Store Management') {
										storeManagement.push(successResult.data[ctr].description + '<br />');
									}
								}
								// Lists populated, now start filling in div
								if(orderAdministration.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
									'<div class="ml-ppos-add-csr-permission-title">Order Administration</div>';
									for(idx = 0; idx < orderAdministration.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											orderAdministration[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								if(productAdministration.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
										'<div class="ml-ppos-add-csr-permission-title">Product Administration</div>';
									for(idx = 0; idx < productAdministration.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											productAdministration[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								if(customerManagement.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
										'<div class="ml-ppos-add-csr-permission-title">Customer Management</div>';
									for(idx = 0; idx < customerManagement.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											customerManagement[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								
								if(storeManagement.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' +
										'<div class="ml-ppos-add-csr-permission-title">Store Management</div>';
									for(idx = 0; idx < storeManagement.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											storeManagement[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								document.getElementById('permissionListDiv').innerHTML = permissionHtml;
							}, function (errorResult) {
								console.log('ErrorResult - Error occurred while getting permissions : ' + errorResult);
							}
						);
					}
				}
			};
	}]);
}(window.angular));
;
/*! GlobalValidationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('csrValidationService',
		['globalValidationService', '$translate',
		function (globalValidationService, $translate) {
    
		return {

				/**
				* Validate CSR fields
				*/
				validateCSR : function (csr, addOrEdit) {
					if (!csr.firstName) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName', csr);
						return false;
					} else if (!csr.lastName) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName', csr);
						return false;
					} else if (csr.email === undefined || !csr.email ||
						!globalValidationService.isEmailValid(csr.email)) {
						this.showMessageAndFocus('msg.ppos.invalidEmail', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.password) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.password', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.confirmPassword) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword', csr);
						return false;
					} else if (addOrEdit === 'add' && csr.password !== csr.confirmPassword) {
						this.showMessageAndFocus('msg.ppos.passwordNotMatch', csr);
						return false;
					} else if (addOrEdit === 'add' && !globalValidationService.isPasswordValid(csr.password)) {
						this.showMessageAndFocus('msg.ppos.invalidPassword', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.unlockPosPin) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.unlockPosPIN', csr);
						return false;
					} else if (addOrEdit === 'add' && csr.unlockPosPin.length !== 6) {
						if (csr.pin1 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else  if (csr.pin2 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin3 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin4 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin5 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin6 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						}
					} else if (addOrEdit === 'add' && csr.unlockPosPin === '000000') {
						this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
						return false;
					} else if (!csr.selectedRole) {
						this.showMessageAndFocus('msg.ppos.invalidRole', csr);
						return false;
					}
					return true;
				},

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				createEmptyFieldMsgAndDisplay : function (fieldNamePath, csr) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							csr.showCsrOpFailureMessage = true;
							csr.csrOpFailureMessage = genericMessage;
							angular.element('#saveButton').focus();
						});
					});
				},
				
				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				showMessageAndFocus : function (msgPath, csr) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						csr.showCsrOpFailureMessage = true;
						csr.csrOpFailureMessage = msg;
						angular.element('#saveButton').focus();
					});
				}

		};
	}]);
}(window.angular));
;/*! CardReaderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('cardReaderService',
        ['$q', '$log', 'dataService', function ($q, $log, dataService) {
            return {
                /**
                 * This function activates the card reader sdk
                 * @returns {*} A deferred.promise
                 */
                activateSDK: function () {
                    $log.debug('cardReaderService: activateSDK');

                    var deferred = $q.defer();

                    if (!window.unimag.isSDKActive()) {
                        window.unimag.activateSDK(function () {
                            $log.debug('cardReaderService: activateSDK: activated');
                            deferred.resolve({'status': 'activated'});
                        });
                    } else {
                        $log.debug('cardReaderService: activateSDK: already active');
                        deferred.resolve({'status': 'already active'});
                    }

                    return deferred.promise;
                },

                /**
                 * This function tells the card reader to prepare for a card scan.
                 * @returns {*} A deferred.promise
                 */
                scanCard: function () {
                    $log.debug('cardReaderService: scanCard');

                    var deferred = $q.defer();
                    window.unimag.startTaskSwipe(function (task, taskNotif, info) {
                        $log.debug('cardReaderService: scanCard: startTaskSwipe: ' + taskNotif);

                        var E = window.unimag.TaskNotifEnum;
                        switch (taskNotif) {
                            case E.StartFailed:
                                deferred.reject(task + ' task failed to start: ' + info.StartFailedReason);
                                break;
                            case E.Started:
                                break;
                            case E.Stopped:
                                if (!info.ok) {
                                    deferred.reject('swipe failed');
                                }
                                if (info.data) {
                                    deferred.resolve(info.data);
                                }
                                break;
                        }
                    });

                    return deferred.promise;
                },

                /**
                 * This function tries to connect to the card reader device.
                 * @returns {*} A deferred.promise
                 */
                readerConnect: function () {
                    $log.debug('cardReaderService: readerConnect');

                    var deferred = $q.defer();

                    window.unimag.isReaderConnected(function (connected) {
                        $log.debug('cardReaderService: readerConnect: connected: ' + connected);

                        if (connected) {
                            $log.debug('cardReaderService: readerConnect: already connected');
                            deferred.resolve('Connected');
                        } else {
                            $log.debug('cardReaderService: readerConnect: connecting');
                            window.unimag.startTaskConnect(function (task, taskNotif, info) {
                                $log.debug('cardReaderService: readerConnect: startTaskConnect' + taskNotif);
                                var E = window.unimag.TaskNotifEnum;
                                switch (taskNotif) {
                                    case E.StartFailed:
                                        deferred.reject(task + ' task failed to start: ' + info.StartFailedReason);
                                        break;
                                    case E.Started:
                                        break;
                                    case E.Stopped:
                                        if (!info.ok) {
                                            deferred.reject('Timed-out');
                                        } else {
                                            deferred.resolve('Connected');
                                        }
                                        break;
                                }
                            });
                        }
                    });

                    return deferred.promise;
                },

                /**
                 * This function tries to clear any running tasks.
                 * @returns {*} A deferred.promise
                 */
                clearRunningTasks: function () {
                    $log.debug('cardReaderService: clearRunningTasks');

                    var deferred = $q.defer();

                    if (window.unimag.isSDKActive()) {
                        window.unimag.getRunningTask(function (task) {
                            $log.debug('cardReaderService: clearRunningTasks: task: ' + task);
                            if (task) {
                                window.unimag.stopTask();
                                deferred.resolve('tasks cleared');
                            } else {
                                deferred.resolve('no task to clear');
                            }
                        });
                    } else {
                        $log.debug('cardReaderService: clearRunningTasks: no running tasks');
                        deferred.resolve('no task to clear');
                    }

                    return deferred.promise;
                },

                /**
                 * This function tries to authorize the credit card with a post to the back-end.
                 * @param basketId The id of the basket.
                 * @param data The json data to send to the back-end during the post.
                 * @returns {*} A deferred.promise
                 */
                authorizeCard: function (basketId, data) {
                    $log.debug('cardReaderService: authorizeCard');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment/authorize';

                    return dataService.postData(serviceUrl, data);
                }
            };
        }]);
}(window.angular));;(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('configService',
        ['$q', '$translate', '$log', 'dataStorageService', 'dataService', 
		function ($q, $translate, $log, dataStorageService, dataService) {

            var typeConfiguration = 'configuration';
            var typeResources = 'resources';

            function isEmptyObject(obj) {
                if (obj !== null) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                return true;
            }

            function getProperties(type) {
				return dataStorageService.getProperties(type);
            }

            function setProperties(type, properties) {
				dataStorageService.setProperties(type, properties);
            }

            function reset(type) {
                var properties = {};
                setProperties(type, properties);
            }

            function initPropertiesResults(type, results) {
                if (results !== null) {
                    var properties = getProperties(type);
                    for (var key in results) {
                        if (results.hasOwnProperty(key)) {
                            properties[key] = results[key];
                        }
                    }
                    setProperties(type, properties);
                }
            }

            function initBootstrapProperties(type, bootstrapPath) {
                var deferred = $q.defer();

                try {
                    var properties = getProperties(type);
                    if (properties === null || properties === undefined) {
                        reset(type);
                    }

                    // Populate sessionStorage with configs when configurations is empty
                    if (isEmptyObject(properties)) {
                        var serviceUrl = '/api/registry/configs/bootstrap?' +
                            'path=' + bootstrapPath + '&configType=' + type;
                        dataService.getData(serviceUrl).then(
                            function (successResult) {
                                if (successResult) {
                                    initPropertiesResults(type, successResult.data);
                                    if (type === typeResources) {
                                        // If type is resources then refresh translation table.
                                        $translate.refresh();
                                    }
                                    deferred.resolve(getProperties(type));
                                }
                            }, function (errorResult) {
                                deferred.reject(errorResult);
                                $log.error(errorResult);
                            }
                        );
                    } else {
                        deferred.resolve(getProperties(type));
                    }
                } catch (err) {
                    deferred.reject(err);
                    $log.error(err);
                }

                return deferred.promise;
            }

            function getProperty(type, path) {
                var properties = getProperties(type);
                return properties[path];
            }

            return {
                init: function () {
                    var deferred = $q.defer(), self = this;

                    self.initProperties(typeConfiguration, 'ppos.bootstrap.properties').then(function () {
                            self.initProperties(typeResources, 'ppos.bootstrap.resources').then(function () {
                                    deferred.resolve({'success': true});
                                },
                                function (errorResult) {
                                    deferred.reject(errorResult);
                                    $log.error(errorResult);
                                });
                        },
                        function (errorResult) {
                            deferred.reject(errorResult);
                            $log.error(errorResult);
                        }
                    );

                    return deferred.promise;
                },
                getConfig: function (path) {
                    try {
                        return getProperty(typeConfiguration, path);
                    } catch (err) {
                        $log.error(err);
                        return path;
                    }
                },
                initProperties: function (type, bootstrapPath) {
                    return initBootstrapProperties(type, bootstrapPath);
                },
                setProperties: function (type, properties) {
                    return setProperties(type, properties);
                },
                reset: function (type) {
                    return reset(type);
                }
            };
        }]);
}(window.angular));
;/*! CustomerSearchService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('customerSearchService', 
		['dataService', function (dataService) {

		return {

			/**
			* search customers having phone number supplied as arguement.
			**/
			searchCustomerByPhoneNumber : function (customerPhoneNumber) {
				var serviceUrl = '/api/account/customers?q=' + customerPhoneNumber + '&query_fields=phone';

				return dataService.getData(serviceUrl);
			},

			/**
			*search existing customer having same email as supplied in arguement.
			**/
			searchCustomerByEmail : function (customerEmail) {
				var serviceUrl = '/api/account/customers?q=' + customerEmail + '&query_fields=email';

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
;/*! PaginationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('dataService', 
		['$http', '$q', 'dataStorageService', 
		function ($http, $q, dataStorageService) {

		var dataServiceOperations = {

			/**
			 * GET request.
			 */
			getData : function (serviceUrl) {
				var urlBase = dataStorageService.getUrlBase();

				var accessToken = dataStorageService.getAccessToken();

				var deferred = $q.defer();

				// Send GET request.
				$http({
                    method : 'GET',
                    url : urlBase + serviceUrl,
                    headers : { 
						'Accept' : 'application/json', 
						'Authorization' : 'Bearer ' + accessToken },
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						deferred.reject({'data' : data, 'status' : status, 'headers' : headers, 'config' : config});
					});

				return deferred.promise;
			},

			/**
			 * POST request.
			 */
			postData : function (serviceUrl, jsonDataToPost) {
				var urlBase = dataStorageService.getUrlBase();

				var accessToken = dataStorageService.getAccessToken();

				var deferred = $q.defer();

				// Send POST request.
				$http({
                    method : 'POST',
                    url : urlBase + serviceUrl,
                    headers : { 
						'Accept' : 'application/json', 
						'Authorization' : 'Bearer ' + accessToken },
					data :  jsonDataToPost,
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						deferred.reject({'data' : data, 'status' : status, 'headers' : headers, 'config' : config});
					});
				
				return deferred.promise;
			},
			
			/**
			 * PUT request.
			 */
			putData : function (serviceUrl, jsonDataToPut) {
				var urlBase = dataStorageService.getUrlBase();

				var accessToken = dataStorageService.getAccessToken();

				var deferred = $q.defer();

				// Send PUT request.
				$http({
                    method : 'PUT',
                    url : urlBase + serviceUrl,
                    headers : { 
						'Accept' : 'application/json', 
						'Authorization' : 'Bearer ' + accessToken },
					data :  jsonDataToPut,
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						deferred.reject({'data' : data, 'status' : status, 'headers' : headers, 'config' : config});
					});
				
				return deferred.promise;
			},
			
			/**
			 * DELETE request.
			 */
			deleteData : function (serviceUrl) {
				var urlBase = dataStorageService.getUrlBase();

				var accessToken = dataStorageService.getAccessToken();

				var deferred = $q.defer();

				// Send DELETE request.
				$http({
                    method : 'DELETE',
                    url : urlBase + serviceUrl,
                    headers : { 
						'Accept' : 'application/json', 
						'Authorization' : 'Bearer ' + accessToken },
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						deferred.reject({'data' : data, 'status' : status, 'headers' : headers, 'config' : config});
					});
				
				return deferred.promise;
			}
		};

		return dataServiceOperations;
	}]);
}(window.angular));
;/*! DataStorageService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('dataStorageService',
		function () {
    
		return {
			getProperties : function (type) {
                var properties = JSON.parse(sessionStorage.getItem(type));
                return properties;
            },

            setProperties : function (type, properties) {
                sessionStorage.setItem(type, JSON.stringify(properties));
            },

			isLoggedIn : function () {
				var isLoggedIn = sessionStorage.loggedIn;

				if (isLoggedIn === 'true') {
					return true;
				} else {
					return false;
				}
			},
			
			setLoggedIn : function (loggedIn) {
				sessionStorage.loggedIn = loggedIn;
			},

			getLoggedInCSR : function () {
				if (sessionStorage.loggedInCSR) {
					var loggedInCSRDetails = JSON.parse(sessionStorage.loggedInCSR);
					return loggedInCSRDetails;
				} else {
					return null;
				}
			},
			
			setLoggedInCSR : function (loggedInCSR) {
				var loggedInCSRDetails = JSON.stringify(loggedInCSR);
				sessionStorage.loggedInCSR = loggedInCSRDetails;
			},
			
			isScreenLocked : function () {
				var isScreenLocked = sessionStorage.screenLocked;

				if (isScreenLocked === 'true') {
					return true;
				} else {
					return false;
				}
			},
			
			setScreenLocked : function (screenLocked) {
				sessionStorage.screenLocked = screenLocked;
			},

			getUrlBase : function () {
				return localStorage.urlBase;
			},
			
			setUrlBase : function (urlBase) {
				localStorage.urlBase = urlBase;
			},

            getRemoteAssetUrl : function () {
                return sessionStorage.remoteAssetUrl;
            },

            setRemoteAssetUrl : function (remoteAssetUrl) {
                sessionStorage.remoteAssetUrl = remoteAssetUrl;
            },
			
			getStoreCode : function () {
				return localStorage.storeCode;
			},
			
			setStoreCode : function (storeCode) {
				localStorage.storeCode = storeCode;
			},

            getStoreId : function () {
				var store = this.getStore();

				if (store) {
					return store.id;
				} else {
					return null;
				}
            },
			
			getStoreName : function () {
				return localStorage.storeName;
			},
			
			getStore : function () {
				if (sessionStorage.store) {
					var storeDetails = JSON.parse(sessionStorage.store);
					return storeDetails;
				} else {
					return null;
				}
				
			},
			
			setStore : function (store) {
				var storeDetails = JSON.stringify(store);
				sessionStorage.store = storeDetails;

				// Whenever store details are set in session storage
				// set store name in local storage. Because we want store name
				// before login.
				localStorage.storeName = store.name;
			},
			
			getAccessToken : function () {
				return sessionStorage['access_token'];
			},
		
			setAccessToken : function (accessToken) {
				sessionStorage['access_token'] = accessToken;
			},

			getRefreshToken : function () {
				return sessionStorage['refresh_token'];
			},
		
			setRefreshToken : function (refreshToken) {
				sessionStorage['refresh_token'] = refreshToken;
			},
		
			getCustomerId : function () {
				return sessionStorage.customerId;
			},
		
			setCustomerId : function (customerId) {
				sessionStorage.customerId = customerId;
			},
		
			getBasketId : function () {
				return sessionStorage.basketId;
			},

            getFinalizedOrderId : function () {
                return sessionStorage.finalizedOrderId;
            },
		
			setBasketId : function (basketId) {
				sessionStorage.basketId = basketId;
			},

            setFinalizedOrderId : function (orderId) {
                sessionStorage.finalizedOrderId = orderId;
            },

			getLoggedInUsersPosSettings : function () {
				var userPosSettings = null;
				if (sessionStorage.posSettings) {
					userPosSettings = JSON.parse(sessionStorage.posSettings);
				}
				return userPosSettings;
			},
			
			setLoggedInUsersPosSettings : function (posSettings) {
				var userPosSettings = JSON.stringify(posSettings);
				sessionStorage.posSettings = userPosSettings;
			},

            removeItem : function (key){
                sessionStorage.removeItem(key);
            },

			getPaymentChange: function () {
				var paymentChange = sessionStorage.paymentChange;

				this.removeItem('paymentChange');

				return paymentChange;
			},

			setPaymentChange : function (paymentChange) {
				sessionStorage.paymentChange = paymentChange;
			},

            setStarMicronicsPrinterName: function(printerName){
                sessionStorage.starMicronicsPrinterName = printerName;
            },

            getStarMicronicsPrinterName: function(){
                return sessionStorage.starMicronicsPrinterName;
            },

            isPrinterConnected: function(){
				var isPrinterConnected = sessionStorage.isPrinterConnected;

				if (isPrinterConnected === 'true') {
					return true;
				} else {
					return false;
				}
            },

            setPrinterConnected: function(bol){
                sessionStorage.isPrinterConnected = bol;
            }


		};
	});
}(window.angular));
;/*! GeoService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('geoService',
        ['$log', '$q', function ($log, $q) {

			return {

				getUserGeoLocation : function () {
					var deferred = $.Deferred();

					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
					}

					return deferred.promise();
				},
				
				getGeoLocationByAddress : function (address) {
					var deferred = $q.defer();

					var geocoder = new google.maps.Geocoder();

					geocoder.geocode( {'address' : address}, function (results, status) {
						if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
							$log.debug('Zero Result found for address : ' + address);
							// Reject the promise.
							deferred.reject(status);
						} else if (status === google.maps.GeocoderStatus.OK) {
							if (results.length >= 1) {
								var result0 = results[0];
								$log.debug('Formatted Address : ' + result0['formatted_address']);
								// Resolve the promise.
								deferred.resolve(result0.geometry.location);
							}
						}
					});

					return deferred.promise;
				}
			};
        }]);
}(window.angular));
;/*! GlobalValidationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('globalValidationService',
		function () {
    
		return {

			/**
			* Method to check if the email is valid.
			*/
			isEmailValid : function (email) {
				if (!email.match(/(\w+[\w|\.|-]*\w+)(@\w+[\w|\.|-]*\w+\.\w{2,4})/)) {
					return false;			
				} 
				return true;
			},

			/**
			* Method to check if password is valid, a combination of characters & digits.
			*/
			isPasswordValid : function (password) {
				if (password.length < 7 || password.length > 50) {
					return false;
				} else if (!password.match(/(([0-9]+[a-zA-Z]+)|([a-zA-Z]+[0-9]+))([a-zA-Z0-9]*)/)) {
					return false;			
				}
				return true;
			},

			/**
			* Method to check if the passed argument is a digit
			*/
			isNumber : function(txtToCheck) {
				if(null != txtToCheck && txtToCheck.match(/^[0-9]+$/)) {
					return true;
				} else {
					return false;
				}
			},
			
			/**
			* Method to check if phone number is valid.
			*/
			isValidPhoneNumber : function (phoneNumber) {				
				/*var isPhoneNumberRegularExpression = /^\d{10}$/;
				return String(phoneNumber).search(isPhoneNumberRegularExpression) !== -1;*/
				var onlyNumbers = phoneNumber.replace(/\D/g, '');
				if (onlyNumbers.length < 10 || onlyNumbers.length > 20) {
					return false;
				} else {
					var phoneRegEx = new RegExp(/^[- +()]*[0-9][- +()0-9]*$/);
					return phoneRegEx.test(phoneNumber);
				}
			},

			/**
			This method accepts a postal code
			and returns true if the postal code is valid
			*/
			isValidPostalCode : function (postalCode, countryCode) {
				if (postalCode.length < 5 || postalCode.length > 15) {
					return false;
				}
				var caRegex = 
					new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
				var usRegex = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
				if (countryCode === 'US' || countryCode === 'CA') {
					if (countryCode === 'US') {
						return usRegex.test(postalCode);
					} else if (countryCode === 'CA') {
						return caRegex.test(postalCode);
					}
				} else {
					return true;
				}
			}

		};
	});
}(window.angular));

;/*! GoogleMapsInitializer.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').factory('googleMapsInitializer',
        ['$window', '$q', function ($window, $q) {

			var googleMapsAPIDeferred = $q.defer();
			
			// Google map API script url.
			function getScriptUrl () {
				var scriptUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + 
					'&signed_in=true&callback=googleMapsAPIInitialized';

				return scriptUrl;
			}

			// Callback function - resolving promise after google maps api successfully loaded.
			$window.googleMapsAPIInitialized = googleMapsAPIDeferred.resolve;

			// Load google map API script.
			function loadScript () {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = getScriptUrl();
				document.body.appendChild(script);
			}

			// Start loading google maps api.
			loadScript();			

			// Usage: googleMapsInitializer.mapsInitialized.then(callback)
			return {
				mapsInitialized : googleMapsAPIDeferred.promise
			};
        }]);
}(window.angular));
;/*! NearByStoresService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('nearByStoresService',
		['$log', '$q', 'storeService', 'configService', 'dataStorageService',
		function ($log, $q, storeService, configService, dataStorageService) {

			return {

				/**
				 * This function returns an array of radius to limit the store search result.
				 *
				 * @returns (Array) an array of radius to limit the store search result.
				 */
				getRadiusArray : function () {
					var radiusConfigValue = configService.
							getConfig('app.ppos.nearByStores.storeRadiusList');

					var radiusArray = [];

					if (radiusConfigValue) {
						var radiusConfigValueArray = radiusConfigValue.split(',');
						if (radiusConfigValueArray) {
							angular.forEach(radiusConfigValueArray, function (radiusConfigValue) {
								if (radiusConfigValue)	{
									radiusArray.push(radiusConfigValue);
								}
							});
						}
					}

					return radiusArray;
				},

				/**
				 * This function returns the default radius to limit the store search result.
				 *
				 * @returns (Integer) the default radius to limit the store search result.
				 */
				getDefaultRadius : function () {
					var defaultRadius = null;
					var userPosSettings = dataStorageService.getLoggedInUsersPosSettings();
					if (userPosSettings === null || userPosSettings === '') {
						var radiusArray = this.getRadiusArray();
						if (radiusArray) {
							if (radiusArray.length > 0) {
								defaultRadius = radiusArray[0];
							}
						}
					} else {
						defaultRadius = userPosSettings.userSetRadius;
					}

					return defaultRadius;
				},
				
				/**
				 * This function search for products based on the given criteria.
				 * 
				 * @param {Object} {
				 *			skuId: String,
				 *			latitude: Double,
				 *			longitude: Double,
				 *			distance: Double
				 *		} nearByStoresSearchRequest - The near by stores search request object.
				 *
				 * @returns {Object} the promise object.
				 */
				searchNearByStores : function (nearByStoresSearchRequest) {
					var deferred = $q.defer();

					var nearByStoresSearchResponse = [];

					if (nearByStoresSearchRequest) {
						storeService.getNearByStores(
							nearByStoresSearchRequest.skuId,
							nearByStoresSearchRequest.latitude,
							nearByStoresSearchRequest.longitude,
							nearByStoresSearchRequest.distance)
							.then(
							function (successResult) {
								var storeSkuList = successResult.data;

								if (storeSkuList) {
									angular.forEach(storeSkuList, function (storeSku) {
										var store = storeSku.store;

										var storeDetails = {
											address : {
												name : store.details.name,
												street1 : store.details.street1,
												street2 : store.details.street2,
												street3 : store.details.street3,
												city : store.details.city,
												state : store.details.state,
												zipCode : store.details.zipCode,
												phone : store.details.phone
											},
											id : store.details.id,
											pickupEnabled : store.details.pickupEnabled,
											hours : store.details.hours,
											distance : store.distance,
											availableQty : storeSku.availableQty
										};

										nearByStoresSearchResponse.push(storeDetails);
									});
								}

								// Resolve the promise.
								deferred.resolve(nearByStoresSearchResponse);
							}, function (errorResult) {
								$log.error(errorResult);
								// Reject the promise.
								deferred.reject(nearByStoresSearchResponse);
							});
					}

					// Return product search result promise.
					return deferred.promise;
				}
			};
	}]);
}(window.angular));
;/*! NewOrderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('newOrderService', 
		['$q', 'dataStorageService', 'basketService',
		function ($q, dataStorageService, basketService) {

		function getBasketIdFromBasketURI (basketURI) {
			var position = basketURI.lastIndexOf('/');
			var basketId = basketURI.substring(position + 1, basketURI.length);
			return basketId;
		}

		return {

			startNewOrder : function (customerId, storeId, csrId, phone) {
				if (!basketService.isAutoSaveBag()) {
					csrId = null;
				}

				var deferred = $q.defer();

				if (!customerId) {
					// Create guest Customer and Basket.
					basketService.createGuestBasket(storeId, csrId, phone)
						.then(
						function (successResult) {
							var data = successResult.data;

							// Set Customer ID in storage.
							var customerId = data.customerId;
							dataStorageService.setCustomerId(customerId);

							// Set Basket ID in storage.
							var basketId = data.basketId;
							dataStorageService.setBasketId(basketId);

							var newOrderResponse =  {
								'customerId' : customerId,
								'basketId' : basketId
							};
							
							/*if (basketService.isAutoSaveBag()) {
								basketService.saveBag(basketId);
							}*/

							// Resolve the promise.
							deferred.resolve(newOrderResponse);
						}, function (errorResult) {
							console.log(
								'An error occurred while creating guest Customer ' + 
								'and Basket : ' + errorResult);

							var newOrderResponse =  {
								'customerId' : '',
								'basketId' : ''
							};
							
							// Reject the promise.
							deferred.reject(newOrderResponse);
						});
				} else {
					// Create Basket for given Customer.
					basketService.createBasket(customerId, csrId)
						.then(
						function (successResult) {
							var basketURI = successResult.data;
							var basketId = getBasketIdFromBasketURI(basketURI);

							// Set Customer ID in storage.
							dataStorageService.setCustomerId(customerId);
					
							// Set Basket ID in storage.
							dataStorageService.setBasketId(basketId);

							var newOrderResponse =  {
								'customerId' : customerId,
								'basketId' : basketId
							};
							
							/*if (basketService.isAutoSaveBag()) {
								basketService.saveBag(basketId);
							}*/
							
							// Resolve the promise.
							deferred.resolve(newOrderResponse);
						}, function (errorResult) {
							console.log(
								'An error occurred while creating Basket : ' + errorResult);

							var newOrderResponse =  {
								'customerId' : '',
								'basketId' : ''
							};
							
							// Reject the promise.
							deferred.reject(newOrderResponse);
						});
				}

				// Return product search result promise.
				return deferred.promise;
			}
		};
	}]);
}(window.angular));
;/*! OrderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('orderService',
        ['dataService', 
		function (dataService) {

			return {

				/**
				 * This function gets order details for the given order id.
				 * 
				 * @param {Number} orderId - The id of the order to get details.
				 */
				getOrderById : function (orderId) {
					var serviceUrl = '/api/orders/' + orderId + '?includeDiscounts=true';
					
					return dataService.getData(serviceUrl);
				},
				
				/**
				 * This function gets order details for the given order code.
				 * 
				 * @param {String} orderCode - The code of the order to get details.
				 */
				getOrderByCode : function (orderCode) {
					var serviceUrl = '/api/orders/search?q=' + orderCode;
					
					return dataService.getData(serviceUrl);
				},
				
				getInStorePickupOrderShipments : function (storeId, sortParam) {
					var serviceUrl = '/api/pickupinstores/shipments/stores/' + storeId;

					if (sortParam) {
						serviceUrl = serviceUrl + '?sortParam=' + sortParam;
					}

					return dataService.getData(serviceUrl);
				},
				
				groupBySku : function (storeId) {
					var serviceUrl = '/api/pickupinstores/skus/stores/' + storeId;

					return dataService.getData(serviceUrl);
				},
				
				associateCSRtoShipment : function (csrId, orderId, orderShipmentId) {
					var serviceUrl = 
						'/api/csrs/' + csrId +
						'/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupInProcessState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=PICK_UP_IN_PROCESS';

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupReadyState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=PICK_UP_READY';

					return dataService.putData(serviceUrl);
				},
				
				moveToPickupDoneState : function (orderId, orderShipmentId, storeId) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=SHIPPED';

					return dataService.putData(serviceUrl);
				},
				
				addShipmentNoteForPickup : function (orderId, orderShipmentId, noteToAdd) {
					var serviceUrl = 
						'/api/pickupinstores/notes/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.postData(serviceUrl, noteToAdd);
				},
				
				// Edit Note - Phase 2
				/*editShipmentNoteForPickup : function (orderId, orderShipmentId, noteId, noteToEdit) {
					var serviceUrl = 
						'/api/pickupinstores/notes/' + noteId + 
						'/orders/' + orderId + 
						'/shipments/' + orderShipmentId;

					return dataService.putData(serviceUrl, noteToEdit);
				},*/

				/*reset : function (orderId, orderShipmentId, storeId, status) {
					var serviceUrl = 
						'/api/pickupinstores/status/orders/' + orderId + 
						'/shipments/' + orderShipmentId + 
						'/stores/' + storeId + 
						'?status=' + status;

					return dataService.putData(serviceUrl);
				}*/
			};
        }]);

}(window.angular));
;/*! PaginationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('paginationService', 
		[function () {
		
		var paginationServiceOperations = {

			/**
			 * This function prepares the paging model for pagination 
			 * based on the given input.
			 * 
			 * @param {Object} {
			 *			currentPage: Number,
			 *			numberOfRecords: Number,
			 *			recordsPerPage: Number,
			 *			pagesPerPageGroup: Number,
			 *		} pagingModelRequest - The paging model request object.
			 *
			 * @returns {Object} {
			 *			currentPage: Number,
			 *			numberOfRecords: Number,
			 *			recordsPerPage: Number,
			 *			pagesPerPageGroup: Number,
			 *			showPagination: Boolean,
			 *			numberOfPages: Number,
			 *			previousPageGroup: Object {
			 *				hasPreviousPageGroup: Boolean,
			 *				previousPageGroupPageNumber: Number,
			 *				previousPageGroupPageNumberOffSet: Number
			 *			},
			 *			nextPageGroup: Object {
			 *				hasNextPageGroup: Boolean,
			 *				nextPageGroupPageNumber: Number,
			 *				nextPageGroupPageNumberOffSet: Number
			 *			},
			 *			pages: Array {
			 *				pageNumber: Number,
			 *				offSet: Number
			 *			}
			 *		} pagingModel - The paging model object.
			 */
			getPagingModel : function (pagingModelRequest) {

				var pagingModel = {

					currentPage : 0,
					
					numberOfRecords : 0,

					recordsPerPage : 0,

					pagesPerPageGroup : 0,
					
					showPagination : false,
					
					numberOfPages : 0,
					
					previousPageGroup : {
						hasPreviousPageGroup : false,
					
						previousPageGroupPageNumber : 0,
					
						previousPageGroupPageNumberOffSet : 0,
					},
					
					nextPageGroup : {
						hasNextPageGroup : false,

						nextPageGroupPageNumber : 0,
					
						nextPageGroupPageNumberOffSet : 0,
					},
					
					pages : []
				};
				
				pagingModel.currentPage = pagingModelRequest.currentPage;
				
				pagingModel.numberOfRecords = pagingModelRequest.numberOfRecords;
				
				pagingModel.recordsPerPage = pagingModelRequest.recordsPerPage;

				pagingModel.pagesPerPageGroup = pagingModelRequest.pagesPerPageGroup;

				pagingModel.showPagination = isShowPagination(
					pagingModelRequest.numberOfRecords, pagingModelRequest.recordsPerPage);

				if (pagingModel.showPagination)	{
					pagingModel.numberOfPages = getNumberOfPages(
						pagingModelRequest.numberOfRecords, pagingModelRequest.recordsPerPage);
					
					var beginPageIndex = getBeginPageIndex(
						pagingModelRequest.currentPage, pagingModelRequest.pagesPerPageGroup);

					var endPageIndex = getEndPageIndex(
						pagingModelRequest.currentPage, pagingModelRequest.numberOfRecords, 
						pagingModelRequest.recordsPerPage, pagingModelRequest.pagesPerPageGroup);

					for (var i = beginPageIndex; i <= endPageIndex; i++) {
						var offSet = pagingModelRequest.recordsPerPage * (i - 1);
						pagingModel.pages.push({ 'pageNumber' : i, 'offSet' : offSet });
					}

					// Previous Page Group
					var previousPageGroupAvailable = hasPreviousPageGroup(
						pagingModelRequest.currentPage, pagingModelRequest.pagesPerPageGroup);

					if (previousPageGroupAvailable) {
						var previousPageGroupPageNumber = beginPageIndex - 1;
						
						var previousPageGroupPageNumberOffSet = 
							pagingModelRequest.recordsPerPage * (previousPageGroupPageNumber - 1);

						pagingModel.previousPageGroup = {
							hasPreviousPageGroup : previousPageGroupAvailable,
							
							previousPageGroupPageNumber : previousPageGroupPageNumber,
							
							previousPageGroupPageNumberOffSet : previousPageGroupPageNumberOffSet,
						};
					}
					
					// Next Page Group
					var nextPageGroupAvailable = hasNextPageGroup(
						pagingModelRequest.currentPage, pagingModelRequest.numberOfRecords, 
						pagingModelRequest.recordsPerPage, pagingModelRequest.pagesPerPageGroup);

					if (nextPageGroupAvailable) {
						var nextPageGroupPageNumber = endPageIndex + 1;
						
						var nextPageGroupPageNumberOffSet = 
							pagingModelRequest.recordsPerPage * (nextPageGroupPageNumber - 1);

						pagingModel.nextPageGroup = {
							hasNextPageGroup : nextPageGroupAvailable,

							nextPageGroupPageNumber : nextPageGroupPageNumber,
						
							nextPageGroupPageNumberOffSet : nextPageGroupPageNumberOffSet,
						};
					}
				}

				return pagingModel;
			}
		};
		
		function isShowPagination (numberOfRecords, recordsPerPage) {
			if (numberOfRecords <= recordsPerPage) {
				return false;
			}
			
			return true;
		}
		
		function getNumberOfPages (numberOfRecords, recordsPerPage) {
			var numberOfPages = Math.ceil(numberOfRecords / recordsPerPage);

			return numberOfPages;
		}

		function getNumberOfPageGroups (numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var numberOfPages = getNumberOfPages(numberOfRecords, recordsPerPage);

			if (numberOfPages <= pagesPerPageGroup) {
				return 1;
			}
			
			var numberOfPageGroups = Math.floor(numberOfPages / pagesPerPageGroup);

			if ((numberOfPages % pagesPerPageGroup) > 0) { 
				++numberOfPageGroups;
			}

			return numberOfPageGroups;
		}

		function getCurrentPageGroup (currentPage, pagesPerPageGroup) {
			var currentPageGroup = 1;

			if ((currentPage % pagesPerPageGroup) === 0) {
				currentPageGroup = currentPage / pagesPerPageGroup;
			} else {
				//currentPageGroup = (currentPage / pagesPerPageGroup) + 1;
				currentPageGroup = Math.ceil(currentPage / pagesPerPageGroup);
			}
			
			return currentPageGroup;
		}

		function getBeginPageIndex (currentPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			var beginPageIndex = ((currentPageGroup * pagesPerPageGroup) - pagesPerPageGroup) + 1;

			return beginPageIndex;
		}

		function getEndPageIndex (currentPage, numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var numberOfPages = getNumberOfPages(numberOfRecords, recordsPerPage);
				
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			if (currentPage === numberOfPages) {
				return currentPage;
			}
			
			if (numberOfPages < (currentPageGroup * pagesPerPageGroup)) {
				return numberOfPages;
			}
			
			var endPageIndex = (currentPageGroup * pagesPerPageGroup);
			
			return endPageIndex;
		}

		function hasPreviousPageGroup (currentPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			if (currentPageGroup > 1) {
				return true;
			}
				
			return false;
		}

		function hasNextPageGroup (currentPage, numberOfRecords, recordsPerPage, pagesPerPageGroup) {
			var currentPageGroup = getCurrentPageGroup(currentPage, pagesPerPageGroup);

			var numberOfPageGroups = getNumberOfPageGroups(numberOfRecords, recordsPerPage, pagesPerPageGroup);

			if (currentPageGroup < numberOfPageGroups) {
				return true;
			}
			
			return false;
		}

		return paginationServiceOperations;
	}]);
}(window.angular));
;/*! PaymentService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').service('paymentService',
        ['$q', '$log', 'dataService', 'configService', function ($q, $log, dataService, configService) {

            return {
                getPayments : function () {
                    $log.debug('paymentService: getPayments');

                    var serviceUrl = '/api/payments',
                        deferred = $q.defer();

                    dataService.getData(serviceUrl).then(function(successResult){
                            var payments = [],
                                availablePaymentTypes,
                                i, k;

                            // Get the Available Payment Types from the config
                            availablePaymentTypes = configService.
                                getConfig('app.ppos.checkout.available_payment_types');

                            // If we got something split it into an array
                            if (availablePaymentTypes && availablePaymentTypes.length > 0){
                                availablePaymentTypes = availablePaymentTypes.split(',');
                            }

                            // Get the payments that match the Available Payment Types,
                            // preserving the order provided by the config
                            for (i = 0; i < availablePaymentTypes.length; i++){
                                var availablePaymentType = availablePaymentTypes[i];

                                for (k = 0; k < successResult.data.length; k++) {
                                    var payment = successResult.data[k];

                                    if (availablePaymentType === payment.code){
                                        payment.name = payment.name.toLowerCase();
                                        payment.active = true;
                                        payments.push(payment);
                                    }
                                }
                            }

                            deferred.resolve(payments);
                        },
                        function(errorResult){
                            $log.error('paymentService: getPayments: Failed');
                            $log.error(errorResult);
                            deferred.reject(errorResult);
                        });

                    return deferred.promise;

                },

                addPayment : function (basketId, paymentToAdd) {
                    $log.debug('paymentService: addPayment');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment';

                    return dataService.postData(serviceUrl, paymentToAdd);
                },

                getCreditCardTypes : function () {
                    $log.debug('paymentService: getCreditCardTypes');

                    var serviceUrl = '/api/payments/creditCards';

                    return dataService.getData(serviceUrl);
                },

                releaseAuthorization: function (basketId, data) {
                    $log.debug('paymentService: releaseAuthorization');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment/releaseAuthorization';

                    return dataService.postData(serviceUrl, data);
                },

                getCreditCardOptions : function () {
                    $log.debug('paymentService: getCreditCardOptions');

                    var creditCardOptions = {
                        'number': '',
                        'type': '',
                        'types': [],
                        'cvv': '',
                        'postalCode': '',
                        'expiryMonth': {
                            'options': [
                                {
                                    'label': 'January',
                                    'value': '01'
                                },
                                {
                                    'label': 'February',
                                    'value': '02'
                                },
                                {
                                    'label': 'March',
                                    'value': '03'
                                },
                                {
                                    'label': 'April',
                                    'value': '04'
                                },
                                {
                                    'label': 'May',
                                    'value': '05'
                                },
                                {
                                    'label': 'June',
                                    'value': '06'
                                },
                                {
                                    'label': 'July',
                                    'value': '07'
                                },
                                {
                                    'label': 'August',
                                    'value': '08'
                                },
                                {
                                    'label': 'September',
                                    'value': '09'
                                },
                                {
                                    'label': 'October',
                                    'value': '10'
                                },
                                {
                                    'label': 'November',
                                    'value': '11'
                                },
                                {
                                    'label': 'December',
                                    'value': '12'
                                }
                            ],
                            'selectedOption': ''
                        },
                        'expiryYear': {
                            'options': [
                                {
                                    'label': '2015',
                                    'value': '2015'
                                },
                                {
                                    'label': '2016',
                                    'value': '2016'
                                },
                                {
                                    'label': '2017',
                                    'value': '2017'
                                },
                                {
                                    'label': '2018',
                                    'value': '2018'
                                },
                                {
                                    'label': '2019',
                                    'value': '2019'
                                },
                                {
                                    'label': '2020',
                                    'value': '2020'
                                },
                                {
                                    'label': '2021',
                                    'value': '2021'
                                },
                                {
                                    'label': '2022',
                                    'value': '2022'
                                },
                                {
                                    'label': '2023',
                                    'value': '2023'
                                }
                            ],
                            'selectedOption': ''
                        }
                    };
                    return creditCardOptions;
                },
                getCashButtons : function () {
                    $log.debug('paymentService: getCashButtons');

                    var buttons = [
                        {
                            'label': '1',
                            'value': '1',
                            'ordinal': 1
                        },
                        {
                            'label': '2',
                            'value': '2',
                            'ordinal': 2
                        },
                        {
                            'label': '3',
                            'value': '3',
                            'ordinal': 3
                        },
                        {
                            'label': '4',
                            'value': '4',
                            'ordinal': 4
                        },
                        {
                            'label': '5',
                            'value': '5',
                            'ordinal': 5
                        },
                        {
                            'label': '6',
                            'value': '6',
                            'ordinal': 6
                        },
                        {
                            'label': '7',
                            'value': '7',
                            'ordinal': 7
                        },
                        {
                            'label': '8',
                            'value': '8',
                            'ordinal': 8
                        },
                        {
                            'label': '9',
                            'value': '9',
                            'ordinal': 9
                        },
                        {
                            'label': '0',
                            'value': '0',
                            'ordinal': 10
                        },
                        {
                            'label': '00',
                            'value': '00',
                            'ordinal': 11
                        },
                        {
                            'label': 'Delete',
                            'value': 'Delete',
                            'ordinal': 12
                        }
                    ];
                    buttons = _.sortByOrder(buttons, ['ordinal']);
                    return buttons;
                },
                basketCheckout : function (storeId, basketId, paymentToAdd) {
                    $log.debug('paymentService: basketCheckout');

                    var serviceUrl = '/api/baskets/' + basketId + '/checkout'+ '?storeId=' + storeId;
                    return dataService.postData(serviceUrl, paymentToAdd);
                }
            };
        }]);
}(window.angular, window._));
;/*! ProductCatalogService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('productCatalogService',
		['$q', '$log', 'dataService', function ($q, $log, dataService) {

		return {

			getProductById : function (productId) {
                var serviceUrl = '/api/products/' + productId;

				return dataService.getData(serviceUrl);
			},

            getProductDetailsById: function (productId) {
                var serviceUrl = '/api/products/' + productId,
                    deferred = $q.defer();

                // Debug logging
                $log.debug('productCatalogService: getProductDetailsById: ' + productId);

                dataService.getData(serviceUrl).then(
                    function (successResult) {
                        deferred.resolve(successResult);
                    }, function (errorResult) {
                        deferred.reject(errorResult);
                        $log.error(errorResult);
                    });

                return deferred.promise;
            },

            getProductCrossSells: function (productId, storeId) {
                var serviceUrl = '/api/products/' + productId + '/stores/' + storeId + '/crosssells',
                    deferred = $q.defer();

                // Debug logging
                $log.debug('productCatalogService: getProductCrossSells: ' + productId);

                dataService.getData(serviceUrl).then(
                    function (successResult) {
                        deferred.resolve(successResult);
                    }, function (errorResult) {
                        deferred.reject(errorResult);
                        $log.error(errorResult);
                    });

                return deferred.promise;
            },

            getProductViewData : function (productIDs, storeID) {

                var serviceUrl =
                    '/api/view/products/' + productIDs + '/stores/' + storeID;

                return dataService.getData(serviceUrl);
            },

            getPriceMessages : function (priceInfo, wasIs, onSale) {

                function isMinMaxPriceEqual(priceInfo){
                    return (priceInfo.minPrice === priceInfo.maxPrice);
                }

                function getSinglePrice(priceInfo){
                    return  priceInfo.minPrice;
                }

                function getPriceRange(priceInfo){
                    return (priceInfo.minPrice + ' - ' + priceInfo.maxPrice);
                }

                // Sale Price

                function isMinMaxSalePriceEqual(priceInfo){
                    return (priceInfo.minSalePrice === priceInfo.maxSalePrice);
                }

                function getSingleSalePrice(priceInfo){
                    return  priceInfo.minSalePrice;
                }

                function getSalePriceRange(priceInfo){
                    return (priceInfo.minSalePrice + ' - ' + priceInfo.maxSalePrice);
                }

                var priceMsg = '';
                var priceWasMsg = '';
                var priceNowMsg = '';

                if (priceInfo){
                    //console.log('wasIs = ' + wasIs + ';');
                    //console.log('onSale = ' + onSale + ';');
                    //console.log(priceInfo);
                    if (wasIs){
                        if (isMinMaxSalePriceEqual(priceInfo)){
                            priceWasMsg = getSinglePrice(priceInfo);
                            priceNowMsg = getSingleSalePrice(priceInfo);
                        }else{
                            // price range
                            priceWasMsg = getPriceRange(priceInfo);
                            priceNowMsg = getSalePriceRange(priceInfo);
                        }
                    }else if (onSale){
                        if (isMinMaxSalePriceEqual(priceInfo)){
                            priceMsg = getSingleSalePrice(priceInfo);
                        }else{
                            // price range
                            priceMsg = getSalePriceRange(priceInfo);
                        }
                    }else{
                        if (isMinMaxPriceEqual(priceInfo)){
                            priceMsg = getSinglePrice(priceInfo);
                        }else{
                            // price range
                            priceMsg = getPriceRange(priceInfo);
                        }
                    }
                }

                var priceMessages = {
                    priceMsg : priceMsg,
                    priceWasMsg : priceWasMsg,
                    priceNowMsg : priceNowMsg
                };

                //console.log(priceMessages);
                return priceMessages;
            },
			
            getPriceInfoForProduct : function (productIDs, includeSkuPriceInfo) {
                var serviceUrl =
                    '/api/prices/products/?productIDs=' + productIDs + '&includeSkuPriceInfo=' + includeSkuPriceInfo;

                return dataService.getData(serviceUrl);
            },
			
			getInventory : function (skuId, storeId) {
				var serviceUrl;

				if (storeId) {
					serviceUrl = '/api/inventory/skus/' + skuId + '?storeID=' + storeId;
				} else {
					serviceUrl = '/api/inventory/skus/' + skuId;
				}

                return dataService.getData(serviceUrl);
            }
		};
	}]);
}(window.angular));
;/*! ProductSearchService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('productSearchService', 
		['$log', '$q', 'dataService', 'productCatalogService', 'paginationService', 'configService',

			function ($log, $q, dataService, productCatalogService, paginationService, configService) {

				return {

					/**
					 * This function returns configurations for the
					 * product search result page.
					 *
					 * @returns (Object) productSearchConfigModel
					 */
					getProductSearchConfigModel : function () {
						var sortOptions = configService.
							getConfig('app.ppos.productSearch.sort_options');

						var showName = configService.
							getConfig('app.ppos.productSearch.show_name');

						var showShortDescription = configService.
							getConfig('app.ppos.productSearch.show_short_description');

						var showCode = configService.
							getConfig('app.ppos.productSearch.show_code');

						var showPrices = configService.
							getConfig('app.ppos.productSearch.show_prices');
						
						var productSearchConfigModel = {
							sortOptions : sortOptions,
							showName : showName,
							showShortDescription : showShortDescription,
							showCode : showCode,
							showPrices : showPrices
						};

						return productSearchConfigModel;
					},

					/**
					 * This function validates the given product search keyword
					 * for empty/null and minimum characters required.
					 * 
					 * @param {String} productSearchKeyword - The product search keyword to validate.
					 *
					 * @returns (Boolean) true if keyword is valid else false.
					 */
					validateProductSearchKeywordRequired : function (productSearchKeyword) {
						if (!productSearchKeyword) {
							return false;
						} 

						if (productSearchKeyword.length < 3) {
							return false;
						}

						return true;
					},
					
					/**
					 * This function returns as array of product sort option object.
					 *
					 * @returns (Array) {
					 *			sortOptionObject: Object {
					 *				sortOptionConfig: String,
					 *				sortOptionParam: String,
					 *				sortOptionOrder: String
					 *			}
					 *		} sortOptionsArray - Returns an array of sort options.
					 */
					getSortOptions : function () {
						var productSearchConfigModel = this.getProductSearchConfigModel();

						var sortOptionsConfigValue = productSearchConfigModel.sortOptions;

						var sortOptionsArray = [];

						if (sortOptionsConfigValue) {
							var sortOptionsConfigValueArray = sortOptionsConfigValue.split(',');
							if (sortOptionsConfigValueArray) {
								angular.forEach(sortOptionsConfigValueArray, function (sortOptionConfigValue) {
									if (sortOptionConfigValue)	{
										var sortOptionConfig = sortOptionConfigValue;
										var sortOptionParam = '';
										var sortOptionOrder = '';

										var position = sortOptionConfigValue.search('Ascend');
										if (position !== -1) {
											sortOptionOrder = 'asc';
										} else {
											position = sortOptionConfigValue.search('Descend');
											if (position !== -1 ) {
												sortOptionOrder = 'desc';
											}
										}

										if (position !== -1) {
											sortOptionParam = sortOptionConfigValue.substring(0, position);

											var sortOptionObject = {
												'sortOptionConfig' : sortOptionConfig,
												'sortOptionParam' : sortOptionParam,
												'sortOptionOrder' : sortOptionOrder
											};

											sortOptionsArray.push(sortOptionObject);
										}
									}
								});
							}
						}

						return sortOptionsArray;
					},
					
					/**
					 * This function returns the default product sort option.
					 *
					 * @returns (Object) {
					 *			sortOptionObject: Object {
					 *				sortOptionParam: String,
					 *				sortOptionOrder: String
					 *			}
					 *		} sortOptionObject - Returns an array of sort options.
					 */
					getDefaultSortOption : function () {
						var defaultSortOption = null;

						var sortOptionsArray = this.getSortOptions();

						if (sortOptionsArray) {
							if (sortOptionsArray.length > 0) {
								defaultSortOption = sortOptionsArray[0];
							}
						}

						return defaultSortOption;
					},
					
					/**
					 * This function search for products based on the given criteria.
					 * 
					 * @param {Object} {
					 *			productSearchKeyword: String,
					 *			offSet: Number,
					 *			productsPerPage: Number,
					 *			pageNumber: Number,
					 *			currentSortOrder: String,
					 *			currentSortParam: String
					 *		} productSearchRequest - The product search request object.
					 *
					 * @returns {Object} {
					 *			productSearchKeyword: String,
					 *			searchResult: Object,
					 *			pagingModel: Object,
					 *			sortOptions: Array,
					 *			defaultSortOption: String,
					 *          currentSortOrder: String,
					 *			currentSortParam: String,
					 *			currentSortOptionConfig: String
					 *		} productSearchResponse - The product search response object.
					 */
					searchProduct : function (productSearchRequest) {
						// List of available sort options.
						var sortOptions = this.getSortOptions();

						// Default sort option.
						var defaultSortOption = this.getDefaultSortOption();

						// Current sort order.
						var currentSortOrder = productSearchRequest.currentSortOrder || 
							defaultSortOption.sortOptionOrder;

						// Current sort param.
						var currentSortParam = productSearchRequest.currentSortParam || 
							defaultSortOption.sortOptionParam;

						// Current sort option config.
						var currentSortOptionConfig = '';
						if (sortOptions) {
							for (var i = 0; i < sortOptions.length; i++) {
								if ((sortOptions[i].sortOptionParam === currentSortParam) && 
									(sortOptions[i].sortOptionOrder === currentSortOrder)) {
									currentSortOptionConfig = sortOptions[i].sortOptionConfig;
								}
							}
						}

						// TODO: This value is not configurable as per requirement.
						var pagesPerPageGroup = 5;
						
						// Product search URL.
						var serviceUrl = '/api/products?' + 
							'q=' + encodeURIComponent(productSearchRequest.productSearchKeyword) + 
							'&families=' + 'none' + 
							'&offset=' + productSearchRequest.offSet + 
							'&pagesize=' + productSearchRequest.productsPerPage + 
							'&sortOrder=' + currentSortOrder + 
							'&sortParam=' + currentSortParam;
						
						var deferred = $q.defer();
						
						// Send product search request to server.
						dataService.getData(serviceUrl)
							.then(
							function (successResult) {
								if (successResult) {
									// Paging model request.
									var pagingModelRequest = {
										currentPage : productSearchRequest.pageNumber,
										numberOfRecords : successResult.data.searchResultSize,
										recordsPerPage : productSearchRequest.productsPerPage,
										pagesPerPageGroup : pagesPerPageGroup
									};

									// Prepare paging model.
									var pagingModel = paginationService.getPagingModel(pagingModelRequest);
									
									// Prepare product search result response object.
									var productSearchResponse = {
										productSearchKeyword : productSearchRequest.productSearchKeyword,
										searchResult : successResult.data,
										pagingModel : pagingModel,
										sortOptions : sortOptions,
										defaultSortOption : defaultSortOption,
										currentSortOrder : currentSortOrder,
										currentSortParam : currentSortParam,
										currentSortOptionConfig : currentSortOptionConfig
									};

									// Resolve the promise.
									deferred.resolve(productSearchResponse);
								}
							}, function (errorResult) {
								// Prepare product search result response object.
								var productSearchResponse = {
									productSearchKeyword : productSearchRequest.productSearchKeyword,
									searchResult : errorResult.data,
									pagingModel : null,
									sortOptions : null,
									defaultSortOption : null
								};
								
								// Reject the promise.
								deferred.reject(productSearchResponse);
							});
						
						// Return product search result promise.
						return deferred.promise;
					},
					
					/**
					 * 
					 * 
					 */
					getProductSearchResult : function () {
						var productSearchResultCache = JSON.parse(sessionStorage.getItem('productSearchResultCache'));
						return productSearchResultCache;
					},
					
					/**
					 * 
					 * 
					 */
					setProductSearchResult : function (productSearchDataModel) {
						var productSearchResultCache = JSON.stringify(productSearchDataModel);
						sessionStorage.setItem('productSearchResultCache', productSearchResultCache);
					}
				};
	}]);
}(window.angular));
;
/**
 * Receipt Service.
 *
 * @author Will Mitchell
 *
 */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('receiptService',
        ['dataService', function (dataService) {


            return {
                printOrderReceipt : function (orderId, storeId, csrId) {

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=PrintReceiptPPOS&sendEmail=false&storeID='+storeId +'&csrID='+csrId;

                    console.log(serviceUrl);
                    return dataService.getData(serviceUrl);
                },

                emailOrderReceipt: function (orderId,storeId, csrId, parmEmail) {

                    var email = parmEmail || null;


                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailConfirmPPOS&storeID='+storeId+'&csrID='+csrId+
                         '&emailOverride='+email;


                    return dataService.getData(serviceUrl);
                },

                emailPickupReady: function (orderId, storeId, csrId, parmEmail){

                    var email = parmEmail || null;

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailPickupReadyPPOS&storeID='+storeId+'&csrID='+csrId+
                        '&emailOverride='+email;

                    return dataService.getData(serviceUrl);
                },

                emailPickupDone: function (orderId, storeId, csrId, parmEmail){

                    var email = parmEmail || null;

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailPickupDonePPOS&storeID='+storeId+'&csrID='+csrId+
                        '&emailOverride='+email;

                    return dataService.getData(serviceUrl);
                },

                printPickupDone: function (orderId, storeId, csrId){
                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=PrintPickupDonePPOS&sendEmail=false&storeID='+storeId+
                        '&csrID='+csrId;

                    return dataService.getData(serviceUrl);
                }



            };
        }]);
}(window.angular));
;/*! RedirectBridgeService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('redirectBridgeService',
        ['$log', '$location', 'dataStorageService', 'appService',

            /**
             * A simple redirect bridge service to help with redirecting between provisioning/login and the main app.
             * @param $log
             * @param $location
             * @param dataStorageService
             * @returns {{goTo: Function}}
             */
            function ($log, $location, dataStorageService, appService) {

                return {
                    goTo: function (location) {
                        $log.debug('redirectBridgeService: goTo: location: ' + location);

                        // Try and get the remote asset url from the data storage service
                        var assetUrl = dataStorageService.getRemoteAssetUrl(),
                            appTemplate;

                        // If we have an asset url that means we may use window.location for the redirect
                        if (assetUrl && assetUrl.length > 0) {
                            // Choose the appropriate appTemplate based on where we're going
                            switch (location) {
                                case '/home':
                                case '/provisioning':
                                    appTemplate = 'index.html';
                                    break;
                                default:
                                    appTemplate = 'app.html';
                                    break;
                            }

                            // Do the redirect
                            window.location = appTemplate + '#' + location;
                        } else {
                            // If we didn't have an asset url, everything is being served locally,
                            // make sure we always stay with the same local app
                            appService.deactivateSpinner();
                            $location.path(location);
                        }
                    }
                };
            }
        ]
    );
}(window.angular));
;/*! ScanBarcodeService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('scanBarcodeService',
        ['$q', '$log', 'dataService', function ($q, $log, dataService) {
            return {
                /**
                 * This function gets the device status.
                 * @returns {*} A deferred.promise
                 */
                getDeviceStatus: function () {
                    $log.debug('scanBarcodeService: getDeviceStatus');

                    var deferred = $q.defer();

                    window.mlSocketMobile.getDeviceStatus(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },

                /**
                 * This function gets the scanned value from the device.
                 * @returns {*} A deferred.promise
                 */
                getScannedValue: function () {
                    $log.debug('scanBarcodeService: getScannedValue');

                    var deferred = $q.defer();

                    window.mlSocketMobile.getScannedValue(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },

                /**
                 * This function posts the provided *data* to the provided *serviceUrl*
                 * @param serviceUrl The service url to call
                 * @param data The data to post to the service
                 * @returns {*} A deferred.promise
                 */
                sendBarcode: function (serviceUrl, data) {
                    $log.debug('scanBarcodeService: sendBarcode');

                    return dataService.postData(serviceUrl, data);
                }
            };
        }]);
}(window.angular));;/*! SecurityService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('securityService', 
		['$http', '$q', 'dataStorageService', 
		function ($http, $q, dataStorageService) {

		return {

			hasPermission : function (csr, requiredPermission) {
				var hasPermission = false;

				angular.forEach(csr.permissions, function (csrPermission) {
					if (csrPermission.code === requiredPermission) {
						hasPermission = true;
					}
				});

				return hasPermission;
			},
			
			authorize : function (csr, requiredPermissions) {
				var authorized = true;

				for (var i = 0; i < requiredPermissions.length; i++) {
					var hasPermission = this.hasPermission(csr, requiredPermissions[i]);

					if (!hasPermission) {
						authorized = false;
						break;
					}
				}

				return authorized;
			},
			
			/**
			 * Get Token.
			 */
			getToken : function (userCredentials) {
				var urlBase = dataStorageService.getUrlBase();

				var userName = userCredentials.loginId;
				var password = userCredentials.password;
				var storeCode = dataStorageService.getStoreCode();

				var serviceUrl = '/login/token';

				var deferred = $q.defer();

				// Send POST request.
				$http({
                    method : 'POST',
                    url : urlBase + serviceUrl,
                    headers : { 'Accept' : 'application/json' },
					data : { 'userName' : userName, 'password' : password, 'storeCode' : storeCode },
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status, headers, config) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						deferred.reject({'data' : data, 'status' : status, 'headers' : headers, 'config' : config});
					});
				
				return deferred.promise;
			},

			/**
			 * Refresh Token.
			 */
			refreshToken : function () {
				var urlBase = dataStorageService.getUrlBase();

				var refreshToken = dataStorageService.getRefreshToken();

				var serviceUrl = '/login/refresh';
				
				var deferred = $q.defer();

				// Send POST request.
				$http({
                    method : 'POST',
                    url : urlBase + serviceUrl,
                    headers : { 'Accept' : 'application/json' },
					data : { 'refreshToken' : refreshToken },
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						var errorMessage = 'An error occurred with status - ' + status + ' during refresh token.';

						deferred.reject(errorMessage);
					});
				
				return deferred.promise;
			},
			
			/**
			 * Terminate Token.
			 */
			terminateToken : function () {
				var urlBase = dataStorageService.getUrlBase();

				var accessToken = dataStorageService.getAccessToken();
				
				var refreshToken = dataStorageService.getRefreshToken();

				var serviceUrl = '/login/terminate';
				
				var deferred = $q.defer();

				// Send POST request.
				$http({
                    method : 'POST',
                    url : urlBase + serviceUrl,
                    headers : { 'Accept' : 'application/json' },
					data : { 'accessToken' : accessToken, 'refreshToken' : refreshToken },
                    cache : false
                }).success(function(data) {
						// This callback will be called asynchronously 
						// when the successful response is available from server.

						deferred.resolve(data);
					})
					.error(function(data, status) {
						// This callback will be called asynchronously if 
						// an error occurs or server returns response with an error status.

						var errorMessage = 'An error occurred with status - ' + status + ' during terminate token.';

						deferred.reject(errorMessage);
					});
				
				return deferred.promise;
			}
		};
	}]);
}(window.angular));
;/*! SettingsService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('settingsService',
		['configService',
		function (configService) {

			return {

				/**
				 * This function returns an array of timeout values from configuration
				 *  to lock the screen after selected timeout
				 *
				 * @returns (Array) an array of timeouts
				 */
				getTimeoutArray : function () {
					var timeoutConfigValue = configService.
							getConfig('app.ppos.posSettings.timeoutList');
					var timeoutArray = [];

					if (timeoutConfigValue) {
						var timeoutConfigValueArray = timeoutConfigValue.split(',');
						if (timeoutConfigValueArray) {
							angular.forEach(timeoutConfigValueArray, function (timeoutConfigValue) {
								if (timeoutConfigValue)	{
									timeoutArray.push(timeoutConfigValue);
								}
							});
						}
					}
					return timeoutArray;
				}
			};
	}]);
}(window.angular));
;/*! ShippingService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('shippingService', 
		['dataService', 
		function (dataService) {
		
		return {

			/**
			 * This function gets list of states of a country
			 * 
			 * @param {String} countryCode - The code of the country to get states.
			 */
			getStates : function (countryCode) {
				var serviceUrl = '/api/shippings/states?countryCode=' + countryCode;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function gets list of countries
			 * 
			 */
			getCountries : function () {
				var serviceUrl = '/api/shippings/countries';

				return dataService.getData(serviceUrl);
			},

			getShippingMethods : function(basketId, basketShipmentId, countryCode, stateCode) {
				var serviceUrl = '/api/shippings/shippingMethods/basket/'+basketId+'/shipments/'+basketShipmentId+
					'?countryCode='+countryCode+'&stateCode='+stateCode;

				return dataService.getData(serviceUrl);
			},

			updateShippingMethod : function(basketId, shipmentId, shipMethodId) {
				var serviceUrl = '/api/shippings/basket/' + basketId +
					'/shipments/' + shipmentId + '?shippingMethodID=' + shipMethodId;

				return dataService.putData(serviceUrl, '');
			}
		};
	}]);
}(window.angular));
;
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('starPrinter',
        ['$q', function ($q) {

        return {
            getPort: function () {
                var deferred = $q.defer();
                ppos.devices.mlStarMicronics.getPort(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            getFirmwareVersion: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getFirmwareVersion(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            getModelName: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getModelName(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            getDeviceName: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getDeviceName(function (data) {
                    deferred.resolve(data);
                },function (data){
                    deferred.reject(data);
                });

                return deferred.promise;
            },
            printBarCode: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.printBarCode(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            uploadVendorImage: function (imageUrl, targetImageName) {
                var deferred = $q.defer();
                var fileTransfer = new window.FileTransfer();
                var uri = encodeURI(imageUrl + targetImageName);
                var cordovaLocation = window.cordova.file.dataDirectory + targetImageName;
                var filePath = encodeURI(cordovaLocation);

                fileTransfer.download(
                    uri,
                    filePath,
                    function () {
                        var filePrefix = 'file:///';
                        var iosLocation = '/private/' + cordovaLocation.substring(filePrefix.length);
                        ppos.devices.mlStarMicronics.setUploadImageLocations(
                            cordovaLocation, iosLocation, function (data) {
                                deferred.resolve(data);
                        });
                    },
                    function () {
                        deferred.reject('Download Failed');
                    },
                    true,
                    {
                        //This is here as an exemplar in case we need to add headers eventually
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );

                return deferred.promise;
            },
            printTestPage: function (pageData) {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.printTestPage(pageData, function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            openCashDrawer: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.openCashDrawer(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
        };
    }]);
}(window.angular));

;/*! StoreService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('storeService', 
		['dataService', 
		function (dataService) {
		
		return {

			/**
			 * This function gets store details based on the given store code.
			 * 
			 * @param {String} storeCode - The code of the store to get details.
			 */
			getStoreByCode : function (storeCode) {
				var serviceUrl = '/api/stores/code/' + storeCode;

				return dataService.getData(serviceUrl);
			},
			
			/**
			 * This function search for near by stores based on the given criteria.
			 * 
			 * @param {String} skuId - The ID of the sku.
			 * @param {Double} latitude
			 * @param {Double} longitude
			 * @param {Double} distance
			 */
			getNearByStores : function (skuId, latitude, longitude, distance) {
				var serviceUrl = '/api/stores/nearby/skus/' + skuId + 
					'?latitude=' + latitude + 
					'&longitude=' + longitude + 
					'&distance=' + distance;

				return dataService.getData(serviceUrl);
			}
		};
	}]);
}(window.angular));
;/*! AddCouponCodeModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('addCouponCodeModal', function() {
		return {
			restrict : 'E',

			templateUrl : 'views/basket/AddCouponCodeModal.html',
			
			controller : 'addCouponCodeModalController',

			link : function () {
				angular.element('#addCouponCodeModal').on('shown.bs.modal', function () {
					angular.element('#couponCode').focus();
				});
			}
		};
	});
}(window.angular));
;/*! AppSpinner.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlAppSpinner',
        ['$log','$timeout', '$translate',
            function ($log, $timeout, $translate) {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/AppSpinner.html',
                    scope: {},
                    link: function (scope) {
                        scope.closeBtnTxt = 'Close';
                        scope.requestTimedOut = 'Request timed out. Please try again.';

                        /**
                         * This function is used to Initialize the Scope.
                         */
                        scope.init = function () {
                            scope.displaySpinner = false;
                            scope.timer = null;
                            scope.timerLimit = 30000;
                            scope.timerLimitExceeded = false;
                        };

                        /**
                         * This function listens for 'toggleSpinner' event and then
                         * displays or hides the spinner based on the data's active boolean.
                         */
                        scope.$on('toggleSpinner', function (event, data) {
                            $log.debug('mlAppSpinner: toggleSpinner: ' + data);
                            if (data.active === true) {
                                scope.cancelTimer();
                                scope.timer = $timeout(scope.timedOut, scope.timerLimit);
                                scope.displaySpinner = true;
                            } else {
                                $timeout.cancel(scope.timer);
                                scope.init();
                            }
                        });

                        /**
                         * This function is triggered when/if the timer runs out, and then updates
                         * the *timerLimitExceeded* scope property.
                         */
                        scope.timedOut = function () {
                            scope.timerLimitExceeded = true;
                        };

                        /**
                         * This function closes/hides the spinner display.
                         */
                        scope.close = function () {
                            if (scope.timerLimitExceeded) {
                                scope.cancelTimer();
                                scope.init();
                            }
                        };

                        /**
                         * This function sets the string messages from the app resources, but
                         * if they're not found in the resources, because the user isn't logged in yet,
                         * then it'll just use the default/fallback *hardcoded* messages.
                         */
                        scope.setMessages = function () {
                            // Get the string for the close button.
                            $translate('btn.ppos.close').then(function (value) {
                                if (value !== 'btn.ppos.close') {
                                    scope.closeBtnTxt = value;
                                }
                            });

                            // Get the string for the *request timed out* message
                            $translate('msg.ppos.requestTimedOut').then(function (value) {
                                if (value !== 'msg.ppos.requestTimedOut') {
                                    scope.requestTimedOut = value;
                                }
                            });
                        };

                        /**
                         * This function cancels the timer if it's running and resets
                         * the *timerLimitExceeded* boolean property.
                         */
                        scope.cancelTimer = function () {
                            if (scope.timer) {
                                $timeout.cancel(scope.timer);
                                scope.timer = null;
                            }

                            scope.timerLimitExceeded = false;
                        };

                        /**
                         * Clean up the timer on destroy.
                         */
                        scope.$on('$destroy', function () {
                                scope.cancelTimer();
                            }
                        );

                        // Initialize the scope.
                        scope.init();
                        // Try to set the Messages.
                        scope.setMessages();
                    }
                };
            }]);
}(window.angular));

;/*! PaymentModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('csrDeleteConfirmationModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/csr/CSRDeleteConfirmationModal.html';

		return directive;
	});
}(window.angular));
;/*! CustomerProfileInformationModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('customerProfileInformationModal',  
		['$timeout', function ($timeout) {
		return {

			restrict : 'E',

			controller : 'customerProfileInformationController',

			templateUrl : 'views/customer/CustomerProfileInformationModal.html',

			link : function (scope) {
				angular.element('#customerProfileInformation').on('shown.bs.modal', function () {
					angular.element('#phoneNumber').focus();
				});
				angular.element('#customerProfileInformation').on('hidden.bs.modal', function () {
					$timeout(scope.closeProfileInformationModal, 0);
				});
			}
		};
	}]);
}(window.angular));
;/*! CustomerSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('customerSearchModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/search/CustomerSearchModal.html';

		return directive;
	});
}(window.angular));
;/*! InStorePickupCustomerVerificationModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('inStorePickupCustomerVerificationModal', 
		['$log', '$location', '$translate', 'orderService', 'dataStorageService', 'securityService', 
		'receiptService', 'starPrinter', 'globalValidationService',
		function ($log, $location, $translate, orderService, dataStorageService, securityService, 
		receiptService, starPrinter, globalValidationService) {
			return {
				restrict : 'E',

				templateUrl : 'views/instorepickup/InStorePickupCustomerVerificationModal.html',
				
				scope : {
                    orderDetailDataModel : '='
                },

				link : function (scope) {
					scope.$watch('orderDetailDataModel', function (value) {
						if (value) {
							scope.init();
						}
					});

					scope.init = function () {
						scope.orderId = scope.orderDetailDataModel.id;
						scope.orderNumber = scope.orderDetailDataModel.code;
						scope.pickupShipment = scope.getPickupShipment();

						scope.processInStorePickup = scope.canProcessInStorePickup();

						scope.paymentTypeCreditCard = scope.isPaymentTypeCreditCard();
						scope.creditCardType = scope.getCreditCardType();
						scope.creditCardLastFourDigits = scope.getCreditCardLastFourDigits();

						scope.billingContactFirstName = scope.getBillingContactFirstName();
						scope.billingContactLastName = scope.getBillingContactLastName();
						
						scope.pickupContactFirstName = scope.getPickupContactFirstName();
						scope.pickupContactLastName = scope.getPickupContactLastName();
						scope.pickupCustomerEmail = scope.getPickupCustomerEmail();

						if ((scope.billingContactFirstName !== scope.pickupContactFirstName) || 
							(scope.billingContactLastName !== scope.pickupContactLastName)) {
							scope.cardVerificationRequired = false;
						} else {
							scope.cardVerificationRequired = true;
						}

						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						scope.pickupDone = false;
					};

					scope.reset = function () {
						$log.debug('In Store Pickup Customer Verification - reset()');

						scope.orderId = '';
						scope.orderNumber = '';
						scope.pickupShipment = null;

						scope.processInStorePickup = false;

						scope.paymentTypeCreditCard = false;
						scope.creditCardType = '';
						scope.creditCardLastFourDigits = '';

						scope.billingContactFirstName = '';
						scope.billingContactLastName = '';
						
						scope.pickupContactFirstName = '';
						scope.pickupContactLastName = '';
						scope.pickupCustomerEmail = '';

						scope.cardVerificationRequired = false;

						scope.creditCardVerified = false;
						scope.customerVerified = false;

						scope.receiptTypePrinter = false;
						scope.receiptTypeEmail = false;

						scope.showStep1 = true;
						scope.showStep2 = false;
						scope.showStep3 = false;

						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						scope.pickupDone = false;
					};

					scope.isPaymentTypeCreditCard = function () {
						var paymentTypeCreditCard = false;

						var payments = scope.orderDetailDataModel.payments;

						if (payments) {
							angular.forEach(payments, function (payment) {
								if (payment.paymentType === 'CREDIT CARD') {
									paymentTypeCreditCard = true;
								}
							});
						}

						return paymentTypeCreditCard;
					};

					scope.getCreditCardPayment = function () {
						var creditCardPayment = null;

						var payments = scope.orderDetailDataModel.payments;

						if (payments) {
							angular.forEach(payments, function (payment) {
								if (payment.paymentType === 'CREDIT CARD') {
									creditCardPayment = payment;
								}
							});
						}

						return creditCardPayment;
					};

					scope.getCreditCardType = function () {
						if (scope.isPaymentTypeCreditCard()) {
							return scope.getCreditCardPayment().cardType;
						} else {
							return '';
						}
					};

					scope.getCreditCardLastFourDigits = function () {
						if (scope.isPaymentTypeCreditCard()) {
							return scope.getCreditCardPayment().maskedNumber;
						} else {
							return '';
						}
					};

					scope.getPickupShipment = function () {
						var pickupShipment = null;

						angular.forEach(scope.orderDetailDataModel.shipments, function (shipment) {
							angular.forEach(shipment.items, function (item) {
								if (dataStorageService.getStoreId() === item.storeID) {
									pickupShipment = shipment;
								}
							});
						});

						return pickupShipment;
					};

					scope.canProcessInStorePickup = function () {
						var canProcessInStorePickup = false;

						if (scope.pickupShipment) {
							if (scope.pickupShipment.status === 'Pickup Ready' &&
								securityService.authorize(
								dataStorageService.getLoggedInCSR(), ['INSTORE_PICKUP'])) {

								canProcessInStorePickup = true;
							}
						}

						return canProcessInStorePickup;
					};

					scope.getBillingContactFirstName = function () {
						if (scope.orderDetailDataModel.billToInfo) {
							return scope.orderDetailDataModel.billToInfo.firstName;
						}

						return '';
					};

					scope.getBillingContactLastName = function () {
						if (scope.orderDetailDataModel.billToInfo) {
							return scope.orderDetailDataModel.billToInfo.lastName;
						}

						return '';
					};

					scope.getPickupContactFirstName = function () {
						if (scope.pickupShipment) {
							return scope.pickupShipment.shipmentInfo.person.firstName;
						}

						return '';
					};

					scope.getPickupContactLastName = function () {
						if (scope.pickupShipment) {
							return scope.pickupShipment.shipmentInfo.person.lastName;
						}

						return '';
					};

					scope.getPickupCustomerEmail = function () {
						var pickupCustomerEmail = '';

						if (scope.pickupShipment) {
							if (scope.pickupShipment.shipmentInfo) {
								pickupCustomerEmail = scope.pickupShipment.shipmentInfo.email;
							}
						}

						if (!pickupCustomerEmail) {
							if (scope.orderDetailDataModel.customer) {
								return scope.orderDetailDataModel.customer.email;
							}
						}

						return pickupCustomerEmail;
					};

					scope.processStep1 = function () {
						if (scope.isPaymentTypeCreditCard() && scope.cardVerificationRequired) {
							if (scope.creditCardVerified && scope.customerVerified) {
								scope.showStep1 = false;
								scope.showStep2 = true;
								scope.showStep3 = false;

								if (!scope.signature.isEmpty()) {
									scope.clearSignature();
								}
							}
						} else if (scope.customerVerified) {
							scope.showStep1 = false;
							scope.showStep2 = true;
							scope.showStep3 = false;

							if (!scope.signature.isEmpty()) {
								scope.clearSignature();
							}
						}
					};

					scope.processStep2 = function (orderId, orderShipmentId) {
						var hasSignature = !scope.signature.isEmpty();

						if (hasSignature) {
							scope.clearSignature();

							orderService.moveToPickupDoneState(orderId, orderShipmentId, dataStorageService.getStoreId())
								.then(
								function (successResult) {
									if (successResult) {
										scope.showStep1 = false;
										scope.showStep2 = false;
										scope.showStep3 = true;

										scope.pickupDone = true;

										angular.element('#pickupCustomerEmail').focus();
									}
								}, function (errorResult) {
									$log.error(errorResult);
								});
						}

                        if (!dataStorageService.isPrinterConnected()) {
							scope.printerAvailable = false;

							$translate('lbl.ppos.noDevice').
								then(function (msg) {
									scope.deviceName = msg;
								});
                        } else {
							scope.printerAvailable = true;
							scope.deviceName = dataStorageService.getStarMicronicsPrinterName();
						}
					};

					scope.processStep3 = function () {
						// Assume there are no validation errors.
						scope.hasValidationErrors = false;
						scope.validationErrors = [];

						if (angular.element('#pickupCustomerEmail').hasClass('ng-invalid-email')) {
							scope.hasValidationErrors = true;

							$translate('msg.ppos.invalidEmail').
								then(function (msg) {
									scope.validationErrors.push(msg);
									angular.element('#pickupCustomerEmail').focus();
								});
						} else if (!globalValidationService.isEmailValid(scope.pickupCustomerEmail)) {
							scope.hasValidationErrors = true;

							$translate('msg.ppos.invalidEmail').
								then(function (msg) {
									scope.validationErrors.push(msg);
									angular.element('#pickupCustomerEmail').focus();
								});
						} else {
							if (scope.receiptTypeEmail)	{
								receiptService.emailPickupDone(
									scope.orderId, dataStorageService.getStoreId(), 
									dataStorageService.getLoggedInCSR().id, scope.pickupCustomerEmail)
									.then(
									function (successResult) {
										if (successResult) {
										}
									}, function (errorResult) {
										$log.error(errorResult);
									});
							}

							if (scope.receiptTypePrinter) {
								receiptService.printPickupDone(
									scope.orderId, dataStorageService.getStoreId(), 
									dataStorageService.getLoggedInCSR().id)
									.then(
									function (successResult) {
										if (successResult) {
											scope.assembleTestPage = [];
											// Split the template data
											scope.assembleTestPage = successResult.data.split(',');
											window.temp =  scope.assembleTestPage;
											starPrinter.printTestPage(scope.assembleTestPage);
										}
									}, function (errorResult) {
										$log.error(errorResult);
									});
							}

							if (scope.receiptTypePrinter || scope.receiptTypeEmail) {
								scope.showStep1 = false;
								scope.showStep2 = false;
								scope.showStep3 = false;
								angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
								//angular.element('#inStorePickupConfirmationModal').modal('show');
                            }
						}
					};

					/////////////////////////////////// Cancel Steps ///////////////////////////////////

					scope.cancelStep1 = function () {
						scope.reset();

						scope.init();

						angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
					};

					scope.cancelStep2 = function () {
						scope.clearSignature();

						scope.showStep1 = true;
						scope.showStep2 = false;
						scope.showStep3 = false;
					};

					scope.clearSignature = function () {
						scope.signature.clear();
					};

					// Show "Pickup Confirmation" if user clicked on "No Receipt".
					scope.noReceipt = function () {
						scope.receiptTypePrinter = false;
						scope.receiptTypeEmail = false;

						scope.showStep1 = false;
						scope.showStep2 = false;
						scope.showStep3 = false;
						angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
						//angular.element('#inStorePickupConfirmationModal').modal('show');
					};

					scope.closeInStorePickupCustomerVerificationModal = function () {
						// Show "Pickup Confirmation" if user clicked on close icon from "Pickup Receipt".
						if (scope.showStep3) {
							scope.receiptTypePrinter = false;
							scope.receiptTypeEmail = false;

							scope.showStep1 = false;
							scope.showStep2 = false;
							scope.showStep3 = false;
							angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
							//angular.element('#inStorePickupConfirmationModal').modal('show');
						} else {
							scope.reset();

							scope.init();

							angular.element('#inStorePickupCustomerVerificationModal').modal('hide');
						}
					};

					scope.showInStorePickupCustomerVerificationModal = function () {
						scope.reset();
						
						scope.init();

						angular.element('#inStorePickupCustomerVerificationModal').modal('show');
					};

					angular.element('#inStorePickupCustomerVerificationModal').on('hidden.bs.modal', function () {
						// On hide of #inStorePickupCustomerVerificationModal show #inStorePickupConfirmationModal
						if (scope.pickupDone) {

							if (scope.receiptTypeEmail && !scope.pickupCustomerEmail) {
								scope.receiptTypeEmail = false;
								scope.$apply();
							}
							
							angular.element('#inStorePickupConfirmationModal').modal('show');
						}
					});

					/////////////////////////
					/////////////////////////
					scope.inStorePickupConfirmationDone = function () {
						angular.element('#inStorePickupConfirmationModal').modal('hide');
					};

					scope.closeInStorePickupConfirmationModal = function () {
						angular.element('#inStorePickupConfirmationModal').modal('hide');
					};

					scope.safeApply = function(fn) {
						var phase = scope.$root.$$phase;

						if (phase === '$apply') {
							fn();
						} else {
							$location.path('/dashboard');
							scope.$apply();
						}
					};

					angular.element('#inStorePickupConfirmationModal').on('hidden.bs.modal', function () {
						scope.reset();

						// Navigate to dashboard page.
						// https://coderwall.com/p/ngisma/safe-apply-in-angular-js
						// monkey patch...
						scope.safeApply(function() {
						  $location.path('/dashboard');
						});
					});
					/////////////////////////
					/////////////////////////

					scope.reset();
				}
			};
	}]);
}(window.angular));
;/*! NearByStoresModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('nearByStoresModal',
		['$log', '$location', 'dataStorageService', 'productCatalogService', 'nearByStoresService', 'appService',
		'googleMapsInitializer', 'geoService', 'basketService', 'newOrderService',
		function($log, $location, dataStorageService, productCatalogService, nearByStoresService, appService,
		googleMapsInitializer, geoService, basketService, newOrderService) {

			return {
				restrict : 'E',

				templateUrl : 'views/common/NearByStoresModal.html',

				link : function (scope) {
					scope.nearByStoresDataModel = {
						radiusArray : [],
						defaultRadius : '',
						selectedRadius : '',
						product : null,
						selectedSku : '',
						requestedQuantity : '',
						nearByStoresSearchKeyword : '',
						online : {
							availableQty : ''
						},
						stores : []
					};
					
					/**
					 * Show near by stores modal.
					 */
					scope.showNearByStoresModal = function (productId, skuId, requestedQuantity) {
						angular.element('#productDetailModal').modal('hide');

						angular.element('#nearByStoresModal').modal('show');

						scope.initNearByStoresDataModel(productId, skuId, requestedQuantity);
					};
					
					/**
					 * Close near by stores modal.
					 */
					scope.closeNearByStoresModal = function () {
						angular.element('#nearByStoresModal').modal('hide');
					};
					
					/**
					 * Cancel near by stores modal.
					 */
					scope.cancelNearByStoresModal = function () {
						// Add your logic here that you want to execute on cancel event.
					};

					/**
					 * Initialize the model with blank or null values.
					 */
					scope.initNearByStoresDataModel = function (productId, skuId, requestedQuantity) {
						scope.nearByStoresDataModel = {
							radiusArray : nearByStoresService.getRadiusArray(),
							defaultRadius : nearByStoresService.getDefaultRadius(),
							selectedRadius : nearByStoresService.getDefaultRadius(),
							product : null,
							selectedSku : '',
							requestedQuantity : '',
							nearByStoresSearchKeyword : '',
							online : {
								availableQty : ''
							},
							stores : []
						};
						
						var product = null;

						var selectedSku = null;

						// Get product by Id.
						productCatalogService.getProductById(productId)
							.then(
							function (successResult) {
								product = successResult.data;

								var skus = successResult.data.skus;

								if (skus) {
									// Iterate over each Sku and use the one 
									// that matches with the given sku.
									angular.forEach(skus, function (sku) {
										if (sku.id === skuId) {
											selectedSku = sku;

											// Set product in model.
											scope.nearByStoresDataModel.product = product;

											// Set selected sku in model.
											scope.nearByStoresDataModel.selectedSku = selectedSku;

											// Set the requested quantity.
											scope.nearByStoresDataModel.requestedQuantity = requestedQuantity;
											
											productCatalogService.getInventory(selectedSku.id, null)
												.then(
												function (successResult) {
													// Set online quantity available.
													var availableQty = successResult.data.qtyAvailable;
													scope.nearByStoresDataModel.online = {
														availableQty : availableQty,
														showStockAvailabilityMessage : false
													};
												}, function (errorResult) {
													$log.error(errorResult);
												});
											
											scope.searchNearByStores(true);
										}
									});
								}
							}, function (errorResult) {
								$log.error(errorResult);
							});
					};

					/**
					 * This function search for near by stores.
					 */
					 // TODO: jsDocs
					scope.searchNearByStores = function (newSearch) {
						// If its a new search then use default radius as distance.
						if (newSearch) {
							scope.nearByStoresDataModel.selectedRadius = nearByStoresService.getDefaultRadius();
						}

						// Google maps API initialized.
						googleMapsInitializer.mapsInitialized.then(function () {
							// Promised resolved.

							// Default search by current store zip code.
							var store = dataStorageService.getStore();
							var nearByStoresSearchKeyword = store.zipCode;

							// If user has provided search keyword then use that keyword.
							if (scope.nearByStoresDataModel.nearByStoresSearchKeyword) {
								nearByStoresSearchKeyword = 
									scope.nearByStoresDataModel.nearByStoresSearchKeyword;
							} else {
								scope.nearByStoresDataModel.nearByStoresSearchKeyword = 
									nearByStoresSearchKeyword;
							}
							
							// Get latitude and longitude.
							var getGeoLocationPromise = geoService.
								getGeoLocationByAddress(nearByStoresSearchKeyword);
							
							// Register a callback function to get called 
							// when the geo location data is resolved.
							getGeoLocationPromise
								.then(
								function (geoLocation) {
									// Prepare near by stores search request.
									var nearByStoresSearchRequest = {
										skuId : scope.nearByStoresDataModel.selectedSku.id,
										latitude : geoLocation.lat(),
										longitude : geoLocation.lng(),
										distance : scope.nearByStoresDataModel.selectedRadius
									};
									
									// Search near by stores based on latitude and longitude.
									var nearByStoresSearchResponsePromise = 
										nearByStoresService.searchNearByStores(nearByStoresSearchRequest);

									// Get stores from response and set in the model.
									nearByStoresSearchResponsePromise
										.then(
										function (successResult) {
											scope.nearByStoresDataModel.stores = successResult;

											// Initially don't display stock availability message.
											for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
												scope.nearByStoresDataModel.stores[i].
													showStockAvailabilityMessage = false;
											}
										}, function (errorResult) {
											$log.error(errorResult);
											scope.nearByStoresDataModel.stores = [];
										});
								}, function (error) {
									$log.error(error);
									scope.nearByStoresDataModel.stores = [];
								});
						}, function () {
							// Promise rejected.
						});
					};

					/**
					 * This function adds item to basket consuming inventory of webstore.
					 */
					scope.addItemToBasketFromWebStore = function () {
						if (scope.nearByStoresDataModel.requestedQuantity > 
							scope.nearByStoresDataModel.online.availableQty) {
							// Display stock availability message.
							scope.nearByStoresDataModel.online.showStockAvailabilityMessage = true;
							
							for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
								scope.nearByStoresDataModel.stores[i].
									showStockAvailabilityMessage = false;
							}
						} else {
							appService.activateSpinner();

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								// Customer and Basket are not in session. So create guest Customer and its Basket.

								var customerId = '';
								var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											var itemToAdd = {
												productID : scope.nearByStoresDataModel.product.id,
												skuID : scope.nearByStoresDataModel.selectedSku.id,
												qty : scope.nearByStoresDataModel.requestedQuantity,
												storeID : null
											};
											
											scope.addItemToBasketFromNearByStoresModal(
												dataStorageService.getBasketId(), itemToAdd);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Customer and Basket are in session.
								var itemToAdd = {
									productID : scope.nearByStoresDataModel.product.id,
									skuID : scope.nearByStoresDataModel.selectedSku.id,
									qty : scope.nearByStoresDataModel.requestedQuantity,
									storeID : null
								};
								
								scope.addItemToBasketFromNearByStoresModal(
									dataStorageService.getBasketId(), itemToAdd);
							}
						}
					};
					
					/**
					 * This function adds item to basket consuming inventory of given store.
					 */
					scope.addItemToBasketFromPhysicalStore = function (store) {
						var storeId = store.id;

						if (scope.nearByStoresDataModel.requestedQuantity > store.availableQty) {
							// Display stock availability message.
							for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
								if (scope.nearByStoresDataModel.stores[i].id === store.id) {
									scope.nearByStoresDataModel.stores[i].
										showStockAvailabilityMessage = true;
								} else {
									scope.nearByStoresDataModel.stores[i].
										showStockAvailabilityMessage = false;
								}
							}

							// Display stock availability message.
							scope.nearByStoresDataModel.online.showStockAvailabilityMessage = false;
						} else {
							appService.activateSpinner();

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								// Customer and Basket are not in session. So create guest Customer and its Basket.

								var customerId = '';
								//var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											var itemToAdd = {
												productID : scope.nearByStoresDataModel.product.id,
												skuID : scope.nearByStoresDataModel.selectedSku.id,
												qty : scope.nearByStoresDataModel.requestedQuantity,
												storeID : storeId
											};
											
											scope.addItemToBasketFromNearByStoresModal(
												dataStorageService.getBasketId(), itemToAdd);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Customer and Basket are in session.
								var itemToAdd = {
									productID : scope.nearByStoresDataModel.product.id,
									skuID : scope.nearByStoresDataModel.selectedSku.id,
									qty : scope.nearByStoresDataModel.requestedQuantity,
									storeID : storeId
								};
								
								scope.addItemToBasketFromNearByStoresModal(
									dataStorageService.getBasketId(), itemToAdd);
							}
						}
					};

					/**
					 * This function adds the given item to basket.
					 * 
					 * @param {Number} basketId - The ID of the basket to add item to.
					 * @param {Object} {
					 *			productID: Number,
					 *			skuID: Number,
					 *			qty: Number,
					 *			storeID: Number
					 *		} itemToAdd - The item to add object.
					 */
					scope.addItemToBasketFromNearByStoresModal = function (basketId, itemToAdd) {
						basketService.addItemToBasket(basketId, itemToAdd)
							.then(
							function (successResult) {
								appService.deactivateSpinner();

								if (successResult) {
									// Hide near by stores modal.
									angular.element('#nearByStoresModal').modal('hide');

									var currentUrlPath = $location.path();
									if (currentUrlPath === '/basket') {
										scope.initializeBasketDetailDataModel(basketId);
									} else {
										// Navigate to basket page.
										$location.path('/basket');
									}
								}
							}, function (errorResult) {
								$log.error('An error occurred while adding item to the Basket.' + 
									errorResult);
								appService.deactivateSpinner();

                                // Hide near by stores modal.
                                angular.element('#nearByStoresModal').modal('hide');

                                var currentUrlPath = $location.path();
                                if (currentUrlPath === '/basket') {
                                    scope.initializeBasketDetailDataModel(basketId);
                                } else {
                                    // Navigate to basket page.
                                    $location.path('/basket');
                                }
							});
					};

					scope.continueStockAvailability = function (store) {
						if (store) {
							scope.nearByStoresDataModel.requestedQuantity = store.availableQty;
							scope.addItemToBasketFromPhysicalStore(store);
						} else {
							scope.nearByStoresDataModel.requestedQuantity = 
								scope.nearByStoresDataModel.online.availableQty;
							scope.addItemToBasketFromWebStore();
						}
					};

					scope.cancelStockAvailability = function () {
						// Reset show stock availability message to false.
						for (var i = 0; i < scope.nearByStoresDataModel.stores.length; i++) {
							scope.nearByStoresDataModel.stores[i].
								showStockAvailabilityMessage = false;
						}

						scope.nearByStoresDataModel.online.showStockAvailabilityMessage = false;
					};
				}
			};
		}]);
}(window.angular));
;/*! NumericSpinner.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
	'use strict';

	// A Directive for displaying a numeric spinner (often used to display Qty fields)
	angular.module('pointOfSaleApplication').directive('mlNumericSpinner', function () {
		// Return the directive object
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'views/common/NumericSpinner.html',
			scope: {
				'mappedValue': '=',
				'maxLength': '@'
			},
			link: function (scope) {

                /**
                 * Increment the mapped value.
                 * @param event
                 */
                scope.incrementValue = function (event) {
                    var currentVal, newValLength;

                    // Stop acting like a button
                    event.preventDefault();
                    event.stopPropagation();

                    // Get the current value
                    currentVal = scope.mappedValue / 1;

                    // Get what would be the new value's length
                    newValLength = ((parseInt(currentVal) + 1).toString()).length;

                    // Length of the updated value should not be greater than max length of the input text field.
                    if(scope.isNumeric(currentVal) && newValLength <= scope.maxLength) {
                        // Increment the value
                        currentVal = parseInt(currentVal) + 1;
                    } else if(!scope.isNumeric(currentVal) || isNaN(currentVal)) {
                        // Reset the value
                        currentVal = 0;
                    }

                    // Update the mapped value
                    scope.mappedValue = currentVal;
                };

                /**
                 * Decrement the mapped value.
                 * @param event
                 */
				scope.decrementValue = function (event) {
					var currentVal;

					// Stop acting like a button
					event.preventDefault();
					event.stopPropagation();

					// Get its current value
					currentVal = scope.mappedValue / 1;

                    // The current value should be numeric and greater than 0
                    if(scope.isNumeric(currentVal) && currentVal > 0) {
                        // Decrement the value
                        currentVal = parseInt(currentVal) - 1;
					} else {
                        // Reset the value
						currentVal = 0;
					}

                    // Update the mapped value
                    scope.mappedValue = currentVal;
				};

                /**
                 * Check to see if the provided value is Numeric
                 * @param value
                 * @returns {boolean}
                 */
				scope.isNumeric = function (value) {
					var reg = new RegExp('^\\d*$');
					return reg.test(value) && !isNaN(value);
				};

                /**
                 * Check to see if the button, of the provided 'buttonType,' should be disabled
                 * @param buttonType The type of the button (eg. 'increment', 'decrement')
                 * @returns {boolean}
                 */
                scope.isButtonDisabled = function (buttonType) {
                    var currentVal = scope.mappedValue / 1,
                        disable = false;

                    // If the current value is an empty string, set it to 0
                    if(currentVal === '') {
                        currentVal = 0;
                    }

                    // Switch based on the button type (eg. 'increment', 'decrement')
                    switch (buttonType) {
                        case 'increment':
                            if (scope.isNumeric(currentVal) &&
                                ((parseInt(currentVal) + 1).toString()).length > scope.maxLength) {
                                disable = true;
                            }
                            break;
                        case 'decrement':
                            if (parseInt(currentVal) === 0) {
                                disable = true;
                            }
                            break;
                    }

                    return disable;
                };

                /**
                 * Handle on blur events for the Qty field and adjust the value if necessary.
                 */
                scope.handleBlur = function () {
                    var value = scope.mappedValue;

                    if (value == null || value.length === 0 || (value + '').replace(/\s/g, '').length === 0 ||
                        !scope.isNumeric(value)) {
                        scope.mappedValue = 0;
                    } else {
                        scope.mappedValue = value/1;
                    }
                };

                /**
                 * Watch the mappedValue for changes and reset to '0' if necessary
                 */
                scope.$watch('mappedValue', function(value) {
                    if (!scope.isNumeric(value)) {
                        scope.mappedValue = 0;
                    }

					scope.$emit('quantityChanged', scope.mappedValue);
                });

			}
		};
	});
}(window.angular));

;/**
 * Order Confirmation Receipt Modal Directive
 *
 * @author Will Mitchell
 */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    // A Directive for displaying prices (is, was, free, etc)
    angular.module('pointOfSaleApplication').directive('orderConfirmationModal', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/OrderConfirmationModal.html',
            controller: 'orderConfirmationModalController',

            link: function (scope, element) {
                /**
                 * This attaches an even to the Dialog's *hidden* event, so we can do some
                 * cleanup after it's hidden.
                 */
                element.find('.modal:first').on('hidden.bs.modal', function () {
                    scope.$emit('redirectTo', {path: '/dashboard'});
                });
            }
        };
    });
}(window.angular));
;/*! OrderSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('orderSearchModal', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/search/OrderSearchModal.html',
            controller: 'orderSearchModalController',
            link: function (scope, element) {
                angular.element('#orderSearchModal').on('shown.bs.modal', function () {
                    angular.element('#orderCode').focus();
                });

                element.find('.modal:first').on('hidden.bs.modal', function () {
                    $timeout(scope.closeOrderSearchModal, 0);
                });
            }
        };
    }]);
}(window.angular));
;/*! PaymentCash.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCash', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/PaymentCash.html',
            scope: {
                mlPaymentModel: '=',
                paymentService: '=',
                mlParentSubmit: '&'
            },
            link: function (scope) {

                /**
                 * Used to init the model for this payment
                 */
                scope.init = function () {
                    scope.selectionType = 'CASH';

                    scope.mlPaymentModel.cash = {
                        'amount': '0',
                        'amountDisplay': scope.formatAmount('0'),
                        'buttons': scope.paymentService.getCashButtons()
                    };
                };

                /**
                 * Handel key selections.
                 * @param key
                 */
                scope.selectCashKey = function (key) {
                    if (key === 'Delete') {
                        var amount = scope.mlPaymentModel.cash.amount;
                        if (amount.length > 1) {
                            // remove last char
                            scope.mlPaymentModel.cash.amount = amount.substr(0, amount.length - 1);
                        }
                    } else {
                        scope.mlPaymentModel.cash.amount = scope.mlPaymentModel.cash.amount + key;
                    }
                    scope.mlPaymentModel.cash.amountDisplay = scope.formatAmount(scope.mlPaymentModel.cash.amount);
                };

                scope.formatAmount = function (amount) {
                    var formatted = parseInt(amount) / 100;
                    return formatted.toFixed(2);
                };

                scope.clearCash = function () {
                    scope.mlPaymentModel.cash.amount = '0';
                    scope.mlPaymentModel.cash.amountDisplay = scope.formatAmount('0');
                };

                /**
                 * Add the payment to the model and submit to the parent controller
                 */
                scope.applyPayment = function () {
                    if (parseInt(scope.mlPaymentModel.cash.amount) > 0){
                        var code = 'CASH';
                        var name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name');

                        var payment = {
                            'name': name,
                            'paymentType': name,
                            'paymentAmount': scope.mlPaymentModel.cash.amountDisplay,
                            'code': code
                        };

                        scope.mlPaymentModel.payments[code] = payment;

                        scope.mlParentSubmit();
                    }
                };

                /**
                 * Handel the form submit.
                 * This is where the form validation should happen
                 */
                scope.submitForm = function () {
                    // if we need to do validation, we'll do it here
                    scope.applyPayment();
                };

                /**
                 * Listen for a processPayment broadcast and validate/submit the data
                 */
                scope.$on('processPayment', function (event, data) {
                    if (data === scope.selectionType) {
                        scope.submitForm();
                    }
                });

                /**
                 * Listen for a resetPaymentDisplay broadcast and then clean up the display
                 */
                scope.$on('resetPaymentDisplay', function (event, data) {
                    if (data === scope.selectionType || !data) {
                        scope.clearCash();
                    }
                });

                // Init the model
                scope.init();
            }
        };
    });
}(window.angular, window._));

;/*! PaymentCreditCardManual.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCreditCardManual', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/PaymentCreditCardManual.html',
            scope: {
                mlPaymentModel: '=',
                paymentService: '=',
                mlParentSubmit: '&'
            },
            link: function (scope) {

                /**
                 * Used to init the model for this payment
                 */
                scope.init = function () {
                    scope.selectionType = 'CREDIT_CARD_ENTRY';
                    scope.formSubmitted = false;

                    scope.mlPaymentModel.creditCard = scope.paymentService.getCreditCardOptions();

                    scope.paymentService.getCreditCardTypes().then(function(successResult){
                        scope.mlPaymentModel.creditCard.types = successResult.data;
                    }, function (errorResult) {
                        console.log(errorResult.data);
                        console.log(errorResult.data.errorMessage);
                    });
                };


                // Watch for changes on the credit card number
                scope.$watch('mlPaymentModel.creditCard.number', function(newValue) {
                    scope.ccTypeMatch(newValue);
                });

                /**
                 * Try to match the credit card number to a credit card and if a match is found, sync the model data
                 * @param value
                 */
                scope.ccTypeMatch = function (value){
                    var card, pattern, foundValue = '', i;

                    // Only continue if we have cards to iterate over
                    if (scope.mlPaymentModel.creditCard.types) {
                        // Iterate over all available cards and test the current number against the card's pattern
                        for (i = 0; i < scope.mlPaymentModel.creditCard.types.length; i++) {
                            card = scope.mlPaymentModel.creditCard.types[i];
                            pattern = new RegExp(card.pattern);

                            // If a match is found, update the 'foundValue' and break out of the loop
                            if (pattern.test(value)) {
                                foundValue = card.value;
                                break;
                            }
                        }

                        // Update the model data with the result
                        scope.mlPaymentModel.creditCard.type = foundValue;
                    }
                };

                /**
                 * Add the payment to the model and submit to the parent controller
                 */
                scope.applyPayment = function () {
                    var code = 'CARDPRESENT';
                    var name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name');
                    var payment = {
                        'paymentType': name,
                        'creditCardNumber': scope.mlPaymentModel.creditCard.number,
                        'creditCardExpiryMonth': scope.mlPaymentModel.creditCard.expiryMonth.selectedOption,
                        'creditCardExpiryYear': scope.mlPaymentModel.creditCard.expiryYear.selectedOption,
                        'creditCardType': scope.mlPaymentModel.creditCard.type,
                        'cvv2': scope.mlPaymentModel.creditCard.cvv,
                        'postalCode': scope.mlPaymentModel.creditCard.postalCode,
                        'code': code,
                        'name': name
                    };

                    scope.mlPaymentModel.payments[code] = payment;

                    scope.mlParentSubmit();
                };

                /**
                 * Handel the form submit.
                 * This is where the form validation should happen
                 */
                scope.submitForm = function (){
                    scope.formSubmitted = true;

                    // check to make sure the form is  valid
                    if (scope.paymentManualCreditCard.$valid) {
                        scope.applyPayment();
                    } else {
                        console.log('The form is NOT valid.');
                    }
                };

                /**
                 * Listen for a processPayment broadcast and validate/submit the data
                 */
                scope.$on('processPayment', function(event, data) {
                    if (data === scope.selectionType) {
                        scope.submitForm();
                    }
                });

                // Init the model
                scope.init();
            }
        };
    });
}(window.angular, window._));

;/*! PaymentCreditCardSwipe.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlPaymentCreditCardSwipe',
        ['$log', 'cardReaderService', function ($log, cardReaderService) {
            // Return the directive object
            return {
                restrict: 'E',
                templateUrl: 'views/basket/PaymentCreditCardSwipe.html',
                scope: {
                    mlPaymentModel: '=',
                    paymentService: '=',
                    mlParentSubmit: '&',
                    mlViewSelection: '=',
                    mlChangeSelection: '&'
                },
                link: function (scope) {
                    /**
                     * Used to init the model for this payment
                     */
                    scope.init = function () {
                        $log.debug('mlPaymentCreditCardSwipe: init');

                        scope.selectionType = 'CREDIT_CARD_SWIPE';
                        scope.sdkIsActive = false;
                        scope.readerIsConnected = false;
                        scope.readerIsAttached = false;
                        scope.isScanInError = false;
                        scope.sdkActivation = {};
                        scope.authInProgress = false;
                        scope.authFailed = false;
                        scope.authRequestIDs = '';
                        scope.amountAuthorized = '';
                        scope.authorizedCardType = '';
                        scope.maskedCardNumber = '';
                    };

                    /**
                     * This function makes a call to *activate* the sdk and *connect* the reader,
                     * or prepare the device for a *scan*, if the reader is already activated and connected
                     */
                    scope.initializeReader = function () {
                        $log.debug('mlPaymentCreditCardSwipe: initializeReader');

                        if (!scope.sdkIsActive) {
                            scope.nestedActivateSDK();
                        } else if (scope.sdkIsActive && scope.readerIsConnected) {
                            scope.scanCard();
                        }
                    };

                    /**
                     * This function tries to *activate* the sdk and *connect* to the reader device,
                     * and if successful, it then prepares the device for a *scan*
                     * otherwise flags are set for the error states and the errors are logged
                     */
                    scope.nestedActivateSDK = function () {
                        $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK');

                        try {
                            cardReaderService.activateSDK().then(
                                function () {
                                    $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK: activateSDK: Success');

                                    scope.sdkIsActive = true;
                                    cardReaderService.readerConnect().then(
                                        function () {
                                            $log.debug('mlPaymentCreditCardSwipe: nestedActivateSDK: ' +
                                            'readerConnect: Success');

                                            scope.readerIsConnected = true;
                                            scope.scanCard();
                                        },
                                        function (errorResult) {
                                            $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK:' +
                                            ' readerConnect: Failed');
                                            $log.error(errorResult);
                                            scope.readerIsConnected = false;
                                        }
                                    );

                                },
                                function (errorResult) {
                                    $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK: activateSDK: Failed');
                                    $log.error(errorResult);
                                    scope.sdkIsActive = false;
                                }
                            );
                        } catch (error) {
                            $log.error('mlPaymentCreditCardSwipe: nestedActivateSDK:' +
                            ' Failed to activate/connect the card reader.');
                            $log.error(error);
                        }
                    };


                    /**
                     * This function tries to prepare the device for a scan.
                     */
                    scope.scanCard = function () {
                        $log.debug('mlPaymentCreditCardSwipe: scanCard');

                        scope.isScanInError = false;

                        if (!scope.sdkIsActive) {
                            scope.isScanInError = true;
                            return;
                        }
                        if (!scope.readerIsConnected) {
                            scope.isScanInError = true;
                            return;
                        }

                        cardReaderService.scanCard().then(
                            function (successResult) {
                                $log.debug('mlPaymentCreditCardSwipe: scanCard: Success');
                                var data = getStrRepr(successResult);
                                scope.isScanInError = false;
                                scope.authorizeCard(data);
                            },
                            function (errorResult) {
                                $log.error('mlPaymentCreditCardSwipe: scanCard: Failed ');
                                $log.error(errorResult);
                            }
                        );

                    };

                    /**
                     * This function is used to authorize the card with a back-end post.
                     * @param data The credit card track data.
                     */
                    scope.authorizeCard = function (data) {
                        $log.debug('mlPaymentCreditCardSwipe: authorizeCard');

                        scope.authInProgress = true;

                        cardReaderService.authorizeCard(scope.mlPaymentModel.id, {
                            trackData: data,
                            'payments': _.toArray(scope.mlPaymentModel.payments)
                        }).then(
                            function (successResult) {
                                if (successResult.data.success) {
                                    $log.debug('mlPaymentCreditCardSwipe: authorizeCard: Success');

                                    scope.authInProgress = false;
                                    scope.authFailed = false;
                                    scope.amountAuthorized = successResult.data.amountAuthorized;
                                    scope.authRequestIDs = successResult.data.requestIDs;
                                    scope.authorizedCardType = successResult.data.cardType;
                                    scope.maskedCardNumber = successResult.data.maskedCreditCardNumber;
                                    scope.mlChangeSelection({selection: 'SIGNATURE'});

                                    scope.mlPaymentModel.authData = {
                                        'creditCardType': scope.authorizedCardType,
                                        'authRequestIDs': scope.authRequestIDs
                                    };
                                } else {
                                    $log.error('mlPaymentCreditCardSwipe: authorizeCard: Failed');
                                    $log.error(successResult.data.error);

                                    scope.authInProgress = false;
                                    scope.authFailed = true;
                                    scope.scanCard();
                                }
                            },
                            function (errorResult) {
                                $log.error('mlPaymentCreditCardSwipe: authorizeCard: Failed');
                                $log.error(errorResult);

                                scope.authInProgress = false;
                                scope.authFailed = true;
                                scope.scanCard();
                            }
                        );
                    };

                    /**
                     * Add the payment to the model and submit to the parent controller
                     */
                    scope.applyPayment = function () {
                        $log.debug('mlPaymentCreditCardSwipe: applyPayment');

                        var code = 'CARDPRESENT',
                            name = _.result(_.find(scope.mlPaymentModel.paymentTypes, 'code', code), 'name'),
                            payment = {
                            'paymentType': name,
                            'paymentAmount': scope.amountAuthorized,
                            'signatureVerified': true,
                            'authRequestIDs': scope.authRequestIDs,
                            'creditCardType': scope.authorizedCardType,
                            'maskedCreditCardNumber': scope.maskedCardNumber
                        };

                        scope.mlPaymentModel.payments[code] = payment;
                        scope.mlParentSubmit();
                    };

                    /**
                     * Watch the view selection so we can init all necessary pieces.
                     */
                    scope.$watch('mlViewSelection', function (value) {
                        if (value === scope.selectionType) {
                            cardReaderService.clearRunningTasks().then(function () {
                                scope.init();
                                scope.initializeReader();
                            });

                        }
                    });

                    /**
                     * Listen for a processPayment broadcast and validate/submit the data
                     */
                    scope.$on('processPayment', function (event, data) {
                        if (data === scope.selectionType) {
                            scope.applyPayment();
                        }
                    });

                    /**
                     * Takes an array of credit card track data and returns a concatenated string.
                     * @param array
                     * @returns {string}
                     */
                    function getStrRepr(array) {
                        var ret = [], a = array;
                        for (var i = 0; i < a.length; i++) {
                            if (a[i] === '\t'.charCodeAt(0)) {
                                ret[i] = '\\t';
                            } else if (a[i] === '\n'.charCodeAt(0)) {
                                ret[i] = '\\n';
                            } else if (a[i] === '\r'.charCodeAt(0)) {
                                ret[i] = '\\r';
                            } else if (a[i] === '\\'.charCodeAt(0)) {
                                ret[i] = '\\\\';
                                //printable
                            } else if (a[i] >= 0x20 && a[i] <= 0x7E) {
                                ret[i] = String.fromCharCode(a[i]);
                                //use \hex for all others
                            } else {
                                var hex = a[i].toString(16);
                                ret[i] = '\\' + (hex.length === 1 ? '0' : '') + hex; // eg. 0xab => \ab instead of \xab
                            }
                        }
                        return ret.join('');
                    }

                    // Make a call to init the scope
                    scope.init();
                }
            };
        }]);
}(window.angular, window._));

;/*! PaymentModal.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('paymentModal', function() {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = 'views/basket/PaymentModal.html';

		return directive;
	});
}(window.angular));
;/*! ProductDetailModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('productDetailModal', 
		['$log', '$location', 'dataStorageService', 'basketService', 'newOrderService',
		function ($log, $location, dataStorageService, basketService, newOrderService) {
			return {
				restrict : 'E',

				templateUrl : 'views/product/ProductDetailModal.html',
				
				controller : 'productDetailController',
				
				link : function (scope) {
					angular.element('#productDetailModal').on('show.bs.modal', function () {
						// Initialize product detail modal.
						// Look for product Id in the scope of this directive 
						// and use it to initialize model for view.
						if (scope.productId) {
							scope.model.initialized = false;
							scope.init(scope.productId);
						}
					});

					/**
					 * Close product detail modal.
					 */
					scope.closeProductDetailModal = function () {
						angular.element('#productDetailModal').modal('hide');
					};

					/**
					 * Cancel product detail modal.
					 */
					scope.cancelProductDetailModal = function () {
						angular.element('#productDetailModal').modal('hide');
					};

					scope.addItemToBasketAndReloadBasket = function () {
						scope.model.addToBasketItem.storeID = dataStorageService.getStoreId();

						// Get the selected sku Id
						scope.model.addToBasketItem.skuID = scope.getSelectedSku();

						// Only continue if we have a selected sku
						if (scope.model.addToBasketItem.skuID !== null && 
							scope.model.stockAvailable && 
							scope.model.addToBasketItem.qty > 0) {

							if ((!dataStorageService.getCustomerId()) && (!dataStorageService.getBasketId())) {
								var customerId = '';
								var storeId = dataStorageService.getStore().id;
								var csrId = dataStorageService.getLoggedInCSR().id;
								var phone = '';

								newOrderService.startNewOrder(customerId, storeId, csrId, phone)
									.then(
									function (successResult) {
										if (successResult) {
											$log.debug('New Order Response : ' + angular.toJson(successResult));

											// Get the basket Id from data storage
											var basketId = dataStorageService.getBasketId();

											// Make the service call to addItemToBasket
											basketService.addItemToBasket(basketId, scope.model.addToBasketItem).then(
												function (successResult) {
													if (successResult) {
														// Navigate to basket page.
														$location.path('/basket');
													}
												}, function (errorResult) {
													$log.error('An error occurred while adding item to the Basket.' + 
														errorResult);
												}
											);
										}
									}, function (errorResult) {
										$log.error('An error occured while starting new Order.' + errorResult);
									});
							} else {
								// Get the basket Id from data storage
								var basketId = dataStorageService.getBasketId();

								// Make the service call to addItemToBasket
								basketService.addItemToBasket(basketId, scope.model.addToBasketItem).then(
									function (successResult) {
										if (successResult) {
											var currentUrlPath = $location.path();
											if (currentUrlPath === '/basket') {
												// Fire basket reload event back upwards using $scope.$emit
												scope.$emit('reloadBasket');
											} else {
												// Navigate to basket page.
												$location.path('/basket');
											}
										}
									}, function (errorResult) {
										$log.error('An error occurred while adding item to the Basket.' + 
											errorResult);
									}
								);
							}
						}
					};
				}
			};
		}]);
}(window.angular));
;/*! ProductOptions.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular, _) {
    'use strict';

    // A Directive for displaying prices (is, was, free, etc)
    angular.module('pointOfSaleApplication').directive('mlProductOptions', function () {
        // Return the directive object
        return {
            restrict: 'A',
            templateUrl: 'views/product/ProductOptions.html',
            scope: {
                'options': '='
            },
            link: function (scope) {
                // Active state vars
                scope.selectedSkus = null;
                scope.activeOptionType = null;

				scope.$watch('options', function() {
					scope.selectedSkus = null;
					scope.activeOptionType = null;
				});

                /**
                 * Handles Option selection, updating active state vars (selectedSkus, activeOptionType, etc)
                 * @param {object} type The option type object.
                 * @param {object} option The option object.
                 */
                scope.selectOption = function (type, option) {
                    var selectable;

                    // Update the selectedOption property on the option type object
                    type.selectedOption = option;

                    // Update the scope, so we can keep track of the currently 'active' option type
                    scope.activeOptionType = type;

                    // Check to see if the current option is selectable
                    selectable = scope.isOptionSelectable(type, option);

                    // Only continue if the current option is selectable
                    if (selectable) {

                        if (scope.selectedSkus !== null && !scope.firstOptionSelect()) {
                            // We've already made some selections, so take an intersection of the sku IDs
                            scope.selectedSkus = _.intersection(scope.selectedSkus, option.skuIDs);
                        } else {
                            // We haven't make a selection yet, so just update the selectedSkus
                            scope.selectedSkus = option.skuIDs;
                        }

                    } else {
                        // If the option wasn't 'selectable' reset the selectedSkus with this options's sku IDs
                        scope.selectedSkus = option.skuIDs;
                    }

                    if (scope.selectedSkus){
                        scope.$emit('productOptionChanged', { selectedSkus: scope.selectedSkus });
                    }
                };

                /**
                 * Checks to see if we currently only have one, or less, selected option/optionType
                 * @returns {boolean} Returns true if we only have one selected option time or false otherwise
                 */
                scope.firstOptionSelect = function () {
                    var multipleOptionTypes,
                        selectedOptionTypeLength;

                    // Check to see if this product has multiple option types
                    multipleOptionTypes = scope.options.length > 1;

                    // Figure out how many options we already have selected
                    selectedOptionTypeLength = _.filter(scope.options, function (n) {
                        return n.selectedOption !== null;
                    }).length;

                    // If we have multiple option types and one or less selected options return true, otherwise false
                    return (multipleOptionTypes && selectedOptionTypeLength <= 1);
                };

                /**
                 * Checks to see if the provided option for the given option type is selectable
                 * @param {object} type The option type object.
                 * @param {object} option The option object.
                 * @returns {boolean}
                 */
                scope.isOptionSelectable = function (type, option) {
                    // Default 'selectable' to true
                    var selectable = true;

                    // Since we're flagging options as non-selectable...
                    // Only continue if our state vars confirm that we've had an option selected
                    if (scope.activeOptionType != null && scope.selectedSkus !== null) {
                        if (type !== scope.activeOptionType) {
                            // If the the type is outside our current activeOptionType, check the skuID's intersection
                            // to see if it's selectable
                            selectable = (_.intersection(scope.selectedSkus, option.skuIDs).length > 0);
                        } else if (type === scope.activeOptionType) {
                            // If the type is equal to the current activeOptionType, check to see if we have one or
                            // less prior selections, if so, enable this optionType's other options, otherwise check
                            // the skuID's intersection
                            selectable = (scope.firstOptionSelect()) ? true :
                                (_.intersection(scope.selectedSkus, option.skuIDs).length > 0);
                        }
                    }

                    return selectable;
                };
            }
        };
    });
}(window.angular, window._));

;/*! ProductSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('productSearchModal', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/search/ProductSearchModal.html',
            controller: 'productSearchModalController',
            link: function (scope, element) {
                angular.element('#productSearchModal').on('shown.bs.modal', function () {
                    angular.element('#productSearchKeyword').focus();
                });

                element.find('.modal:first').on('hidden.bs.modal', function () {
                    $timeout(scope.closeProductSearchModal, 0);
                });
            }
        };
    }]);
}(window.angular));
;/**
 * Email Receipt Modal Directive
 *
 * @author Will Mitchell
 */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

        // A Directive for displaying prices (is, was, free, etc)
        angular.module('pointOfSaleApplication').directive('receiptModal', function () {
            // Return the directive object
            return {
                restrict: 'E',
                templateUrl: 'views/basket/ReceiptModal.html',
                controller: 'receiptModalController',

                link: function (scope, element) {

                    scope.manageSelection = function (option) {

                        if (option === 'print' && scope.receiptDataModel.deviceName !== scope.noDevice) {
                            scope.receiptDataModel.printSelected = !scope.receiptDataModel.printSelected;
                            return;


                        }
                        else if (option === 'email'){
                            scope.receiptDataModel.emailSelected = !scope.receiptDataModel.emailSelected;
                            scope.buttonClicked = false;
                        }
                    };

                    element.find('.modal:first').on('hidden.bs.modal', function () {
                        scope.update();
                        scope.$emit('order-confirm', scope.obj);
                        angular.element('#orderConfirmationModal').modal('show');
                    });
                }
            };
    });
}(window.angular));

;/*! ScanBarcode.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlBarcodeSearch',
        ['$location', '$log', '$timeout', 'scanBarcodeService', 'dataStorageService',
            function ($location, $log, $timeout, scanBarcodeService, dataStorageService) {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/ScanBarcode.html',
                    scope: {
                        modalTitle: '@',
                        serviceUrl: '@',
                        servicePostData: '=',
                        forwardUrl: '@',
                        displayAsModal: '@',
                        createBasket: '@',
                        scanCallback: '&',
                        scanSuccessCallback: '&',
                        continueBtnResource: '@',
                        cancelBtnResource: '@',
                        multiAddMsgResource: '@',
                        multiAddCountResource: '@'
                    },
                    link: function (scope, element) {
                        /**
                         * Used to init the model
                         */
                        scope.init = function () {
                            $log.debug('mlBarcodeSearch: init');

                            scope.deviceStatus = '';
                            scope.deviceConnected = false;
                            scope.scanningValue = '';
                            scope.scannedValue = '';
                            scope.stopPolling = false;
                            scope.searchInProgress = false;
                            scope.searchError = false;
                            scope.canContinue = false;
                            scope.itemFoundCount = 0;
                            scope.servicePostData = scope.servicePostData || {};

                            if (scope.createBasket) {
                                scope.servicePostData.basketId = dataStorageService.getBasketId() || null;
                                scope.servicePostData.storeId = dataStorageService.getStoreId() || null;

                                if (dataStorageService.getLoggedInCSR() && dataStorageService.getLoggedInCSR().id) {
                                    scope.servicePostData.csrId = dataStorageService.getLoggedInCSR().id;
                                } else {
                                    scope.servicePostData.csrId = null;
                                }
                            }

                            scope.pollForConnection();
                        };

                        /**
                         * Watch the *deviceConnected* scope var for a true state and then start
                         * polling for scanner values.
                         */
                        scope.$watch('deviceConnected', function (value) {
                            if (value === true) {
                                scope.pollForScannedValue();
                            }
                        });

                        /**
                         * Watch the *scanningValue* scope var for changes and when we have a good value,
                         * send it to the *sendBarcode* function which calls the service.
                         */
                        scope.$watch('scanningValue', function (newValue, lastValue) {
                            if (newValue && newValue.toLowerCase() !== 'no value' &&
                                newValue.toLowerCase() !== 'no value available' &&
                                lastValue && !scope.searchInProgress) {
                                $log.debug('mlBarcodeSearch: watch: scanningValue: newValue: ' + newValue);
                                $log.debug('mlBarcodeSearch: watch: scanningValue: lastValue: ' + lastValue);

                                scope.scannedValue = newValue;
                                scope.sendBarcode();
                            }
                        });

                        /**
                         * The function calls the *scanBarcodeService* *sendBarcode* function passing along
                         * the scannedValue.
                         */
                        scope.sendBarcode = function () {
                            if (!scope.searchInProgress) {
                                var apiURL = scope.serviceUrl.replace(/UPC_CODE/g, scope.scannedValue);

                                $log.debug('mlBarcodeSearch: sendBarcode: serviceUrl: ' + apiURL);
                                $log.debug('mlBarcodeSearch: sendBarcode: scannedValue: ' + scope.scannedValue);
                                scope.searchError = false;
                                scope.searchInProgress = true;

                                if (scope.scanCallback) {
                                    scope.scanCallback({'code': scope.scannedValue});
                                }

                                scanBarcodeService.sendBarcode(apiURL, scope.servicePostData).then(
                                    function (successResult) {
                                        $log.debug('mlBarcodeSearch: sendBarcode: Success');
                                        scope.searchInProgress = false;
                                        scope.canContinue = true;
                                        scope.itemFoundCount++;

                                        if (successResult.data.basketId) {
                                            scope.servicePostData.basketId = successResult.data.basketId;
                                        }

                                        if (!scope.continueBtnResource) {
                                            scope.hideScanDialog();
                                        }

                                        if (scope.createBasket === 'true') {
                                            dataStorageService.setBasketId(successResult.data.basketId);
                                            dataStorageService.setCustomerId(successResult.data.customerId);
                                        }

                                        if (scope.scanSuccessCallback) {
                                            scope.scanSuccessCallback();
                                        }

                                        if (scope.forwardUrl && !scope.continueBtnResource) {
                                            $location.path(scope.forwardUrl);
                                        }
                                    },
                                    function (errorResult) {
                                        $log.error('mlBarcodeSearch: sendBarcode: Failed');
                                        $log.error(errorResult);
                                        scope.searchInProgress = false;
                                        scope.searchError = true;
                                    }
                                );
                            }
                        };

                        /**
                         * Poll for device connection.
                         */
                        scope.pollForConnection = function () {
                            if (!scope.deviceConnected && !scope.stopPolling) {
                                $timeout(scope.getDeviceStatus, 500);
                            }
                        };

                        /**
                         * Poll for scanned value.
                         */
                        scope.pollForScannedValue = function () {
                            if (scope.deviceConnected && !scope.stopPolling) {
                                $timeout(scope.getScannedValue, 500);
                            }
                        };

                        /**
                         * This function calls the service to get the devices connection status.
                         */
                        scope.getDeviceStatus = function () {
                            try {
                                scanBarcodeService.getDeviceStatus().then(
                                    function (successResult) {
                                        $log.debug('mlBarcodeSearch: getDeviceStatus: Success');

                                        scope.deviceStatus = successResult;
                                        if (successResult && successResult.toLowerCase() === 'connected') {
                                            scope.deviceConnected = true;
                                        } else {
                                            scope.pollForConnection();
                                        }
                                    },
                                    function (errorResult) {
                                        $log.error('mlBarcodeSearch: getDeviceStatus: Failed');
                                        $log.error(errorResult);

                                        scope.deviceStatus = 'Error';
                                    }
                                );
                            } catch (errorResult) {
                                $log.error('mlBarcodeSearch: getDeviceStatus: Failed');
                                $log.error(errorResult);
                            }
                        };

                        /**
                         * This function calls the service to get the scanned value from the device.
                         */
                        scope.getScannedValue = function () {
                            scanBarcodeService.getScannedValue().then(
                                function (successResult) {
                                    $log.debug('mlBarcodeSearch: getScannedValue: Success');

                                    scope.scanningValue = successResult;
                                    scope.pollForScannedValue();
                                },
                                function (errorResult) {
                                    $log.error('mlBarcodeSearch: getScannedValue: Failed');
                                    $log.error(errorResult);

                                    scope.scannedValue = 'Error';
                                }
                            );
                        };

                        /**
                         * This function shows the Scan Modal Dialog.
                         */
                        scope.showScanDialog = function () {
                            scope.init();
                            element.find('.modal:first').modal('show');
                        };

                        /**
                         * This function hides the Scan Modal Dialog.
                         */
                        scope.hideScanDialog = function () {
                            scope.stopPolling = true;
                            element.find('.modal:first').modal('hide');
                        };

                        scope.continue = function () {
                            if (scope.canContinue){
                                scope.hideScanDialog();
                                if (scope.forwardUrl) {
                                    $location.path(scope.forwardUrl);
                                }
                            }
                        };

                        /**
                         * This attaches an even to the Scan Dialog's *hidden* event, so we can do some
                         * cleanup after it's hidden.
                         */
                        element.find('.modal:first').on('hidden.bs.modal', function () {
                            // Stop all polling
                            scope.stopPolling = true;
                        });
                    }
                };
            }]);
}(window.angular));

;/*! ScanBarcodeBody.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlBarcodeSearchBody',
        [
            function () {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/ScanBarcodeBody.html',
                    link: function () {}
                };
            }]);
}(window.angular));

;
/**
 * Shipping Address And Method Modal Directive
 *
 *
 */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').directive('shippingAddressAndMethodModal', function() {
		return {
			restrict : 'E',

			templateUrl : 'views/basket/ShippingAddressAndMethodModal.html',
			
			controller : 'shippingAddressAndMethodModalController',

			link : function () {
				angular.element('#shippingAddressAndMethodModal').on('shown.bs.modal', function () {
				
				});
			}
		};
	});
}(window.angular));
;// jshint ignore: start

(function (angular) {
	'use strict';

	/**
	 * ==================  angular-ios9-uiwebview.patch.js v1.1.1 ==================
	 *
	 * This patch works around iOS9 UIWebView regression that causes infinite digest
	 * errors in Angular.
	 *
	 * The patch can be applied to Angular 1.2.0 – 1.4.5. Newer versions of Angular
	 * have the workaround baked in.
	 *
	 * To apply this patch load/bundle this file with your application and add a
	 * dependency on the "ngIOS9UIWebViewPatch" module to your main app module.
	 *
	 * For example:
	 *
	 * ```
	 * angular.module('myApp', ['ngRoute'])`
	 * ```
	 *
	 * becomes
	 *
	 * ```
	 * angular.module('myApp', ['ngRoute', 'ngIOS9UIWebViewPatch'])
	 * ```
	 *
	 *
	 * More info:
	 * - https://openradar.appspot.com/22186109
	 * - https://github.com/angular/angular.js/issues/12241
	 * - https://github.com/driftyco/ionic/issues/4082
	 *
	 *
	 * @license AngularJS
	 * (c) 2010-2015 Google, Inc. http://angularjs.org
	 * License: MIT
	 */

	angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function($provide) {

		$provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

			if (isIOS9UIWebView($window.navigator.userAgent)) {
				return applyIOS9Shim($delegate);
			}

			return $delegate;

			function isIOS9UIWebView(userAgent) {
				return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
			}

			function applyIOS9Shim(browser) {
				var pendingLocationUrl = null;
				var originalUrlFn= browser.url;

				browser.url = function() {
					if (arguments.length) {
						pendingLocationUrl = arguments[0];
						return originalUrlFn.apply(browser, arguments);
					}

					return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
				};

				window.addEventListener('popstate', clearPendingLocationUrl, false);
				window.addEventListener('hashchange', clearPendingLocationUrl, false);

				function clearPendingLocationUrl() {
					pendingLocationUrl = null;
				}

				return browser;
			}
		}]);
	}]);

}(window.angular));
;angular.module('pointOfSaleApplication').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/basket/AddCouponCodeModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"addCouponCodeModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeAddCouponCodeModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\">Add Coupon / Promotion</h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"addCouponCode()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"addCouponCodeDataModel.showAddCouponCodeError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ addCouponCodeDataModel.addCouponCodeErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\">Enter Coupon / Promotion</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"couponCode\" id=\"couponCode\" class=\"form-control\" placeholder=\"Coupon Code\" data-ng-model=\"addCouponCodeDataModel.couponCode\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"addCouponButton\" id=\"addCouponButton\" class=\"ml-ppos-primary-button\">Add Coupon</button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeAddCouponCodeModal()\" translate=\"btn.ppos.cancel\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/Basket.html',
    "<div class=\"ml-ppos-basket-wrapper\" data-ng-controller=\"basketController\">\n" +
    "\t<div class=\"ml-ppos-basket-container\">\n" +
    "\t\t<div class=\"ml-ppos-basket-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-basket-order-number\"><span translate=\"lbl.ppos.basketNumber\"></span> {{ basketDetailDataModel.data.id }}</div>\n" +
    "\t\t\t<!-- Basket row head -->\n" +
    "\t\t\t<div data-ng-controller=\"shippingAddressAndMethodModalController\">\n" +
    "\t\t\t\t<input type=\"hidden\" id=\"hiddenOpener\" data-ng-click=\"showShippingAddressAndMethodModal(); $event.stopPropagation();\">\n" +
    "\t\t\t\t<shipping-address-and-method-modal></shipping-address-and-method-modal>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-basket-head-item-row\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-info\" translate=\"hdr.ppos.productDetail\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-price\" translate=\"hdr.ppos.price\"></div>\n" +
    "\t\t\t\t<!--<div class=\"ml-ppos-basket-head-adjustment\" translate=\"hdr.ppos.adjustment\"></div>-->\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-quantity\" translate=\"hdr.ppos.qty\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-total\" translate=\"hdr.ppos.total\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-head-close-button\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Basket row head End -->\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div data-ng-repeat=\"basketShipment in basketDetailDataModel.data.shipments\">\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"basketItem in basketShipment.items\">\n" +
    "\t\t\t\t\t\t<!-- Basket item row start -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-items-row-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-items-row\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-thumb\"><img src=\"{{basketItem.product.image.thumb}}\" data-ng-click=\"viewProductDetail(basketItem.product.id)\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-thumb-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-click=\"viewProductDetail(basketItem.product.id)\">{{ basketItem.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"></span> {{ basketItem.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in basketItem.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<!-- Pickup or ship to section starts-->\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"basketItem.store.id != currentStore.id\"><!--  show div if item is not from current store -->\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-shipment-options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-click=\"setItemAsShipTo(basketDetailDataModel.data.id, basketItem)\" name=\"radioShipToPickup_{{basketItem.id}}\" id=\"radioShipToPickup_{{basketItem.id}}\" value=\"shipTo\" data-ng-checked=\"!basketItem.isPickupFromStore\" data-ng-disabled=\"!basketItem.isAvailableOnline\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div for=\"radioShipToPickup_{{basketItem.id}}\"><i></i>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableOnline\" translate=\"lbl.ppos.shipToAvailable\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"!basketItem.isAvailableOnline\" translate=\"lbl.ppos.shipToNotAvailable\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-click=\"setItemAsPickup(basketDetailDataModel.data.id, basketItem)\" name=\"radioShipToPickup_{{basketItem.id}}\" id=\"radioShipToPickup_{{basketItem.id}}\" value=\"pickupInStore\" data-ng-checked=\"basketItem.isPickupFromStore\" data-ng-disabled=\"!basketItem.isAvailableInStore\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div for=\"radioShipToPickup_{{basketItem.id}}\"><i></i>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableInStore && basketItem.isPickupFromStore\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-basket-shipment-pickup-store-info\" translate=\"msg.ppos.pickupItemInfo\" translate-values=\"{ storeCity: basketItem.store.city, storeCode: basketItem.store.code }\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"basketItem.isAvailableInStore && !basketItem.isPickupFromStore\" translate=\"lbl.ppos.pickupAvailable\"/>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"!basketItem.isAvailableInStore\" translate=\"lbl.ppos.pickupNotAvailable\"/></div> <!-- Change link will be displaed in phase 2 -->\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"basketItem.store.id == currentStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span translate=\"lbl.ppos.puchasedStore\"/> {{currentStore.name | translate }} ({{basketItem.store.code | translate }})\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<!-- Pickup or ship to section ends-->\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\" class=\"ml-ppos-basket-item-price\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\">Free Gift</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-default>{{ basketItem.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<!--<div class=\"ml-ppos-basket-item-adjustment\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-hide=\"basketItem.discounts.length\"><a href=\"\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-show=\"basketItem.discounts.length\">-{{ basketItem.discountTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-quantity\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\" class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t{{ basketItem.qty }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<input type=\"hidden\" data-ng-value=\"basketItem.qty\" name=\"qty_{{ basketItem.id }}\" id=\"qty_{{ basketItem.id }}\" size=\"2\" maxlength=\"2\" />\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-switch-default class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"basketItem.qty\" data-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-button-update\"><a href=\"javascript:;\" data-ng-click=\"updateBasketItem(basketDetailDataModel.data.id, basketItem.id, basketItem.product.id,  basketItem.skuID, basketItem.qty, basketItem.store)\" translate=\"btn.ppos.update\"></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-switch on=\"basketItem.freeGift\" class=\"ml-ppos-basket-item-total\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-when=\"true\">Free Gift</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-switch-default>{{ basketItem.subTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-show=\"!basketItem.freeGift\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-close-button\"><a href=\"\" data-ng-click=\"removeItemFromBasket(basketDetailDataModel.data.id, basketItem.id)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-discount\" data-ng-repeat=\"basketItemDiscount in basketItem.discounts\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-item-discount-message\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ basketItemDiscount.message }}<!--  <span>-{{ basketItemDiscount.amount }}</span> -->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Basket item row End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-basket-nav-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-basket-header-customer\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-default-header-wrapper\">\n" +
    "\t\t\t\t\t<span>\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" data-ng-click=\"customerProfileInformationModal('update');\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\">{{ customerInformation }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></div>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<customer-profile-information-modal></customer-profile-information-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.product\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-basket-product-search-row\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t<ml-barcode-search data-display-as-modal=\"true\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-modal-title=\"Product Scan\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-service-url=\"/api/scan/skus/UPC_CODE\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-service-post-data=\"skuBarcodeSearchPostData\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-scan-success-callback=\"scanSuccessHandler()\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-cancel-btn-resource=\"btn.ppos.close\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-continue-btn-resource=\"btn.ppos.done\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-multi-add-msg-resource=\"msg.ppos.itemWithCodeAddedToBasket\"\n" +
    "\t\t\t\t\t\t\t\t\t   data-multi-add-count-resource=\"msg.ppos.scanAnotherProduct\"\n" +
    "\t\t\t\t\t\t\t></ml-barcode-search>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-product-search\">\n" +
    "\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-search-button\" data-toggle=\"modal\" data-target=\"#productSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchProduct\"></span></a>\n" +
    "\t\t\t\t\t\t<product-search-modal></product-search-modal>\n" +
    "\t\t\t\t\t\t<product-detail-modal></product-detail-modal>\n" +
    "\t\t\t\t\t\t<near-by-stores-modal></near-by-stores-modal>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Don't show apply coupon code section, summary section, place order and adjustment if there are no items in the basket. -->\n" +
    "\t\t\t<div data-ng-if=\"basketDetailDataModel.data.shipments.length\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.couponPromotion\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-product-coupon-row\">\n" +
    "\t\t\t\t\t<!-- <div class=\"ml-ppos-basket-product-scan\">\n" +
    "\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanCouponBarcode\"></span></a>\n" +
    "\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-product-typein\">\n" +
    "\t\t\t\t\t\t<div data-ng-controller=\"addCouponCodeModalController\">\n" +
    "\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-basket-product-typein-button\" data-toggle=\"modal\" data-target=\"#addCouponCodeModal\"><span translate=\"btn.ppos.typeIn\"></span><span class=\"ml-ppos-grey-icon ml-ppos-typein\"></span></a>\n" +
    "\t\t\t\t\t\t\t<add-coupon-code-modal></add-coupon-code-modal>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-coupon-message\">\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"sourceCode in basketDetailDataModel.data.sourceCodeInfoList\" class=\"ml-ppos-default-header-wrapper\" data-ng-if=\"!sourceCode.discountAmountZero\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\"><span translate=\"msg.ppos.appliedCouponCodeWithAmount\" translate-values=\"{ couponCode : sourceCode.code}\"></span>{{ sourceCode.discountAmount }}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><a href=\"\" data-ng-click=\"removeSourceCode(basketDetailDataModel.data.id, sourceCode.code)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-sub-head\" translate=\"lbl.ppos.summaryOfCharges\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\t\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.merchandiseSubtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\" data-ng-repeat=\"basketDiscount in basketDetailDataModel.data.discounts\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\">{{ basketDiscount.message }}:</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">-{{ basketDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.subtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.subTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.taxAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.shippingAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.shippingTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"basketShipment in basketDetailDataModel.data.shipments\">\n" +
    "\t\t\t\t\t\t\t<div  class=\"ml-ppos-basket-summary-content\" data-ng-repeat=\"basketShipmentDiscount in basketShipment.discounts\" data-ng-if=\"!basketShipment.pickupFromStore\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" data-ng-if=\"!basketShipmentDiscount.discountAmountZero\">{{ basketShipmentDiscount.message }}:</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\" data-ng-if=\"!basketShipmentDiscount.discountAmountZero\">-{{ basketShipmentDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- \n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.adjustmentAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\"></div>\n" +
    "\t\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-summary-total-content\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-label\" translate=\"lbl.ppos.totalAmount\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-summary-value\">{{ basketDetailDataModel.data.total }}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-row\" data-ng-controller=\"paymentController\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-button-place-order\">\n" +
    "\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate=\"btn.ppos.placeOrder\"></span>\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t<button type=\"submit\" class=\"ml-ppos-btn-hidden\" data-ng-click=\"showPaymentModal(basketDetailDataModel.data.id, basketDetailDataModel.data.total)\" id=\"btnOpenPymtModal\" translate=\"btn.ppos.placeOrder\"></button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<payment-modal></payment-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "                <!-- Receipt Start -->\n" +
    "                <div class=\"ml-ppos-dashboard-bag-widget-button-wrapper\">\n" +
    "                    <receipt-modal></receipt-modal>\n" +
    "                </div>\n" +
    "                <!-- Receipt End -->\n" +
    "\n" +
    "                <div class=\"ml-ppos-dashboard-order-confirm-widget-button-wrapper\">\n" +
    "                    <order-confirmation-modal></order-confirmation-modal>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- NOTE: PEBL-15818 Item Level adjustment is in phase 2 of PPOS -->\n" +
    "\t\t\t\t<!--<div class=\"ml-ppos-basket-button-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-basket-button-adjustment\"><a href=\"javascript:;\" translate=\"btn.ppos.adjustment\"></a></div>\n" +
    "\t\t\t\t</div>-->\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-basket-button-row\" data-ng-if=\"!basketDetailDataModel.isAutoSaveBag\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-save-bag\" data-ng-show=\"!basketDetailDataModel.data.csrID\"><a href=\"javascript:;\" data-ng-click=\"saveBag(basketDetailDataModel.data.id)\"><span translate>btn.ppos.saveBag</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></i></a></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-basket-button-save-bag\" data-ng-show=\"basketDetailDataModel.data.csrID\"><a href=\"javascript:;\"><span translate>btn.ppos.saved</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></i></a></div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Save Bag Success Message -->\n" +
    "\t\t\t<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t\t\t\t<div class=\"modal\" id=\"saveBagSuccessModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t\t\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-success\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div translate>btn.ppos.shoppingBagSavedMessage</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"saveBagSuccessOkButton\" id=\"saveBagSuccessOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/OrderConfirmationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "    <div class=\"modal\" id=\"orderConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-ng-click=\"close()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"lbl.ppos.orderNo\"></span>&nbsp;{{orderConfirmationDataModel.orderid}}</h4>\n" +
    "                </div>\n" +
    "\n" +
    "                <form name=\"receiptForm\" novalidate data-ng-submit=\"\">\n" +
    "                    <div class=\"modal-body\" class=\"form-control\">\n" +
    "\n" +
    "                        <div class=\"ml-ppos-customer-search-head ng-scope\" style=\"text-align:center;border-top:1px solid #8da5d1;padding-top:30px;padding-bottom:30px\">\n" +
    "                            <div data-ng-if=\"orderConfirmationDataModel.printSelected\"><span translate=\"lbl.ppos.receiptReadyOn\"></span>&nbsp;{{orderConfirmationDataModel.deviceName}}</div>\n" +
    "                               <p/>\n" +
    "                            <div data-ng-if=\"orderConfirmationDataModel.emailSelected\"><span translate=\"lbl.ppos.receiptHasBeenSentTo\"></span>&nbsp;{{orderConfirmationDataModel.email}}</div>\n" +
    "\n" +
    "                            <div data-ng-if=\"!orderConfirmationDataModel.printSelected && !orderConfirmationDataModel.emailSelected\"><span translate=\"lbl.ppos.orderConfirmationMessage\"></span></div>\n" +
    "\n" +
    "                           </div>\n" +
    "                        <div class=\"modal-footer ml-ppos-button-customer-search\" style=\"border-top:1px solid #8da5d1;\">\n" +
    "                        <button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"close()\" data-dismiss=\"modal\"><span translate=\"btn.ppos.done\"></span></button>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCash.html',
    "<!-- PaymentCash.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"ml-ppos-payment-cash-entry\">{{mlPaymentModel['cash'].amountDisplay}}</div>\n" +
    "    <div class=\"ml-ppos-cash-key-pad\">\n" +
    "        <div class=\"ml-ppos-cash-key-wrapper\" ng-repeat=\"button in mlPaymentModel.cash.buttons track by $index\" ng-click=\"selectCashKey(button.value)\">\n" +
    "            <div class=\"ml-ppos-cash-key\" ng-class=\"{ 'ml-ppos-cash-key-delete' : button.label == 'Delete' }\">{{button.label}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCreditCardManual.html',
    "<!-- PaymentCreditCardManual.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <form name=\"paymentManualCreditCard\" ng-submit=\"submitForm()\" novalidate>\n" +
    "        <!-- Credit Card Number -->\n" +
    "        <div class=\"ml-ppos-payment-card-number ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardNumber\"><span>*</span> <span translate=\"lbl.ppos.creditCardNumber\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardNumber\" name=\"creditCardNumber\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.number\" size=\"16\" maxlength=\"16\" required>\n" +
    "            <input type=\"hidden\" id=\"creditCardType\" name=\"creditCardType\" ng-model=\"mlPaymentModel.creditCard.type\"\n" +
    "                   required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardNumber.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardNumber.$valid && paymentManualCreditCard.creditCardType.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.creditCardNotSupportedError\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Expiry Month and Year -->\n" +
    "        <div class=\"ml-ppos-payment-form-content ml-ppos-payment-form-field-delimiter\">\n" +
    "            <fieldset>\n" +
    "                <legend><span>*</span> <span translate=\"lbl.ppos.expirationDate\"></span></legend>\n" +
    "                <!-- Expiry Month -->\n" +
    "                <div class=\"ml-ppos-payment-card-month\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            id=creditCardExpiryMonth\n" +
    "                            name=\"creditCardExpiryMonth\"\n" +
    "                            ng-model=\"mlPaymentModel.creditCard.expiryMonth.selectedOption\"\n" +
    "                            ng-options=\"option.value as option.label for option in mlPaymentModel.creditCard.expiryMonth.options\"\n" +
    "                            required>\n" +
    "                        <option value=\"\" translate=\"sel.ppos.month\"></option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <!-- Expiry Year -->\n" +
    "                <div class=\"ml-ppos-payment-card-year\">\n" +
    "                    <select class=\"form-control\"\n" +
    "                            name=\"creditCardExpiryYear\"\n" +
    "                            ng-model=\"mlPaymentModel.creditCard.expiryYear.selectedOption\"\n" +
    "                            ng-options=\"option.value as option.label for option in mlPaymentModel.creditCard.expiryYear.options\"\n" +
    "                            required>\n" +
    "                        <option value=\"\" translate=\"sel.ppos.year\"></option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <!-- Validation Messages -->\n" +
    "                <div class=\"ml-ppos-payment-error\"\n" +
    "                     ng-show=\"(paymentManualCreditCard.creditCardExpiryMonth.$error.required || paymentManualCreditCard.creditCardExpiryYear.$error.required) && formSubmitted\"\n" +
    "                     translate=\"msg.ppos.fieldsRequiredError\"></div>\n" +
    "            </fieldset>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- CVV -->\n" +
    "        <div class=\"ml-ppos-payment-card-cvv ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardCVV\"><span>*</span> <span translate=\"lbl.ppos.cardIdentification\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardCVV\" name=\"creditCardCVV\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.cvv\" maxlength=\"4\" required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardCVV.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Zip/Postal Code -->\n" +
    "        <div class=\"ml-ppos-payment-card-zip ml-ppos-payment-form-field-delimiter\">\n" +
    "            <label for=\"creditCardPostalCode\"><span>*</span> <span translate=\"lbl.ppos.billingZipCode\"></span></label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"creditCardPostalCode\" name=\"creditCardPostalCode\"\n" +
    "                   data-ng-model=\"mlPaymentModel.creditCard.postalCode\" maxlength=\"10\" required>\n" +
    "            <!-- Validation Messages -->\n" +
    "            <div class=\"ml-ppos-payment-error\"\n" +
    "                 ng-show=\"paymentManualCreditCard.creditCardPostalCode.$error.required && formSubmitted\"\n" +
    "                 translate=\"msg.ppos.fieldRequiredError\"></div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentCreditCardSwipe.html',
    "<!-- PaymentCreditCardSwipe.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ml-ppos-payment-method-credit-scan-content\">\n" +
    "    <!-- Connecting to the Device -->\n" +
    "    <div data-ng-show=\"!sdkIsActive || !readerIsConnected\">\n" +
    "        <div class=\"ml-ppos-error-container\">\n" +
    "            <div class=\"ml-ppos-error-message\">\n" +
    "                <div translate=\"msg.ppos.connecting\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "            <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                class=\"ml-icon-lib ml-icon-credit-card disabled\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Device Already Connected -->\n" +
    "    <div class=\"ml-scan-section\" data-ng-show=\"sdkIsActive && readerIsConnected\">\n" +
    "        <!-- Ready to Scan -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"!authInProgress && !authFailed\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.swipeCard\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-long-arrow-down\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card ml-ppos-credit-card-icon\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Card Auth in Progress -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"authInProgress\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.authorizingCard\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card disabled\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Auth Failed -->\n" +
    "        <div class=\"ml-scan-section\" data-ng-show=\"!authInProgress && authFailed\">\n" +
    "            <div class=\"ml-ppos-error-container\">\n" +
    "                <div class=\"ml-icon-error\"></div>\n" +
    "                <div class=\"ml-ppos-error-message\">\n" +
    "                    <div translate=\"msg.ppos.processingCardError\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"ml-ppos-payment-method-credit-scan-icons\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-long-arrow-down error\"></span><span\n" +
    "                    class=\"ml-icon-lib ml-icon-credit-card ml-ppos-credit-card-icon\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/PaymentModal.html',
    "<!-- PaymentModal.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ml-ppos-modal-container\">\n" +
    "    <div class=\"modal\" id=\"paymentModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\" ng-class=\"{ 'ml-ppos-signature-content' : selection == 'SIGNATURE' }\">\n" +
    "                <!-- Modal Dialog Header -->\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title ml-ppos-payment-modal-total\" ng-show=\"selection == 'SIGNATURE'\"><span>{{model.total}}</span></h4>\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"hdr.ppos.basketNumber\"></span>: <span>{{model.id}}</span></h4>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- Modal Dialog Body -->\n" +
    "                <div class=\"modal-body\">\n" +
    "                    <div class=\"ml-ppos-payment-display\" ng-class=\"{ 'active' : showDefaultLayout() }\">\n" +
    "                        <div class=\"ml-ppos-payment-method\">\n" +
    "                            <!-- Payment Type Selection -->\n" +
    "                            <div class=\"ml-ppos-payment-selection\" ng-class=\"{ 'active' : selection == 'PAYMENT_SELECTION' }\">\n" +
    "                                <div class=\"ml-ppos-payment-method-label\"><span translate=\"msg.ppos.selectPaymentMethod\"></span></div>\n" +
    "                                <div class=\"ml-ppos-payment-method-item\" ng-repeat=\"type in model.paymentTypes track by $index\" ng-click=\"select(type.code)\">\n" +
    "                                    <div>{{type.displayName}}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <!-- Credit Card Selection Options -->\n" +
    "                            <div class=\"ml-ppos-payment-method-credit\" ng-class=\"{ 'active' : selection == 'CARDPRESENT' }\">\n" +
    "                                <!-- Scan Option -->\n" +
    "                                <div class=\"ml-ppos-scan\" data-ng-click=\"select('CREDIT_CARD_SWIPE')\">\n" +
    "                                    <span class=\"ml-ppos-scan-button\">\n" +
    "                                        <span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span>\n" +
    "                                        <span translate=\"btn.ppos.scanCreditCard\"></span>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                                <!-- Manual Option -->\n" +
    "                                <!-- TODO: uncomment, to add the manual credit card entry. -->\n" +
    "                                <!--<div class=\"ml-ppos-typein\" data-ng-click=\"select('CREDIT_CARD_ENTRY')\">-->\n" +
    "                                    <!--<span class=\"ml-ppos-typein-button\">-->\n" +
    "                                        <!--<span class=\"ml-ppos-grey-icon ml-ppos-typein\"></span>-->\n" +
    "                                        <!--<span translate=\"btn.ppos.typeIn\"></span>-->\n" +
    "                                    <!--</span>-->\n" +
    "                                <!--</div>-->\n" +
    "                            </div>\n" +
    "                            <!-- Credit Card Manual Entry -->\n" +
    "                            <div class=\"ml-ppos-payment-method-credit-enter\" ng-class=\"{ 'active' : selection == 'CREDIT_CARD_ENTRY' }\">\n" +
    "                                <ml-payment-credit-card-manual data-ml-payment-model=\"model\" data-ml-parent-submit=\"addPayment()\" data-payment-service=\"paymentService\"></ml-payment-credit-card-manual>\n" +
    "                            </div>\n" +
    "                            <!-- Cash -->\n" +
    "                            <div class=\"ml-ppos-payment-method-cash\" ng-class=\"{ 'active' : selection == 'CASH' }\">\n" +
    "                                <ml-payment-cash data-ml-payment-model=\"model\" data-ml-parent-submit=\"addPayment()\" data-payment-service=\"paymentService\"></ml-payment-cash>\n" +
    "                            </div>\n" +
    "                            <!-- Gift Certificates -->\n" +
    "                            <div class=\"ml-ppos-payment-method-gift-certificate\" ng-class=\"{ 'active' : selection == 'GIFTCERT' }\">\n" +
    "                                <span translate=\"btn.ppos.enterGiftCertificate\"></span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Payment Summary -->\n" +
    "                        <div class=\"ml-ppos-payment-summary\">\n" +
    "                            <!-- Total -->\n" +
    "                            <div class=\"ml-ppos-summary-content\">\n" +
    "                                <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.total\"></span>:</div>\n" +
    "                                <div class=\"ml-ppos-summary-value\">{{model.total}}</div>\n" +
    "                            </div>\n" +
    "                            <!-- Payment List -->\n" +
    "                            <div class=\"ml-ppos-scroll-container\">\n" +
    "                                <div class=\"\" ng-repeat=\"payment in model.data.payments track by $index\">\n" +
    "                                    <div class=\"ml-ppos-summary-content ml-ppos-summary-payments\">\n" +
    "                                        <div class=\"ml-ppos-summary-label\">{{payment.displayName}}:</div>\n" +
    "                                        <div class=\"ml-ppos-summary-value\">{{payment.displayAmount}}</div>\n" +
    "\n" +
    "                                        <div class=\"ml-ppos-basket-item-close-button\">\n" +
    "                                            <span data-ng-click=\"removePayment(payment.code)\" class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"ml-ppos-payment-summary-footer\">\n" +
    "                                <!-- Balance -->\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-remaining-balance\" ng-class=\"{ 'active' : model.displayBalance }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.remainingBalance\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.displayBalance}}</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-total-paid\" ng-class=\"{ 'active' : model.data.displayTotal }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.totalPaid\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.data.displayTotal}}</div>\n" +
    "                                </div>\n" +
    "                                <div class=\"ml-ppos-summary-content ml-ppos-summary-change-amount\" ng-class=\"{ 'active' : model.data.change }\">\n" +
    "                                    <div class=\"ml-ppos-summary-label\"><span translate=\"lbl.ppos.changeAmount\"></span>:</div>\n" +
    "                                    <div class=\"ml-ppos-summary-value\">{{model.data.change}}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!-- Credit Card Swipe -->\n" +
    "                    <div class=\"ml-ppos-payment-method-credit-scan\" ng-class=\"{ 'active' : selection == 'CREDIT_CARD_SWIPE' }\">\n" +
    "                        <ml-payment-credit-card-swipe data-ml-payment-model=\"model\"\n" +
    "                                                      data-ml-parent-submit=\"addPayment()\"\n" +
    "                                                      data-ml-change-selection=\"select(selection)\"\n" +
    "                                                      data-payment-service=\"paymentService\"\n" +
    "                                                      data-ml-view-selection=\"selection\"></ml-payment-credit-card-swipe>\n" +
    "                    </div>\n" +
    "                    <!-- Signature -->\n" +
    "                    <div class=\"ml-ppos-signature-wrapper\" ng-show=\"selection == 'SIGNATURE'\">\n" +
    "                        <div class=\"ml-ppos-signature-header\" ng-show=\"selection == 'SIGNATURE'\"><span translate=\"lbl.ppos.creditCardSignatureHeader\"></span></div>\n" +
    "                        <canvas ng-signature-pad=\"model.signature\" width=\"570px\" height=\"200px\" class=\"ml-ppos-signature\"></canvas>\n" +
    "                        <div class=\"ml-ppos-signature-agreement\" ng-show=\"selection == 'SIGNATURE'\">\n" +
    "                            <span translate=\"lbl.ppos.creditCardSignatureAgreement\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- Modal Dialog Footer Buttons -->\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <!--<div ng-show=\"model.placeOrder\"><button type=\"submit\" name=\"\" id=\"markAsPaid\" class=\"ml-ppos-primary-button\" data-ng-click=\"basketCheckout()\" translate=\"btn.ppos.markAsPaid\"></button></div>-->\n" +
    "                    <div ng-show=\"!model.placeOrder && showDefaultLayout()\"><button type=\"submit\" name=\"\" id=\"\" class=\"ml-ppos-primary-button\" data-ng-click=\"apply()\" translate=\"btn.ppos.addPayment\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\"><button type=\"submit\" name=\"\" id=\"acceptSignature\" class=\"ml-ppos-primary-button\" data-ng-click=\"acceptSignature()\" translate=\"Accept Signature\"></button></div>\n" +
    "\n" +
    "                    <div ng-show=\"selection == 'PAYMENT_SELECTION'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-hide=\"selection == 'PAYMENT_SELECTION' || selection == 'SIGNATURE'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\"  translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelSignature()\"  translate=\"btn.ppos.cancel\"></button></div>\n" +
    "                    <div ng-show=\"selection == 'SIGNATURE'\" class=\"ml-ppos-signature-clear-button\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"clearSignature()\"  translate=\"btn.ppos.clearSignature\"></button></div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/ReceiptModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "    <div class=\"modal\" id=\"receiptModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button type=\"button\" class=\"close\" data-ng-click=\"cancel()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                    <h4 class=\"modal-title\"> <span translate=\"lbl.ppos.receipt\"></span></h4>\n" +
    "                </div>\n" +
    "\n" +
    "                    <form name=\"receiptForm\" novalidate data-ng-submit=\"processReceipt()\">\n" +
    "                        <div class=\"modal-body\" class=\"form-control\">\n" +
    "\n" +
    "                          <div data-ng-show=\"receiptDataModel.paymentChange\" class=\"ml-ppos-payment-change-due\"><span translate=\"lbl.ppos.changeDue\"></span>&nbsp; {{receiptDataModel.paymentChange}}</div>\n" +
    "\n" +
    "                            <div data-ng-show=\"receiptDataModel.hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "                                <div class=\"ml-icon-error\"></div>\n" +
    "                                <div class=\"ml-ppos-error-message\">\n" +
    "                                    <div data-ng-repeat=\"validationError in receiptDataModel.validationErrors\">{{ validationError }}</div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span id=\"print\" ng-class=\"receiptDataModel.printSelected == true ?  'ml-ppos-mini-white-icon ml-ppos-radio ml-ppos-radio-selected' : 'ml-icon-lib ml-icon-unchecked' \" data-ng-model=\"receiptDataModel.printSelected\" data-ng-click=\"manageSelection('print')\"></span>\n" +
    "                            <span translate=\"lbl.ppos.print\"></span> {{receiptDataModel.deviceName}}\n" +
    "\n" +
    "                            <p/>\n" +
    "                            <span id=\"email\" ng-class=\"receiptDataModel.emailSelected == true ?  'ml-ppos-mini-white-icon ml-ppos-radio ml-ppos-radio-selected' : 'ml-icon-lib ml-icon-unchecked' \" ng-model=\"receiptDataModel.emailSelected\"  data-ng-click=\"manageSelection('email')\"></span>\n" +
    "                            <span translate=\"lbl.ppos.email\"></span> <div style=\"width:400px;display: inline-block\"><input id=\"receiptModalEmail\" type=\"email\" data-ng-model=\"email\" class=\"form-control\"></div>\n" +
    "\n" +
    "                            <div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "\n" +
    "                            <div><button type=\"submit\" data-ng-disabled=\"!receiptDataModel.printSelected && ! receiptDataModel.emailSelected \" name=\"emailReceiptButton\" id=\"emailReceiptButton\" class=\"ml-ppos-primary-button\" ng-disabled=\"buttonClicked\"><span translate=\"lbl.ppos.receipt\"></span> </button></div>\n" +
    "                            <div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\"><span translate=\"lbl.ppos.noReceipt\"></span> </button></div>\n" +
    "\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "           \n" +
    "               \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basket/ShippingAddressAndMethodModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-basket-new-shipping-wrapper\">\r" +
    "\n" +
    "\t<div class=\"modal\" id=\"shippingAddressAndMethodModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "\t\t<div class=\"modal-dialog\">\r" +
    "\n" +
    "\t\t\t<div class=\"modal-content\">\r" +
    "\n" +
    "\t\t\t\t<form novalidate id=\"frmShipAddressMethodModal\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-header\">\r" +
    "\n" +
    "\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeShippingAddressAndMethodModal()\" data-dismiss=\"modal\" aria-label=\"Close\" id=\"btnCloseModal\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\r" +
    "\n" +
    "\t\t\t\t\t\t<h4 class=\"modal-title\"><span translate=\"hdr.ppos.shipToAddress\"/></h4>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"shipping.showMessage\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ shipping.operationMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body ml-ppos-basket-new-shipping-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Address Block -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-shipment-address-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.firstName\" name=\"txtFirstName\" id=\"txtFirstName\" maxlength=\"40\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.lastName\" name=\"txtLastName\" id=\"txtLastName\" required=\"\" maxlength=\"40\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.streetAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.streetAddress\" name=\"txtStreetAddress\" id=\"txtStreetAddress\" required=\"\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.optionalAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.optionalAddress\" name=\"txtOptionalAddress\" id=\"txtOptionalAddress\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.city\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.city\" name=\"txtCity\" id=\"txtCity\" required=\"\" maxlength=\"50\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.state\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><select name=\"selState\" class=\"form-control\" id=\"selState\" data-ng-model=\"shipping.selectedState\" data-ng-change=\"populateShippingMethods('selState')\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in shipping.states\" value=\"{{option.id}}\" ng-selected=\"{{option.id == shipping.selectedState}}\">{{ option.description | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.zipCode\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"text\" class=\"form-control\" data-ng-model=\"shipping.zipCode\" name=\"txtZipCode\" id=\"txtZipCode\" required=\"\" maxlength=\"10\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.country\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><select name=\"selCountry\" class=\"form-control\" id=\"selCountry\" data-ng-model=\"shipping.selectedCountry\" data-ng-change=\"populateShippingMethods('selCountry')\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in shipping.countries\" value=\"{{option.id}}\" ng-selected=\"{{option.id == shipping.selectedCountry}}\">{{ option.description | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.phoneNumber\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"tel\" class=\"form-control\" data-ng-model=\"shipping.phoneNumber\" name=\"txtPhone\" id=\"txtPhone\" required=\"\" maxlength=\"20\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-address-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label><span translate=\"lbl.ppos.emailAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><input type=\"email\" class=\"form-control\" data-ng-model=\"shipping.email\" name=\"txtEmail\" id=\"txtEmail\" required=\"\" maxlength=\"100\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- Address Block -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- shipping method -->\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-basket-new-shipment-container ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-ng-show=\"shipping.shippingMethods.length > 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == shipping.selectedShippingMethod}\" data-ng-repeat=\"option in shipping.shippingMethods\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"shipping.selectedShippingMethod\"  name=\"radioShippingMethod\" id=\"radioShippingMethod\" value=\"{{option.id}}\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<i ng-show=\"option.id != shipping.selectedShippingMethod\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-unselect\"></i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<i ng-hide=\"option.id != shipping.selectedShippingMethod\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<i class=\"ml-ppos-mini-grey-icon ml-ppos-select\"></i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</i>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-basket-new-shipment-name\">{{ option.name | translate }} - {{ option.cost }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div> <span>{{ option.description | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t\t\t<!--<div class=\"ml-ppos-basket-new-shipment-container ml-ppos-toggle-container\" data-ng-show=\"shipping.shippingMethods.length == 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.noShippingMethod\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>-->\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- shipping method -->\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"addShippingAddress\" id=\"addShippingAddress\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.paymentOptions\" data-ng-click=\"saveShippingAddressAndMethod(shipping)\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelShippingAddressAndMethodModal()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\" name=\"btnCancelShipToModal\" id=\"btnCancelShipToModal\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-15999 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#addShippingAddress').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#addShippingAddress').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#btnCancelShipToModal').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#btnCancelShipToModal').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/common/AppSpinner.html',
    "<!-- AppSpinner.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div class=\"ppos-app-spinner\" data-ng-show=\"displaySpinner\">\n" +
    "    <div class=\"ppos-app-spinner-bg\"></div>\n" +
    "    <div class=\"ppos-app-spinner-msg-wrapper\">\n" +
    "        <div class=\"ppos-app-spinner-msg-content\">\n" +
    "            <span data-ng-hide=\"timerLimitExceeded\"\n" +
    "                  class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin ppos-app-spinner-icon\"></span>\n" +
    "\n" +
    "            <div class=\"timer-limit-exceeded-wrapper\" data-ng-show=\"timerLimitExceeded\">\n" +
    "                <div class=\"ml-ppos-error-container\">\n" +
    "                    <div class=\"ml-icon-error\"></div>\n" +
    "                    <div class=\"ml-ppos-error-message\">\n" +
    "                        <div>{{requestTimedOut}}</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"timer-limit-exceeded-close\">\n" +
    "                        <button class=\"ml-ppos-primary-button\" data-ng-click=\"close()\">{{closeBtnTxt}}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/Header.html',
    "<div class=\"ml-ppos-header-wrapper\">\n" +
    "\n" +
    "\t<div class=\"ml-ppos-header-logo\"><span class=\"ml-ppos-header-logo-img\" data-ng-click=\"openDashboardPage();\"></span></div>\n" +
    "\n" +
    "\t<div class=\"ml-ppos-header-nav\" data-ng-show=\"!applicationModel.isScreenLocked\"> \n" +
    "\t\t<div class=\"ml-ppos-header-nav-logout ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"logout();hideOverlay();\" data-ng-controller=\"logoutController\"><span class=\"ml-ppos-mini-white-icon ml-ppos-logout-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-basket ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"openBasketPage();hideOverlay();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-basket-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-unlock ml-ppos-a-href-close-overlay\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"lockScreen();hideOverlay();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-unlock-head\"></span></a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-header-nav-user\">\n" +
    "\t\t\t<a href=\"javascript:;\" data-ng-show=\"applicationModel.isCSRLoggedIn\" data-ng-click=\"toggleOverlay();\" id=\"ml-ppos-header-nav-user-link\">{{ applicationModel.csrUserName }}<span class=\"ml-icon-lib ml-icon-arrow-down\"></span></a>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<!-- Account Drop Down -->\n" +
    "\t\t<div class=\"ml-ppos-account-drop-down-container\">\n" +
    "\t\t\t<div id=\"ml-ppos-account-overlay\" style=\"display:block\" ng-show=\"applicationModel.toggleValue\" data-ng-click=\"hideOverlay();\"></div>\n" +
    "\t\t\t<div id=\"ml-ppos-account-drop-down\" style=\"display:block\" ng-show=\"applicationModel.toggleValue\">\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openCSRChangePasswordPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-change-password\"></i> <span translate=\"lbl.ppos.changePassword\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openCSRChangePINPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-unlock\"></i> <span translate=\"lbl.ppos.changePin\"/></a></li>\n" +
    "\t\t\t\t\t<!--<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-appointment\"></i> <span translate=\"lbl.ppos.appointment\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-todo\"></i> <span translate=\"lbl.ppos.toDoList\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-profile\"></i> <span translate=\"lbl.ppos.profile\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-my-sale\"></i> <span translate=\"lbl.ppos.mySales\"/></a></li>\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\"><i class=\"ml-ppos-mini-white-icon ml-ppos-dashboard\"></i> <span translate=\"lbl.ppos.dashboard\"/></a></li>-->\n" +
    "\t\t\t\t\t<li class=\"ml-ppos-a-href-close-overlay\"><a href=\"\" data-ng-click=\"openManagementPage();toggleOverlay();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-settings\"></i> <span translate=\"lbl.ppos.settings\"/></a></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Account Drop Down End -->\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- No Shopping Bag Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"noShoppingBagModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate>btn.ppos.noShoppingBagMessage</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"noShoppingBagOkButton\" id=\"noShoppingBagOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/NearByStoresModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-nearby-store-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"nearByStoresModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<!-- Header -->\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeNearByStoresModal()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.availabilityInNearbyStores\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<!-- Body -->\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-store-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-store-product-info-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-image\"><img src=\"{{ nearByStoresDataModel.product.image.thumb }}\" /></div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-name\">{{ nearByStoresDataModel.product.name }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-code\"># {{ nearByStoresDataModel.selectedSku.code }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"nearByStoresDataModel.selectedSku.options\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in nearByStoresDataModel.selectedSku.options\" class=\"ml-ppos-store-product-options\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ option.optionType }}: {{ option.name }}\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-product-qty\"><span translate=\"msg.ppos.qty\"></span> {{ nearByStoresDataModel.requestedQuantity }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-store-info-container\">\n" +
    "\t\t\t\t\t\t\t<!-- Store Search -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-box\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-zip-head\" translate=\"lbl.ppos.cityStateZip\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-form\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<form name=\"nearByStoresForm\" novalidate data-ng-submit=\"searchNearByStores(true)\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-input\"><input type=\"text\" name=\"nearByStoresSearchKeyword\" id=\"nearByStoresSearchKeyword\" class=\"form-control\" data-ng-model=\"nearByStoresDataModel.nearByStoresSearchKeyword\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-button\"><input type=\"submit\" name=\"findNearByStoresButton\" id=\"findNearByStoresButton\" class=\"ml-ppos-primary-button\" value=\"{{ 'btn.ppos.findStores' | translate }}\" data-ng-disabled=\"!nearByStoresDataModel.nearByStoresSearchKeyword\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</form>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-distance ml-ppos-toggle-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-distance-head\" translate=\"lbl.ppos.storesWithinRadius\"></div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : radius == nearByStoresDataModel.selectedRadius}\" data-ng-repeat=\"radius in nearByStoresDataModel.radiusArray\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedStoreRadius\" id=\"selectedStoreRadius\" value=\"{{ radius }}\" data-ng-model=\"nearByStoresDataModel.selectedRadius\" data-ng-change=\"searchNearByStores(false)\" /> <span translate=\"lbl.ppos.storeRadius\" translate-values=\"{ storeRadius: radius }\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<!-- Store Detail -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row ml-ppos-store-detail-row-head\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\" translate=\"hdr.ppos.store\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"hdr.ppos.hours\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"hdr.ppos.distance\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\" translate=\"hdr.ppos.availability\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-content-scroll ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\" translate=\"lbl.ppos.online\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!nearByStoresDataModel.online.showStockAvailabilityMessage\"  class=\"ml-ppos-store-detail-row-stock\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"nearByStoresDataModel.online.availableQty > 0\"><span translate=\"msg.ppos.inStock\"></span> <br> {{ nearByStoresDataModel.online.availableQty }}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"nearByStoresDataModel.online.availableQty == 0\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"><a href=\"\" data-ng-click=\"addItemToBasketFromWebStore()\" data-ng-if=\"nearByStoresDataModel.online.availableQty > 0\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"nearByStoresDataModel.online.showStockAvailabilityMessage\" class=\"ml-ppos-store-stock-error\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.stockAvailability.100\" translate-values=\"{ requestedQuantity : nearByStoresDataModel.requestedQuantity, availableQuantity : nearByStoresDataModel.online.availableQty }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-stock-error-cancel-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityCancelButton\" id=\"stockAvailabilityCancelButton\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStockAvailability()\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityContinueButton\" id=\"stockAvailabilityContinueButton\" class=\"ml-ppos-primary-button\" data-ng-click=\"continueStockAvailability()\" translate=\"btn.ppos.stockAvailability.continue\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"nearByStoresDataModel.stores.length\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"store in nearByStoresDataModel.stores | filter : {pickupEnabled : true}\" class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street1 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street2 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.city }},\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.state }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.zipCode }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"!store.showStockAvailabilityMessage\" class=\"ml-ppos-store-detail-row-stock\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"{{ store.hours }}\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"lbl.ppos.storeDistance\" translate-values=\"{ storeDistance: store.distance }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"store.availableQty > 0\"><span translate=\"msg.ppos.inStock\"></span> <br> {{ store.availableQty }}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span data-ng-if=\"store.availableQty == 0\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"><a href=\"\" data-ng-click=\"addItemToBasketFromPhysicalStore(store)\" data-ng-if=\"store.availableQty > 0\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></span></a></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-show=\"store.showStockAvailabilityMessage\" class=\"ml-ppos-store-stock-error\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-search-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.stockAvailability.100\" translate-values=\"{ requestedQuantity : nearByStoresDataModel.requestedQuantity, availableQuantity : store.availableQty }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-stock-error-cancel-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityCancelButton\" id=\"stockAvailabilityCancelButton\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStockAvailability()\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" name=\"stockAvailabilityContinueButton\" id=\"stockAvailabilityContinueButton\" class=\"ml-ppos-primary-button\" data-ng-click=\"continueStockAvailability(store)\" translate=\"btn.ppos.stockAvailability.continue\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"store in nearByStoresDataModel.stores | filter : {pickupEnabled : false}\" class=\"ml-ppos-store-detail-row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-store\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street1 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street2 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.city }},\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.state }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t{{ store.address.zipCode }}\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ store.address.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-hours\" translate=\"{{ store.hours }}\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-distance\" translate=\"lbl.ppos.storeDistance\" translate-values=\"{ storeDistance: store.distance }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-availability\" translate=\"msg.ppos.notEligibleForStorePickup\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-store-detail-row-add-btn\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"!nearByStoresDataModel.stores.length\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div translate=\"msg.ppos.noStoresFound\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Store Detail End -->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<!-- Footer -->\n" +
    "\t\t\t\t\t<!--<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t <div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelNearByStoresModal()\" data-dismiss=\"modal\" translate>btn.ppos.cancel</button></div> \n" +
    "\t\t\t\t\t</div>-->\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/common/NumericSpinner.html',
    "<div class=\"ml-numeric-spinner-wrapper\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\"\n" +
    "                    ng-click=\"decrementValue($event)\"\n" +
    "                    ng-disabled=\"isButtonDisabled('decrement')\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-minus\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "        <input type=\"text\" size=\"3\" maxlength=\"{{maxLength}}\" class=\"ml-ppos-quantity-spinner\"\n" +
    "               data-ng-model=\"mappedValue\"\n" +
    "               data-ng-blur=\"handleBlur()\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-default\" type=\"button\"\n" +
    "                    ng-click=\"incrementValue($event)\"\n" +
    "                    ng-disabled=\"isButtonDisabled('increment')\">\n" +
    "                <span class=\"ml-icon-lib ml-icon-plus\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/common/ScanBarcode.html',
    "<!-- ScanBarcode.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <!-- Modal Display -->\n" +
    "    <div data-ng-show=\"displayAsModal === 'true'\">\n" +
    "        <a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\" data-ng-click=\"showScanDialog()\"><span\n" +
    "                class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanProductBarcode\"></span></a>\n" +
    "\n" +
    "        <div class=\"ml-ppos-modal-container ml-ppos-scan-barcode-wrapper\">\n" +
    "            <div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "                <div class=\"modal-dialog\">\n" +
    "                    <div class=\"modal-content\">\n" +
    "                        <div class=\"modal-header\">\n" +
    "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\"\n" +
    "                                    aria-label=\"Close\"><span aria-hidden=\"true\"><span\n" +
    "                                    class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "                            <!-- Title -->\n" +
    "                            <h4 class=\"modal-title\">{{modalTitle}}</h4>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"modal-body\">\n" +
    "                            <ml-barcode-search-body></ml-barcode-search-body>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <!-- Footer Buttons -->\n" +
    "                        <div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "                            <div>\n" +
    "                                <button class=\"ml-ppos-secondary-button\"\n" +
    "                                        data-ng-show=\"cancelBtnResource\"\n" +
    "                                        data-dismiss=\"modal\"\n" +
    "                                        translate=\"{{cancelBtnResource}}\">\n" +
    "                                </button>\n" +
    "                                <button class=\"ml-ppos-primary-button\"\n" +
    "                                        data-ng-show=\"continueBtnResource\"\n" +
    "                                        data-ng-click=\"continue()\"\n" +
    "                                        data-ng-class=\"{disabled: !canContinue}\"\n" +
    "                                        translate=\"{{continueBtnResource}}\">\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Inline Display -->\n" +
    "    <div class=\"ml-ppos-scan-barcode-wrapper\" data-ng-show=\"displayAsModal === 'false'\">\n" +
    "        <ml-barcode-search-body></ml-barcode-search-body>\n" +
    "    </div>\n" +
    " </div>"
  );


  $templateCache.put('views/common/ScanBarcodeBody.html',
    "<!-- ScanBarcodeBody.html | (c) 2015 MarketLive, Inc. | All Rights Reserved -->\n" +
    "\n" +
    "<div>\n" +
    "    <!-- Messages -->\n" +
    "    <div class=\"ml-ppos-error-container\">\n" +
    "        <div ng-show=\"searchError\" class=\"ml-icon-error\"></div>\n" +
    "        <div ng-show=\"!deviceConnected\" class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.connecting\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && !searchError && !canContinue\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.readyToScan\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && searchInProgress\" class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.searchingForCode\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && searchError\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"msg.ppos.searchingForCodeFailed\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "            <div translate=\"msg.ppos.tryAgain\"></div>\n" +
    "        </div>\n" +
    "        <div ng-show=\"deviceConnected && !searchInProgress && canContinue && !searchError && multiAddMsgResource\"\n" +
    "             class=\"ml-ppos-error-message\">\n" +
    "            <div translate=\"{{multiAddMsgResource}}\"\n" +
    "                 translate-values=\"{ code: scannedValue }\"></div>\n" +
    "            <div data-ng-show=\"multiAddCountResource && itemFoundCount\" translate=\"{{multiAddCountResource}}\"\n" +
    "                 translate-values=\"{count: itemFoundCount}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Icons -->\n" +
    "    <div class=\"ml-ppos-scan-barcode-icons-wrapper\">\n" +
    "        <div class=\"ml-ppos-scan-barcode-icons\"\n" +
    "             data-ng-class=\"{ready: deviceConnected && !searchInProgress}\">\n" +
    "            <span class=\"ml-icon-lib ml-icon-circle-o-notch ml-icon-spin\"></span><span\n" +
    "                class=\"ml-icon-lib ml-icon-barcode\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/csr/CSRAdd.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-add-csr-container\">\r" +
    "\n" +
    "\t<form novalidate>\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-head-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-add-buttons\">\r" +
    "\n" +
    "\t\t\t\t<button type=\"button\" name=\"cancelButton\" class=\"ml-ppos-secondary-button\" id=\"cancelButton\" translate=\"btn.ppos.cancel\" ng-click=\"cancel()\"></button><button type=\"submit\" name=\"saveButton\" class=\"ml-ppos-primary-button\" id=\"saveButton\" translate=\"btn.ppos.save\" data-ng-click=\"addCSR(csr)\"></button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"csr.showCsrOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t<div>{{ csr.csrOpFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-form\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-image\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span translate=\"lbl.ppos.employeeId\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"employeeId\" id=\"employeeId\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.employeeId\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.firstName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.lastName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.emailAddress\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"email\" name=\"email\" id=\"email\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"csr.email\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.password\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"password\" name=\"password\" id=\"password\" maxlength=\"50\" class=\"form-control\" data-ng-model=\"csr.password\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.reEnterPassword\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-add-csr-input-password\"><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" maxlength=\"50\" class=\"form-control\" data-ng-model=\"csr.confirmPassword\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.unlockPosPIN\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-add-csr-input-pin\">\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin1\" size=\"1\" name=\"pin1\" id=\"pin1\" data-ng-keyup=\"moveOnNext(csr.pin1,'pin1','pin2')\" ng-focus=\"clearContent('pin1')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin2\" size=\"1\" name=\"pin2\" id=\"pin2\" data-ng-keyup=\"moveOnNext(csr.pin2,'pin2','pin3')\" ng-focus=\"clearContent('pin2')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin3\" size=\"1\" name=\"pin3\" id=\"pin3\" data-ng-keyup=\"moveOnNext(csr.pin3,'pin3','pin4')\" ng-focus=\"clearContent('pin3')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin4\" size=\"1\" name=\"pin4\" id=\"pin4\" data-ng-keyup=\"moveOnNext(csr.pin4,'pin4','pin5')\" ng-focus=\"clearContent('pin4')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin5\" size=\"1\" name=\"pin5\" id=\"pin5\" data-ng-keyup=\"moveOnNext(csr.pin5,'pin5','pin6')\" ng-focus=\"clearContent('pin5')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"form-control\" type=\"password\" maxlength=\"1\" ng-model=\"csr.pin6\" size=\"1\" name=\"pin6\" id=\"pin6\" data-ng-keyup=\"moveOnNext(csr.pin6,'pin6','roleType')\" ng-focus=\"clearContent('pin6')\" pattern=\"[0-9]*\"/>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-add-input-pin-message\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"msg.ppos.unlockPosPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.roleType\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length == 2\" class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == csr.selectedRole}\" data-ng-repeat=\"option in csr.roleType\" id=\"lblRoleRadio{{option.id}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"csr.selectedRole\"  name=\"roleTypeRadio\" id=\"roleTypeRadio\" value=\"{{option.id}}\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"/> <span>{{ option.code | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length != 2\" class=\"ml-ppos-edit-csr-role\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<select name=\"roleTypeSelect\" id=\"roleTypeSelect\" class=\"form-control-select\" data-ng-model=\"csr.selectedRole\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<option ng-repeat=\"option in csr.roleType\" value=\"{{option.id}}\">{{ option.code | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.activeStatus\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblActive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'true'}\" data-ng-click=\"setStatus(true)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"true\" data-ng-model=\"csr.activeStatus\" /> <span translate=\"lbl.ppos.active\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblInactive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'false'}\" data-ng-click=\"setStatus(false)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"false\" data-ng-model=\"csr.activeStatus\"/> <span translate=\"lbl.ppos.inactive\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-permission-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-permission-head\">\r" +
    "\n" +
    "\t\t\t\t\t<button class=\"btn\" type=\"button\" ng-click=\"showHidePermission();\"><i id=\"permissionDivElement\" class=\"ml-icon-lib ml-icon-plus\"></i> <span translate=\"hdr.ppos.permissions\"/></button> \r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"collapse\" id=\"collapseDiv\">\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"permissionListDiv\"></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block End -->\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16516 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#saveButton').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#saveButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#cancelButton').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#cancelButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/csr/CSRChangePIN.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<form novalidate data-ng-submit=\"changePIN(changePinModel)\">\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-account-change-pin-container\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-head-container\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-change-pin-title\"><span translate=\"hdr.ppos.changeAccessPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-save\"><button class=\"ml-ppos-primary-button\" type=\"submit\" name=\"save\" id=\"save\" translate=\"btn.ppos.save\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"openDashboardPage()\" translate=\"btn.ppos.cancel\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<!-- Error Block -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"changePinModel.showMessage\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ changePinModel.message | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-toggle-container ml-ppos-account-display-pin-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<span class=\"ml-ppos-account-display-pin-title\" translate=\"lbl.ppos.displayAccessPin\" />\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePinModel.inputType == 'text'}\" ng-click=\"showHidePin('text')\" ><span translate=\"sel.ppos.showAccessPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePin\" id=\"showPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePinModel.inputType == 'password'}\" ng-click=\"showHidePin('masked')\"><span translate=\"sel.ppos.hideAccessPin\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePin\" id=\"hidePin\" >\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-form-container\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row ml-ppos-account-pin-icon\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"msg.ppos.unlockPosPin\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.currentAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"currentPin\" id=\"currentPin\" data-ng-model=\"changePinModel.currentPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.newAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"newPin\" id=\"newPin\" data-ng-model=\"changePinModel.newPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span><span translate=\"lbl.ppos.confirmAccessPin\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePinModel.inputType}}\" name=\"confirmPin\" id=\"confirmPin\" data-ng-model=\"changePinModel.confirmPin\" maxlength=\"6\" pattern=\"[0-9]*\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</form>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/csr/CSRChangePassword.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<form novalidate data-ng-submit=\"changePassword(changePasswordModel)\">\n" +
    "\t\t<div class=\"ml-ppos-account-change-password-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-account-head-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-change-password-title\"><span translate=\"lbl.ppos.changePassword\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-button-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-save\"><button class=\"ml-ppos-primary-button\" type=\"submit\" name=\"save\" id=\"save\" translate=\"btn.ppos.save\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"openDashboardPage()\" translate=\"btn.ppos.cancel\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<!-- Error Block -->\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"changePasswordModel.showChangePasswordFailureMessage\">\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t<div>{{ changePasswordModel.changePasswordFailureMessage | translate }}</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-toggle-container ml-ppos-account-display-password-wrapper\">\n" +
    "\t\t\t\t<span class=\"ml-ppos-account-display-password-title\" translate=\"lbl.ppos.displayPassword\"/>\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePasswordModel.inputType == 'text'}\" ng-click=\"showHidePassword('text')\"><span translate=\"sel.ppos.showPassword\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePassword\" id=\"showPassword\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : changePasswordModel.inputType == 'password'}\" ng-click=\"showHidePassword('masked')\"><span  translate=\"sel.ppos.hidePassowrd\"/> \n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showHidePassword\" id=\"hidePassword\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-account-form-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.currentPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"password\" id=\"currentPassword\" data-ng-model=\"changePasswordModel.currentPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.newPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"newPassword\" id=\"newPassword\" data-ng-model=\"changePasswordModel.newPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-account-form-row\">\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.confirmPassword\"/></label>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input class=\"form-control\" type=\"{{changePasswordModel.inputType}}\" name=\"confirmPassword\" id=\"confirmPassword\" data-ng-model=\"changePasswordModel.confirmPassword\" maxlength=\"50\" autocapitalize=\"off\"/></div>\n" +
    "\t\t\t\t</div> \n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('views/csr/CSRDeleteConfirmationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-csr-list-confirm-wrapper\">\n" +
    "    <div class=\"modal\" id=\"csrDeleteConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <h4 class=\"modal-title\"><span translate=\"hdr.ppos.confirmDelete\"/></h4>\n" +
    "                </div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-message\"><span translate=\"msg.ppos.csrConfirmDeleteMsg\"/> <span>{{csrListDataModel.csrDeleteUser}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-save\"><button class=\"ml-ppos-primary-button\" type=\"button\" name=\"ok\" id=\"ok\" ng-click=\"deleteCsrUser();\"  translate=\"btn.ppos.ok\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-confirm-button-cancel\"><button class=\"ml-ppos-secondary-button\" type=\"button\" name=\"cancel\" id=\"cancel\" ng-click=\"closeDelConfirmModal();\" translate=\"btn.ppos.cancel\"/></div>\n" +
    "\t\t\t\t</div>\t\t\t\t\t\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/csr/CSREdit.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-add-csr-container\">\r" +
    "\n" +
    "\t<form novalidate>\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-head-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-add-buttons\">\r" +
    "\n" +
    "\t\t\t\t<button type=\"button\" name=\"cancelButton\" class=\"ml-ppos-secondary-button\" id=\"cancelButton\" translate=\"btn.ppos.cancel\" ng-click=\"goToCsrListScreen();\"></button><button type=\"submit\" name=\"saveButton\" class=\"ml-ppos-primary-button\" id=\"saveButton\" translate=\"btn.ppos.save\" data-ng-click=\"updateCSR(csr)\"></button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"csr.showCsrOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t<div>{{ csr.csrOpFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-add-csr-form\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-image\"></div>\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span translate=\"lbl.ppos.employeeId\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-edit-csr-disable\"><span name=\"employeeId\">{{csr.employeeId}}</span></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.firstName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"csr.lastName\" /></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.userID\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-edit-csr-disable\"><span name=\"email\">{{csr.email}}</span></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-add-input-pin-message\">\r" +
    "\n" +
    "\t\t\t\t\t<label></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input\"><span translate=\"User email\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.roleType\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length == 2\" class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : option.id == csr.selectedRole}\" data-ng-repeat=\"option in csr.roleType\" id=\"lblRoleRadio{{option.id}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<input type=\"radio\" data-ng-model=\"csr.selectedRole\"  name=\"roleTypeRadio\" id=\"roleTypeRadio\" value=\"{{option.id}}\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"/> <span>{{ option.code | translate }}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"csr.roleType.length != 2\" class=\"ml-ppos-edit-csr-role\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<select name=\"roleTypeSelect\" id=\"roleTypeSelect\" class=\"form-control-select\" data-ng-model=\"csr.selectedRole\" data-ng-change=\"populateCSRTypeDetails(csr.selectedRole)\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<option ng-repeat=\"option in csr.roleType\" ng-selected=\"{{option.id == csr.selectedRole}}\" value=\"{{option.id}}\">{{ option.code | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</select>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-row ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<label><span>*</span> <span translate=\"lbl.ppos.activeStatus\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-add-csr-input ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblActive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'true'}\" data-ng-click=\"setStatus(true)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"true\" data-ng-model=\"csr.activeStatus\" /> <span translate=\"lbl.ppos.active\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t<label id=\"lblInactive\" class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csr.activeStatus.toString() == 'false'}\" data-ng-click=\"setStatus(false)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"activeStatus\" id=\"activeStatus\" value=\"false\" data-ng-model=\"csr.activeStatus\"/> <span translate=\"lbl.ppos.inactive\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-add-csr-permission-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-add-csr-permission-head\">\r" +
    "\n" +
    "\t\t\t\t\t<button class=\"btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseDiv\" aria-expanded=\"false\" aria-controls=\"collapse\" ng-click=\"showHidePermission();\"><i id=\"permissionDivElement\" class=\"ml-icon-lib ml-icon-plus\"></i> <span translate=\"hdr.ppos.permissions\"/></button>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"collapse\" id=\"collapseDiv\">\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"permissionListDiv\"></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Permission Block End -->\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16516 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#saveButton').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#saveButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#cancelButton').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#cancelButton').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>\r" +
    "\n"
  );


  $templateCache.put('views/csr/CSRList.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<div class=\"ml-ppos-csr-list-container\">\n" +
    "\t\n" +
    "\t\t<div class=\"ml-ppos-csr-list-head-row\">\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-title\">\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen();\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate=\"lbl.ppos.management\"/></a>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-toggle ml-ppos-toggle-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\" data-toggle=\"buttons\">\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'ALL'}\" data-ng-click=\"getAllCSRs();\"><span translate=\"lbl.ppos.viewAll\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showAll\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'ACTIVE'}\" data-ng-click=\"getActiveCSRs();\"><span translate=\"lbl.ppos.activeOnly\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showActiveOnly\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : csrListDataModel.csrListType == 'INACTIVE'}\" data-ng-click=\"getInActiveCSRs();\"><span translate=\"Inactive Only\"/>\n" +
    "\t\t\t\t\t\t<input type=\"radio\" name=\"showCsrUser\" id=\"showInActiveOnly\" >\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-add-button\">\n" +
    "\t\t\t\t<a href=\"javascript:;\" name=\"csrAddNew\" id=\"csrAddNew\" ng-click=\"goToCsrAddScreen();\"><span class=\"ml-ppos-mini-white-icon ml-ppos-plus\"></a>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-csr-list-item-wrapper\">\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-item-row ml-ppos-csr-list-item-row-head\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-status\"><span translate=\"lbl.ppos.status\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-id\"><span translate=\"lbl.ppos.id\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-first-name\"><span translate=\"lbl.ppos.firstName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-last-name\"><span translate=\"lbl.ppos.lastName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-user-name\"><span translate=\"lbl.ppos.userName\"/></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-delete\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-edit\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-csr-list-item-row ml-ppos-csr-list-item-row-head\" ng-show=\"!csrListDataModel.userData.length\">\n" +
    "\t\t\t\t<span translate=\"msg.ppos.noRecordFound\"/>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-show=\"showUserRow('{{items.typePPOS}}');\" class=\"ml-ppos-csr-list-item-row\" ng-repeat=\"items in csrListDataModel.userData\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-status\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-item-status-active\" data-ng-show=\"isActive('{{items.active}}', 'showActive');\">Active</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-csr-list-item-status-inactive\" data-ng-show=\"isActive('{{items.active}}', 'showInactive');\">Inactive</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-id\">{{items.employeeID}}</div> \n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-first-name\">{{items.firstName}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-last-name\">{{items.lastName}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-user-name\">{{items.email}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-delete\" ><a href=\"\" ng-show=\"showDelete('{{items.active}}', '{{items.typePPOS}}');\" ng-click=\"deleteUser(items.id, items.email);\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></a></div>\n" +
    "\t\t\t\t<csr-delete-confirmation-modal></csr-delete-confirmation-modal>\n" +
    "\t\t\t\t<div class=\"ml-ppos-csr-list-item-edit\"><a href=\"\" ng-show=\"showEdit('{{items.typePPOS}}');\" data-ng-click=\"goToCsrEditScreen(items.id);\"><span class=\"ml-ppos-mini-white-icon ml-ppos-todo\"></a></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/customer/CustomerProfileInformationModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-profile-wrapper\">\r" +
    "\n" +
    "\t<div class=\"modal\" id=\"customerProfileInformation\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\r" +
    "\n" +
    "\t\t<div class=\"modal-dialog\">\r" +
    "\n" +
    "\t\t\t<div class=\"modal-content\">\r" +
    "\n" +
    "\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div id=\"customerProfileForm\" name= \"customerProfileForm\" ng-hide='customerFormDiv'>\r" +
    "\n" +
    "\t\t\t\t\t<form novalidate id=\"frmSaveUpdateCustomer\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-header\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeProfileInformationModal()\" data-dismiss=\"modal\" aria-label=\"Close\" id=\"btnCloseCustomerProfileModal\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<h4 class=\"modal-title\"><span translate=\"hdr.ppos.customerProfileInformation\"/></h4>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-form-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"customerDO.showOpFailureMessage\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div>{{ customerDO.opFailureMessage | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.phoneNumber\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"tel\" name=\"phoneNumber\" id=\"phoneNumber\" maxlength=\"10\" class=\"form-control\" data-ng-model=\"customerDO.phoneNumber\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.firstName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"text\" name=\"firstName\" id=\"firstName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"customerDO.firstName\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.lastName\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"text\" name=\"lastName\" id=\"lastName\" maxlength=\"40\" class=\"form-control\" data-ng-model=\"customerDO.lastName\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.email\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"email\" name=\"email\" id=\"email\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.email\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.password\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"password\" name=\"password\" id=\"password\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.password\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.confirmPassword\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.confirmPassword\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.securityQuestion\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field\"><select name=\"hint\" class=\"form-control\" id=\"hint\" data-ng-model=\"customerDO.hint\"> \r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<option ng-repeat=\"option in customerDO.securityQuestions\" value=\"{{option.id}}\" ng-selected=\"{{option.id == customerDO.hint}}\">{{ option.question | translate }}</option>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</select></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<label>* <span translate=\"lbl.ppos.securityAnswer\"/></label>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-account-form-field ml-ppos-account-form-last-item\"><input type=\"text\" name=\"hintAnswer\" id=\"hintAnswer\" maxlength=\"100\" class=\"form-control\" data-ng-model=\"customerDO.hintAnswer\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"btnSaveUpdateCustomer\" class=\"ml-ppos-primary-button\" id=\"btnSaveUpdateCustomer\" translate=\"btn.ppos.saveCustomer\" data-ng-click=\"saveOrUpdateCustomer(customerDO)\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" name=\"btnCancelSaveUpdateCustomer\" class=\"ml-ppos-secondary-button\" id=\"btnCancelSaveUpdateCustomer\" translate=\"btn.ppos.cancel\" data-ng-click=\"closeProfileInformationModal();\" data-dismiss=\"modal\"></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.existingPhoneCustomerResult != null\" class=\"ml-ppos-customer-profile-details\" >\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-details-message\" translate=\"msg.ppos.customerSearchResultByPhone\" translate-values=\"{ customerPhoneNumber : customerSearchDataModel.customerPhoneNumber }\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.existingPhoneCustomerResult.data\" class=\"ml-ppos-customer-profile-details-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"updateSelectedContact(customer.id, customer.primaryContact.id, customerDO)\">{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }} <span class=\"ml-ppos-customer-search-zip-code\">{{ customer.primaryContact.address.postalCode }}</span> <span> {{ customer.email }} </span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></i></a>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-primary-button\" data-ng-click=\"saveCustomer(customerDO)\"><span translate=\"btn.ppos.saveCustomer\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeSearchModal();\"><span translate=\"btn.ppos.cancel\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.existingEmailCustomerResult != null\" class=\"ml-ppos-customer-profile-details ml-ppos-customer-result-byemail\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-profile-details-message\" translate=\"msg.ppos.customerSearchResultByEmail\" translate-values=\"{ customerEmail : customerSearchDataModel.existingEmail }\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.existingEmailCustomerResult.data\" class=\"ml-ppos-customer-profile-details-row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-result-byemail-info\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.primaryContact.address.postalCode }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>{{ customer.email }}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-customer-profile-button-container\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-primary-button\" data-ng-click=\"updateSelectedContact(customer.id, customer.primaryContact.id, customerDO)\"><span translate=\"btn.ppos.saveCustomer\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"closeSearchModal();\"><span translate=\"btn.ppos.cancel\"/></button></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- Following script tag added for fixing PEBL-16484 -->\r" +
    "\n" +
    "<script>\r" +
    "\n" +
    "$('#btnSaveUpdateCustomer').on('touchend', function(e){\r" +
    "\n" +
    "    e.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t$('#btnSaveUpdateCustomer').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "$('#btnCancelSaveUpdateCustomer').on('touchend', function(e){\r" +
    "\n" +
    "\te.stopPropagation(); e.preventDefault();\r" +
    "\n" +
    "\t// following is the hack to hide soft keyboard\r" +
    "\n" +
    "\tdocument.activeElement.blur();\r" +
    "\n" +
    "\t$('input').blur();\r" +
    "\n" +
    "\t$('select').blur();\r" +
    "\n" +
    "\t$('#btnCancelSaveUpdateCustomer').trigger('click');\r" +
    "\n" +
    "});\r" +
    "\n" +
    "</script>"
  );


  $templateCache.put('views/dashboard/Dashboard.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-wrapper\">\n" +
    "\t\t<!-- Instore Pickup Start -->\n" +
    "\t\t<div class=\"ml-ppos-dashboard-instore-pickup-widget-wrapper\" data-ng-controller=\"inStorePickupOrderShipmentsController\">\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-bar\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-instore-pickup-content\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-store\"></span></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-message\"><a data-ng-href=\"#/inStorePickupOrderShipments\" translate>hdr.ppos.inStorePickup</a></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-right\"><a data-ng-href=\"#/inStorePickupOrderShipments\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div data-ng-include=\"'views/dashboard/InStorePickupOrderShipmentsWidget.html'\"></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Instore Pickup End -->\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-dashboard-middle-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-search-widget-wrapper\">\n" +
    "\t\t\t\t<!-- Product Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.product</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-scan\">\n" +
    "                                    <ml-barcode-search data-display-as-modal=\"true\"\n" +
    "                                                       data-modal-title=\"Product Scan\"\n" +
    "                                                       data-service-url=\"/api/scan/skus/UPC_CODE\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-service-post-data=\"skuBarcodeSearchPostData\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-scan-success-callback=\"scanSuccessHandler()\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-create-basket=\"true\"\n" +
    "                                                       data-forward-url=\"/basket\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-cancel-btn-resource=\"btn.ppos.close\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-continue-btn-resource=\"btn.ppos.done\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-multi-add-msg-resource=\"msg.ppos.itemWithCodeAddedToBasket\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\t   data-multi-add-count-resource=\"msg.ppos.scanAnotherProduct\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t></ml-barcode-search>\n" +
    "                                </div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-toggle=\"modal\" data-target=\"#productSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchProduct\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<product-search-modal></product-search-modal>\n" +
    "\t\t\t\t\t\t\t\t\t<product-detail-modal></product-detail-modal>\n" +
    "\t\t\t\t\t\t\t\t\t<near-by-stores-modal></near-by-stores-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-browse\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\"><span class=\"ml-ppos-grey-icon ml-ppos-browse\"></span>Browse</a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Product Search End -->\n" +
    "\t\t\t\t<!-- Order Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-order-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.order</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.scanOrderReceipt\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-toggle=\"modal\" data-target=\"#orderSearchModal\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchOrder\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<order-search-modal></order-search-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-browse\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\" data-ng-click=\"showCustomerSearchModal()\"><span class=\"ml-ppos-grey-icon ml-ppos-plus\"></span><span translate=\"btn.ppos.orderNew\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<customer-search-modal></customer-search-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Order Search End -->\n" +
    "\t\t\t\t<!-- Customer Search Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-customer-search-widget-content\">\n" +
    "\t\t\t\t\t\t\t<h2 translate>hdr.ppos.customer</h2>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-product-search-button-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<!-- <div class=\"ml-ppos-product-scan\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-scan-button\"><span class=\"ml-ppos-grey-icon ml-ppos-scan-barcode\"></span><span translate=\"btn.ppos.loyalty\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t</div> -->\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-search-button\" data-ng-click=\"showCustomerSearchModal()\"><span class=\"ml-ppos-grey-icon ml-ppos-search\"></span><span translate=\"btn.ppos.searchCustomer\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t\t<!--<customer-search-modal></customer-search-modal>-->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-browse\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-product-browse-button\" data-ng-click=\"customerProfileInformationModal('dashboard');\"><span class=\"ml-ppos-grey-icon ml-ppos-plus\"></span><span translate=\"btn.ppos.customerNew\"></a>\n" +
    "\t\t\t\t\t\t\t\t\t<customer-profile-information-modal></customer-profile-information-modal>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Customer Search End -->\n" +
    "\n" +
    "\t\t\t\t<!-- Email Signup Start -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-bar\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-email-signup-widget-content\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-include=\"'views/dashboard/EmailSignupWidget.html'\" data-ng-controller=\"emailSignupController\"></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- Email Signup End -->\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-dashboard-right-container\">\n" +
    "\t\t\t<!-- Shopping Bag Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-wrapper\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-content\">\n" +
    "\t\t\t\t\t\t<!-- Shopping Bag Header Start -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></span></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.shoppingBag</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-header-icon-right\"><a href=\"javascript:;\" data-ng-click=\"openBasketPage();\" class=\"\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Shopping Bag Header End -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-bag-widget-button-wrapper\" data-ng-controller=\"customerSearchModalController\">\n" +
    "\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"ml-ppos-dashboard-bag-new-order-button\" data-ng-click=\"showCustomerSearchModal()\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.newOrder</span>\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-plus\"></span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t\t<!--<customer-search-modal></customer-search-modal>-->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-content\">\n" +
    "\t\t\t\t\t\t<div data-ng-include=\"'views/dashboard/SavedBasketsWidget.html'\" data-ng-controller=\"savedBasketsController\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Shopping Bag End -->\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/EmailSignupWidget.html',
    "<!-- Email Signup Header Start -->\n" +
    "<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-icon-lib ml-icon-email\"></span></div>\n" +
    "\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.emailSignUp</div>\n" +
    "</div>\n" +
    "<!-- Email Signup Header End -->\n" +
    "\n" +
    "<!-- Email Signup Body Start -->\n" +
    "<form novalidate name=\"emailSignupForm\" data-ng-submit=\"emailSignup()\">\n" +
    "\t<div class=\"ml-ppos-dashboard-email-signup-form\">\n" +
    "\t\t<div class=\"ml-ppos-email-input\">\n" +
    "\t\t\t<span translate=\"lbl.ppos.email\" />\n" +
    "\t\t\t<input type=\"email\" name=\"emailId\" id=\"emailId\" data-ng-model=\"emailSignupDataModel.email\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-name-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-first-name-input\">\n" +
    "\t\t\t\t<span translate=\"lbl.ppos.firstName\" />\n" +
    "\t\t\t\t<input type=\"text\" name=\"firstName\" data-ng-model=\"emailSignupDataModel.firstName\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-last-name-input\">\n" +
    "\t\t\t\t<span translate=\"lbl.ppos.lastName\" />\n" +
    "\t\t\t\t<input type=\"text\" name=\"lastName\" data-ng-model=\"emailSignupDataModel.lastName\" class=\"ml-ppos-input-text\" />\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-signup-button\">\n" +
    "\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.signUp</span>\n" +
    "\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<button type=\"submit\" name=\"emailSignupButton\" id=\"emailSignupButton\" class=\"ml-ppos-btn-hidden\">Sign Up</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "<!-- Email Signup Body End -->\n" +
    "\n" +
    "<!-- Success Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"emailSignupSuccessModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-success\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate>msg.ppos.emailSignUpSuccess</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"emailSignupSuccessOkButton\" id=\"emailSignupSuccessOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- Error Message -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"emailSignupErrorModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t<div data-ng-show=\"emailSignupDataModel.hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"validationError in emailSignupDataModel.validationErrors\">{{ validationError }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t<div><button type=\"submit\" name=\"emailSignupErrorOkButton\" id=\"emailSignupErrorOkButton\" data-dismiss=\"modal\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.ok\"></button></div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/InStorePickupOrderShipmentsWidget.html',
    "<div class=\"ml-ppos-dashboard-instore-pickup-content-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-item-row\">\n" +
    "\t\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order\"><a data-ng-href=\"#/pickupNewOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"ml-ppos-scroll-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Ordered.length\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order-items ml-ppos-instore-pickup-new-order-head\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-order\" translate>hdr.ppos.inStorePickup.orderNumber</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-date\" translate>hdr.ppos.inStorePickup.orderDate</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-customer\" translate>hdr.ppos.inStorePickup.customer</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-new-order-items\" data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-order\">#{{ pickupNewOrderShipment.order.code }}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-date\">{{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-customer\">{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupInProcessOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupReadyOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-dashboard-instore-pickup-content-row\">\n" +
    "\t\t<div><a data-ng-href=\"#/pickupDoneOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span class=\"ml-ppos-instore-pickup-count\">{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a></div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/dashboard/SavedBasketsWidget.html',
    "<!-- Saved Baskets Header Start -->\n" +
    "<div class=\"ml-ppos-dashboard-header-wrapper\">\n" +
    "\t<div class=\"ml-ppos-dashboard-header-icon-left\"><span class=\"ml-ppos-mini-white-icon ml-ppos-circle-bag\"></span></div>\n" +
    "\t<div class=\"ml-ppos-dashboard-header-message\" translate>hdr.ppos.saved</div>\n" +
    "</div>\n" +
    "<!-- Saved Baskets Header End -->\n" +
    "\n" +
    "<!-- Saved Baskets Body Start -->\n" +
    "<div class=\"ml-ppos-dashboard-saved-bag-widget-items-container\">\n" +
    "\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t<div data-ng-repeat=\"savedBasket in savedBasketsDataModel.baskets\" class=\"ml-ppos-dashboard-saved-bag-widget-items\">\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-items-detail\">\n" +
    "\t\t\t\t\t<a data-ng-click=\"openSavedBasket(savedBasket.customer.id, savedBasket.id)\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-customer-name\">\n" +
    "\t\t\t\t\t\t\t<span data-ng-if=\"savedBasket.customer.guest\">\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-if=\"savedBasket.customer.primaryContact.phone1\">\n" +
    "\t\t\t\t\t\t\t\t\t{{ savedBasket.customer.primaryContact.phone1 }}\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-if=\"!savedBasket.customer.primaryContact.phone1\" translate>hdr.ppos.guest</span>\n" +
    "\t\t\t\t\t\t\t</span> \n" +
    "\t\t\t\t\t\t\t<span data-ng-if=\"!savedBasket.customer.guest\">{{ savedBasket.customer.primaryContact.person.firstName }} {{ savedBasket.customer.primaryContact.person.lastName }}</span> \n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t{{savedBasket.dateModified | date : 'medium'}}\n" +
    "\t\t\t\t\t\t<div><span translate>lbl.ppos.totalAmount</span> {{ savedBasket.total }}</div>\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-dashboard-saved-bag-widget-items-button\">\t\t\t\n" +
    "\t\t\t\t\t<a data-ng-click=\"deleteSavedBasket(savedBasket.id)\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<!-- Saved Baskets Body End -->"
  );


  $templateCache.put('views/home/Home.html',
    "<div class=\"ml-ppos-change-store-wrapper\">\n" +
    "\t<div class=\"ml-ppos-change-store-container\">\n" +
    "\t\t<span>{{ homePageDataModel.storeName }}</span> <span>({{ homePageDataModel.storeCode }})</span>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div data-ng-include=\"'views/login/LoginWidget.html'\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/InStorePickupCustomerVerificationModal.html',
    "<div class=\"ml-ppos-order-detail-instore-pickup-button\" data-ng-if=\"processInStorePickup\">\n" +
    "\t<a href=\"javascript:;\" data-ng-click=\"showInStorePickupCustomerVerificationModal()\" class=\"ml-ppos-primary-button\">{{ 'btn.ppos.inStorePickup' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-store\"></span></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-instore-customer-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"inStorePickupCustomerVerificationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeInStorePickupCustomerVerificationModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.inStorePickupCustomerVerification\" translate-values=\"{ orderNumber : orderNumber }\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<div data-ng-show=\"showStep1\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep1()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"paymentTypeCreditCard && cardVerificationRequired\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-head\" translate>lbl.ppos.lastFourDigitsCreditCard</div>\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"creditCardVerified\" id=\"creditCardVerified\" data-ng-model=\"creditCardVerified\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div for=\"creditCardVerified\"><i></i><span>{{ creditCardType }} {{ creditCardLastFourDigits }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-sub-head\" translate>lbl.ppos.customerIdentification</div>\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"customerVerified\" id=\"customerVerified\" data-ng-model=\"customerVerified\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div for=\"customerVerified\"><i></i><span>{{ pickupContactFirstName }} {{ pickupContactLastName }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\" translate>btn.ppos.process</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStep1()\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div data-ng-show=\"showStep2\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep2(orderId, pickupShipment.id)\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-signature-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-head\"><span translate=\"lbl.ppos.creditCardSignatureHeader\"></span></div>\n" +
    "\t\t\t\t\t\t\t\t<canvas ng-signature-pad=\"signature\" ng-signature-pad-pen-color=\"rgb(255,255,255)\" width=\"420\" height=\"200\" class=\"ml-ppos-signature\"></canvas>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-sub-head\" translate=\"lbl.ppos.inStorePickupSignatureAgreement\"></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\" translate>btn.ppos.acceptSignature</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelStep2()\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-clear-button\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"clearSignature()\" translate=\"btn.ppos.clearSignature\"></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"showStep3\">\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"processStep3()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"hasValidationErrors\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"validationError in validationErrors\">{{ validationError }}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-info\">\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"receiptTypePrinter\" id=\"receiptTypePrinter\" data-ng-model=\"receiptTypePrinter\" ng-disabled=\"!printerAvailable\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div><i for=\"receiptTypePrinter\"></i><span for=\"receiptTypePrinter\" translate=\"lbl.ppos.print\"></span><span class=\"ml-ppos-order-detail-device-name\">{{ deviceName }}</span></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-info\">\n" +
    "\t\t\t\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" name=\"receiptTypeEmail\" id=\"receiptTypeEmail\" data-ng-model=\"receiptTypeEmail\" />\n" +
    "\t\t\t\t\t\t\t\t\t<div><i for=\"receiptTypeEmail\"></i><span for=\"receiptTypeEmail\" translate=\"lbl.ppos.email\"></span></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-detail-customer-email\"><input type=\"email\" name=\"pickupCustomerEmail\" id=\"pickupCustomerEmail\" data-ng-model=\"pickupCustomerEmail\" class=\"form-control\" /></div>\n" +
    "\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\"><span translate=\"lbl.ppos.receipt\"></span></button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"noReceipt()\"><span translate=\"lbl.ppos.noReceipt\"></span></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!-- -->\n" +
    "<div class=\"ml-ppos-modal-container ml-ppos-instore-customer-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"inStorePickupConfirmationModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeInStorePickupConfirmationModal()\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.inStorePickupCustomerVerification\" translate-values=\"{ orderNumber : orderNumber }\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<form novalidate data-ng-submit=\"inStorePickupConfirmationDone()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body ml-ppos-order-detail-customer-options\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"receiptTypePrinter\"><span translate=\"lbl.ppos.receiptReadyOn\"></span>&nbsp;{{ deviceName }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"receiptTypeEmail\"><span translate=\"lbl.ppos.receiptHasBeenSentTo\"></span>&nbsp;{{ pickupCustomerEmail }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"!receiptTypePrinter && !receiptTypeEmail\"><span translate=\"msg.ppos.inStorePickupComplete\"></span></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" class=\"ml-ppos-primary-button\"><span translate=\"btn.ppos.done\"></span></button></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/instorepickup/InStorePickupHeader.html',
    "<div class=\"ml-ppos-instore-pickup-header-container\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-new\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-new-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupNewOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupNewOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupNewOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupNewOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-process\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-process-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupInProcessOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupInProcessOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-ready\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-ready-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupReadyOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupReadyOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"ml-ppos-instore-pickup-header-done\">\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-order-done-bar\" data-ng-class=\"{'ml-ppos-instore-pickup-inactive' : !inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState}\"></div>\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t<a data-ng-href=\"#/inStorePickupOrderShipments\" data-ng-if=\"inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t\t<a data-ng-href=\"#/pickupDoneOrderShipments\" data-ng-if=\"!inStorePickupHeaderDataModel.pickupDoneOrderShipmentsState\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/InStorePickupOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-header-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-new\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-new-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupNewOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-new\"></i>{{ 'hdr.ppos.inStorePickup.newPickup' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Ordered.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-process\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-process-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupInProcessOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-process\"></i>{{ 'hdr.ppos.inStorePickup.inProcess' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupInProcess.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-ready\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupReadyOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-ready\"></i>{{ 'hdr.ppos.inStorePickup.pickUpReady' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.PickupReady.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-header-done\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-done-bar\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-title\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/pickupDoneOrderShipments\"><i class=\"ml-ppos-instore-pickup-circle-done\"></i>{{ 'hdr.ppos.inStorePickup.done' | translate }} <span>{{ inStorePickupOrderShipmentsDataModel.Shipped.length }}</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Pickup Row Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-row-container\">\n" +
    "\t\t\t<!-- Pickup New Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-new ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-new-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupNewOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupNewOrderShipment.order.code }}</span> <span>{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupNewOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupNewOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupNewOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupNewOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-move\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.inStorePickup.move</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"moveToPickupInProcessState(pickupNewOrderShipment.order.id, pickupNewOrderShipment.id)\" class=\"ml-ppos-btn-hidden\"></button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup New Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup In Process Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-process\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-process-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupInProcessOrderShipment in inStorePickupOrderShipmentsDataModel.PickupInProcess\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupInProcessOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupInProcessOrderShipment.order.code }}</span> <span>{{ pickupInProcessOrderShipment.order.billToInfo.firstName }} {{ pickupInProcessOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupInProcessOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupInProcessOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupInProcessOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupInProcessOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-move\" data-ng-show=\"pickupInProcessOrderShipment.canMoveToPickupReady\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.inStorePickup.move</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"moveToPickupReadyState(pickupInProcessOrderShipment.order.id, pickupInProcessOrderShipment.id)\" class=\"ml-ppos-btn-hidden\" translate>btn.ppos.inStorePickup.move</button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-csr-list\">\n" +
    "\t\t\t\t\t\t\t\t<!-- Assigned CSR -->\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#activeCSRList_{{ pickupInProcessOrderShipment.id }}\">{{ pickupInProcessOrderShipment.CSR.firstName }} {{ pickupInProcessOrderShipment.CSR.lastName }}</button>\n" +
    "\t\t\t\t\t\t\t\t<!-- CSR list to choose from -->\n" +
    "\t\t\t\t\t\t\t\t<div id=\"activeCSRList_{{ pickupInProcessOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t\t\t\t\t<li data-ng-repeat=\"activeCSR in activeCSRs\" ng-if=\"activeCSR.id != pickupInProcessOrderShipment.CSR.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span></span><a href=\"javascript:;\" data-ng-click=\"associateCSRtoShipment(activeCSR.id, pickupInProcessOrderShipment.order.id, pickupInProcessOrderShipment.id)\">{{ activeCSR.firstName }} {{ activeCSR.lastName }}</a>\n" +
    "\t\t\t\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup In Process Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup Ready Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-ready-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupReadyOrderShipment in inStorePickupOrderShipmentsDataModel.PickupReady\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupReadyOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupReadyOrderShipment.order.code }}</span> <span>{{ pickupReadyOrderShipment.order.billToInfo.firstName }} {{ pickupReadyOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupReadyOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupReadyOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupReadyOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupReadyOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Note Start -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-notes\" data-ng-if=\"pickupReadyOrderShipment.note.length\">\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#show_note_{{ pickupReadyOrderShipment.id }}\" translate>btn.ppos.inStorePickup.showNote</button>\n" +
    "\t\t\t\t\t\t\t\t<div id=\"show_note_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<textarea rows=\"5\" cols=\"25\" placeholder=\"{{ 'msg.ppos.inStorePickup.writeANote' | translate }}\" data-ng-model=\"pickupReadyOrderShipment.note[0].note\" readonly></textarea>\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Edit Note - Phase 2 -->\n" +
    "\t\t\t\t\t\t\t\t\t<!-- <button type=\"button\" data-ng-click=\"editShipmentNoteForPickup(pickupReadyOrderShipment.order.id, pickupReadyOrderShipment.id, pickupReadyOrderShipment.order.customer.id, pickupReadyOrderShipment.note[0].id, pickupReadyOrderShipment.note[0].note)\" class=\"ml-ppos-primary-button ml-ppos-instore-pickup-save-button\">Save Note</button> -->\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-notes\" data-ng-if=\"!pickupReadyOrderShipment.note.length\">\n" +
    "\t\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" data-toggle=\"collapse\" data-target=\"#add_note_{{ pickupReadyOrderShipment.id }}\" translate>btn.ppos.inStorePickup.addNote</button>\n" +
    "\t\t\t\t\t\t\t\t<div id=\"add_note_{{ pickupReadyOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t\t<textarea rows=\"5\" cols=\"25\" placeholder=\"{{ 'msg.ppos.inStorePickup.writeANote' | translate }}\" data-ng-model=\"pickupReadyOrderShipment.noteTextToAdd\" maxlength=\"{{ noteMaxLength }}\"></textarea>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"pickupReadyOrderShipment.noteTextToAdd.length === noteMaxLength\" translate=\"msg.ppos.inStorePickup.maxNoteCharacters\" translate-values=\"{ noteMaxLength : noteMaxLength }\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"pickupReadyOrderShipment.noteTextToAdd\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<button type=\"button\" data-ng-click=\"addShipmentNoteForPickup(pickupReadyOrderShipment.order.id, pickupReadyOrderShipment.id, pickupReadyOrderShipment.order.customer.id, pickupReadyOrderShipment.noteTextToAdd)\" class=\"ml-ppos-primary-button ml-ppos-instore-pickup-save-button\" translate>btn.ppos.inStorePickup.saveNote</button>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<!-- Note End -->\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup Ready Orders End -->\n" +
    "\n" +
    "\t\t\t<!-- Pickup Done Orders Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-order-done\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-done-container ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-content\">\n" +
    "\t\t\t\t\t\t<!-- Loop Start -->\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"pickupDoneOrderShipment in inStorePickupOrderShipmentsDataModel.Shipped\" class=\"ml-ppos-instore-pickup-toggle\">\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"togglebtn\" ng-click=\"toggleIcon({{ pickupDoneOrderShipment.id }});\"><span class=\"ml-ppos-instore-pickup-order-number\">#{{ pickupDoneOrderShipment.order.code }}</span> <span>{{ pickupDoneOrderShipment.order.billToInfo.firstName }} {{ pickupDoneOrderShipment.order.billToInfo.lastName }}</span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\" id=\"arrow_{{ pickupDoneOrderShipment.id }}\"></i></button>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\" class=\"collapse ml-ppos-instore-pickup-order-content-data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupDoneOrderShipment.items\" class=\"ml-ppos-instore-pickup-thumb-content\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-thumb\"><img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" /></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-item-code\">{{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-date\">{{ 'lbl.ppos.inStorePickup.orderedDate' | translate }} {{pickupDoneOrderShipment.order.orderDate | date : 'medium'}}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-button-container\"><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"viewOrderDetail(pickupDoneOrderShipment.order.id)\" translate>btn.ppos.inStorePickup.viewDetail</button></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<!-- Loop End -->\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Pickup Done Orders End -->\n" +
    "\n" +
    "\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupDoneOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Shipped.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupDoneOrderShipment in inStorePickupOrderShipmentsDataModel.Shipped\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\">#{{ pickupDoneOrderShipment.order.code }} <span>{{pickupDoneOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupDoneOrderShipment.order.billToInfo.firstName }} {{ pickupDoneOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupDoneOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupDoneOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupDoneOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupInProcessOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.PickupInProcess.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupInProcessOrderShipment in inStorePickupOrderShipmentsDataModel.PickupInProcess\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\">#{{ pickupInProcessOrderShipment.order.code }} <span>{{pickupInProcessOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupInProcessOrderShipment.order.billToInfo.firstName }} {{ pickupInProcessOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupInProcessOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupInProcessOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupInProcessOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t<div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/instorepickup/PickupNewOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.Ordered.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\" id=\"lstSortByMenu\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('itemSKUNumber')\">{{ 'lbl.ppos.inStorePickup.sortByItemSKUNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'itemSKUNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\" data-ng-if=\"currentSortParam !== 'itemSKUNumber'\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupNewOrderShipment in inStorePickupOrderShipmentsDataModel.Ordered\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupNewOrderShipment.id }}\">#{{ pickupNewOrderShipment.order.code }} <span>{{pickupNewOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupNewOrderShipment.order.billToInfo.firstName }} {{ pickupNewOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupNewOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupNewOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupNewOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div data-ng-if=\"currentSortParam === 'itemSKUNumber'\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-wrapper\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-head\">\n" +
    "\t\t\t\t\t\t<div translate>hdr.ppos.inStorePickup.productName</div>\n" +
    "\t\t\t\t\t\t<div translate>hdr.ppos.qty</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"skuDetails in groupBySkuDataModel\" class=\"ml-ppos-instore-pickup-sort-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-thumb\"><img src=\"{{ skuDetails.thumb }}\" /></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-name\">\n" +
    "\t\t\t\t\t\t\t\t<div>{{ skuDetails.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sku\"><span translate=\"lbl.ppos.style\"/> {{ skuDetails.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-sort-qty\">{{ skuDetails.qty }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<!-- Content Start End -->\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/instorepickup/PickupReadyOrderShipments.html',
    "<div class=\"ml-ppos-main-wrapper\">\n" +
    "\t<div class=\"ml-ppos-instore-pickup-order-wrapper\">\n" +
    "\n" +
    "\t\t<!-- Pickup Headers Start -->\n" +
    "\t\t<div data-ng-include=\"'views/instorepickup/InStorePickupHeader.html'\"></div>\n" +
    "\t\t<!-- Pickup Headers End -->\n" +
    "\t\t\n" +
    "\t\t<!-- Content Start -->\n" +
    "\t\t<div class=\"ml-ppos-instore-pickup-content-container\">\n" +
    "\t\t\t<!-- Sorting Start -->\n" +
    "\t\t\t<div class=\"ml-ppos-instore-pickup-sort-container\" data-ng-if=\"inStorePickupOrderShipmentsDataModel.PickupReady.length\">\n" +
    "\t\t\t\t<ul class=\"nav nav-tabs\">\n" +
    "\t\t\t\t\t<li role=\"presentation\" class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:;\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "\t\t\t\t\t\t\t{{ 'lbl.ppos.inStorePickup.sortBy' | translate }} <span class=\"ml-icon-lib ml-icon-arrow-down\"></span>\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderNumber')\">{{ 'lbl.ppos.inStorePickup.sortByOrderNumber' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderNumber'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('orderDate')\">{{ 'lbl.ppos.inStorePickup.sortByOrderDate' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'orderDate'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('customerLastName')\">{{ 'lbl.ppos.inStorePickup.sortByCustomerName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'customerLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li>\n" +
    "\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"sortInStorePickupOrderShipmentsDataModel('csrLastName')\">{{ 'lbl.ppos.inStorePickup.sortBySalesAssociateName' | translate }} <span class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-down\" data-ng-if=\"currentSortParam === 'csrLastName'\"></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Sorting End -->\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t<div class=\"panel-group ml-ppos-instore-pickup-order-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"pickupReadyOrderShipment in inStorePickupOrderShipmentsDataModel.PickupReady\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\">#{{ pickupReadyOrderShipment.order.code }} <span>{{pickupReadyOrderShipment.order.orderDate | date : 'medium'}}</span><span class=\"ml-ppos-instore-pickup-customer-name\">{{ pickupReadyOrderShipment.order.billToInfo.firstName }} {{ pickupReadyOrderShipment.order.billToInfo.lastName }}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"orderShipmentDetail_{{ pickupReadyOrderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-repeat=\"item in pickupReadyOrderShipment.items\" class=\"ml-ppos-instore-pickup-order-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-img\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-options\"></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-footer\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-instore-pickup-order-detail-button\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"viewOrderDetail(pickupReadyOrderShipment.order.id)\" class=\"ml-ppos-primary-button\"><span translate>btn.ppos.inStorePickup.viewDetail</span><i class=\"ml-ppos-mini-grey-icon ml-ppos-arrow-right\"></i></a>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Content End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/login/LoginWidget.html',
    "<div class=\"ml-ppos-login-wrapper ml-ppos-login-main-column\" data-ng-controller=\"loginController\">\n" +
    "\t<div class=\"ml-ppos-login-main-container\">\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"showLoginFailureMessage\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t<div>{{ loginFailureMessage | translate }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-login-container\">\n" +
    "\t\t\t<form novalidate data-ng-submit=\"login(userCredentials)\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.login.username\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"loginId\" id=\"loginId\" class=\"form-control\" data-ng-model=\"userCredentials.loginId\" placeholder=\"{{ 'msg.ppos.login.enterUsername' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.login.password\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"password\" name=\"password\" id=\"password\" class=\"form-control ml-ppos-login-label-password\" data-ng-model=\"userCredentials.password\" placeholder=\"{{ 'msg.ppos.login.enterPassword' | translate }}\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-button-container\">\n" +
    "\t\t\t\t\t<button type=\"submit\" name=\"loginButton\" class=\"ml-ppos-login-button\" id=\"loginButton\" translate>btn.ppos.login.loginButton</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/login/UnlockScreen.html',
    "<div class=\"ml-ppos-unlock-wrapper ml-ppos-unlock-main-column\" data-ng-controller=\"unlockScreenController\">\n" +
    "\t<div class=\"ml-ppos-unlock-main-container\">\n" +
    "\t\t<div class=\"ml-ppos-unlock-user-logout\">\n" +
    "\t\t\t<a data-ng-click=\"logout()\" data-ng-controller=\"logoutController\" translate=\"msg.ppos.logoutOtherUser\" translate-values=\"{ loggedInCSRName : unlockScreenDataModel.loggedInCSR.firstName }\"></a>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div data-ng-show=\"unlockScreenDataModel.showPinDoesNotMatchErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.enterCorrectAccessPin</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-unlock-container\">\n" +
    "\t\t\t<div translate=\"msg.ppos.greetingUser\" translate-values=\"{ loggedInCSRName : unlockScreenDataModel.loggedInCSR.firstName }\"></div>\n" +
    "\n" +
    "\t\t\t<div translate>msg.ppos.unlockScreenTypeAccessPin</div>\n" +
    "\n" +
    "\t\t\t<div><input type=\"password\" disabled name=\"pinEntered\" id=\"pinEntered\" data-ng-model=\"unlockScreenDataModel.pinEntered\" class=\"form-control\" /></div>\n" +
    "\n" +
    "\t\t\t<div ng-repeat=\"pinButton in unlockScreenDataModel.pinButtons track by $index\" ng-click=\"selectPin(pinButton.value)\" class=\"ml-ppos-unlock-keys-container\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-unlock-keys\">{{ pinButton.label }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/management/Management.html',
    "<div class=\"ml-ppos-account-wrapper\">\n" +
    "\t<div class=\"ml-ppos-management-container\">\n" +
    "\t\t<!-- Employee Management Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanSearchEmp || managementDataModel.isUserCanAddEmp || managementDataModel.isUserCanListEmp\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-employee\"></i>  <span translate=\"hdr.ppos.employeeManagement\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanSearchEmp\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-search\"></span> <span translate=\"btn.ppos.search\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanAddEmp\" ng-click=\"goToCsrAddScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-plus\"></span> <span translate=\"btn.ppos.new\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanListEmp\" ng-click=\"goToCsrListScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-browse\"></span> <span translate=\"btn.ppos.view\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Employee Management End -->\n" +
    "\t\t<!-- Settings Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanDoPosSettings || managementDataModel.isUserCanDoPaymentSettings\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-settings\"></i> <span translate=\"lbl.ppos.settings\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanDoPosSettings\" ng-click=\"goToPposSettingsScreen();\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-setting-pos\"></span><span translate=\"btn.ppos.pos\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanDoPaymentSettings\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-payment\"></span> <span translate=\"btn.ppos.payment\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Settings End -->\n" +
    "\t\t<!-- Reports Start -->\n" +
    "\t\t<div class=\"ml-ppos-management-row\" data-ng-if=\"managementDataModel.isUserCanViewSaleSettlement || managementDataModel.isUserCanViewOrderReturn || managementDataModel.isUserCanViewOrderTransaction || managementDataModel.isUserCanViewShipmentStatus || managementDataModel.isUserCanViewEmpActivity\">\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\n" +
    "\t\t\t\t<i class=\"ml-ppos-mini-white-icon ml-ppos-report\"></i> <span translate=\"hdr.ppos.reports\"/>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"ml-ppos-management-content ml-ppos-management-content-reports\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewSaleSettlement\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-sales\" ></span> <span translate=\"btn.ppos.saleSettlement\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewOrderReturn\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-return\"></span> <span translate=\"btn.ppos.orderReturn\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewOrderTransaction\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-transaction\"></span> <span translate=\"btn.ppos.orderTransaction\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewShipmentStatus\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-browse\"></span> <span translate=\"btn.ppos.shipmentStatus\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-management-icon-container\" data-ng-if=\"managementDataModel.isUserCanViewEmpActivity\">\n" +
    "\t\t\t\t\t<a href=\"\"><span class=\"ml-ppos-white-icon ml-ppos-activity\"></span> <span translate=\"btn.ppos.employeeActivity\"/></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<!-- Reports End -->\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/order/OrderDetail.html',
    "<div class=\"ml-ppos-order-detail-instore-pickup-wrapper\">\n" +
    "\t<div class=\"ml-ppos-order-detail-instore-pickup-container\">\n" +
    "\t\t<div class=\"ml-ppos-order-pickup-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-order-pickup-order-number\"><span><span translate=\"lbl.ppos.orderDetail.orderNumber\"/>:</span> {{ orderDetailDataModel.code }}</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t<!-- Loop -->\n" +
    "\t\t\t<div class=\"panel-group ml-ppos-order-pickup-detail-row\" id=\"accordion\">\n" +
    "\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"orderShipment in orderShipmentDataModel\">\n" +
    "\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderShipmentDetail_{{ orderShipment.id }}\"> <span translate=\"lbl.ppos.shipmentCount\" translate-values=\"{ shipmentCount: $index + 1, totalShipment: orderShipmentDataModel.length }\"/><span class=\"ml-ppos-instore-pickup-customer-name\">{{orderShipment.status}} </span> <i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"orderShipmentDetail_{{ orderShipment.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.shipmentContains\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.shipmentSubTotal\" translate-values=\"{ shipmentCount: $index + 1 }\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.shippingInformation\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"item in orderShipment.items\" class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-image\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in item.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"option.optionType\">{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.priceEach\"/> {{ item.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"itemDiscount in item.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.discount\"/> {{ itemDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"hdr.ppos.price\"/> {{ item.sellPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ itemDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.merchandiseSubtotalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"shipmentDiscount in orderShipment.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.shippingAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.discountedShippingTotal }} {{ shipmentDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"orderShipment.discounts.length === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.shippingAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.discountedShippingTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.taxAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderShipment.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content ml-ppos-order-subtotal-content-border\"><span translate=\"lbl.ppos.totalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value ml-ppos-order-subtotal-content-border\">{{ orderShipment.total }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-customer\">{{ orderShipment.shipmentInfo.person.firstName }} {{ orderShipment.shipmentInfo.person.middleName }} {{ orderShipment.shipmentInfo.person.lastName }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.street1 }} {{ orderShipment.shipmentInfo.address.street2 }} {{ orderShipment.shipmentInfo.address.street3 }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.city }}, {{ orderShipment.shipmentInfo.address.state }} {{ orderShipment.shipmentInfo.address.postalCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.address.country }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shipmentInfo.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<br/>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{ orderShipment.shippingMethod.name }} - {{ orderShipment.shippingMethod.description }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\t\n" +
    "\t\t\t<!-- Loop End -->\n" +
    "\t\t\t<!-- Loop -->\n" +
    "\t\t\t\t<div class=\"panel panel-default\" data-ng-repeat=\"orderPickup in orderPickupDataModel\" id=\"PickupOptions\">\n" +
    "\t\t\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-title\">\n" +
    "\t\t\t\t\t\t\t<a data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#orderPickupDetail_{{ orderPickup.id }}\"><span translate=\"lbl.ppos.pickupCount\" translate-values=\"{ pickupCount: $index + 1, totalPickup: orderPickupDataModel.length }\"/><span>- {{orderPickup.store.name}} ({{orderPickup.store.code}})</span> <span class=\"ml-ppos-instore-pickup-customer-name\">{{orderPickup.status}}</span><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></i></a>\n" +
    "\t\t\t\t\t\t</div> \n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"orderPickupDetail_{{ orderPickup.id }}\" class=\"panel-collapse collapse\">\n" +
    "\t\t\t\t\t\t<div class=\"panel-body\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.pickupItems\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.pickupSubTotal\" translate-values=\"{ pickupCount: $index + 1 }\"/></div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"orderPickup.items[0].storeID != thisStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-subhead\"><span translate=\"lbl.ppos.orderDetail.pickupInfo\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-repeat=\"item in orderPickup.items\" class=\"ml-ppos-order-pickup-shipment-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-image\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<img src=\"{{ item.product.image.thumb }}\" width=\"80\" height=\"80\" />\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ item.product.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.style\"/> {{ item.skuCode }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"option in item.options\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"option.optionType\">{{ option.optionType }}: {{ option.name }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"msg.ppos.qty\"/> {{ item.qty }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.priceEach\"/> {{ item.regularPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-repeat=\"itemDiscount in item.discounts\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"lbl.ppos.orderDetail.discount\"/> {{ itemDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div><span translate=\"hdr.ppos.price\"/> {{ item.sellPrice }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div>{{ itemDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-detail-subtotal\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.merchandiseSubtotalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderPickup.merchandiseTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content\"><span translate=\"lbl.ppos.taxAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value\">{{ orderPickup.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-content ml-ppos-order-subtotal-content-border\"><span translate=\"lbl.ppos.totalAmount\"/></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-subtotal-value ml-ppos-order-subtotal-content-border\">{{ orderPickup.total }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-info\">\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"item.storeID != thisStore.id\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"$index === 0\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-customer\">{{ orderPickup.shipmentInfo.person.firstName }} {{ orderPickup.shipmentInfo.person.middleName }} {{ orderPickup.shipmentInfo.person.lastName }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div>{{ orderPickup.shipmentInfo.phone }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<!-- Loop End -->\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-order-pickup-nav-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-order-pickup-header-customer\">{{ orderDetailDataModel.customer.primaryContact.person.firstName }} {{ orderDetailDataModel.customer.primaryContact.person.lastName }}</div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-order-pickup-sub-head\"><span translate=\"lbl.ppos.summaryOfCharges\"/></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.merchandiseSubtotalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.merchTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.taxAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.taxTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.shippingAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.shippingTotal }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"orderDiscount in orderDetailDataModel.discounts\" class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderDiscount.message }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">-{{ orderDiscount.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-total-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\" translate=\"lbl.ppos.totalAmount\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderDetailDataModel.total }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-row\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-order-pickup-sub-head\"><span translate=\"lbl.ppos.orderDetail.paymentMethods\"/></div>\n" +
    "\t\t\t\t\t<div data-ng-repeat=\"orderPayment in orderDetailDataModel.payments\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'CARD PRESENT' || orderPayment.paymentType === 'CREDIT CARD'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.cardType }} {{ orderPayment.maskedNumber }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'GIFT CERTIFICATE'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'CASH'\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "<<<<<<< .working\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'PAYPAL'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'AMAZON'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }}</div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "=======\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'PAYPAL'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    "                        <div class=\"ml-ppos-order-pickup-summary-content\" data-ng-if=\"orderPayment.paymentType === 'AMAZON'\">\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-label\">{{ orderPayment.paymentType }} <span translate=\"lbl.ppos.forLabel\"></span></div>\n" +
    "                            <div class=\"ml-ppos-order-pickup-summary-value\">{{ orderPayment.amount }}</div>\n" +
    "                        </div>\n" +
    ">>>>>>> .merge-right.r166239\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div data-ng-if=\"orderDetailDataModel.sourceCodeInfoList\" data-ng-repeat=\"sourceCodeInfo in orderDetailDataModel.sourceCodeInfoList\"  class=\"ml-ppos-order-pickup-summary-content\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-label\"><span translate=\"msg.ppos.appliedCouponCodeWithAmount\" translate-values=\"{ couponCode : sourceCodeInfo.code}\"></span></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-order-pickup-summary-value\" data-ng-if=\"!sourceCodeInfo.discountAmountZero\">{{ sourceCodeInfo.discountAmount }}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-order-detail-instore-pickup-button-container\">\n" +
    "\t\t\t\t\t<in-store-pickup-customer-verification-modal data-order-detail-data-model=\"orderDetailDataModel\"></in-store-pickup-customer-verification-modal>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/product/ProductDetail.html',
    "<div class=\"ml-product-detail-wrapper\">\n" +
    "    <div class=\"ml-product-detail-container\">\n" +
    "        <!-- Main Content -->\n" +
    "        <div class=\"ml-product-detail-main-content\">\n" +
    "            <!-- Image -->\n" +
    "            <div class=\"ml-product-detail-image-wrapper\">\n" +
    "                <div class=\"ml-product-detail-image\"><img src=\"{{model.product.image.detail}}\"></div>\n" +
    "                <!-- Suggested Items -->\n" +
    "                <div class=\"ml-product-detail-suggestions\" data-ng-if=\"model.crossSells.length\">\n" +
    "\t\t\t\t\t<div translate=\"msg.ppos.suggestedProducts\"></div>\n" +
    "                    <div class=\"ml-ppos-grid-view-items\">\n" +
    "                        <div data-ng-repeat=\"crossSellItem in model.crossSells track by $index\" class=\"ml-ppos-grid-view-item\">\n" +
    "                            <div data-ng-if=\"$index < 6\">\n" +
    "                                <a data-ng-href=\"#/productDetail?productId={{ crossSellItem.id }}&fromProductSearch=false\">\n" +
    "                                    <div class=\"ml-ppos-item-image\"><img ng-src=\"{{crossSellItem.image.thumb}}\" width=\"80\" height=\"80\"/></div>\n" +
    "                                    <div class=\"ml-ppos-item-info\">\n" +
    "                                        <div class=\"ml-ppos-item-product-name\" data-ng-if=\"model.showName\">{{ crossSellItem.name }}</div>\n" +
    "                                        <div class=\"ml-ppos-item-price\">\n" +
    "                                            <div>{{ crossSellItem.prices.displayPrice.price }}</div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\t\t\t\t<!-- Suggested Items End -->\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Details -->\n" +
    "            <div class=\"ml-product-detail-data-wrapper\">\n" +
    "                <div class=\"ml-product-detail-backto-search\" data-ng-if=\"model.fromProductSearch === 'true'\">\n" +
    "    \t\t\t\t<a data-ng-click=\"backToProductSearchResult()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i> <span translate>btn.ppos.backToSearchResult</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t\t<!-- Name, Description, Code, etc... -->\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-data-section\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-product-name\" data-ng-if=\"model.showName\">{{model.product.name}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-short-desc\" data-ng-if=\"model.showShortDescription\">{{model.product.description.shortDescription}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-long-desc\" data-ng-if=\"model.showLongDescription\">{{model.product.description.longDescription}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-product-code\"><span translate=\"lbl.ppos.style\"></span> {{model.product.code}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-price-product\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{model.product.prices.displayPrice.priceWas}}</div>\n" +
    "\t\t\t\t\t\t\t<div>{{model.product.prices.displayPrice.price}}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-data-section\">\n" +
    "\t\t\t\t\t\t<!-- Options -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-options-wrapper\"\n" +
    "\t\t\t\t\t\t\t data-ml-product-options\n" +
    "\t\t\t\t\t\t\t data-options=\"model.product.optionsWithAssociatedSkuIDs\"></div>\n" +
    "\t\t\t\t\t\t<!-- Qty -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t<label class=\"ml-ppos-quantity-spinner-label\"><div translate=\"msg.ppos.qty\"></div></label>\n" +
    "\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"model.addToBasketItem.qty\"\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t\tdata-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-price-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-sku\">{{model.priceSkuMsg}}</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-stock-wrapper\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"model.stockAvailable === true\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-label\" translate=\"msg.ppos.inStock\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-qty\">{{model.stockQty}}</span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-available\" translate=\"msg.ppos.available\"></span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"model.stockUnavailable === true\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-unavailable\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-button-wrapper\" data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t\t<div data-ng-if=\"!getSelectedSku()\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.selectValidOption</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-product-detail-button-wrapper\" data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t<!-- Nearby Store Button -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-store-button\" data-ng-class=\"{'disabled' : model.disableStoresButton}\"><input type=\"button\" name=\"nearByStoresButton\" id=\"nearByStoresButton\" value=\"{{'btn.ppos.stores' | translate}}\" data-ng-click=\"showNearByStoresModal(model.product.id, getSelectedSku(), model.addToBasketItem.qty)\" class=\"ml-ppos-secondary-button\"> <near-by-stores-modal></near-by-stores-modal></div>\n" +
    "\t\t\t\t\t\t<!-- Add to Cart Button -->\n" +
    "\t\t\t\t\t\t<div class=\"ml-product-detail-cart-button\" data-ng-class=\"{'disabled' : model.disableAddToCartButton}\"><input type=\"button\" name=\"addToCartButton\" id=\"addToCartButton\" class=\"ml-ppos-primary-button\" value=\"{{'btn.ppos.addToBasket' | translate}}\" ng-click=\"addItemToBasket()\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/product/ProductDetailModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"productDetailModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"closeProductDetailModal()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\">{{ model.product.name }}</h4>\n" +
    "\t\t\t\t</div>\n" +
    "                <form novalidate data-ng-submit=\"closeProductDetailModal(); addItemToBasketAndReloadBasket();\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-row\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-thumb\"><img data-ng-src=\"{{model.addToBasketItem.thumb}}\" width=\"150\" height=\"150\" /></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-info\">\n" +
    "\n" +
    "                                    <!-- Short Description -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-short-desc\" data-ng-if=\"model.showShortDescription\">{{ model.product.description.shortDescription }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Long Description -->\n" +
    "\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.showLongDescription\">{{ model.product.description.longDescription }}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Code -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-product-search-code\"><span translate=\"lbl.ppos.style\"></span> {{ model.product.code }}</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Product Level Price -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-product\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{model.product.prices.displayPrice.priceWas}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div>{{model.product.prices.displayPrice.price}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Options -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-options-wrapper\"\n" +
    "\t\t\t\t\t\t\t\t\t\tdata-ml-product-options\n" +
    "\t\t\t\t\t\t\t\t\t\tdata-options=\"model.product.optionsWithAssociatedSkuIDs\"></div>\n" +
    "                    \n" +
    "\t\t\t\t\t\t\t\t\t<!-- Qty -->\n" +
    "\t\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<label class=\"ml-ppos-quantity-spinner-label\"><div translate=\"msg.ppos.qty\"></div></label>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-quantity-spinner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<ml-numeric-spinner data-mapped-value=\"model.addToBasketItem.qty\" data-max-length=\"2\"></ml-numeric-spinner>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Sku Level Price -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-price-sku\">{{model.priceSkuMsg}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<!-- Stock Availability -->\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"ml-product-detail-stock-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.stockAvailable === true\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-label\" translate=\"msg.ppos.inStock\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-qty\">{{model.stockQty}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-available\" translate=\"msg.ppos.available\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.stockUnavailable === true\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"ml-product-detail-stock-unavailable\" translate=\"msg.ppos.unavailable\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div data-ng-if=\"!getSelectedSku()\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\" translate>msg.ppos.selectValidOption</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-set ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div data-ng-if=\"model.initialized\">\n" +
    "\t\t\t\t\t\t\t<!-- Add to Cart Button -->\n" +
    "\t\t\t\t\t\t\t<div data-ng-class=\"{'disabled' : model.disableAddToCartButton}\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate=\"btn.ppos.addToBasket\"></span>\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-grey-icon ml-ppos-plus\"></span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t\t<button type=\"submit\" name=\"addToCartButton\" id=\"addToCartButton\" class=\"ml-ppos-btn-hidden\" translate=\"btn.ppos.addToBasket\"></button>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<!-- Nearby Store Button -->\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-product-detail-store-button\" data-ng-class=\"{'disabled' : model.disableStoresButton}\"><input type=\"button\" name=\"nearByStoresButton\" id=\"nearByStoresButton\" value=\"{{'btn.ppos.stores' | translate}}\" data-ng-click=\"showNearByStoresModal(model.product.id, getSelectedSku(), model.addToBasketItem.qty)\" class=\"ml-ppos-secondary-button\"></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancelProductDetailModal()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/product/ProductOptions.html',
    "<div class=\"ml-product-option-container\">\n" +
    "    <div class=\"ml-product-option-type-wrapper\" ng-repeat=\"type in options track by $index\">\n" +
    "        <div class=\"ml-product-option-type\">{{type.optionType}}</div>\n" +
    "        <div class=\"ml-product-option-wrapper\">\n" +
    "            <div class=\"ml-product-option\"\n" +
    "                 ng-class=\"{'selected': type.selectedOption == option,'disabled': !isOptionSelectable(type, option)}\"\n" +
    "                 ng-repeat=\"option in type.options track by $index\">\n" +
    "                <div class=\"ml-product-option-text\" ng-click=\"selectOption(type, option)\" ng-hide=\"option.image\">\n" +
    "                    {{option.name}}\n" +
    "                </div>\n" +
    "                <div class=\"ml-product-option-image\" ng-click=\"selectOption(type, option)\" ng-show=\"option.image\"><img\n" +
    "                        ng-src=\"{{option.image}}\"/></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/provisioning/Provisioning.html',
    "<div class=\"ml-ppos-login-wrapper ml-ppos-login-main-column\">\n" +
    "\t<div class=\"ml-ppos-login-main-container\">\t\n" +
    "\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"showProvisioningFailureMessage\">\n" +
    "\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t<div>{{ provisioningFailureMessage | translate }}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-login-head\" translate=\"msg.ppos.provisioning.header\"></div>\n" +
    "\n" +
    "\t\t<div class=\"ml-ppos-login-container\">\n" +
    "\t\t\t<form novalidate data-ng-submit=\"provisionApplication(provisioningDetails)\">\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.provisioning.serverUrl\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"urlBase\" id=\"urlBase\" class=\"form-control\" data-ng-model=\"provisioningDetails.urlBase\" placeholder=\"{{ 'msg.ppos.provisioning.enterServerUrl' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label\" translate=\"lbl.ppos.provisioning.storeCode\"></div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-label-content\">\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"storeCode\" id=\"storeCode\" class=\"form-control\" data-ng-model=\"provisioningDetails.storeCode\" placeholder=\"{{ 'msg.ppos.provisioning.enterStoreCode' | translate }}\" autocorrect=\"off\" autocapitalize=\"off\" />\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-login-button-container\">\n" +
    "\t\t\t\t\t<button type=\"submit\" name=\"provisioningSubmitButton\" id=\"provisioningSubmitButton\" class=\"ml-ppos-login-button\" translate>btn.ppos.provisioning.submit</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/CustomerSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-customer-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"customerSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-ng-click=\"close()\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate>hdr.ppos.newOrder</h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.customerSearchResult == null\">\n" +
    "\t\t\t\t\t<form name=\"customerSearchForm\" novalidate data-ng-submit=\"searchCustomer()\">\n" +
    "\t\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"showPhoneNumberRequiredMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div translate>msg.ppos.phoneNumberRequired</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div data-ng-show=\"showInValidPhoneNumberMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t\t<div translate>msg.ppos.invalidPhoneNumberEntered</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-head\" translate>lbl.ppos.customerPhoneNumber</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-label-content\">\n" +
    "\t\t\t\t\t\t\t\t<input type=\"tel\" name=\"customerPhoneNumber\" id=\"customerPhoneNumber\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.phoneNumberSearchPlaceholder' | translate }}\" data-ng-model=\"customerSearchDataModel.customerPhoneNumber\" show-focus=\"customerSearchDataModel.customerSearchResult == null\"/>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-customer-search\">\n" +
    "\t\t\t\t\t\t\t<div><button type=\"submit\" name=\"customerSearchButton\" id=\"customerSearchButton\" class=\"ml-ppos-primary-button\" translate>btn.ppos.searchCustomerButon</button></div>\n" +
    "\t\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-ng-click=\"cancel()\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-button-customer-skip-button\"><a href=\"javascript:;\" data-ng-click=\"skipCustomerSearchAndStartNewOrder(null)\" class=\"ml-ppos-secondary-button-understated\" translate>btn.ppos.skip</a></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"customerSearchDataModel.customerSearchResult != null\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-customer-search-result-message\" translate=\"msg.ppos.customerSearchResult\" translate-values=\"{ customerCount : customerSearchDataModel.customerSearchResult.data.length, customerPhoneNumber : customerSearchDataModel.customerPhoneNumber }\"></div>\n" +
    "\t\t\t\t\t\t<div data-ng-repeat=\"customer in customerSearchDataModel.customerSearchResult.data\" class=\"ml-ppos-customer-search-result-row\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"startNewOrder(customer.id)\">{{ customer.primaryContact.person.firstName }} {{ customer.primaryContact.person.lastName }} <span class=\"ml-ppos-customer-search-zip-code\">{{ customer.primaryContact.address.postalCode }}</span> <span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-right\"></span></a>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-customer-search-result\">\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button-understated\" data-ng-click=\"skipCustomerSearchAndStartNewOrder(null)\" translate>btn.ppos.skip</button></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-button-customer-search-place-order\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-inner\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn-text\" translate>btn.ppos.searchAgain</span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"ml-ppos-btn ml-ppos-mini-white-icon ml-ppos-arrow-left\"></span>\n" +
    "\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t<button type=\"button\" class=\"ml-ppos-btn-hidden\" data-ng-click=\"searchAgain()\" translate>btn.ppos.searchAgai</button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/OrderSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"orderSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\"  data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.searchOrder\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"searchOrderByCode()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"orderSearchDataModel.showOrderSearchError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ orderSearchDataModel.orderSearchErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\" translate=\"lbl.ppos.enterOrderNumber\"></div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"orderCode\" id=\"orderCode\" class=\"form-control\" data-ng-model=\"orderSearchDataModel.orderCode\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"orderSearchButton\" id=\"orderSearchButton\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.searchOrder\"></button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/ProductSearchModal.html',
    "<div class=\"ml-ppos-modal-container ml-ppos-product-search-wrapper\">\n" +
    "\t<div class=\"modal\" id=\"productSearchModal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "\t\t<div class=\"modal-dialog\">\n" +
    "\t\t\t<div class=\"modal-content\">\n" +
    "\t\t\t\t<div class=\"modal-header\">\n" +
    "\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\"><span class=\"ml-ppos-mini-white-icon ml-ppos-close\"></span></span></button>\n" +
    "\t\t\t\t\t<h4 class=\"modal-title\" translate=\"hdr.ppos.addManually\"></h4>\n" +
    "\t\t\t\t</div>\n" +
    "\t  \n" +
    "\t\t\t\t<form novalidate data-ng-submit=\"searchProduct()\">\n" +
    "\t\t\t\t\t<div class=\"modal-body\">\n" +
    "\t\t\t\t\t\t<div data-ng-show=\"productSearchDataModel.showProductSearchError\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t\t{{ productSearchDataModel.productSearchErrorMessage }}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-head\" translate=\"lbl.ppos.enterProductNameOrSkuNumber\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-product-search-label-content\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"productSearchKeyword\" id=\"productSearchKeyword\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.keywordOrItem' | translate }}\" data-ng-model=\"productSearchDataModel.productSearchKeyword\" />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div class=\"modal-footer ml-ppos-button-product-search\">\n" +
    "\t\t\t\t\t\t<div><button type=\"submit\" name=\"productSearchButton\" id=\"productSearchButton\" class=\"ml-ppos-primary-button\" translate=\"btn.ppos.searchProduct\"></button></div>\n" +
    "\t\t\t\t\t\t<div><button type=\"button\" class=\"ml-ppos-secondary-button\" data-dismiss=\"modal\" translate=\"btn.ppos.cancel\"></button></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/search/ProductSearchResult.html',
    "<div data-ng-controller=\"productSearchResultController\" class=\"ml-ppos-product-search-result-wrapper\">\n" +
    "\t<div class=\"ml-ppos-search-container\">\n" +
    "\t\t<div class=\"ml-ppos-facet-nav-container\">\n" +
    "\t\t<div data-ng-if=\"productSearchResultDataModel.showSorting\">\n" +
    "\t\t\t<div class=\"ml-ppos-facet-refine-head\" translate=\"hdr.ppos.refineYourSearch\"></div>\n" +
    "\t\t\t\t<div class=\"ml-ppos-facet-sortbg\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-default-header-wrapper\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-message\" translate=\"lbl.ppos.sortBy\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-default-header-icon\"><a href=\"\" data-toggle=\"collapse\" data-target=\"#Sorting\"><span class=\"ml-ppos-mini-white-icon ml-ppos-arrow-down\"></span></a></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-facet-selected\">\n" +
    "\t\t\t\t\t\t<span data-ng-repeat=\"sortOption in productSearchResultDataModel.sortOptions\" data-ng-if=\"sortOption.sortOptionConfig === productSearchResultDataModel.currentSortOptionConfig\" \n" +
    "\t\t\t\t\t\ttranslate=\"sel.ppos.{{ productSearchResultDataModel.currentSortOptionConfig }}\">\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div id=\"Sorting\" class=\"collapse\">\n" +
    "\t\t\t\t\t\t<a data-toggle=\"collapse\" data-target=\"#Sorting\" href=\"\" data-ng-repeat=\"sortOption in productSearchResultDataModel.sortOptions\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, 0, 1, sortOption.sortOptionOrder, sortOption.sortOptionParam)\" translate=\"sel.ppos.{{ sortOption.sortOptionConfig }}\"></a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"ml-ppos-search-detail-container\">\n" +
    "\t\t\t<div class=\"ml-ppos-search-head-row\">\n" +
    "\t\t\t\t<!-- Title and search field. -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-search-title-wrapper\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-title\" translate=\"lbl.ppos.searchTerm\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-keyword\">\n" +
    "\t\t\t\t\t\t<form novalidate data-ng-submit=\"searchProduct(productSearchKeyword, 0, 1)\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" name=\"productSearchKeyword\" id=\"productSearchKeyword\" class=\"form-control\" placeholder=\"{{ 'msg.ppos.keywordOrItem' | translate }}\" data-ng-model=\"productSearchKeyword\" />\n" +
    "\t\t\t\t\t\t</form>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<!-- Pagination -->\n" +
    "\t\t\t\t<div class=\"ml-ppos-search-pagination\" data-ng-show=\"productSearchResultDataModel.pagingModel.showPagination\">\n" +
    "\t\t\t\t\t<ul class=\"ml-ppos-pagination\">\n" +
    "\t\t\t\t\t\t<!-- Previous Page Group Link Disabled -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"!productSearchResultDataModel.pagingModel.previousPageGroup.hasPreviousPageGroup\" class=\"ml-ppos-paging-default ml-ppos-paging-disabled\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-paging-previous ml-icon-lib ml-icon-previous\"></span>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t<!-- Previous Page Group Link Clickable -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"productSearchResultDataModel.pagingModel.previousPageGroup.hasPreviousPageGroup\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, productSearchResultDataModel.pagingModel.previousPageGroup.previousPageGroupPageNumberOffSet, productSearchResultDataModel.pagingModel.previousPageGroup.previousPageGroupPageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\" class=\"ml-ppos-paging-previous ml-icon-lib ml-icon-previous\"> </a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t<!-- Pages for current Page Group -->\n" +
    "\t\t\t\t\t\t<li data-ng-repeat=\"page in productSearchResultDataModel.pagingModel.pages\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<!-- Current Page should not be clickable. -->\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-if=\"productSearchResultDataModel.pagingModel.currentPage == page.pageNumber\" class=\"active\">{{ page.pageNumber }}</a>\n" +
    "\t\t\t\t\t\t\t<!-- All other pages should be clickable. -->\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-if=\"productSearchResultDataModel.pagingModel.currentPage != page.pageNumber\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, page.offSet, page.pageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\">{{ page.pageNumber }}</a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t<!-- Next Page Group Link Disabled -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"!productSearchResultDataModel.pagingModel.nextPageGroup.hasNextPageGroup\" class=\"ml-ppos-paging-default ml-ppos-paging-disabled\">\n" +
    "\t\t\t\t\t\t\t<span class=\"ml-ppos-paging-next ml-icon-lib ml-icon-next\"></span>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t<!-- Next Page Group Link Clickable -->\n" +
    "\t\t\t\t\t\t<li data-ng-show=\"productSearchResultDataModel.pagingModel.nextPageGroup.hasNextPageGroup\" class=\"ml-ppos-paging-default\">\n" +
    "\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(productSearchResultDataModel.productSearchKeyword, productSearchResultDataModel.pagingModel.nextPageGroup.nextPageGroupPageNumberOffSet, productSearchResultDataModel.pagingModel.nextPageGroup.nextPageGroupPageNumber, productSearchResultDataModel.currentSortOrder, productSearchResultDataModel.currentSortParam)\" class=\"ml-ppos-paging-next ml-icon-lib ml-icon-next\"> </a>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-scroll-container\">\n" +
    "\t\t\t<!-- Error Messages. -->\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<div data-ng-show=\"productSearchResultDataModel.showKeywordRequiredErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t<div translate=\"msg.ppos.shortSearchTerm\" translate-values=\"{ minLength : 3 }\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-show=\"productSearchResultDataModel.showProductNotFoundErrorMessage\" class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t<div translate=\"msg.ppos.searchNoResults\" translate-values=\"{ searchTerm : productSearchResultDataModel.searchTerm }\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Success Messages. -->\n" +
    "\t\t\t<div data-ng-if=\"!productSearchResultDataModel.showKeywordRequiredErrorMessage && !productSearchResultDataModel.showProductNotFoundErrorMessage\">\n" +
    "\t\t\t\t<div data-ng-if=\"!productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-search-result-message\" translate=\"msg.ppos.searchResults\" translate-values=\"{ productCount: productSearchResultDataModel.searchResult.searchResultSize, searchKeyword: productSearchResultDataModel.productSearchKeyword }\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-error-container\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-icon-error\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-error-message\">\n" +
    "\t\t\t\t\t\t\t<div translate=\"msg.ppos.noMatchesFound\" translate-values=\"{ searchKeyword: productSearchResultDataModel.productSearchKeyword }\">\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded.length == 1\">\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.didYouMean\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-repeat=\"alternateTerm in productSearchResultDataModel.searchResult.alternateTermsQueryEncoded\">\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a>?\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div data-ng-if=\"productSearchResultDataModel.searchResult.alternateTermsQueryEncoded.length > 1\">\n" +
    "\t\t\t\t\t\t\t\t<span translate=\"msg.ppos.didYouMean\"></span>\n" +
    "\t\t\t\t\t\t\t\t<span data-ng-repeat=\"alternateTerm in productSearchResultDataModel.searchResult.alternateTermsQuery\">\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$first\"><a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a></span>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$middle\">, <a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a></span>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t\t<span data-ng-if=\"$last\">or <a href=\"\" data-ng-click=\"searchProduct(alternateTerm, 0, 1)\" translate=\"msg.ppos.alternateTerm\" translate-values=\"{ alternateTerm: alternateTerm }\"></a>?</span>\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<div translate=\"msg.ppos.alternateMatchCount\" translate-values=\"{ productCount: productSearchResultDataModel.searchResult.searchResultSize }\">\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<!-- Product Thumbnails. -->\n" +
    "\t\t\t<div class=\"ml-ppos-grid-view-items\">\t\n" +
    "\t\t\t\t<div data-ng-repeat=\"product in productSearchResultDataModel.searchResult.productInfo\" class=\"ml-ppos-grid-view-item\">\n" +
    "\t\t\t\t\t<a data-ng-href=\"#/productDetail?productId={{ product.id }}&fromProductSearch=true\">\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-image\"><img ng-src=\"{{ product.imageResolved }}\" /></div>\n" +
    "\t\t\t\t\t\t<div class=\"ml-ppos-item-info\">\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-product-name\" data-ng-if=\"productSearchConfigModel.showName\">{{ product.name }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-short-desc\" data-ng-if=\"productSearchConfigModel.showShortDescription\">{{ product.description.shortDescription }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-product-code\" data-ng-if=\"productSearchConfigModel.showCode\">{{ product.code }}</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"ml-ppos-item-price\" data-ng-if=\"productSearchConfigModel.showPrices\">\n" +
    "\t\t\t\t\t\t\t\t<div>{{ product.priceInfo.priceMsg }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"ml-item-price-was\">{{ product.priceInfo.priceWasMsg }}</div>\n" +
    "\t\t\t\t\t\t\t\t<div>{{ product.priceInfo.priceNowMsg }}</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/settings/POSSettings.html',
    "<div class=\"ml-ppos-account-wrapper\">\r" +
    "\n" +
    "\t<div class=\"ml-ppos-management-container\">\r" +
    "\n" +
    "\t\t<!-- Management Title Start -->\r" +
    "\n" +
    "\t\t<div class=\"ml-ppos-management-row\">\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-management-title\">\r" +
    "\n" +
    "\t\t\t\t<a href=\"\" ng-click=\"goToManagementScreen()\"><i class=\"ml-ppos-mini-white-icon ml-ppos-arrow-left\"></i><span translate=\"lbl.ppos.management\"/></a>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Management Title End -->\r" +
    "\n" +
    "\t\t<!-- Settings Start -->\r" +
    "\n" +
    "\t\t<form novalidate>\r" +
    "\n" +
    "\t\t\t<!-- Error Block Start -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-error-container\" data-ng-show=\"posSettingsModel.showMessage\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-icon-error\" id=\"divMsgIconContainer\"></div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-error-message\">\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ posSettingsModel.message | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t<!-- Error Block End -->\r" +
    "\n" +
    "\t\t\t<!-- PEBL-16140 : Commented for phase 1, uncomment in Phase 2 - STARTS -->\r" +
    "\n" +
    "\t\t\t<!--\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row\">\r" +
    "\n" +
    "\t\t\t\t<div><span translate=\"hdr.ppos.posScreenSettings\"/></div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row ml-ppos-settings-row-indent\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-label\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"hdr.ppos.autoLockScreen\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"hdr.ppos.autoLockScreenInactivity\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-value ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : timeout == posSettingsModel.userSetTimeout}\" data-ng-repeat=\"timeout in posSettingsModel.timeoutArray\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedTimeout\" id=\"selectedTimeout\" value=\"{{ timeout }}\" data-ng-model=\"posSettingsModel.userSetTimeout\" data-ng-change=\"saveChanges(posSettingsModel);\"/> <span translate=\"lbl.ppos.timeoutMinutes\" translate-values=\"{ timeout: timeout }\"></span>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t-->\r" +
    "\n" +
    "\t\t\t<!-- PEBL-16140 : Commented for phase 1, uncomment in Phase 2 - ENDS -->\r" +
    "\n" +
    "\t\t\t<!-- Stores -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-store-location\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.storeLocation\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div>{{ posSettingsModel.storeLocation | translate }}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<!-- Stores -->\r" +
    "\n" +
    "\t\t\t<div class=\"ml-ppos-settings-row ml-ppos-settings-row-indent\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-label\">\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.nearbyStores\"/></div>\r" +
    "\n" +
    "\t\t\t\t\t<div><span translate=\"lbl.ppos.nearbyStoresDistance\"/></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"ml-ppos-settings-value ml-ppos-toggle-container\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"ml-ppos-toggle btn-group btn-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label class=\"ml-ppos-toggle-button btn\" ng-class=\"{active : radius == posSettingsModel.userSetRadius}\" data-ng-repeat=\"radius in posSettingsModel.radiusArray\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"radio\" name=\"selectedRadius\" id=\"selectedRadius\" value=\"{{ radius }}\" data-ng-model=\"posSettingsModel.userSetRadius\" data-ng-change=\"saveChanges(posSettingsModel);\"/> <span translate=\"lbl.ppos.storeRadius\" translate-values=\"{ storeRadius: radius }\"></span>\r" +
    "\n" +
    "\t\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
