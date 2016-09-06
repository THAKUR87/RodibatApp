/*! AppService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    /**
     * A generic service used to communicate, at a global level, with the app's rootScope
     */
    angular.module('pointOfSaleApplication').service('appService',
        ['$rootScope', function ($rootScope) {

            return {
                /**
                 * This function activates/displays the application spinner.
                 */
                activateSpinner: function () {
                    $rootScope.$broadcast('toggleSpinner', {active: true});
                },

                /**
                 * This function de-activates/hides the application spinner.
                 */
                deactivateSpinner: function () {
                    $rootScope.$broadcast('toggleSpinner', {active: false});
                }
            };
        }]);
}(window.angular));
