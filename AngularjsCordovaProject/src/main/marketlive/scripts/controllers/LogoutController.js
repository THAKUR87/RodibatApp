/*! LoginController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
