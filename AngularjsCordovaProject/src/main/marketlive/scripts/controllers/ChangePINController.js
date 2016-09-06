/*! ChangePINController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('changePinController',
		['$scope', '$location', 'dataStorageService', 'csrService', '$translate', '$log',

			function ($scope, $location, dataStorageService, csrService, $translate, $log) {

				$scope.init = function () {
				var loggedInCSR = dataStorageService.getLoggedInCSR();
					if (loggedInCSR && loggedInCSR.email) {
						csrService.getCSRByEmail(loggedInCSR.email).then(
						function (successResult) {
							$scope.changePinModel.csrJsonBeforeSave = successResult.data;
							dataStorageService.setLoggedInCSR(successResult.data);
						}, function (errorResult) {
							$scope.changePinModel.csrJsonBeforeSave = null;
							$log.error('ErrorResult - An error occurred while getting CSR : ' + errorResult);
						});
					}
				};

				$scope.changePinModel = {
					csrJsonBeforeSave : null,
					currentPin : null,
					newPin : null,
					confirmPin : null,
					showMessage : false,
					message : null,
					inputType : 'text'
				};

				/**
				 * Save changed PIN.
				 */
				$scope.changePIN = function (changePinModel) {
					if (changePinModel.csrJsonBeforeSave !== null) {
						var isValid = validatePINs(changePinModel);
						if(isValid) {
							// Make Rest Call to save new PIN
							var csrStores = [];
							csrStores.push(dataStorageService.getStoreId());
							var csrToModify = {
								'firstName' : changePinModel.csrJsonBeforeSave.firstName,
								'lastName' : changePinModel.csrJsonBeforeSave.lastName,
								'status' : changePinModel.csrJsonBeforeSave.active,
								'employeeID' : changePinModel.csrJsonBeforeSave.employeeID,
								'email' : changePinModel.csrJsonBeforeSave.email,
								'pin' : changePinModel.newPin,
								'stores' : csrStores,
								'codeCSRType' : changePinModel.csrJsonBeforeSave.typePPOS
							};
							csrService.updateCSR(changePinModel.csrJsonBeforeSave.id, csrToModify).then(
								function (successResult) {
									$log.info('CSR Modified ' + successResult);
									clearPINs();
									showMessage('msg.ppos.pinChanged');
									if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
										angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
										angular.element('#divMsgIconContainer').addClass('ml-icon-success');
									}
									// Re-init so that if user wants to change again without refresh, 
									// then it has latest values, also for screen lock/unlock
									$scope.init();
								}, function (errorResult) {
									$log.error('ErrorResult - An error occurred while changing CSR PIN: ' + errorResult);
									showMessage('msg.ppos.pinNotChanged','currentPin');
								}
							);
						}
					} else {
						$log.error('ErrorResult - An error occurred while changing CSR PIN');
						showMessage('msg.ppos.pinNotChanged','currentPin');
					}
				};

				/**
				 * Toggling of password character display according to selected type, 
				 * like display of entered password characters in text or masked (astrix) characters.
				 *
				 */
				$scope.showHidePin = function(showHideType){
				    if (showHideType === 'text') {
					    $scope.changePinModel.inputType = 'text';
					}
				    else if (showHideType === 'masked') {
					    $scope.changePinModel.inputType = 'password';
					}
			    };

				/**
				 * Navigate to profile dashboard page if user clicks on cancel button.
				 *
				 */
				$scope.openDashboardPage = function () {
					// Navigate to dashboard.
					$location.path('/dashboard');
				};
				
				$scope.isNumber = function (elementId, elementValue) {
					if(null != elementValue && !elementValue.match(/^[0-9]+$/)) {
						return false;
					} else {
						return true;
					}
				};

				/**
				 * Clears password fields.
				 */
				function clearPINs () {
					$scope.changePinModel.currentPin = null;
					$scope.changePinModel.newPin = null;
					$scope.changePinModel.confirmPin = null;
				}

				/**
				* Validate CSR fields
				*/
				function validatePINs (changePinModel) {
					//TODO $viewValue is not working for failed patterns
					// Thats why using undefined check
					if (changePinModel.currentPin === undefined) {
						showMessage('msg.ppos.invalidCurrentAccessPIN');
						return false;
					} else if (changePinModel.newPin === undefined) {
						showMessage('msg.ppos.invalidNewAccessPIN');
						return false;
					} else if (changePinModel.confirmPin === undefined) {
						showMessage('msg.ppos.invalidConfirmAccessPIN');
						return false;
					} else if (!changePinModel.currentPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.currentAccessPin');
						return false;
					} else if (!changePinModel.newPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.newAccessPin');
						return false;
					} else if (!changePinModel.confirmPin) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.confirmAccessPin');
						return false;
					} else if (!$scope.isNumber(changePinModel.currentPin) || 
							changePinModel.currentPin.length !== 6) {
						showMessage('msg.ppos.invalidCurrentAccessPIN');
						return false;
					} else if (!$scope.isNumber(changePinModel.newPin) || 
							changePinModel.newPin.length !== 6) {
						showMessage('msg.ppos.invalidNewAccessPIN');
						return false;
					} else if (!$scope.isNumber(changePinModel.confirmPin) || 
							changePinModel.confirmPin.length !== 6) {
						showMessage('msg.ppos.invalidConfirmAccessPIN');
						return false;
					} else if (changePinModel.newPin !== changePinModel.confirmPin) {
						showMessage('msg.ppos.pinNotMatch');
						return false;
					} else if (changePinModel.currentPin === changePinModel.newPin) {
						showMessage('msg.ppos.currentNewPinSame');
						return false;
					} else if (changePinModel.csrJsonBeforeSave && changePinModel.csrJsonBeforeSave.pin 	&& 
						changePinModel.csrJsonBeforeSave.pin !== changePinModel.currentPin) {
						showMessage('msg.ppos.currentPinNoMatch');
						return false;
					}
					return true;
				}

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				function showMessage (msgPath) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						$scope.changePinModel.showMessage = true;
						$scope.changePinModel.message = msg;
						angular.element('#save').focus();
					});
				}

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				function createEmptyFieldMsgAndDisplay (fieldNamePath) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							$scope.changePinModel.showMessage = true;
							$scope.changePinModel.message = genericMessage;
							angular.element('#save').focus();
						});
					});
				}

				$scope.init();
				angular.element('#currentPin').focus();
			}]);
}(window.angular));