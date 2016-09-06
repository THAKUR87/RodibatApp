/*! AppSpinner.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

window.angular = window.angular || {};

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').directive('mlAppSpinner',
        ['$log','$timeout', '$translate',
            function ($log, $timeout, $translate) {
                // Return the directive object
                return {
                    restrict: 'E',
                    templateUrl: 'views/common/AppSpinner.html',
                    scope: {},
                    link: function (scope) {
                        scope.closeBtnTxt = 'Close';
                        scope.requestTimedOut = 'Request timed out. Please try again.';

                        /**
                         * This function is used to Initialize the Scope.
                         */
                        scope.init = function () {
                            scope.displaySpinner = false;
                            scope.timer = null;
                            scope.timerLimit = 30000;
                            scope.timerLimitExceeded = false;
                        };

                        /**
                         * This function listens for 'toggleSpinner' event and then
                         * displays or hides the spinner based on the data's active boolean.
                         */
                        scope.$on('toggleSpinner', function (event, data) {
                            $log.debug('mlAppSpinner: toggleSpinner: ' + data);
                            if (data.active === true) {
                                scope.cancelTimer();
                                scope.timer = $timeout(scope.timedOut, scope.timerLimit);
                                scope.displaySpinner = true;
                            } else {
                                $timeout.cancel(scope.timer);
                                scope.init();
                            }
                        });

                        /**
                         * This function is triggered when/if the timer runs out, and then updates
                         * the *timerLimitExceeded* scope property.
                         */
                        scope.timedOut = function () {
                            scope.timerLimitExceeded = true;
                        };

                        /**
                         * This function closes/hides the spinner display.
                         */
                        scope.close = function () {
                            if (scope.timerLimitExceeded) {
                                scope.cancelTimer();
                                scope.init();
                            }
                        };

                        /**
                         * This function sets the string messages from the app resources, but
                         * if they're not found in the resources, because the user isn't logged in yet,
                         * then it'll just use the default/fallback *hardcoded* messages.
                         */
                        scope.setMessages = function () {
                            // Get the string for the close button.
                            $translate('btn.ppos.close').then(function (value) {
                                if (value !== 'btn.ppos.close') {
                                    scope.closeBtnTxt = value;
                                }
                            });

                            // Get the string for the *request timed out* message
                            $translate('msg.ppos.requestTimedOut').then(function (value) {
                                if (value !== 'msg.ppos.requestTimedOut') {
                                    scope.requestTimedOut = value;
                                }
                            });
                        };

                        /**
                         * This function cancels the timer if it's running and resets
                         * the *timerLimitExceeded* boolean property.
                         */
                        scope.cancelTimer = function () {
                            if (scope.timer) {
                                $timeout.cancel(scope.timer);
                                scope.timer = null;
                            }

                            scope.timerLimitExceeded = false;
                        };

                        /**
                         * Clean up the timer on destroy.
                         */
                        scope.$on('$destroy', function () {
                                scope.cancelTimer();
                            }
                        );

                        // Initialize the scope.
                        scope.init();
                        // Try to set the Messages.
                        scope.setMessages();
                    }
                };
            }]);
}(window.angular));

