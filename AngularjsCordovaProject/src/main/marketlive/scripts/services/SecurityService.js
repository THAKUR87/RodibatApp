/*! SecurityService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
