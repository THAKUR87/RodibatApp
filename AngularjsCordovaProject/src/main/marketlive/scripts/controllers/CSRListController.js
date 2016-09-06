/*! CSRListController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('csrListController', 
		['$log', '$scope', '$location', 'csrService', 'dataStorageService',
		function ($log, $scope, $location, csrService, dataStorageService) {

			$scope.csrListDataModel = {
				userData : null,
				csrDeleteId : null,
				csrDeleteUser : null,
				csrListType : null
			};

			$scope.init = function () {
				$scope.getAllCSRs();
			};
			
			/**
			* To get all CSR (active + inactive) user list.
			*/
			$scope.getAllCSRs = function () {
				$scope.csrListDataModel.csrListType = 'ALL';
				csrService.getAllCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = '';
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* To get only active CSR user list.
			*/
			$scope.getActiveCSRs = function () {
				$scope.csrListDataModel.csrListType = 'ACTIVE';
				csrService.getActiveCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* To get only inactive CSR user list.
			*/
			$scope.getInActiveCSRs = function () {
				$scope.csrListDataModel.csrListType = 'INACTIVE';
				csrService.getInActiveCSRs()
					.then(
					function (successResult) {
						$scope.csrListDataModel.userData = successResult.data;
					}, function (errorResult) {
						$log.error(errorResult);
					});
			};

			/**
			* Navigate to CSR management screen if clicks on management button\link.
			*/
			$scope.goToManagementScreen = function () {
					$location.path('/management');
			};

			/**
			* Navigate to CSR add screen if clicks on add icon\button.
			*/
			$scope.goToCsrAddScreen = function () {
				$location.path('/csrAdd');
			};

			/**
			 * Navigate to CSR edit screen if clicks on edit button.
			 *
			 */
			$scope.goToCsrEditScreen = function (csrId) {
				sessionStorage.lastEditCsrId = csrId;				
				$location.path('/csrEdit');
 			};

			
			$scope.deleteUser = function (csrId, csrUser) {
				$scope.csrListDataModel.csrDeleteId = csrId;
				$scope.csrListDataModel.csrDeleteUser = csrUser;
				angular.element('#csrDeleteConfirmationModal').modal('show');
			};

			$scope.closeDelConfirmModal = function () {
				angular.element('#csrDeleteConfirmationModal').modal('hide');
			};

			/**
			 * Delete CSR user if clicks on delete button.
			 *
			 */
			$scope.deleteCsrUser = function () {
				angular.element('#csrDeleteConfirmationModal').modal('hide');
				csrService.deleteCSR($scope.csrListDataModel.csrDeleteId)
					.then(
					function (successResult) {
						console.log('CSR deleted : ' + successResult);
						$scope.init();
					}, function (errorResult) {
						$log.error(errorResult);
					});
 			};
 
			/**
			* toggle active\inactive status of the user to be shown for csr user.
			*/
			$scope.isActive = function(active, showActiveInactive) {
				var isActive = false;
				if (active === 'true' && showActiveInactive === 'showActive') {
					return true;
				} else if (active === 'false' && showActiveInactive === 'showInactive') {
					return true;
				}
				return isActive;
			};
 
			/**
			* To find if delete icon should be active or not for the user listing, 
			* delete icon is visible only if csr user is in inactive state.
			*/
			$scope.showDelete = function(active, typePPOS) {
				if (active === 'true' || typePPOS === 'Admin') {
					return false;
				} else {
					return true;
				}
			};

			/**
			* To find if edit icon should be visible or not for the user listing, 
			* edit icon will not be visible for the user row with admin role.
			*/
			$scope.showEdit = function(typePPOS) {
				if (typePPOS === 'Admin') {
					return false;
				} else {
					return true;
				}
			};

			/**
			* To find if user row should be visible or not, 
			* user row will be visible according to roles, admin row will be visible 
			* only if logged in user also have admin role.
			*/
			$scope.showUserRow = function(typePPOS) {
				var loggedInUserType = dataStorageService.getLoggedInCSR().typePPOS; 
				if (typePPOS === 'Admin' && loggedInUserType !== 'Admin') {
					return false;
				} else {
					return true;
				}
			};


			$scope.init();
		}]);
}(window.angular));

