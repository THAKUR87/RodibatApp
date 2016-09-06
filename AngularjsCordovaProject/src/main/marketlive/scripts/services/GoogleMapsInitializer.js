/*! GoogleMapsInitializer.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').factory('googleMapsInitializer',
        ['$window', '$q', function ($window, $q) {

			var googleMapsAPIDeferred = $q.defer();
			
			// Google map API script url.
			function getScriptUrl () {
				var scriptUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + 
					'&signed_in=true&callback=googleMapsAPIInitialized';

				return scriptUrl;
			}

			// Callback function - resolving promise after google maps api successfully loaded.
			$window.googleMapsAPIInitialized = googleMapsAPIDeferred.resolve;

			// Load google map API script.
			function loadScript () {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = getScriptUrl();
				document.body.appendChild(script);
			}

			// Start loading google maps api.
			loadScript();			

			// Usage: googleMapsInitializer.mapsInitialized.then(callback)
			return {
				mapsInitialized : googleMapsAPIDeferred.promise
			};
        }]);
}(window.angular));
