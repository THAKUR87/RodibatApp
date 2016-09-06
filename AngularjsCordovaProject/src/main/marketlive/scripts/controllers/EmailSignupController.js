/*! EmailSignupController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('emailSignupController',
        ['$log', '$scope', '$translate', 'ancillaryService', 'globalValidationService',
		function ($log, $scope, $translate, ancillaryService, globalValidationService) {

			$scope.emailSignupDataModel = {
				hasValidationErrors : false,
				validationErrors : [],
				email : '',
				firstName : '',
				lastName : ''
			};

			$scope.initializeEmailSignupDataModel = function () {
				$scope.emailSignupDataModel.hasValidationErrors = false;
				$scope.emailSignupDataModel.validationErrors = [];
				$scope.emailSignupDataModel.email = '';
				$scope.emailSignupDataModel.firstName = '';
				$scope.emailSignupDataModel.lastName = '';
			};

			$scope.emailSignup = function () {
				// Assume there are no validation errors.
				$scope.emailSignupDataModel.hasValidationErrors = false;
				$scope.emailSignupDataModel.validationErrors = [];

				var isValid = $scope.validateEmailSignupFields();

				if (isValid) {
					var emailSignup = {
						email : $scope.emailSignupDataModel.email,
						firstName : $scope.emailSignupDataModel.firstName,
						lastName : $scope.emailSignupDataModel.lastName
					};
					
					ancillaryService.emailSignup(emailSignup)
						.then(
						function (successResult) {
							if (successResult) {
								$scope.initializeEmailSignupDataModel();

								angular.element('#emailSignupSuccessModal').modal('show');
							}
						}, function (errorResult) {
							$log.error(errorResult);

							if (errorResult.data.responseCode === '422') {
								$scope.emailSignupDataModel.hasValidationErrors = true;

								var errorMessageObj = errorResult.data.errorMessage;

								// Here, 'property' is field name.
								for (var property in errorMessageObj) {
									if (errorMessageObj.hasOwnProperty(property)) {

										var errorMessagesByField = errorMessageObj[property];

										for (var i = 0; i < errorMessagesByField.length; i++) {
											$scope.emailSignupDataModel.validationErrors.push(
												property + ' - ' + errorMessagesByField[i]);
										}

									}
								}
								
								angular.element('#emailSignupErrorModal').modal('show');
							}
						});
				} else {
					$scope.emailSignupDataModel.hasValidationErrors = true;

					angular.element('#emailSignupErrorModal').modal('show');
				}
			};

			$scope.validateEmailSignupFields = function () {
				var hasValidationErrors = false;

				// Email validation.
				if (angular.element('#emailId').hasClass('ng-invalid-email')) {
					// TODO: This is a hack... PEBL-15808

					// Invalid email format as per HTML5 and AngularJS.
					hasValidationErrors = true;
					
					$translate('msg.ppos.invalidEmail').
						then(function (invalidEmailMessage) {
							$scope.emailSignupDataModel.validationErrors.push(invalidEmailMessage);
						});
				} else if ($scope.emailSignupDataModel.email) {
					if (!globalValidationService.isEmailValid($scope.emailSignupDataModel.email)) {
						// Invalid email format as per MarketLive client side validation.
						hasValidationErrors = true;

						$translate('msg.ppos.invalidEmail').
							then(function (invalidEmailMessage) {
								$scope.emailSignupDataModel.validationErrors.push(invalidEmailMessage);
							});
					}
				} else if (!$scope.emailSignupDataModel.email) {
					hasValidationErrors = true;

					$translate('lbl.ppos.email').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (emailRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(emailRequiredMessage);
								});
						});
				}

				// First name validation - required.
				if (!$scope.emailSignupDataModel.firstName) {
					hasValidationErrors = true;

					$translate('lbl.ppos.firstName').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (firstNameRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(firstNameRequiredMessage);
								});
						});
				}

				// Last name validation - required.
				if (!$scope.emailSignupDataModel.lastName) {
					hasValidationErrors = true;

					$translate('lbl.ppos.lastName').
						then(function (fieldNameVal) {
							$translate('msg.ppos.isRequiredField', { fieldName : fieldNameVal}).
								then(function (lastNameRequiredMessage) {
									$scope.emailSignupDataModel.validationErrors.push(lastNameRequiredMessage);
								});
						});
				}

				if (hasValidationErrors) {
					$scope.emailSignupDataModel.hasValidationErrors = true;
					return false;
				} else {
					return true;
				}
			};

			// Initialize model for view.
			$scope.initializeEmailSignupDataModel();
        }]);
}(window.angular));
