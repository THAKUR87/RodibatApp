/*! BasketController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
