/*! UnlockScreenController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
