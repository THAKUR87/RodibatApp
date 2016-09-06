
/*! GlobalValidationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('csrValidationService',
		['globalValidationService', '$translate',
		function (globalValidationService, $translate) {
    
		return {

				/**
				* Validate CSR fields
				*/
				validateCSR : function (csr, addOrEdit) {
					if (!csr.firstName) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName', csr);
						return false;
					} else if (!csr.lastName) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName', csr);
						return false;
					} else if (csr.email === undefined || !csr.email ||
						!globalValidationService.isEmailValid(csr.email)) {
						this.showMessageAndFocus('msg.ppos.invalidEmail', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.password) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.password', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.confirmPassword) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword', csr);
						return false;
					} else if (addOrEdit === 'add' && csr.password !== csr.confirmPassword) {
						this.showMessageAndFocus('msg.ppos.passwordNotMatch', csr);
						return false;
					} else if (addOrEdit === 'add' && !globalValidationService.isPasswordValid(csr.password)) {
						this.showMessageAndFocus('msg.ppos.invalidPassword', csr);
						return false;
					} else if (addOrEdit === 'add' && !csr.unlockPosPin) {
						this.createEmptyFieldMsgAndDisplay('lbl.ppos.unlockPosPIN', csr);
						return false;
					} else if (addOrEdit === 'add' && csr.unlockPosPin.length !== 6) {
						if (csr.pin1 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else  if (csr.pin2 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin3 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin4 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin5 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						} else if (csr.pin6 === '') {
							this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
							return false;
						}
					} else if (addOrEdit === 'add' && csr.unlockPosPin === '000000') {
						this.showMessageAndFocus('msg.ppos.invalidUnlockPIN', csr);
						return false;
					} else if (!csr.selectedRole) {
						this.showMessageAndFocus('msg.ppos.invalidRole', csr);
						return false;
					}
					return true;
				},

				/**
				This method accepts two resource path
				1. First parameter is the path of resource that is a generic message for blank field.
				2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
				3. Third parameter is the id of the html element on which the focus needs to be placed.
				*/
				createEmptyFieldMsgAndDisplay : function (fieldNamePath, csr) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(fieldNamePath).
					then(function (fieldNameVal) {
						$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
						then(function (genericMessage) {
							csr.showCsrOpFailureMessage = true;
							csr.csrOpFailureMessage = genericMessage;
							angular.element('#saveButton').focus();
						});
					});
				},
				
				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				showMessageAndFocus : function (msgPath, csr) {
					if(angular.element('#divMsgIconContainer').hasClass('ml-icon-success')) {
						angular.element('#divMsgIconContainer').removeClass('ml-icon-success');
						angular.element('#divMsgIconContainer').addClass('ml-icon-error');
					}
					$translate(msgPath).
					then(function (msg) {
						csr.showCsrOpFailureMessage = true;
						csr.csrOpFailureMessage = msg;
						angular.element('#saveButton').focus();
					});
				}

		};
	}]);
}(window.angular));
