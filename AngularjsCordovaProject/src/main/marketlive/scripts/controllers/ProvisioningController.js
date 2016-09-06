/*! ProvisioningController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

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
