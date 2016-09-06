/*! DashboardController.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').controller('dashboardController',
        ['$scope', '$log','dataStorageService',
            function ($scope, $log, dataStorageService) {

                $scope.init = function () {
                    $log.debug('dashboardController: init');

                    $scope.basketId = dataStorageService.getBasketId();
                    $scope.storeId = dataStorageService.getStoreId();
                    $scope.loggedInCSR = dataStorageService.getLoggedInCSR();

                    $scope.skuBarcodeSearchPostData = {
                        basketId: $scope.basketId || null,
                        csrId: $scope.loggedInCSR.id || null,
                        storeId: $scope.storeId || null
                    };

                    $log.debug('basketId: ' + $scope.basketId);
                };

                $scope.scanSuccessHandler = function () {
                    var saveBasketsScope = angular.element('.ml-ppos-dashboard-saved-bag-widget-content')
                        .find('div:first').scope();

                    if (saveBasketsScope) {
                        saveBasketsScope.initializeSavedBasketsDataModel();
                    }
                };

                $scope.init();
            }]);
}(window.angular));
