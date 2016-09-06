(function () {
    'use strict';

    var application = {

        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            // Bind 'deviceready' event listeners
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        // 'deviceready' Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedDeviceReadyEvent'
        // function, we must explicitly call 'application.receivedDeviceReadyEvent(...);'
        onDeviceReady: function () {
            // TODO:
            //application.receivedDeviceReadyEvent('deviceready');

            // Hide the status bar
            window.StatusBar.hide();
        },

        // Update DOM on a Received Event
        receivedDeviceReadyEvent: function (id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received deviceready Event: ' + id);
        }
    };

    application.initialize();
}());
