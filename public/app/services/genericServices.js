/*global app*/
app.factory('genericServices', [function () {
    'use strict';
    return {
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    };
}]);
