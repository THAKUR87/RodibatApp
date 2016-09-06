/*! RedirectBridgeService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('redirectBridgeService',
        ['$log', '$location', 'dataStorageService', 'appService',

            /**
             * A simple redirect bridge service to help with redirecting between provisioning/login and the main app.
             * @param $log
             * @param $location
             * @param dataStorageService
             * @returns {{goTo: Function}}
             */
            function ($log, $location, dataStorageService, appService) {

                return {
                    goTo: function (location) {
                        $log.debug('redirectBridgeService: goTo: location: ' + location);

                        // Try and get the remote asset url from the data storage service
                        var assetUrl = dataStorageService.getRemoteAssetUrl(),
                            appTemplate;

                        // If we have an asset url that means we may use window.location for the redirect
                        if (assetUrl && assetUrl.length > 0) {
                            // Choose the appropriate appTemplate based on where we're going
                            switch (location) {
                                case '/home':
                                case '/provisioning':
                                    appTemplate = 'index.html';
                                    break;
                                default:
                                    appTemplate = 'app.html';
                                    break;
                            }

                            // Do the redirect
                            window.location = appTemplate + '#' + location;
                        } else {
                            // If we didn't have an asset url, everything is being served locally,
                            // make sure we always stay with the same local app
                            appService.deactivateSpinner();
                            $location.path(location);
                        }
                    }
                };
            }
        ]
    );
}(window.angular));
