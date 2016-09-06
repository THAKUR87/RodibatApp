/*! LoginController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
