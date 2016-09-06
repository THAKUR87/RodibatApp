/*! GlobalValidationService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('globalValidationService',
		function () {
    
		return {

			/**
			* Method to check if the email is valid.
			*/
			isEmailValid : function (email) {
				if (!email.match(/(\w+[\w|\.|-]*\w+)(@\w+[\w|\.|-]*\w+\.\w{2,4})/)) {
					return false;			
				} 
				return true;
			},

			/**
			* Method to check if password is valid, a combination of characters & digits.
			*/
			isPasswordValid : function (password) {
				if (password.length < 7 || password.length > 50) {
					return false;
				} else if (!password.match(/(([0-9]+[a-zA-Z]+)|([a-zA-Z]+[0-9]+))([a-zA-Z0-9]*)/)) {
					return false;			
				}
				return true;
			},

			/**
			* Method to check if the passed argument is a digit
			*/
			isNumber : function(txtToCheck) {
				if(null != txtToCheck && txtToCheck.match(/^[0-9]+$/)) {
					return true;
				} else {
					return false;
				}
			},
			
			/**
			* Method to check if phone number is valid.
			*/
			isValidPhoneNumber : function (phoneNumber) {				
				/*var isPhoneNumberRegularExpression = /^\d{10}$/;
				return String(phoneNumber).search(isPhoneNumberRegularExpression) !== -1;*/
				var onlyNumbers = phoneNumber.replace(/\D/g, '');
				if (onlyNumbers.length < 10 || onlyNumbers.length > 20) {
					return false;
				} else {
					var phoneRegEx = new RegExp(/^[- +()]*[0-9][- +()0-9]*$/);
					return phoneRegEx.test(phoneNumber);
				}
			},

			/**
			This method accepts a postal code
			and returns true if the postal code is valid
			*/
			isValidPostalCode : function (postalCode, countryCode) {
				if (postalCode.length < 5 || postalCode.length > 15) {
					return false;
				}
				var caRegex = 
					new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
				var usRegex = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
				if (countryCode === 'US' || countryCode === 'CA') {
					if (countryCode === 'US') {
						return usRegex.test(postalCode);
					} else if (countryCode === 'CA') {
						return caRegex.test(postalCode);
					}
				} else {
					return true;
				}
			}

		};
	});
}(window.angular));

