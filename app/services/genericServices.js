/*global app*/
app.factory('genericServices', [function () {
    'use strict';
    return {
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        isInternetExplorer: function () {
            var isIe = false;
            return isIe || !!document.documentMode;
        },

        isSafari: function () {
            return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        }
    };
}]);
