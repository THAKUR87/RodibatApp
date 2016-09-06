/*jshint bitwise: false*/
(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('receiptModalController',
        ['$scope', '$location', 'dataStorageService', 'starPrinter',
            'receiptService', 'accountService', 'globalValidationService',  '$translate',

            function ($scope, $location, dataStorageService, starPrinter, receiptService, accountService,
                      globalValidationService, $translate ) {

                $scope.receiptDataModel = {
                    deviceName: '',
                    hasValidationErrors: false,
                    hasEmailValidationErrors: false,
                    validationErrors : [],
                    printSelected: false,
                    emailSelected: false
                };

                $scope.email =  undefined ;
                $scope.obj = undefined;

                $translate('lbl.ppos.noDevice').
                    then(function (msg) {
                        $scope.noDevice = msg;
                    });


                $scope.$on('order',function(){
                    $scope.showReceiptModal();
                });

                $scope.update = function(){

                    //create object to send out
                    $scope.obj = {
                        orderId:dataStorageService.getFinalizedOrderId(),
                        printSelected: $scope.receiptDataModel.printSelected,
                        deviceName: $scope.receiptDataModel.deviceName,
                        emailSelected: $scope.receiptDataModel.emailSelected,
                        email: $scope.email

                    };
                };

                $scope.showReceiptModal = function () {

                    $scope.receiptDataModel.paymentChange = dataStorageService.getPaymentChange();
                    $scope.receiptDataModel.deviceName  = dataStorageService.getStarMicronicsPrinterName();


                    if(!dataStorageService.isPrinterConnected()){

                          $scope.receiptDataModel.hasValidationErrors = true;

                          $translate('lbl.ppos.noDevice').
                            then(function (msg) {
                                $scope.receiptDataModel.validationErrors.push(msg);
                            });

                          $scope.buttonClicked  = true;
                    }

                    accountService.getCustomerById(dataStorageService.getCustomerId()).then(

                        function (successResult){
                            if(successResult.data.email != null){
                                $scope.email  = successResult.data.email;
                                dataStorageService.setOrderContactEmail = $scope.email;
                            }

                        }, function (errorResult) {
                            console.log(errorResult);
                        });

                    dataStorageService.removeItem('customerId');


                    $scope.buttonClicked = false;
                    $scope.receiptDataModel.orderid = dataStorageService.getFinalizedOrderId();
                    console.log( 'OrderId: ' + $scope.receiptDataModel.orderid);
                    angular.element('#receiptModal').modal('show');
                };

                $scope.cancel = function () {
                    $scope.receiptDataModel.emailSelected = false;
                    $scope.receiptDataModel.printSelected = false;

                    $scope.update();
                    $scope.obj.showMessage = true;

                    angular.element('#receiptModal').modal('hide');
                    $scope.$emit('order-confirm', $scope.obj);
                    angular.element('#orderConfirmationModal').modal('show');
                };

                $scope.processReceipt = function () {
                    $scope.receiptDataModel.hasEmailValidationErrors = false;
                    $scope.receiptDataModel.validationErrors = [];

                    $scope.validateEmail();
                    var isValid = !$scope.receiptDataModel.hasEmailValidationErrors;

                    if ($scope.receiptDataModel.emailSelected === true) {

                        if(isValid === false){
                            return;
                        }

                        $scope.update();
                        $scope.buttonClicked = true;
                        console.log('Calling email receipt service: order:' + dataStorageService.getFinalizedOrderId());
                        receiptService.emailOrderReceipt(dataStorageService.getFinalizedOrderId(),
                            dataStorageService.getStoreId(), dataStorageService.getLoggedInCSR().id,
                            $scope.email
                        ).then(
                            function(result){
                                angular.element('#receiptModal').modal('hide');
                                angular.element('#orderConfirmationModal').modal('show');
                                $scope.update();
                                $scope.showMessage = false;
                                $scope.$emit('order-confirm', $scope.obj);
                                console.log(result);
                            }
                        );

                    }
                    if ($scope.receiptDataModel.printSelected === true) {
                        $scope.buttonClicked = true;
                        console.log('Calling print receipt service: order:' + dataStorageService.getFinalizedOrderId());

                        receiptService.printOrderReceipt(
                            dataStorageService.getFinalizedOrderId(),dataStorageService.getStoreId(),
                            dataStorageService.getLoggedInCSR().id
                        ).then(
                            function(result){

                                $scope.assembleTestPage = [];
                                //split the template data
                                var tmp = $scope.scrubText(result.data);

                                $scope.assembleTestPage = tmp.split(',');
                                window.temp = $scope.assembleTestPage;

                                starPrinter.getDeviceName().then(function(data){
                                    if(data === 'NoDevice') {
                                        dataStorageService.setPrinterConnected(false);
                                        $translate('lbl.ppos.noDevice').
                                            then(function (msg) {
                                                //So after a failure we set the name to discon
                                                dataStorageService.setStarMicronicsPrinterName(msg);
                                                dataStorageService.setPrinterConnected(false);
                                                $scope.receiptDataModel.printSelected = false;
                                                $scope.receiptDataModel.deviceName =msg;
                                                $scope.receiptDataModel.validationErrors.push(msg);
                                                $scope.receiptDataModel.hasValidationErrors = true;
                                            });

                                    }else {
                                        starPrinter.printTestPage($scope.assembleTestPage).then();
                                        $scope.update();
                                        $scope.showMessage = false;
                                        angular.element('#receiptModal').modal('hide');
                                        angular.element('#orderConfirmationModal').modal('show');
                                        $scope.$emit('order-confirm', $scope.obj);
                                    }
                                    });



                            }
                        );
                    }
                };

                $scope.scrubText = function(textIn) {
                    var textOut ='';
                    var len = textIn.length;

                    for(var i = 0; i < len ; i++) {
                        var valToTest = (textIn.charCodeAt(i) & 0x80) >> 7;

                        if(valToTest !== 1) {
                            textOut += textIn.charAt(i);
                        }
                    }
                    return textOut;
                };


                $scope.validateEmail = function () {

                   // var hasValidationErrors = false;
                    // Email validation.
                    if (angular.element('#receiptModalEmail').hasClass('ng-invalid-email')) {
                        // TODO: This is a hack... PEBL-15808
                        // Invalid email format as per HTML5 and AngularJS.
                       $scope.receiptDataModel.hasEmailValidationErrors = true;

                        $translate('msg.ppos.invalidEmail').
                            then(function (invalidEmailMessage) {
                                $scope.receiptDataModel.validationErrors.push(invalidEmailMessage);
                            });
                    } else if ($scope.email) {

                        if (!globalValidationService.isEmailValid($scope.email)) {
                            // Invalid email format as per MarketLive client side validation.
                            $scope.receiptDataModel.hasEmailValidationErrors = true;
                            $translate('msg.ppos.invalidEmail').
                                then(function (invalidEmailMessage) {
                                    $scope.receiptDataModel.validationErrors.push(invalidEmailMessage);
                                });
                        }
                    }
                    else if ($scope.email === undefined || $scope.email === '') {

                        $scope.receiptDataModel.hasEmailValidationErrors = true;

                        $translate('lbl.ppos.email').
                            then(function (fieldNameVal) {
                                $translate('msg.ppos.isRequiredField', {fieldName: fieldNameVal}).
                                    then(function (emailRequiredMessage) {
                                        $scope.receiptDataModel.validationErrors.push(emailRequiredMessage);
                                    });
                            });
                    }

                };


                }]);



}(window.angular));
