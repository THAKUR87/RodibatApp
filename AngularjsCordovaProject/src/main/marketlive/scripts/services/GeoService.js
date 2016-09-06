/*! GeoService.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('geoService',
        ['$log', '$q', function ($log, $q) {

			return {

				getUserGeoLocation : function () {
					var deferred = $.Deferred();

					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
					}

					return deferred.promise();
				},
				
				getGeoLocationByAddress : function (address) {
					var deferred = $q.defer();

					var geocoder = new google.maps.Geocoder();

					geocoder.geocode( {'address' : address}, function (results, status) {
						if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
							$log.debug('Zero Result found for address : ' + address);
							// Reject the promise.
							deferred.reject(status);
						} else if (status === google.maps.GeocoderStatus.OK) {
							if (results.length >= 1) {
								var result0 = results[0];
								$log.debug('Formatted Address : ' + result0['formatted_address']);
								// Resolve the promise.
								deferred.resolve(result0.geometry.location);
							}
						}
					});

					return deferred.promise;
				}
			};
        }]);
}(window.angular));
