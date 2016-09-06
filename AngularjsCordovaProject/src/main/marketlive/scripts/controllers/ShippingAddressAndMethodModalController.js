/*! ShippingAddressAndMethodModalController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').controller('shippingAddressAndMethodModalController', 
		['$scope', 'dataStorageService', 'accountService', '$log', '$translate', 'appService',
			'globalValidationService', 'basketService', 'shippingService', '$timeout', '$q',

			function ($scope, dataStorageService, accountService, $log, $translate, appService,
				globalValidationService, basketService, shippingService, $timeout, $q) {

				$scope.shipping = {
					customerObj : null,
					contactObj : null,
					firstName : null,
					lastName : null,
					streetAddress : null,
					optionalAddress : null,
					zipCode : null,
					city : null,
					states : [],
					selectedState : null,
					countries : [], 
					selectedCountry : null,
					phoneNumber : null,
					email : null,
					shippingMethods : [],
					selectedShippingMethod : null,
					showMessage : false,
					operationMessage : null
				};

				$scope.init = function () {
					$scope.clearModalData();
					var deferred = $q.defer();
					// populate countries
					shippingService.getCountries().then(function (successResult) {
						var optCountry;
						optCountry = {
							'id' : '-1',
							'description' : 'Select a Country'
						};
						$scope.shipping.countries.push(optCountry);
						for(var index = 0; index < successResult.data.length; index++) {
							optCountry = {
								'id' : successResult.data[index].code,
								'description' : successResult.data[index].code + 
									'-' + successResult.data[index].name
							};
							$scope.shipping.countries.push(optCountry);
						}
						if (dataStorageService.getCustomerId())	{ // get customer default address
							accountService.getCustomerById(dataStorageService.getCustomerId()).then(
							function (successResult) {
								$scope.shipping.customerObj = successResult.data;
								if (successResult.data.primaryContact.id) {
									accountService.getContactById(successResult.data.primaryContact.id)
										.then(
										function (successResult) {
										$scope.shipping.contactObj = successResult.data;
										//Check if return contact is not a guest
										if ($scope.shipping.customerObj.guest === false) { // Not guest
											$scope.shipping.firstName = successResult.data.person.firstName;
											$scope.shipping.lastName = successResult.data.person.lastName;
											$scope.shipping.streetAddress = successResult.data.address.street1;
											$scope.shipping.optionalAddress = successResult.data.address.street2;
											$scope.shipping.zipCode = successResult.data.address.postalCode;
											$scope.shipping.city = successResult.data.address.city;
											if (successResult.data.address.state === null) {
												$scope.shipping.selectedState = 'NA/NA';
											} else {
												$scope.shipping.selectedState = successResult.data.address.state;
											}
											$scope.shipping.selectedCountry = 
												successResult.data.address.country;
											$scope.shipping.phoneNumber = successResult.data.phone1;
											$scope.shipping.email = $scope.shipping.customerObj.email;
										} else { // Guest
											if (successResult.data.address.state === null) {
												$scope.shipping.selectedState = 'NA/NA';
											} else {
												$scope.shipping.selectedState = successResult.data.address.state;
											}
											$scope.shipping.selectedCountry = 
												successResult.data.address.country;
											$scope.shipping.phoneNumber = successResult.data.phone1;
										}
										var optState = {
											'id' : '-1',
											'description' : 'Select a State/Province'
										};
										$scope.shipping.states.push(optState);
										// Get US states
										$scope.populateStates('US').then(
											function (successResult) {
												$log.info('Got US state list with size : ' + successResult.length);
												// Get CA states
												$scope.populateStates('CA').then(
													function(successResult) {
														$log.info('Got CA state list with size : ' + 
															successResult.length);
														var optState = {
															'id' : 'NA/NA',
															'description' : 'NA-International'
														};
														$scope.shipping.states.push(optState);
														$scope.populateShippingMethods().then(
															function (successResult) {
															deferred.resolve(successResult);
															}, function (errorResult) {
																$log.error('Error in getting ship methods : '+ 
																	errorResult);
																deferred.reject(errorResult);
														});
													}, function(errorResult) {
														$log.error('Error in getting CA states ' + errorResult);
														deferred.reject(errorResult);
													});
											}, function (errorResult) {
												$log.error('Error in getting US states ' + errorResult);
												deferred.reject(errorResult);
											});
									}, function (errorResult) {
										$log.error('Error in getting contact :'+errorResult);
										deferred.reject(errorResult);
									});
								}
							}, function (errorResult) {
								$log.error('Error in getting customer ' + errorResult);
								deferred.reject(errorResult);
							});
						}
					}, function(errorResult) {
						$log.error('Error in getting countries : ' + errorResult);
						deferred.reject(errorResult);
					});
					return deferred.promise;
				};

				$scope.populateShippingMethods = function (selClicked) {
					$scope.shipping.shippingMethods = [];
					var countryCode = null; var stateCode = null;
					if (selClicked === 'selCountry') {
						// Country dropdown clicked, select state
						countryCode = $scope.shipping.selectedCountry;
						if (countryCode === 'US') {
							$scope.shipping.selectedState = 'US/AL';
						} else if (countryCode === 'CA') {
							$scope.shipping.selectedState = 'CA/AB';
						} else if (countryCode === '-1') {
							$scope.shipping.selectedState = '-1';
						} else {
							$scope.shipping.selectedState = 'NA/NA';
						}
					} else if (selClicked === 'selState')	{
						stateCode = $scope.shipping.selectedState;
						if(stateCode.length === 5) {
							if (stateCode.substring(0,2) === 'US') {
								$scope.shipping.selectedCountry = 'US';
							} else if (stateCode.substring(0,2) === 'CA') {
								$scope.shipping.selectedCountry = 'CA';
							} else {
								$scope.shipping.selectedCountry = '-1';
							}
						} else {
							$scope.shipping.selectedCountry = '-1';
						}
					}
					countryCode = $scope.shipping.selectedCountry;
					stateCode = $scope.shipping.selectedState;
					
					if(null !== stateCode && stateCode.length === 5) {
						stateCode = $scope.shipping.selectedState.substring(3);
					}
					if (!countryCode || !stateCode || stateCode === '-1' || countryCode === '-1') {
						$scope.shipping.selectedShippingMethod = null;
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						return false;
					}
					var deferred = $q.defer();
					var basketId = dataStorageService.getBasketId();
					var shipToShipments = [];
					basketService.getBasketById(basketId).then(function (successResult) {
						var shipment; var item;
						for (var idx = 0; idx < successResult.data.shipments.length;
							idx++) {
							shipment = successResult.data.shipments[idx];
							for(var index = 0; index < shipment.items.length; index++) {
								item = shipment.items[index];
								if(item.isPickupFromStore === false) {
									// ship to item, store in an array
									if (shipToShipments.indexOf(shipment.id) === -1) {
										shipToShipments.push(shipment.id);
									}
								}
							}
						}
						// For phase 1 there will be only one shipment
						shippingService.getShippingMethods(basketId, shipToShipments[0], 
							countryCode, stateCode).then(
						function (successResult) {
							var shipMethod = null;
							var lowestShipMethodId = null;
							var lowestShipMethodCost = 0;
							if (successResult.data.length > 0) {
								$scope.shipping.shippingMethods = [];
								lowestShipMethodId = successResult.data[0].shippingMethodItem.id;
								lowestShipMethodCost = 
									Number(successResult.data[0].discountedShipMethodCost.replace(/[^0-9\.]+/g,''));
								for (var idx = 0; idx < successResult.data.length; idx++) {
									if (successResult.data[idx].shippingMethodItem.active === true) {
										if (Number(successResult.data[idx].discountedShipMethodCost.
											replace(/[^0-9\.]+/g,'')) < lowestShipMethodCost) {
											lowestShipMethodId = successResult.data[idx].shippingMethodItem.id;
											lowestShipMethodCost = 
												Number(successResult.data[idx].discountedShipMethodCost.
												replace(/[^0-9\.]+/g,''));
										}
										shipMethod = {
											id : successResult.data[idx].shippingMethodItem.id,
											name : successResult.data[idx].shippingMethodItem.name,
											cost : successResult.data[idx].discountedShipMethodCost,
											description : successResult.data[idx].shippingMethodItem.description
										};
										$scope.shipping.shippingMethods.push(shipMethod);
									}
								}
								$scope.shipping.selectedShippingMethod = lowestShipMethodId;
								$scope.shipping.showMessage = false;
								$scope.shipping.operationMessage = null;
							} else {
								$scope.shipping.selectedShippingMethod = null;
								$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
							}
							deferred.resolve(successResult.data);
						}, function (errorResult) {
							$scope.shipping.selectedShippingMethod = null;
							$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
							$log.error('No shipping method found' + errorResult);
							deferred.reject(errorResult);
					});
					}, function (errorResult) {
						$scope.shipping.selectedShippingMethod = null;
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						$log.error('Cannot get basket : ' + errorResult);
						deferred.reject(errorResult);
					});
					return deferred.promise;
				};

				$scope.populateStates = function (countryCode) {
					var deferred = $q.defer();
					var optState;
					if (countryCode === 'US' || countryCode === 'CA')	{
						shippingService.getStates(countryCode).then(function (successResult) {
						for(var index = 0; index < successResult.data.length; index++) {
							optState = {
								'id' : successResult.data[index].stateCode,
								'description' : successResult.data[index].stateCode.substring(3) + '-' +
									successResult.data[index].name
							};
							$scope.shipping.states.push(optState);
						}
						deferred.resolve(successResult.data);
						}, function(errorResult) {
							deferred.reject(errorResult);
							$log.error(errorResult);
						});
					}
					return deferred.promise;
				};

				$scope.showShippingAddressAndMethodModal = function () {
					$scope.init().then(function (successResult) {
						$log.info('Data loaded with shipping method = ' + successResult.length);
						// TODO : Remove shipping modal session storage in phase 2
						sessionStorage.showShippingModal = true;
						angular.element('#shippingAddressAndMethodModal').modal('show');
						appService.deactivateSpinner();
					}, function (errorResult) {
						$log.error('Cannot load data ' + errorResult);
						appService.deactivateSpinner();
					});
				};
				
				$scope.closeShippingAddressAndMethodModal = function () {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = true;
					$scope.clearModalData();
					angular.element('#shippingAddressAndMethodModal').modal('hide');
				};

				$scope.cancelShippingAddressAndMethodModal = function () {
					// TODO : Remove shipping modal session storage in phase 2
					sessionStorage.showShippingModal = true;
					$scope.clearModalData();
					angular.element('#shippingAddressAndMethodModal').modal('hide');
				};

				$scope.setOnlineItemShipToContact = function (basketId, basketItem, contactId) {
					var shipTobasketItem = {
						'basketItemID' : basketItem.id,
						'productID' : basketItem.product.id,
						'skuID' : basketItem.skuID,
						'qty' : basketItem.qty,
						'storeID' : null,
						'shipToContactID' : contactId
					};

					return shipTobasketItem;
				};

				$scope.saveShippingAddressAndMethod = function (shipping) {

					if (validateData(shipping)) {
						appService.activateSpinner();

						// create contact
						var contactJson;
						var basketId = dataStorageService.getBasketId();
						// 1. create contact
						// 2. Update shipTo items with new contact
						// 3. Update shipment with ship method selected
						// 4. Show payment modal
						//---------------------------//
						// Step 1: Create Contact
						contactJson = prepareContactDetail(shipping);
						accountService.createContact($scope.shipping.customerObj.id, 
							contactJson).then(
							function (successResult) {
								var createdContactId = successResult.data.substring(
									successResult.data.lastIndexOf('/') + 1);
								var basketItemToUpdate = [];
								// Step 2 - created, now do second step
								// Assign each ship to basket item, this contact id will be ship to contact id
								if (basketId) {
									basketService.getBasketById(basketId).then(function (successResult) {
										angular.forEach(successResult.data.shipments, function (shipment) {
											angular.forEach(shipment.items, function (item) {
												if(item.isPickupFromStore === false) {
													basketItemToUpdate.push($scope.
														setOnlineItemShipToContact(basketId, item, createdContactId));
												}
											});
										});
										var shipToBasketItems = {
											'basketItems' : basketItemToUpdate,
										};
										basketService.updateBasketItems(basketId, shipToBasketItems).
											then(function (successResult) {
											console.log(successResult);
											// Step 3 : Update ship method of all items - only one in Phase 1
											var shipToShipments = [];
											basketService.getBasketById(basketId).then(function (successResult) {
												var shipment; var item;
												for (var idx = 0; idx < successResult.data.shipments.length;
													idx++) {
													shipment = successResult.data.shipments[idx];
													for(var index = 0; index < shipment.items.length; index++) {
														item = shipment.items[index];
														if(item.isPickupFromStore === false) {
															// ship to item, store in an array
															if (shipToShipments.indexOf(shipment.id) === -1) {
																shipToShipments.push(shipment.id);
															}

														}
													}
												}
												// Step 3 - Rest Call - It will contain only one item/call
												angular.forEach(shipToShipments, function (shipmentId) {
												shippingService.updateShippingMethod(
													dataStorageService.getBasketId(),shipmentId,
														shipping.selectedShippingMethod).then(
													function (successResult) {
														// Step 4. Show payment modal
														$log.info(successResult);
														// basket refresh here to reflect shipping method changes
														$scope.$emit('reloadBasket');
														$timeout(function() {
															angular.element('#shippingAddressAndMethodModal').
															modal('hide');
															// TODO:Remove shipping modal session storage in phase 2
															sessionStorage.showShippingModal = false;
															angular.element('#btnOpenPymtModal').
																trigger('click');
															appService.deactivateSpinner();
														}, 0);
													}, function (errorResult) {
														$log.error(errorResult);
														appService.deactivateSpinner();
													});
												});
											}, function (errorResult) {
												$log.error(errorResult);
												appService.deactivateSpinner();
											});

										}, function(errorResult) {
											$log.error(errorResult);
										appService.deactivateSpinner();
										});
									}, function (errorResult) {
										$log.error(errorResult);
										appService.deactivateSpinner();
									});
								}
							}, function (errorResult) {
								appService.deactivateSpinner();

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
								} else {
									// cannot save contact message
									$scope.showMessageAndFocus('msg.ppos.contactNotsaved');
								}
								$log.error(errorResult);
							}
						);
					}
				};

				$scope.clearModalData = function () {
					$scope.shipping.firstName = null;
					$scope.shipping.lastName = null;
					$scope.shipping.streetAddress = null;
					$scope.shipping.optionalAddress = null;
					$scope.shipping.zipCode = null;
					$scope.shipping.city = null;
					$scope.shipping.states = [];
					$scope.shipping.countries = [];
					$scope.shipping.selectedState = '-1';
					$scope.shipping.selectedCountry = '-1';
					$scope.shipping.phoneNumber = null;
					$scope.shipping.shippingMethods = [];
					$scope.shipping.email = null;
					$scope.shipping.selectedShippingMethod = null;
					$scope.shipping.showMessage = false;
					$scope.shipping.operationMessage = null;
				};

				/**
				This method accepts a resource path and element id,
				it displays the value of resource as error, and focus on element
				*/
				$scope.showMessageAndFocus = function (msgPath) {
					$translate(msgPath).
					then(function (msg) {
						$scope.shipping.showMessage = true;
						$scope.shipping.operationMessage = msg;
						angular.element('#btnCloseModal').focus();
					});
				};

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
							$scope.shipping.showMessage = true;
							$scope.shipping.operationMessage = genericMessage;
							angular.element('#btnCloseModal').focus();
						});
					});
				};

				/**
				* Validate Address fields
				*/
				function validateData (shipping) {
					if (!shipping.firstName) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.firstName');
						return false;
					} else if (!shipping.lastName) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.lastName');
						return false;
					} else if (!shipping.streetAddress) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.streetAddress');
						return false;
					} else if (!shipping.city) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.city');
						return false;
					} else if (!shipping.selectedState || shipping.selectedState === '-1') {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.state');
						return false;
					}  else if (!shipping.zipCode) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.zipCode');
						return false;
					} else if (!globalValidationService.isValidPostalCode(shipping.zipCode, shipping.selectedCountry)) {
						$scope.showMessageAndFocus('msg.ppos.invalidzipCode');
						return false;
					} else if (!shipping.selectedCountry || shipping.selectedCountry === '-1') {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.country');
						return false;
					} else if (!shipping.phoneNumber) {
						$scope.createEmptyFieldMsgAndDisplay('lbl.ppos.phoneNumber');
						return false;
					} else if (!globalValidationService.isValidPhoneNumber(shipping.phoneNumber)) {
						$scope.showMessageAndFocus('msg.ppos.invalidPhoneNumber');
						return false;
					} else if (shipping.email === undefined || !shipping.email || 
						!globalValidationService.isEmailValid(shipping.email)) {
						$scope.showMessageAndFocus('msg.ppos.invalidEmail');
						return false;
					} else if (!shipping.selectedShippingMethod) {
						$scope.showMessageAndFocus('msg.ppos.noShippingMethod');
						return false;
					}
					return true;
				}

				function prepareContactDetail (shipping) {
					var contactDetail = {
						'phone1' : shipping.phoneNumber.replace(/\D/g, ''), //send only numbers to API
						'email' : shipping.email,
						'person' : {
							'firstName' : shipping.firstName,
							'lastName' :shipping.lastName
						},
						'address' : {
							'street1' : shipping.streetAddress,
							'street2' : shipping.optionalAddress,
							'city' : shipping.city,
							'postalCode' : shipping.zipCode,
							'state' : shipping.selectedState,
							'country' : shipping.selectedCountry
						}
					};
					return contactDetail;
				}

			}]);
}(window.angular));
