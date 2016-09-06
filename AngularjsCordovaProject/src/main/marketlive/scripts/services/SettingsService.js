/*! SettingsService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
	'use strict';
	
	angular.module('pointOfSaleApplication').service('settingsService',
		['configService',
		function (configService) {

			return {

				/**
				 * This function returns an array of timeout values from configuration
				 *  to lock the screen after selected timeout
				 *
				 * @returns (Array) an array of timeouts
				 */
				getTimeoutArray : function () {
					var timeoutConfigValue = configService.
							getConfig('app.ppos.posSettings.timeoutList');
					var timeoutArray = [];

					if (timeoutConfigValue) {
						var timeoutConfigValueArray = timeoutConfigValue.split(',');
						if (timeoutConfigValueArray) {
							angular.forEach(timeoutConfigValueArray, function (timeoutConfigValue) {
								if (timeoutConfigValue)	{
									timeoutArray.push(timeoutConfigValue);
								}
							});
						}
					}
					return timeoutArray;
				}
			};
	}]);
}(window.angular));
