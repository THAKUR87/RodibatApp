/*! PaginationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
