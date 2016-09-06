/*! ProductSearchModalDirective.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('productSearchModal', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'views/search/ProductSearchModal.html',
            controller: 'productSearchModalController',
            link: function (scope, element) {
                angular.element('#productSearchModal').on('shown.bs.modal', function () {
                    angular.element('#productSearchKeyword').focus();
                });

                element.find('.modal:first').on('hidden.bs.modal', function () {
                    $timeout(scope.closeProductSearchModal, 0);
                });
            }
        };
    }]);
}(window.angular));
