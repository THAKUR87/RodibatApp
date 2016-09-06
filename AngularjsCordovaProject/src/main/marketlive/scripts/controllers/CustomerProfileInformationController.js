/*! CustomerProfileInformationController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('customerProfileInformationController',
		['$log', '$scope', '$location', '$q', 'dataStorageService', 'accountService', 'appService',
				'customerSearchService', '$translate', 'globalValidationService', 'newOrderService',
			function ($log, $scope, $location, $q, dataStorageService, accountService, appService,
				customerSearchService, $translate, globalValidationService, newOrderService) {

			$scope.customerDO = {
				id : '',
				accountSet : '',
				phoneNumber : '',
				firstName : '',
				lastName : '',
				email : '',
				userName : '',
				password : '',
				confirmPassword : '',
				securityQuestions : [],
				hint : '-1',
				hintAnswer : '',
				guest : true,
				showOpFailureMessage : false,
				opFailureMessage : null,
				street1 : dataStorageService.getStore().street1,
				city : dataStorageService.getStore().city,
				state : dataStorageService.getStore().country + '/' + dataStorageService.getStore().state,
				country : dataStorageService.getStore().country,
				postalCode : dataStorageService.getStore().zipCode
			};

			$scope.fromPage = '';

			$scope.customerSearchDataModel = {
				customerPhoneNumber : null,
				customerEmail : null,
				existingPhoneCustomerResult : null,
				existingEmailCustomerResult : null
			};
			
			$scope.primaryContact = '';
			$scope.customerID = '';
				
			$scope.customerProfileInformationModal = function (fromPage) {
				$scope.customerFormDiv = false;
				$scope.fromPage = fromPage;

				if ($scope.fromPage === 'update') {
					$scope.initCustomerProfileInformationModal().then(function(response){
						if (response) {
							angular.element('#customerProfileInformation').modal('show');			
						}
					});
				} else if($scope.fromPage === 'dashboard') {
					$scope.initCustomerProfileInformationModalNewCustomer();
					angular.element('#customerProfileInformation').modal('show');
				}
			};

			$scope.closeProfileInformationModal = function () {
				clearCustomerData();
				$('input').blur();
				$('select').blur();
				angular.element('#customerProfileInformation').modal('hide');
			};

			$scope.initCustomerProfileInformationModal = function () {
				clearCustomerData();
				if (dataStorageService.getCustomerId())	{
					return getCustomerData(dataStorageService.getCustomerId());
				}
			};

			$scope.initCustomerProfileInformationModalNewCustomer = function () {
				clearCustomerData();
				$scope.initSecurityQuestions();
			};

			// populate security questions
			$scope.initSecurityQuestions = function () {
				var deferred = $q.defer();
				$translate('Select a recovery question').then(function (translatedValue) {
					var optQuestion;
					optQuestion = {
						'id' : '-1',
						'question' : translatedValue
					};
					$scope.customerDO.securityQuestions.push(optQuestion);
					accountService.getSecurityQuestions().then(function (successResult) {
						for(var index = 0; index < successResult.data.length; index++) {
							optQuestion = {
								'id' : successResult.data[index].id,
								'question' : successResult.data[index].question
							};
							$scope.customerDO.securityQuestions.push(optQuestion);
						}
						deferred.resolve(successResult.data);
					}, function(errorResult) {
						$log.error(errorResult);
						deferred.reject(errorResult);
					});
				});
				return deferred.promise;
			};

			/**
			 * Save/Update Customer.
			*/
			$scope.saveOrUpdateCustomer = function (customerDO) {
				var isValid = validateCustomerProfileInformation(customerDO);
				if (isValid) {
					appService.activateSpinner();
					
					$scope.customerSearchDataModel.customerPhoneNumber = customerDO.phoneNumber;
					$scope.customerSearchDataModel.customerEmail = customerDO.email;
					//Check for firstName and lastName
					//If firstName and lastName not provided
					//We use email as firstName and lastName
					if (customerDO.firstName === '' || customerDO.firstName === 'Guest') {
						customerDO.firstName = customerDO.email;
					}

					if (customerDO.lastName === '' || customerDO.lastName === 'Guest') {
						customerDO.lastName = customerDO.email;
					}
					$scope.customerSearchDataModel.existingPhoneCustomerResult = null;
					$scope.customerSearchDataModel.existingEmailCustomerResult = null;
					$scope.existingPhoneCustomerInformation = true;
					$scope.existingEmailCustomerInformation = true;					
					customerSearchService.searchCustomerByEmail(customerDO.email)
						.then(
						function (successResult) {
							removeCurrentCustomer(successResult);
							if (successResult.data.length > 0) {
								$scope.customerFormDiv = true;
								$scope.customerSearchDataModel.existingEmailCustomerResult = successResult;
								$scope.customerSearchDataModel.existingEmail = customerDO.email;
							} else {
								saveUpdateCustomer(customerDO);								
							}	
							appService.deactivateSpinner();
						}, function (errorResult) {
							$log.error(errorResult);
							customerSearchService.searchCustomerByPhoneNumber(customerDO.phoneNumber)
								.then(
								function (successResult) {								   
									removeCurrentCustomer(successResult);
									if (successResult.data.length > 0) {
										$scope.customerFormDiv = true;
										$scope.customerSearchDataModel.existingPhoneCustomerResult = successResult;
										appService.deactivateSpinner();
									} else {
										saveUpdateCustomer(customerDO);								
									}
								}, function (errorResult) {
									$log.error(errorResult);
									saveUpdateCustomer(customerDO);
									appService.deactivateSpinner();							
							});
							appService.deactivateSpinner();	
					});
					
				}
			};

			/**
			* removes current customer from 
			**/
			function removeCurrentCustomer (successResult) {
				for (var idx = 0;idx < successResult.data.length ; idx++) {
					if ($scope.customerID === successResult.data[idx].id) {
						successResult.data.splice(idx, 1);
						break;
					}
				}
			}

			function saveUpdateCustomer (customerDO) {
				if ($scope.fromPage === 'update') {
					$scope.updateCustomer(customerDO);
				} else if ($scope.fromPage === 'dashboard') { 
					$scope.saveCustomer(customerDO);
				}
			}

			$scope.closeSearchModal = function () {
				$scope.customerSearchDataModel.existingEmailCustomerResult = null;
				$scope.customerSearchDataModel.existingPhoneCustomerResult = null;
				$scope.customerFormDiv = false; 
			};

			/**
			 * Get customer detail by given ID.
			**/
			function getCustomerData (customerId) {
				var defer = $q.defer();
				$scope.initSecurityQuestions().then(function (successResult) {
					$log.info('Security questions loaded ' + successResult);
					accountService.getCustomerById(customerId).then(
					function (successResult) {
						$scope.customerID = successResult.data.id;
						$scope.customerDO.accountSet = successResult.data.accountSet;
						if (successResult.data.primaryContact.id) {
							$scope.primaryContact = successResult.data.primaryContact.id;
							$scope.customerDO.hintAnswer = successResult.data.hintAnswer;
							// Set selected question from list
							if (null !== successResult.data.hintQuestion)	{
								for(var queIdx = 0; 
									queIdx < $scope.customerDO.securityQuestions.length; queIdx++) {
									if ($scope.customerDO.securityQuestions[queIdx].question === 
										successResult.data.hintQuestion) {
										$scope.customerDO.hint = $scope.customerDO.securityQuestions[queIdx].id;
										break;
									}
								}
							}
							accountService.getContactById(successResult.data.primaryContact.id)
								.then(
								function (successResult) {								
								 //Check if return contact is not a guest
								if (!successResult.data.guest) {
									$scope.customerDO.phoneNumber = successResult.data.phone1;
									$scope.customerDO.firstName = successResult.data.person.firstName;
									$scope.customerDO.lastName = successResult.data.person.lastName;
									$scope.customerDO.email = successResult.data.email;
									$scope.customerDO.street1 = successResult.data.address.street1;
									$scope.customerDO.city = successResult.data.address.city;
									$scope.customerDO.state = successResult.data.address.state;
									$scope.customerDO.country = successResult.data.address.country;
									$scope.customerDO.postalCode = successResult.data.address.postalCode;
								}
								defer.resolve(true);
								}, function (errorResult) {
									defer.reject(false);
									$log.error('Error while getting contact information ' + errorResult);
								});
						}
					}, function (errorResult) {
						defer.reject(false);
						$log.error('Error while getting customer information ' + errorResult);
					});
				}, function (errorResult) {
					defer.reject(false);
					$log.info('Error while loading security questions ' + errorResult);
				});
				return defer.promise;
			}

			/**
			 * Get customer detail by given ID.
			 */
			function setAddressAndAccountSet (customerId) {
				var defer = $q.defer();
				accountService.getCustomerById(customerId).then(
					function (successResult) {
						$scope.customerID = successResult.data.id;
						$scope.customerDO.id = successResult.data.id;
						$scope.customerDO.accountSet = successResult.data.accountSet;
						if (successResult.data.primaryContact.id) {
							$scope.primaryContact = successResult.data.primaryContact.id;
							accountService.getContactById(successResult.data.primaryContact.id)
								.then(
								function (successResult) {								
								 //Check if return contact is not a guest
								if (!successResult.data.guest) {
									$scope.customerDO.street1 = successResult.data.address.street1;
									$scope.customerDO.city = successResult.data.address.city;
									$scope.customerDO.state = successResult.data.address.state;
									$scope.customerDO.country = successResult.data.address.country;
									$scope.customerDO.postalCode = successResult.data.address.postalCode;
								}
									defer.resolve(true);
								}, function (errorResult) {
									defer.reject(false);
									$log.error(errorResult);
								});
						}
					}, function (errorResult) {
						$log.error(errorResult);
					}); 
					return defer.promise;
			}

			/**
			 * Validate customer fields
			*/ 
			function validateCustomerProfileInformation (customerDO) {
				$scope.customerDO.showOpFailureMessage = false;
				$scope.customerDO.opFailureMessage = '';
				if (!customerDO.phoneNumber) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.phoneNumber');
					return false;
				} else if (!globalValidationService.isValidPhoneNumber(customerDO.phoneNumber)) {
					$scope.showMessageAndFocus('msg.ppos.invalidPhoneNumber');
					return false;
				}if (!customerDO.firstName) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName');
					return false;
				} else if (!customerDO.lastName) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName');
					return false;
				} else if (customerDO.email === undefined || !customerDO.email ||
						!globalValidationService.isEmailValid(customerDO.email)) {
					$scope.showMessageAndFocus('msg.ppos.invalidEmail');
					return false;
				} else if (!customerDO.password) { 
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.password');
					return false;
				} else if (!customerDO.confirmPassword) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.reEnterPassword');
					return false;
				} else if (customerDO.password !== customerDO.confirmPassword) {
					$scope.showMessageAndFocus('msg.ppos.passwordNotMatch');
					return false;
				} else if (!globalValidationService.isPasswordValid(customerDO.password)) {
					$scope.showMessageAndFocus('msg.ppos.invalidPassword'); 
					return false;
				} else if (!customerDO.hint || customerDO.hint === '-1') {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.securityQuestion');
					return false;
				} else if (!customerDO.hintAnswer) {
					$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.securityAnswer');
					return false;
				}
				return true;
			}

			/**
			This method accepts two resource path
			1. First parameter is the path of resource that is a generic message for blank field.
			2. Second parameter is the field name for which an empty value is detected, a label can be passed as well
			3. Third parameter is the id of the html element on which the focus needs to be placed.
			*/
			$scope.createEmptyFieldMsgAndDisplay = function (fieldNamePath) {
				$translate(fieldNamePath).
				then(function (fieldNameVal) {
					$translate('msg.ppos.isRequiredField', { fieldName :  fieldNameVal}).
					then(function (genericMessage) {
						$scope.customerDO.showOpFailureMessage = true;
						$scope.customerDO.opFailureMessage = genericMessage;
						angular.element('#btnCloseCustomerProfileModal').focus();
					});
				});
			};

			/**
			This method accepts a resource path and element id,
			it displays the value of resource as error, and focus on element
			*/
			$scope.showMessageAndFocus = function (msgPath) {
				$translate(msgPath).
				then(function (msg) {
					$scope.customerDO.showOpFailureMessage = true;
					$scope.customerDO.opFailureMessage = msg;
					angular.element('#btnCloseCustomerProfileModal').focus();
				});
			};
			
			//function to prepare contact detail
			function prepareContactDetail (customerDO) {
				var contactDetail = {
					'phone1' : customerDO.phoneNumber,
					'email' : customerDO.email,
					'person' : {
						'firstName' : customerDO.firstName,
						'lastName' :customerDO.lastName
					},
					'address' : {
						'street1' : $scope.customerDO.street1,
						'city' : $scope.customerDO.city,
						'state' : $scope.customerDO.state,
						'country' : $scope.customerDO.country,
						'postalCode' : $scope.customerDO.postalCode
					}
				};
				return contactDetail;
			}

			/**
			 * Clears customer search data.
			 */
			function clearCustomerData () {
				$scope.customerDO.phoneNumber = null;
				$scope.customerDO.firstName = null;
				$scope.customerDO.lastName = null;
				$scope.customerDO.email= null;
				$scope.customerDO.password = null;
				$scope.customerDO.confirmPassword = null;
				$scope.customerDO.securityQuestions = [];
				$scope.customerDO.hint = '-1';
				$scope.customerDO.hintAnswer = null;
				$scope.customerDO.showOpFailureMessage = false;
				$scope.customerDO.opFailureMessage= null;
				$scope.primaryContact = null;
				$scope.customerID = null;
				$scope.customerSearchDataModel = {
					customerPhoneNumber : null,
					existingPhoneCustomerResult : null
				};
				$scope.existingPhoneCustomerInformation = true;
				$scope.existingEmailCustomerInformation = true;
			}

			/**
			* update selected contact from existing customer list.
			**/
			$scope.updateSelectedContact = function (customerId, contactId, customerDO) {
				dataStorageService.setCustomerId(customerId);
				customerDO.id = customerId;
				var defer = $q.defer();				
				setAddressAndAccountSet(customerId).then (
					function (successResult) {
						$log.info('Updated customer : '+successResult);
						$scope.primaryContact = contactId;
						customerDO.accountSet = $scope.customerDO.accountSet;
						$scope.updateCustomer(customerDO); 
					}, function (errorResult) {									
						$log.error('error during updating customer : '+errorResult);
				});
				$log.info(defer);
			};
			
			/**
			 * Updating a customer
			 * @param: customerDO
			 */
			$scope.updateCustomer = function (customerDO) {
				//Setting customer data
				$scope.customerDO.userName = customerDO.email;
				$scope.customerDO.guest = false;
				customerDO.id = dataStorageService.getCustomerId();
				//updating current customer
				accountService.updateCustomer(dataStorageService.getCustomerId(), customerDO).then(
					function (successResult) {
						$log.info('Customer with customerID: ' +
						dataStorageService.getCustomerId()  + ' is successfully updated ' + successResult);
						//update contact
						if ($scope.primaryContact) {
							accountService.getContactById($scope.primaryContact)
								.then(
								function (successResult) {
									var contactJSON = prepareContactDetail(customerDO);
									accountService.updateContact(dataStorageService.getCustomerId(),
										$scope.primaryContact, contactJSON).then(
										function (successResult) {
											$location.path('/basket');
											// Reload basket
											$scope.$emit('reloadBasket');
											// Hide customer search modal.
											$scope.closeProfileInformationModal();
											$log.info(successResult);
											appService.deactivateSpinner();
										}, function (errorResult) {
											$scope.showServerError(errorResult);
											$log.error('Contact with ContactID: ' +
											$scope.primaryContact  + ' is not updated ' +
											errorResult.data.errorMessage);
											appService.deactivateSpinner();
										});
									$log.info(successResult);
								}, function (errorResult) {	
									$scope.showServerError(errorResult);
									$log.error('Contact with ContactID: ' +
									$scope.primaryContact  + ' is not updated ' + errorResult.data.errorMessage);
									appService.deactivateSpinner();
								}); 
						} else {
							appService.deactivateSpinner();
						}
					}, function (errorResult) {
						appService.deactivateSpinner();
						$scope.showServerError(errorResult);
					});
			};

			$scope.showServerError = function(errorResult) {
				var errorMessage = errorResult.data.errorMessage;
				var msg = '';  var serverMsg = '';
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
					$scope.showMessageAndFocus(msg);
				}
			};

			/**
			 * Saving a customer
			 * @param: customerDO
			 */
			$scope.saveCustomer = function (customerDO) {
				//Updating customer if this is called from update
				if ($scope.fromPage === 'update') { 
					$scope.updateCustomer(customerDO);
					return;
				}
				//Setting customer data
				$scope.customerDO.userName = customerDO.email;
				$scope.customerDO.guest = false;
				//To-Do
				$scope.customerDO.accountSet = '1';
				//updating current customer
				accountService.createCustomer(customerDO).then(
					function (successResult) {
						var customerId = getCustomerIdFromCustomerURI(successResult.data);
						//Creating contact
						if (successResult) {
							var contactJSON = prepareContactDetail(customerDO);
							contactJSON.primary = true;
							accountService.createContact(customerId, contactJSON).then(
								function (successResult) {
									var storeId = dataStorageService.getStore().id;
									var csrId = dataStorageService.getLoggedInCSR().id;
									var phone = customerDO.phoneNumber;
									//Set newly created customer in dataStorageService
									dataStorageService.setCustomerId(customerId);
									newOrderService.startNewOrder (customerId, storeId, csrId, phone)
										.then(
										function (successResult) {
												// Navigate to basket page.
												$scope.$emit('reloadBasket');
												$location.path('/basket');
												appService.deactivateSpinner();
												$log.info(successResult);
												$scope.closeProfileInformationModal();
										}, function (errorResult) {
											appService.deactivateSpinner();
											$scope.showServerError(errorResult);
											$log.error('An error occured while starting new Order.' + errorResult);
										});
									$log.info(successResult);
								}, function (errorResult) {
									$scope.showServerError(errorResult);
									$log.error('Not able to create contact for customer ' +
										customerId + errorResult.data.errorMessage);
									appService.deactivateSpinner();
								});
								$log.info(successResult); 
						}
					}, function (errorResult) {
						$scope.showServerError(errorResult);
						appService.deactivateSpinner();
						$log.error(errorResult.data.errorMessage);
				});
			};
			
			/**
			 * Function to get CustomerId from customerURI
			 */
			function getCustomerIdFromCustomerURI (customerURI) {
				var position = customerURI.lastIndexOf('/');
				var customerId = customerURI.substring(position + 1, customerURI.length);
				return customerId;
			}

	}]);

}(window.angular));
