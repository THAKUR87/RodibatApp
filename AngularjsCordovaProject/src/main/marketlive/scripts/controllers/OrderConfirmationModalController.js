/*jshint bitwise: false*/
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('orderConfirmationModalController',
        ['$scope', '$location', 'dataStorageService', 'orderService',

            function ($scope, $location, dataStorageService, orderService) {

                $scope.orderConfirmationDataModel = {
                    deviceName: '',
                    printSelected: false,
                    emailSelected: false ,
                    showMessage: false
                };


                $scope.$on('order-confirm',function(x, y){
                    $scope.showConfirmModal(y);
                });



                $scope.showConfirmModal = function (data) {
                    $scope.orderConfirmationDataModel.printSelected = data.printSelected;
                    $scope.orderConfirmationDataModel.deviceName = data.deviceName;
                    $scope.orderConfirmationDataModel.emailSelected = data.emailSelected;

                    if( !$scope.orderConfirmationDataModel.emailSelected &&
						!$scope.orderConfirmationDataModel.printSelected) {
                        $scope.orderConfirmationDataModel.showMessage = true;
                    }
                    $scope.orderConfirmationDataModel.email = data.email;

                   orderService.getOrderById(data.orderId).then(
                      function(result){
                          $scope.orderConfirmationDataModel.orderid = result.data.code;
                          angular.element('#orderConfirmationtModal').modal('show');

                          dataStorageService.removeItem('customerId');
                      }
                    );



                };

                $scope.close = function () {
                    angular.element('#orderConfirmationtModal').modal('hide');
                    $location.path('/dashboard');


                    //TODO cleanup we shouldnt have to do this - would also be better in the directive
                    angular.element(angular.element('.modal-backdrop')[0].remove());


                };





            }]);



}(window.angular));
