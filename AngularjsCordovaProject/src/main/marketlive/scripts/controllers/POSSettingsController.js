/*! POSSettingsController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
