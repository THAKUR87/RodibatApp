/*! CardReaderService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('cardReaderService',
        ['$q', '$log', 'dataService', function ($q, $log, dataService) {
            return {
                /**
                 * This function activates the card reader sdk
                 * @returns {*} A deferred.promise
                 */
                activateSDK: function () {
                    $log.debug('cardReaderService: activateSDK');

                    var deferred = $q.defer();

                    if (!window.unimag.isSDKActive()) {
                        window.unimag.activateSDK(function () {
                            $log.debug('cardReaderService: activateSDK: activated');
                            deferred.resolve({'status': 'activated'});
                        });
                    } else {
                        $log.debug('cardReaderService: activateSDK: already active');
                        deferred.resolve({'status': 'already active'});
                    }

                    return deferred.promise;
                },

                /**
                 * This function tells the card reader to prepare for a card scan.
                 * @returns {*} A deferred.promise
                 */
                scanCard: function () {
                    $log.debug('cardReaderService: scanCard');

                    var deferred = $q.defer();
                    window.unimag.startTaskSwipe(function (task, taskNotif, info) {
                        $log.debug('cardReaderService: scanCard: startTaskSwipe: ' + taskNotif);

                        var E = window.unimag.TaskNotifEnum;
                        switch (taskNotif) {
                            case E.StartFailed:
                                deferred.reject(task + ' task failed to start: ' + info.StartFailedReason);
                                break;
                            case E.Started:
                                break;
                            case E.Stopped:
                                if (!info.ok) {
                                    deferred.reject('swipe failed');
                                }
                                if (info.data) {
                                    deferred.resolve(info.data);
                                }
                                break;
                        }
                    });

                    return deferred.promise;
                },

                /**
                 * This function tries to connect to the card reader device.
                 * @returns {*} A deferred.promise
                 */
                readerConnect: function () {
                    $log.debug('cardReaderService: readerConnect');

                    var deferred = $q.defer();

                    window.unimag.isReaderConnected(function (connected) {
                        $log.debug('cardReaderService: readerConnect: connected: ' + connected);

                        if (connected) {
                            $log.debug('cardReaderService: readerConnect: already connected');
                            deferred.resolve('Connected');
                        } else {
                            $log.debug('cardReaderService: readerConnect: connecting');
                            window.unimag.startTaskConnect(function (task, taskNotif, info) {
                                $log.debug('cardReaderService: readerConnect: startTaskConnect' + taskNotif);
                                var E = window.unimag.TaskNotifEnum;
                                switch (taskNotif) {
                                    case E.StartFailed:
                                        deferred.reject(task + ' task failed to start: ' + info.StartFailedReason);
                                        break;
                                    case E.Started:
                                        break;
                                    case E.Stopped:
                                        if (!info.ok) {
                                            deferred.reject('Timed-out');
                                        } else {
                                            deferred.resolve('Connected');
                                        }
                                        break;
                                }
                            });
                        }
                    });

                    return deferred.promise;
                },

                /**
                 * This function tries to clear any running tasks.
                 * @returns {*} A deferred.promise
                 */
                clearRunningTasks: function () {
                    $log.debug('cardReaderService: clearRunningTasks');

                    var deferred = $q.defer();

                    if (window.unimag.isSDKActive()) {
                        window.unimag.getRunningTask(function (task) {
                            $log.debug('cardReaderService: clearRunningTasks: task: ' + task);
                            if (task) {
                                window.unimag.stopTask();
                                deferred.resolve('tasks cleared');
                            } else {
                                deferred.resolve('no task to clear');
                            }
                        });
                    } else {
                        $log.debug('cardReaderService: clearRunningTasks: no running tasks');
                        deferred.resolve('no task to clear');
                    }

                    return deferred.promise;
                },

                /**
                 * This function tries to authorize the credit card with a post to the back-end.
                 * @param basketId The id of the basket.
                 * @param data The json data to send to the back-end during the post.
                 * @returns {*} A deferred.promise
                 */
                authorizeCard: function (basketId, data) {
                    $log.debug('cardReaderService: authorizeCard');

                    var serviceUrl = '/api/baskets/' + basketId + '/payment/authorize';

                    return dataService.postData(serviceUrl, data);
                }
            };
        }]);
}(window.angular));