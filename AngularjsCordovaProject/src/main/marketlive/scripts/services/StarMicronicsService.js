
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('starPrinter',
        ['$q', function ($q) {

        return {
            getPort: function () {
                var deferred = $q.defer();
                ppos.devices.mlStarMicronics.getPort(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            getFirmwareVersion: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getFirmwareVersion(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            getModelName: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getModelName(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            getDeviceName: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.getDeviceName(function (data) {
                    deferred.resolve(data);
                },function (data){
                    deferred.reject(data);
                });

                return deferred.promise;
            },
            printBarCode: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.printBarCode(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            uploadVendorImage: function (imageUrl, targetImageName) {
                var deferred = $q.defer();
                var fileTransfer = new window.FileTransfer();
                var uri = encodeURI(imageUrl + targetImageName);
                var cordovaLocation = window.cordova.file.dataDirectory + targetImageName;
                var filePath = encodeURI(cordovaLocation);

                fileTransfer.download(
                    uri,
                    filePath,
                    function () {
                        var filePrefix = 'file:///';
                        var iosLocation = '/private/' + cordovaLocation.substring(filePrefix.length);
                        ppos.devices.mlStarMicronics.setUploadImageLocations(
                            cordovaLocation, iosLocation, function (data) {
                                deferred.resolve(data);
                        });
                    },
                    function () {
                        deferred.reject('Download Failed');
                    },
                    true,
                    {
                        //This is here as an exemplar in case we need to add headers eventually
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );

                return deferred.promise;
            },
            printTestPage: function (pageData) {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.printTestPage(pageData, function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            openCashDrawer: function () {
                var deferred = $q.defer();

                ppos.devices.mlStarMicronics.openCashDrawer(function (data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
        };
    }]);
}(window.angular));

