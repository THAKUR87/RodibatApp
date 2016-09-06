/*! PaymentService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular, _) {
    'use strict';

    angular.module('pointOfSaleApplication').service('paymentService',
        ['$q', '$log', 'dataService', 'configService', function ($q, $log, dataService, configService) {

            return {
                getPayments : function () {
                    $log.debug('paymentService: getPayments');

                    var serviceUrl = '/api/payments',
                        deferred = $q.defer();

                    dataService.getData(serviceUrl).then(function(successResult){
                            var payments = [],
                                availablePaymentTypes,
                                i, k;

                            // Get the Available Payment Types from the config
                            availablePaymentTypes = configService.
                                getConfig('app.ppos.checkout.available_payment_types');

                            // If we got something split it into an array
                            if (availablePaymentTypes && availablePaymentTypes.length > 0){
                                availablePaymentTypes = availablePaymentTypes.split(',');
                            }

                            // Get the payments that match the Available Payment Types,
                            // preserving the order provided by the config
                            for (i = 0; i < availablePaymentTypes.length; i++){
                                var availablePaymentType = availablePaymentTypes[i];

                                for (k = 0; k < successResult.data.length; k++) {
                                    var payment = successResult.data[k];

                                    if (availablePaymentType === payment.code){
                                        payment.name = payment.name.toLowerCase();
                                        payment.active = true;
                                        payments.push(payment);
                                    }
                                }
                            }

                            deferred.resolve(payments);
                        },
                        function(errorResult){
                            $log.error('paymentService: getPayments: Failed');
                            $log.error(errorResult);
                            deferred.reject(errorResult);
                        });

                    return deferred.promise;

                },

                addPayment : function (basketId, paymentToAdd) {
                    $log.debug('paymentService: addPayment');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment';

                    return dataService.postData(serviceUrl, paymentToAdd);
                },

                getCreditCardTypes : function () {
                    $log.debug('paymentService: getCreditCardTypes');

                    var serviceUrl = '/api/payments/creditCards';

                    return dataService.getData(serviceUrl);
                },

                releaseAuthorization: function (basketId, data) {
                    $log.debug('paymentService: releaseAuthorization');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment/releaseAuthorization';

                    return dataService.postData(serviceUrl, data);
                },

                getCreditCardOptions : function () {
                    $log.debug('paymentService: getCreditCardOptions');

                    var creditCardOptions = {
                        'number': '',
                        'type': '',
                        'types': [],
                        'cvv': '',
                        'postalCode': '',
                        'expiryMonth': {
                            'options': [
                                {
                                    'label': 'January',
                                    'value': '01'
                                },
                                {
                                    'label': 'February',
                                    'value': '02'
                                },
                                {
                                    'label': 'March',
                                    'value': '03'
                                },
                                {
                                    'label': 'April',
                                    'value': '04'
                                },
                                {
                                    'label': 'May',
                                    'value': '05'
                                },
                                {
                                    'label': 'June',
                                    'value': '06'
                                },
                                {
                                    'label': 'July',
                                    'value': '07'
                                },
                                {
                                    'label': 'August',
                                    'value': '08'
                                },
                                {
                                    'label': 'September',
                                    'value': '09'
                                },
                                {
                                    'label': 'October',
                                    'value': '10'
                                },
                                {
                                    'label': 'November',
                                    'value': '11'
                                },
                                {
                                    'label': 'December',
                                    'value': '12'
                                }
                            ],
                            'selectedOption': ''
                        },
                        'expiryYear': {
                            'options': [
                                {
                                    'label': '2015',
                                    'value': '2015'
                                },
                                {
                                    'label': '2016',
                                    'value': '2016'
                                },
                                {
                                    'label': '2017',
                                    'value': '2017'
                                },
                                {
                                    'label': '2018',
                                    'value': '2018'
                                },
                                {
                                    'label': '2019',
                                    'value': '2019'
                                },
                                {
                                    'label': '2020',
                                    'value': '2020'
                                },
                                {
                                    'label': '2021',
                                    'value': '2021'
                                },
                                {
                                    'label': '2022',
                                    'value': '2022'
                                },
                                {
                                    'label': '2023',
                                    'value': '2023'
                                }
                            ],
                            'selectedOption': ''
                        }
                    };
                    return creditCardOptions;
                },
                getCashButtons : function () {
                    $log.debug('paymentService: getCashButtons');

                    var buttons = [
                        {
                            'label': '1',
                            'value': '1',
                            'ordinal': 1
                        },
                        {
                            'label': '2',
                            'value': '2',
                            'ordinal': 2
                        },
                        {
                            'label': '3',
                            'value': '3',
                            'ordinal': 3
                        },
                        {
                            'label': '4',
                            'value': '4',
                            'ordinal': 4
                        },
                        {
                            'label': '5',
                            'value': '5',
                            'ordinal': 5
                        },
                        {
                            'label': '6',
                            'value': '6',
                            'ordinal': 6
                        },
                        {
                            'label': '7',
                            'value': '7',
                            'ordinal': 7
                        },
                        {
                            'label': '8',
                            'value': '8',
                            'ordinal': 8
                        },
                        {
                            'label': '9',
                            'value': '9',
                            'ordinal': 9
                        },
                        {
                            'label': '0',
                            'value': '0',
                            'ordinal': 10
                        },
                        {
                            'label': '00',
                            'value': '00',
                            'ordinal': 11
                        },
                        {
                            'label': 'Delete',
                            'value': 'Delete',
                            'ordinal': 12
                        }
                    ];
                    buttons = _.sortByOrder(buttons, ['ordinal']);
                    return buttons;
                },
                basketCheckout : function (storeId, basketId, paymentToAdd) {
                    $log.debug('paymentService: basketCheckout');

                    var serviceUrl = '/api/baskets/' + basketId + '/checkout'+ '?storeId=' + storeId;
                    return dataService.postData(serviceUrl, paymentToAdd);
                }
            };
        }]);
}(window.angular, window._));
