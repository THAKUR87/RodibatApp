/*! ManagementController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
