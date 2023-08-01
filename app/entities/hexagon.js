/*global app*/
app.factory('Hexagon', [function () {
    'use strict';

    function Hexagon(x, y, z) {
        // construction by offset coordinates
        if (typeof z === 'undefined') {
            var hex = this.convertOffsetToCube(parseInt(x, 10), parseInt(y, 10));
            this.x = hex.x;
            this.y = hex.y;
            this.z = hex.z;

        } else {
            this.x = parseInt(x, 10);
            this.y = parseInt(y, 10);
            this.z = parseInt(z, 10);
        }
    }

    Hexagon.prototype = {
        convertOffsetToCube: function (col, row) {
            var x = col,
                z = (col % 2 === 0) ? row - (col + 1) / 2 : row - col / 2,
                y = -x - z,
                hex = new Hexagon(x, y, z);
            return hex.round();
        },

        round: function () {
            var x = Math.round(this.x),
                y = Math.round(this.y),
                z = Math.round(this.z),
                xDiff = Math.abs(x - this.x),
                yDiff = Math.abs(y - this.y),
                zDiff = Math.abs(z - this.z);

            if (xDiff > yDiff && xDiff > zDiff) {
                x = -y - z;
            } else {
                if (yDiff > zDiff) {
                    y = -x - z;
                } else {
                    z = -x - y;
                }
            }
            return new Hexagon(x, y, z);
        },

        scale: function (k) {
            return new Hexagon(this.x * k, this.y * k, this.z * k);
        },

        add: function (hex) {
            return new Hexagon(this.x + hex.x, this.y + hex.y, this.z + hex.z);
        },

        getNeighbour: function (direction) {
            var directions = [
                    new Hexagon(1, 0, -1),
                    new Hexagon(1, -1, 0),
                    new Hexagon(0, -1, 1),
                    new Hexagon(-1, 0, 1),
                    new Hexagon(-1, 1, 0),
                    new Hexagon(0, 1, -1)
                ];
            return this.add(directions[direction]);
        }
    };

    return Hexagon;
}]);
