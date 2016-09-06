/*! ScanBarcode.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlBarcodeSearch',
        ['$location', '$log', '$timeout', 'scanBarcodeService', 'dataStorageService',
            function ($location, $log, $timeout, scanBarcodeService, dataStorageService) {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/ScanBarcode.html',
                    scope: {
                        modalTitle: '@',
                        serviceUrl: '@',
                        servicePostData: '=',
                        forwardUrl: '@',
                        displayAsModal: '@',
                        createBasket: '@',
                        scanCallback: '&',
                        scanSuccessCallback: '&',
                        continueBtnResource: '@',
                        cancelBtnResource: '@',
                        multiAddMsgResource: '@',
                        multiAddCountResource: '@'
                    },
                    link: function (scope, element) {
                        /**
                         * Used to init the model
                         */
                        scope.init = function () {
                            $log.debug('mlBarcodeSearch: init');

                            scope.deviceStatus = '';
                            scope.deviceConnected = false;
                            scope.scanningValue = '';
                            scope.scannedValue = '';
                            scope.stopPolling = false;
                            scope.searchInProgress = false;
                            scope.searchError = false;
                            scope.canContinue = false;
                            scope.itemFoundCount = 0;
                            scope.servicePostData = scope.servicePostData || {};

                            if (scope.createBasket) {
                                scope.servicePostData.basketId = dataStorageService.getBasketId() || null;
                                scope.servicePostData.storeId = dataStorageService.getStoreId() || null;

                                if (dataStorageService.getLoggedInCSR() && dataStorageService.getLoggedInCSR().id) {
                                    scope.servicePostData.csrId = dataStorageService.getLoggedInCSR().id;
                                } else {
                                    scope.servicePostData.csrId = null;
                                }
                            }

                            scope.pollForConnection();
                        };

                        /**
                         * Watch the *deviceConnected* scope var for a true state and then start
                         * polling for scanner values.
                         */
                        scope.$watch('deviceConnected', function (value) {
                            if (value === true) {
                                scope.pollForScannedValue();
                            }
                        });

                        /**
                         * Watch the *scanningValue* scope var for changes and when we have a good value,
                         * send it to the *sendBarcode* function which calls the service.
                         */
                        scope.$watch('scanningValue', function (newValue, lastValue) {
                            if (newValue && newValue.toLowerCase() !== 'no value' &&
                                newValue.toLowerCase() !== 'no value available' &&
                                lastValue && !scope.searchInProgress) {
                                $log.debug('mlBarcodeSearch: watch: scanningValue: newValue: ' + newValue);
                                $log.debug('mlBarcodeSearch: watch: scanningValue: lastValue: ' + lastValue);

                                scope.scannedValue = newValue;
                                scope.sendBarcode();
                            }
                        });

                        /**
                         * The function calls the *scanBarcodeService* *sendBarcode* function passing along
                         * the scannedValue.
                         */
                        scope.sendBarcode = function () {
                            if (!scope.searchInProgress) {
                                var apiURL = scope.serviceUrl.replace(/UPC_CODE/g, scope.scannedValue);

                                $log.debug('mlBarcodeSearch: sendBarcode: serviceUrl: ' + apiURL);
                                $log.debug('mlBarcodeSearch: sendBarcode: scannedValue: ' + scope.scannedValue);
                                scope.searchError = false;
                                scope.searchInProgress = true;

                                if (scope.scanCallback) {
                                    scope.scanCallback({'code': scope.scannedValue});
                                }

                                scanBarcodeService.sendBarcode(apiURL, scope.servicePostData).then(
                                    function (successResult) {
                                        $log.debug('mlBarcodeSearch: sendBarcode: Success');
                                        scope.searchInProgress = false;
                                        scope.canContinue = true;
                                        scope.itemFoundCount++;

                                        if (successResult.data.basketId) {
                                            scope.servicePostData.basketId = successResult.data.basketId;
                                        }

                                        if (!scope.continueBtnResource) {
                                            scope.hideScanDialog();
                                        }

                                        if (scope.createBasket === 'true') {
                                            dataStorageService.setBasketId(successResult.data.basketId);
                                            dataStorageService.setCustomerId(successResult.data.customerId);
                                        }

                                        if (scope.scanSuccessCallback) {
                                            scope.scanSuccessCallback();
                                        }

                                        if (scope.forwardUrl && !scope.continueBtnResource) {
                                            $location.path(scope.forwardUrl);
                                        }
                                    },
                                    function (errorResult) {
                                        $log.error('mlBarcodeSearch: sendBarcode: Failed');
                                        $log.error(errorResult);
                                        scope.searchInProgress = false;
                                        scope.searchError = true;
                                    }
                                );
                            }
                        };

                        /**
                         * Poll for device connection.
                         */
                        scope.pollForConnection = function () {
                            if (!scope.deviceConnected && !scope.stopPolling) {
                                $timeout(scope.getDeviceStatus, 500);
                            }
                        };

                        /**
                         * Poll for scanned value.
                         */
                        scope.pollForScannedValue = function () {
                            if (scope.deviceConnected && !scope.stopPolling) {
                                $timeout(scope.getScannedValue, 500);
                            }
                        };

                        /**
                         * This function calls the service to get the devices connection status.
                         */
                        scope.getDeviceStatus = function () {
                            try {
                                scanBarcodeService.getDeviceStatus().then(
                                    function (successResult) {
                                        $log.debug('mlBarcodeSearch: getDeviceStatus: Success');

                                        scope.deviceStatus = successResult;
                                        if (successResult && successResult.toLowerCase() === 'connected') {
                                            scope.deviceConnected = true;
                                        } else {
                                            scope.pollForConnection();
                                        }
                                    },
                                    function (errorResult) {
                                        $log.error('mlBarcodeSearch: getDeviceStatus: Failed');
                                        $log.error(errorResult);

                                        scope.deviceStatus = 'Error';
                                    }
                                );
                            } catch (errorResult) {
                                $log.error('mlBarcodeSearch: getDeviceStatus: Failed');
                                $log.error(errorResult);
                            }
                        };

                        /**
                         * This function calls the service to get the scanned value from the device.
                         */
                        scope.getScannedValue = function () {
                            scanBarcodeService.getScannedValue().then(
                                function (successResult) {
                                    $log.debug('mlBarcodeSearch: getScannedValue: Success');

                                    scope.scanningValue = successResult;
                                    scope.pollForScannedValue();
                                },
                                function (errorResult) {
                                    $log.error('mlBarcodeSearch: getScannedValue: Failed');
                                    $log.error(errorResult);

                                    scope.scannedValue = 'Error';
                                }
                            );
                        };

                        /**
                         * This function shows the Scan Modal Dialog.
                         */
                        scope.showScanDialog = function () {
                            scope.init();
                            element.find('.modal:first').modal('show');
                        };

                        /**
                         * This function hides the Scan Modal Dialog.
                         */
                        scope.hideScanDialog = function () {
                            scope.stopPolling = true;
                            element.find('.modal:first').modal('hide');
                        };

                        scope.continue = function () {
                            if (scope.canContinue){
                                scope.hideScanDialog();
                                if (scope.forwardUrl) {
                                    $location.path(scope.forwardUrl);
                                }
                            }
                        };

                        /**
                         * This attaches an even to the Scan Dialog's *hidden* event, so we can do some
                         * cleanup after it's hidden.
                         */
                        element.find('.modal:first').on('hidden.bs.modal', function () {
                            // Stop all polling
                            scope.stopPolling = true;
                        });
                    }
                };
            }]);
}(window.angular));

