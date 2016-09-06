/*! DataStorageService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';

	angular.module('pointOfSaleApplication').service('dataStorageService',
		function () {
    
		return {
			getProperties : function (type) {
                var properties = JSON.parse(sessionStorage.getItem(type));
                return properties;
            },

            setProperties : function (type, properties) {
                sessionStorage.setItem(type, JSON.stringify(properties));
            },

			isLoggedIn : function () {
				var isLoggedIn = sessionStorage.loggedIn;

				if (isLoggedIn === 'true') {
					return true;
				} else {
					return false;
				}
			},
			
			setLoggedIn : function (loggedIn) {
				sessionStorage.loggedIn = loggedIn;
			},

			getLoggedInCSR : function () {
				if (sessionStorage.loggedInCSR) {
					var loggedInCSRDetails = JSON.parse(sessionStorage.loggedInCSR);
					return loggedInCSRDetails;
				} else {
					return null;
				}
			},
			
			setLoggedInCSR : function (loggedInCSR) {
				var loggedInCSRDetails = JSON.stringify(loggedInCSR);
				sessionStorage.loggedInCSR = loggedInCSRDetails;
			},
			
			isScreenLocked : function () {
				var isScreenLocked = sessionStorage.screenLocked;

				if (isScreenLocked === 'true') {
					return true;
				} else {
					return false;
				}
			},
			
			setScreenLocked : function (screenLocked) {
				sessionStorage.screenLocked = screenLocked;
			},

			getUrlBase : function () {
				return localStorage.urlBase;
			},
			
			setUrlBase : function (urlBase) {
				localStorage.urlBase = urlBase;
			},

            getRemoteAssetUrl : function () {
                return sessionStorage.remoteAssetUrl;
            },

            setRemoteAssetUrl : function (remoteAssetUrl) {
                sessionStorage.remoteAssetUrl = remoteAssetUrl;
            },
			
			getStoreCode : function () {
				return localStorage.storeCode;
			},
			
			setStoreCode : function (storeCode) {
				localStorage.storeCode = storeCode;
			},

            getStoreId : function () {
				var store = this.getStore();

				if (store) {
					return store.id;
				} else {
					return null;
				}
            },
			
			getStoreName : function () {
				return localStorage.storeName;
			},
			
			getStore : function () {
				if (sessionStorage.store) {
					var storeDetails = JSON.parse(sessionStorage.store);
					return storeDetails;
				} else {
					return null;
				}
				
			},
			
			setStore : function (store) {
				var storeDetails = JSON.stringify(store);
				sessionStorage.store = storeDetails;

				// Whenever store details are set in session storage
				// set store name in local storage. Because we want store name
				// before login.
				localStorage.storeName = store.name;
			},
			
			getAccessToken : function () {
				return sessionStorage['access_token'];
			},
		
			setAccessToken : function (accessToken) {
				sessionStorage['access_token'] = accessToken;
			},

			getRefreshToken : function () {
				return sessionStorage['refresh_token'];
			},
		
			setRefreshToken : function (refreshToken) {
				sessionStorage['refresh_token'] = refreshToken;
			},
		
			getCustomerId : function () {
				return sessionStorage.customerId;
			},
		
			setCustomerId : function (customerId) {
				sessionStorage.customerId = customerId;
			},
		
			getBasketId : function () {
				return sessionStorage.basketId;
			},

            getFinalizedOrderId : function () {
                return sessionStorage.finalizedOrderId;
            },
		
			setBasketId : function (basketId) {
				sessionStorage.basketId = basketId;
			},

            setFinalizedOrderId : function (orderId) {
                sessionStorage.finalizedOrderId = orderId;
            },

			getLoggedInUsersPosSettings : function () {
				var userPosSettings = null;
				if (sessionStorage.posSettings) {
					userPosSettings = JSON.parse(sessionStorage.posSettings);
				}
				return userPosSettings;
			},
			
			setLoggedInUsersPosSettings : function (posSettings) {
				var userPosSettings = JSON.stringify(posSettings);
				sessionStorage.posSettings = userPosSettings;
			},

            removeItem : function (key){
                sessionStorage.removeItem(key);
            },

			getPaymentChange: function () {
				var paymentChange = sessionStorage.paymentChange;

				this.removeItem('paymentChange');

				return paymentChange;
			},

			setPaymentChange : function (paymentChange) {
				sessionStorage.paymentChange = paymentChange;
			},

            setStarMicronicsPrinterName: function(printerName){
                sessionStorage.starMicronicsPrinterName = printerName;
            },

            getStarMicronicsPrinterName: function(){
                return sessionStorage.starMicronicsPrinterName;
            },

            isPrinterConnected: function(){
				var isPrinterConnected = sessionStorage.isPrinterConnected;

				if (isPrinterConnected === 'true') {
					return true;
				} else {
					return false;
				}
            },

            setPrinterConnected: function(bol){
                sessionStorage.isPrinterConnected = bol;
            }


		};
	});
}(window.angular));
