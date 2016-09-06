
/**
 * Receipt Service.
 *
 * @author Will Mitchell
 *
 */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('receiptService',
        ['dataService', function (dataService) {


            return {
                printOrderReceipt : function (orderId, storeId, csrId) {

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=PrintReceiptPPOS&sendEmail=false&storeID='+storeId +'&csrID='+csrId;

                    console.log(serviceUrl);
                    return dataService.getData(serviceUrl);
                },

                emailOrderReceipt: function (orderId,storeId, csrId, parmEmail) {

                    var email = parmEmail || null;


                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailConfirmPPOS&storeID='+storeId+'&csrID='+csrId+
                         '&emailOverride='+email;


                    return dataService.getData(serviceUrl);
                },

                emailPickupReady: function (orderId, storeId, csrId, parmEmail){

                    var email = parmEmail || null;

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailPickupReadyPPOS&storeID='+storeId+'&csrID='+csrId+
                        '&emailOverride='+email;

                    return dataService.getData(serviceUrl);
                },

                emailPickupDone: function (orderId, storeId, csrId, parmEmail){

                    var email = parmEmail || null;

                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=EmailPickupDonePPOS&storeID='+storeId+'&csrID='+csrId+
                        '&emailOverride='+email;

                    return dataService.getData(serviceUrl);
                },

                printPickupDone: function (orderId, storeId, csrId){
                    var serviceUrl = '/api/orders/' + orderId +
                        '/notification?templateID=PrintPickupDonePPOS&sendEmail=false&storeID='+storeId+
                        '&csrID='+csrId;

                    return dataService.getData(serviceUrl);
                }



            };
        }]);
}(window.angular));
