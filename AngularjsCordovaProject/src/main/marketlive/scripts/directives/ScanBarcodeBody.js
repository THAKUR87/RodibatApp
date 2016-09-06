/*! ScanBarcodeBody.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlBarcodeSearchBody',
        [
            function () {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/ScanBarcodeBody.html',
                    link: function () {}
                };
            }]);
}(window.angular));

