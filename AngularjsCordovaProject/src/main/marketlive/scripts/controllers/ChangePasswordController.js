/*! ChangePasswordController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('changePasswordController',
		['$scope', '$location', 'dataStorageService', 'csrService', '$translate',

			function ($scope, $location, dataStorageService, csrService, $translate) {

				$scope.changePasswordModel = {
					currentPassword : null,
					newPassword : null,
					confirmPassword : null,
					showChangePasswordFailureMessage : false,
					changePasswordFailureMessage : null,
					inputType : 'text'

				};

				/**
				 * Save changed password.
				 */
				$scope.changePassword = function (changePasswordModel) {
					var isValid = validatePasswords(changePasswordModel);
					if (isValid) {
						var csrObject = dataStorageService.getLoggedInCSR();
						var csrId = csrObject.id;
						var csrObjectToUpdate = {
							'passwordOld' : changePasswordModel.currentPassword,
							'passwordNew' : changePasswordModel.newPassword,
							'passwordNewConfirm' : changePasswordModel.confirmPassword
						};
						csrService.updateCSRPassword(csrId, csrObjectToUpdate)	
						.then(
							function (successResult) {
								console.log(successResult);
								showMessage('msg.ppos.passwordChanged','');
								clearPasswords();
								angular.element('#currentPassword').focus();
								if(angular.element('#divMsgIconContainer').hasClass('ml-icon-error')) {
									angular.element('#divMsgIconContainer').removeClass('ml-icon-error');
									angular.element('#divMsgIconContainer').addClass('ml-icon-success');
								}
							}, function (errorResult) {
								var invalidInputErrorMessage = errorResult.data.error.error;
								var errorMessage = errorResult.data.errorMessage.CSR;
								if (errorResult.data.responseCode === '422') {
									if (errorMessage !== undefined && 
												 errorMessage.includes('password confirmation') > 0) {
										  showMessage('msg.ppos.passwordNotMatch','newPassword');
									} else if (errorMessage !== undefined && 
													errorMessage.includes('password incorrect.') > 0) {
										  showMessage('msg.ppos.currentPasswordMismatch','currentPassword');
									} else if (errorMessage !== undefined && 
													errorMessage.includes('same as old password') > 0) {
										  showMessage('msg.ppos.currentNewPasswordSame','newPassword');
									} else if (invalidInputErrorMessage !== undefined &&
													invalidInputErrorMessage.includes('missing input data') > 0) {
	   									  showMessage('msg.ppos.invalidPassword','currentPassword');
									}
								} else {
								   showMessage('msg.ppos.csrPasswordChangeError','currentPassword');
								   console.log('ErrorResult - An error occurred while changing password : '+errorResult);
								}
								
						  });
					}

				};

				/**
				 * Toggling of password character display according to selected type, 
				 * like display of entered password characters in text or masked (astrix) characters.
				 *
				 */
				$scope.showHidePassword = function(showHideType){
				    if (showHideType === 'text') {
					    $scope.changePasswordModel.inputType = 'text';
					}
				    else if (showHideType === 'masked') {
					    $scope.changePasswordModel.inputType = 'password';
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

				/**
				 * Clears password fields.
				 */
				function clearPasswords () {
					$scope.changePasswordModel = {
						currentPassword : null,
						newPassword : null,
						confirmPassword : null,
						showChangePasswordFailureMessage : false
					};
				}

				/**
				* Validate CSR fields
				*/
				function validatePasswords (changePasswordModel) {
					if (!changePasswordModel.currentPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.password','currentPassword');
						return false;
					} else if (!changePasswordModel.newPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.newPassword','newPassword');
						return false;
					} else if (!changePasswordModel.confirmPassword) {
						createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword','confirmPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.currentPassword)) {
						showMessage('msg.ppos.invalidPassword','currentPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.newPassword)) {
						showMessage('msg.ppos.invalidPassword','newPassword');
						return false;
					} else if (!isPasswordValid(changePasswordModel.confirmPassword)) {
						showMessage('msg.ppos.invalidPassword','confirmPassword');
						return false;
					} else if (changePasswordModel.newPassword !== changePasswordModel.confirmPassword) {
						showMessage('msg.ppos.passwordNotMatch','newPassword');
						return false;
					} else if (changePasswordModel.currentPassword === changePasswordModel.newPassword) {
						showMessage('msg.ppos.currentNewPasswordSame','newPassword');
						return false;
					}
					return true;
				}

				/**
				Method to check if password is valid, a combination of characters & digits.
				*/

				function isPasswordValid(password) {
					if (password.length < 7 || password.length > 50) {
						return false;
					} else if (!password.match(/(([0-9]+[a-zA-Z]+)|([a-zA-Z]+[0-9]+))([a-zA-Z0-9]*)/)) {
			  			return false;			
  					}
					return true;
				}

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				function showMessage (msgPath, elementIdToFocus) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						$scope.changePasswordModel.showChangePasswordFailureMessage = true;
						$scope.changePasswordModel.changePasswordFailureMessage = msg;
						angular.element('#' + elementIdToFocus).focus();
					});
				}

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				function createEmptyFieldMsgAndDisplay (fieldNamePath, elementIdToFocus) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							$scope.changePasswordModel.showChangePasswordFailureMessage = true;
							$scope.changePasswordModel.changePasswordFailureMessage = genericMessage;
							angular.element('#' + elementIdToFocus).focus();
						});
					});
				}
				angular.element('#currentPassword').focus();
			}]);
}(window.angular));