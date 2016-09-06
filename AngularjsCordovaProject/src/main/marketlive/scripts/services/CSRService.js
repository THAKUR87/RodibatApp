/*! CSRService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('csrService',
		['dataService', 'dataStorageService', '$location', 'globalValidationService', 'csrValidationService',
		function (dataService, dataStorageService, $location, globalValidationService, csrValidationService) {

			return {
				getAllCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getActiveCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&status=1&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getInActiveCSRs : function () {
					var serviceUrl = '/api/csrs?application=PPOS&status=0&store='+dataStorageService.getStoreCode();

					return dataService.getData(serviceUrl);
				},

				getCSRById : function (csrId) {
					var serviceUrl = '/api/csrs/' + csrId;

					return dataService.getData(serviceUrl);
				},

				getCSRByEmail : function (email) {
					var serviceUrl = '/api/csrs/email/' + email +'/';

					return dataService.getData(serviceUrl);
				},
				
				createCSR : function (csrToAdd) {
					var serviceUrl = '/api/csrs';

					return dataService.postData(serviceUrl, csrToAdd);
				},
				
				updateCSR : function (csrId, updateData) {
					var serviceUrl = '/api/csrs/' + csrId;

					return dataService.putData(serviceUrl, updateData);
				},

				deleteCSR : function (csrId) {
					var serviceUrl = '/api/csrs/' + csrId + '/Application/PPOS';
 
					return dataService.deleteData(serviceUrl);
				},

				getCSRPermissions : function (csrTypeId) {
					var serviceUrl = '/api/csrs/permissions?typeID=' + csrTypeId;

					return dataService.getData(serviceUrl);
				},

				getCSRTypes : function() {
					// Get only PPOS Roles (CSRTypes) & exclude 'Admin' role from that list.
					var serviceUrl = '/api/csrs/types?application=PPOS&excludedTypeIDs=12';

					return dataService.getData(serviceUrl);
				},

				getCSRTypePermission : function(csrTypeCode) {
					var serviceUrl = '/api/csrs/permissions?typeID=' + csrTypeCode;

					return dataService.getData(serviceUrl);
				},

				updateCSRPassword : function (csrId, updateData) {
					var serviceUrl = '/api/csrs/password/' + csrId;

					return dataService.putData(serviceUrl, updateData);
				},


				/**
				* Method to move to management screen
				*/
				goToManagementScreen : function () {
					$location.path('/management');
				},

				/**
				* Method to move to management screen
				*/
				goToCsrListScreen : function () {
					$location.path('/csrList');
				},

				/**
				* This is to clear pre-populated content of element.
				*/
				clearContent : function (elementId, csr) {
					angular.element('#'+elementId).val('');
					this.clearPIN(elementId, csr);
				},

				/**
				* Method to clear pin values.
				*/
				clearPIN : function (elementId, csr) {
					if (elementId === 'pin1') {
						csr.pin1 = '';
					}
					if (elementId === 'pin2') {
						csr.pin2 = '';
					}
					if (elementId === 'pin3') {
						csr.pin3 = '';
					}
					if (elementId === 'pin4') {
						csr.pin4 = '';
					}
					if (elementId === 'pin5') {
						csr.pin5 = '';
					}
					if (elementId === 'pin6') {
						csr.pin6 = '';
					}
				},

				/**
				* Method to set active status
				*/
				setStatus : function (activeStatus, csr) {
					csr.activeStatus = activeStatus;
				},
				
				/**
				* Method to show hide the permission div
				*/
				showHidePermission : function () {
					var elmt = angular.element('#permissionDivElement');
					if(elmt.hasClass('ml-icon-plus')) {
						elmt.addClass('ml-icon-minus');
						elmt.removeClass('ml-icon-plus');
						document.getElementById('collapseDiv').style.display = 'block'; 
					} else {
						elmt.addClass('ml-icon-plus');
						elmt.removeClass('ml-icon-minus');
						document.getElementById('collapseDiv').style.display = 'none';
					}
				},

				/**
				* Clears CSR fields.
				*/
				clearCSR : function (storeAssociateRoleCode, storeManagerRoleCode, csr) {
					csr.employeeId = null;
					csr.firstName = null;
					csr.lastName = null;
					csr.email = null;
					csr.password = null;
					csr.confirmPassword = null;
					csr.unlockPosPin = '000000';
					csr.activeStatus = false;
					csr.pin1 = '0';
					csr.pin2 = '0';
					csr.pin3 = '0';
					csr.pin4 = '0';
					csr.pin5 = '0';
					csr.pin6 = '0';
					csr.showCsrOpFailureMessage = false;
					csr.csrOpFailureMessage = null;
					// Select inactive by default
					if(angular.element('#lblActive').hasClass('active')) {
						angular.element('#lblActive').toggleClass('active');
						angular.element('#lblInactive').toggleClass('active');
					}

					if (csr.roleType.length === 2) {
						var storeAssociateRoleId = 
						this.getStoreAssociateRoleName(csr.roleType, storeAssociateRoleCode);
						var storeManagerRoleId = 
						this.getStoreAssociateRoleName(csr.roleType, storeManagerRoleCode);
						csr.selectedRole = storeAssociateRoleId;
						if(angular.element('#lblRoleRadio' + storeManagerRoleId).hasClass('active')) {
							angular.element('#lblRoleRadio' + storeManagerRoleId).toggleClass('active');
							angular.element('#lblRoleRadio' + storeAssociateRoleId).toggleClass('active');
						}
					} else {
						csr.selectedRole = '';
						document.getElementById('roleTypeSelect').selectedIndex = '0';
					}
					this.populateCSRTypeDetails(csr.selectedRole);
				},

				/**
				* This method is returns the id of a roleType.
				*/
				getStoreAssociateRoleName : function (roleTypeList, roleType) {
					var csrRoleId = '';
					if(roleTypeList && roleTypeList.length > 0) {
						for (var index = 0; index < roleTypeList.length; index++) {
							if(roleTypeList[index].code === roleType) {
								csrRoleId =  roleTypeList[index].id;
								break;
							}
						}
					}
					return csrRoleId;
				},
				
				/**
				* On unlock pin text boxes, this method checks if entered value is a digit,
				* if yes, then it moves the focus to next text box.
				*/
				moveOnNext : function (txtValue, currentFieldId, nextFieldID, csr) {					
					// if the entered value is numeric, focus on next field
					if(globalValidationService.isNumber(txtValue)) {
						csr.showCsrOpFailureMessage = false;
						var elmtId = '#' + nextFieldID;
						angular.element(elmtId).focus();
					} else { // if the entered value is non numeric, remain on current field, clear non numeric value
						angular.element('#'+currentFieldId).val('');
						this.clearPIN(currentFieldId, csr);
						csrValidationService.showMessageAndFocus('msg.ppos.invalidUnlockPIN',currentFieldId, csr);
					}
				},

				
				/**
				This method gets role's (CSRType's) permissions from REST & populate that on UI
				*/
				populateCSRTypeDetails : function (csrTypeId) {
					if (csrTypeId === '')	{ //dont hit api (but do clear the html) if first one is selected
						document.getElementById('permissionListDiv').innerHTML = '';
					} else {
						document.getElementById('permissionListDiv').innerHTML = ''; 
						document.getElementById('permissionListDiv').style.display = 'none';
						var permissionHtml = ''; var idx = 0;
						this.getCSRTypePermission(csrTypeId).then(
							function (successResult) {
								document.getElementById('permissionListDiv').style.display = '';
								var orderAdministration = [];
								var productAdministration = [];
								var customerManagement = [];
								var storeManagement = [];
								for (var ctr = 0; ctr < successResult.data.length; ctr++) {
									if (successResult.data[ctr].permissionCategory === 'Order Administration') {
										orderAdministration.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Customer Management') {
										customerManagement.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Product Administration') {
										productAdministration.push(successResult.data[ctr].description + '<br />');
									} else if (successResult.data[ctr].permissionCategory === 'Store Management') {
										storeManagement.push(successResult.data[ctr].description + '<br />');
									}
								}
								// Lists populated, now start filling in div
								if(orderAdministration.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
									'<div class="ml-ppos-add-csr-permission-title">Order Administration</div>';
									for(idx = 0; idx < orderAdministration.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											orderAdministration[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								if(productAdministration.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
										'<div class="ml-ppos-add-csr-permission-title">Product Administration</div>';
									for(idx = 0; idx < productAdministration.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											productAdministration[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								if(customerManagement.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' + 
										'<div class="ml-ppos-add-csr-permission-title">Customer Management</div>';
									for(idx = 0; idx < customerManagement.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											customerManagement[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								
								if(storeManagement.length !== 0 ) {
									permissionHtml += '<div class="ml-ppos-add-csr-permission-container">' +
										'<div class="ml-ppos-add-csr-permission-title">Store Management</div>';
									for(idx = 0; idx < storeManagement.length; idx++) {
										permissionHtml += '<div class="ml-ppos-add-csr-permission-items">' + 
											storeManagement[idx] + '</div>';
									}
									permissionHtml += '</div>';
								}
								document.getElementById('permissionListDiv').innerHTML = permissionHtml;
							}, function (errorResult) {
								console.log('ErrorResult - Error occurred while getting permissions : ' + errorResult);
							}
						);
					}
				}
			};
	}]);
}(window.angular));
