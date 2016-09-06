/**
 * Order Confirmation Receipt Modal Directive
 *
 * @author Will Mitchell
 */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    // A Directive for displaying prices (is, was, free, etc)
    angular.module('pointOfSaleApplication').directive('orderConfirmationModal', function () {
        // Return the directive object
        return {
            restrict: 'E',
            templateUrl: 'views/basket/OrderConfirmationModal.html',
            controller: 'orderConfirmationModalController',

            link: function (scope, element) {
                /**
                 * This attaches an even to the Dialog's *hidden* event, so we can do some
                 * cleanup after it's hidden.
                 */
                element.find('.modal:first').on('hidden.bs.modal', function () {
                    scope.$emit('redirectTo', {path: '/dashboard'});
                });
            }
        };
    });
}(window.angular));
