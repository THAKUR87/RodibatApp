/*! OrderSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('orderSearchModal', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/search/OrderSearchModal.html',
            controller: 'orderSearchModalController',
            link: function (scope, element) {
                angular.element('#orderSearchModal').on('shown.bs.modal', function () {
                    angular.element('#orderCode').focus();
                });

                element.find('.modal:first').on('hidden.bs.modal', function () {
                    $timeout(scope.closeOrderSearchModal, 0);
                });
            }
        };
    }]);
}(window.angular));
