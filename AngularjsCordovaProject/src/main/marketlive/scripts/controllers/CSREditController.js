/*! CSRController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('csrEditController', 
		['$scope', 'csrService', '$location', '$translate', 'csrValidationService',
		'dataStorageService',
			function ($scope, csrService, $location, $translate, csrValidationService, dataStorageService) {
				// Constants for default roles
				$scope.storeAssociateRoleCode = 'Store Associates';
				$scope.storeManagerRoleCode = 'Store Manager';
				$scope.csr = {
						csrId : null,
						employeeId : null,
						firstName : null,
						lastName : null,
						email : null,
						password : null,
						confirmPassword : null,
						unlockPosPin : null,
						roleType : null,
						selectedRole : '',
						activeStatus : null,
						typePPOS : null,
						typePPOSId : null,
						showCsrOpFailureMessage : false,
						csrOpFailureMessage : null
					};
			
				$scope.init = function () {

					$scope.csr.activeStatus = 'false'; //select inactive by default
					$scope.csrId = JSON.parse(sessionStorage.lastEditCsrId);
					csrService.getCSRById($scope.csrId).then(
						function (successResult) {
							var pin = successResult.data.pin;
							$scope.csr.employeeId = successResult.data.employeeID;
							$scope.csr.firstName = successResult.data.firstName;
							$scope.csr.lastName = successResult.data.lastName;
							$scope.csr.email = successResult.data.email;
							$scope.csr.activeStatus = successResult.data.active;
							$scope.csr.unlockPosPin = pin;
							$scope.csr.typePPOS = successResult.data.typePPOS;				
							if (successResult.data.active && !angular.element('#lblActive').hasClass('active')) {
								angular.element('#lblInactive').toggleClass('active');
								angular.element('#lblActive').toggleClass('active');
							}

							csrService.getCSRTypes().then(
									function (successResult) {
										$scope.csr.roleType = successResult.data;
										$scope.csr.selectedRole = 
												csrService.getStoreAssociateRoleName($scope.csr.roleType,
																			$scope.csr.typePPOS);
										$scope.populateCSRTypeDetails($scope.csr.selectedRole);
										if(successResult.data.length !== 2) { 
											// More than 2 roles returned, add a default select option
											$translate('sel.ppos.selectRole').
												then(function (selectOption) {
													var defaultItem = {
														'id' : '',
														'code' : selectOption,
													};
													successResult.data.splice(0, 0, defaultItem);
												});
										} else {
											$scope.populateCSRTypeDetails('');
										}
										
									}, function (errorResult) {
										console.log('ErrorResult - An error occurred while getting' +
										' CSRType list : ' + errorResult);
									}
								);

						}, function (errorResult) {
							console.log('ErrorResult - An error occurred while getting CSR : ' + errorResult);
						}
					);

					

					
				};

				/**
				 * Performs update CSR
				 */
				$scope.updateCSR = function (csr) {
					//Hide soft keyboard
					$('input').blur();$('select').blur();
					var isValid = csrValidationService.validateCSR(csr, 'edit');
					if (isValid) { // client side ok, now hit server
						// Get CSRType code from value as API expects code
						var csrCode = '';
						//var csrTypeId = document.getElementById('roleTypeRadio').value;
						for(var idx = 0; idx < $scope.csr.roleType.length; idx++ ) {
							if($scope.csr.roleType[idx].id.toString() === csr.selectedRole.toString()) {
								csrCode = $scope.csr.roleType[idx].code;
								break;
							}
						}

						// Set DATE_ACTIVE or DATE_DEACTIVE based on selection
						var dateActivated = null;
						var dateDeactivated = null;
						if (csr.activeStatus === true || csr.activeStatus === 'true') {
							dateActivated = new Date().getTime();
						} else {
							dateDeactivated = new Date().getTime();
						}
						// Associate the CSR with this store
						var csrStores = [];
						csrStores.push(dataStorageService.getStoreId());
						// call save csr method on service with JSON object
						var csrToUpdate = {
							'firstName' : csr.firstName,
							'lastName' : csr.lastName,
							'status' : csr.activeStatus,
							'employeeID' : csr.employeeId,		
							'email' : csr.email,
							'pin' : csr.unlockPosPin,
							'codeCSRType' : csrCode,
							'dateActivate' : dateActivated,
							'dateDeactivate' : dateDeactivated,
							'stores' : csrStores,
						};
						csrService.updateCSR($scope.csrId, csrToUpdate).then(							
							function (successResult) {
								console.log('CSR updated ' + successResult);								
								csrValidationService.showMessageAndFocus('msg.ppos.userUpdated', $scope.csr);
								$scope.init();
								if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
									angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
									angular.element('#divMsgIconContainer').addClass('ml-icon-success');
								}
							}, function (errorResult) {
								var msg = ''; var serverMsg = '';
								var errorMessage = errorResult.data.errorMessage;
								if (errorResult.data.responseCode === '422' || 
									errorResult.data.responseCode === '409') {
									for (var key in errorMessage) {
										if(errorMessage[key] !== '') {
											serverMsg = errorMessage[key].toString().trim();
											if (serverMsg.lastIndexOf('.') === serverMsg.length - 1) {
												// Full stop already received from server, dont append
												msg += serverMsg + ' ';
											} else {
												// Full stop NOT received from server, append full stop
												msg += serverMsg + '. ';
											}
										}
									}
									csrValidationService.showMessageAndFocus(msg, $scope.csr);
								} else {
									console.log('ErrorResult - An error occurred while adding CSR : ' + errorResult);
									csrValidationService.showMessageAndFocus('msg.ppos.userNotUpdated', $scope.csr);
								}
							}
						);
					}
				};

				/**
				* This method gets role's (CSRType's) permissions from REST & populate that on UI
				*/
				$scope.populateCSRTypeDetails = function (csrTypeId) {
					csrService.populateCSRTypeDetails(csrTypeId);
				};

				/**
				* Method to move to CSR list screen
				*/
				$scope.goToCsrListScreen = function () {
					csrService.goToCsrListScreen();
				};

				/**
				* Method to move to management screen
				*/
				$scope.goToManagementScreen = function () {
					csrService.goToManagementScreen();
				};

				/**
				* Method to show hide the permission div
				*/
				$scope.showHidePermission = function () {
					csrService.showHidePermission();
				};

				/**
				* On unlock pin text boxes, this method checks if entered value is a digit,
				* if yes, then it moves the focus to next text box.
				*/
				$scope.moveOnNext = function (txtValue, currentFieldId, nextFieldID) {
					csrService.moveOnNext(txtValue, currentFieldId, nextFieldID, $scope.csr);
				};

				$scope.clearContent = function (elementId) {
					csrService.clearContent(elementId, $scope.csr);
				};

				$scope.clearPIN = function (elementId) {
					csrService.clearPIN(elementId, $scope.csr);
				};

				$scope.$watch(
					function() {
						return $scope.csr.pin1 + $scope.csr.pin2 + $scope.csr.pin3 + 
							$scope.csr.pin4 + $scope.csr.pin5 + $scope.csr.pin6; 
					}, function(value) {
							$scope.csr.unlockPosPin = value;
						}
				);

				/**
				* Method to set active status
				*/
				$scope.setStatus = function (activeStatus) {
					$scope.csr.activeStatus = activeStatus;
				};
			
				$scope.init();
				angular.element('#employeeId').focus();
			}
			
		]);
}(window.angular));
