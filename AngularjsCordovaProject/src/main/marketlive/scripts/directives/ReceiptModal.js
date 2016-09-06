/**
 * Email Receipt Modal Directive
 *
 * @author Will Mitchell
 */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

        // A Directive for displaying prices (is, was, free, etc)
        angular.module('pointOfSaleApplication').directive('receiptModal', function () {
            // Return the directive object
            return {
                restrict: 'E',
                templateUrl: 'views/basket/ReceiptModal.html',
                controller: 'receiptModalController',

                link: function (scope, element) {

                    scope.manageSelection = function (option) {

                        if (option === 'print' && scope.receiptDataModel.deviceName !== scope.noDevice) {
                            scope.receiptDataModel.printSelected = !scope.receiptDataModel.printSelected;
                            return;


                        }
                        else if (option === 'email'){
                            scope.receiptDataModel.emailSelected = !scope.receiptDataModel.emailSelected;
                            scope.buttonClicked = false;
                        }
                    };

                    element.find('.modal:first').on('hidden.bs.modal', function () {
                        scope.update();
                        scope.$emit('order-confirm', scope.obj);
                        angular.element('#orderConfirmationModal').modal('show');
                    });
                }
            };
    });
}(window.angular));

