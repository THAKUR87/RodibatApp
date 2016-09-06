/*! HomeController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
