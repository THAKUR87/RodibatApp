/*! ScanBarcodeService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('scanBarcodeService',
        ['$q', '$log', 'dataService', function ($q, $log, dataService) {
            return {
                /**
                 * This function gets the device status.
                 * @returns {*} A deferred.promise
                 */
                getDeviceStatus: function () {
                    $log.debug('scanBarcodeService: getDeviceStatus');

                    var deferred = $q.defer();

                    window.mlSocketMobile.getDeviceStatus(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },

                /**
                 * This function gets the scanned value from the device.
                 * @returns {*} A deferred.promise
                 */
                getScannedValue: function () {
                    $log.debug('scanBarcodeService: getScannedValue');

                    var deferred = $q.defer();

                    window.mlSocketMobile.getScannedValue(function (data) {
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },

                /**
                 * This function posts the provided *data* to the provided *serviceUrl*
                 * @param serviceUrl The service url to call
                 * @param data The data to post to the service
                 * @returns {*} A deferred.promise
                 */
                sendBarcode: function (serviceUrl, data) {
                    $log.debug('scanBarcodeService: sendBarcode');

                    return dataService.postData(serviceUrl, data);
                }
            };
        }]);
}(window.angular));