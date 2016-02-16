/*global app, d3*/
app.factory('mapServices', [function () {
    'use strict';

    var constants = {
            HEX_WIDTH: 20
        },

        colors = {
            HEX_DEEPWATER: '#73b8ff',
            HEX_LIGHTWATER: '#b7dbff',
            HEX_SAND: '#dbd1b4',
            HEX_GRASSLAND: '#b8e97b',
            HEX_LIGHTFOREST: '#78ab46',
            HEX_DARKFOREST: '#567a32',
            HEX_DEFAULT: '#ffffff'
        },

        zoom = d3.behavior.zoom(),

        privateMethods = {
            onZoom: function () {
                d3.select('g')
                    .attr('transform', 'translate(' + d3.event.translate + ')' +
                        ' scale(' + d3.event.scale + ')');
            },

            getHexagonPoints: function (x, y, radius) {
                var points = [],
                    i,
                    angleDeg,
                    angleRad,
                    pointX,
                    pointY;

                for (i = 0; i < 6; i += 1) {
                    angleDeg = 60 * i;
                    angleRad = Math.PI / 180 * angleDeg;

                    pointX = x + radius * Math.cos(angleRad);
                    pointY = y + radius * Math.sin(angleRad);

                    points.push([pointX, pointY]);
                }

                return points;
            },

            getIntensity: function (biome, x, y, mode) {
                var gradient = biome.gradients[x][y],
                    perlin = biome.perlinNoise[x][y];

                if (mode === 0) {
                    return Math.max(gradient - perlin, 0);
                }
                if (mode === 1) {
                    return perlin;
                }
                if (mode === 2) {
                    return gradient;
                }
                return 0;
            },

            getColor: function (intensity, isGrey) {

                if (isGrey) {
                    return 'rgb(' +
                        Math.round(255 - intensity * 256) + ',' +
                        Math.round(255 - intensity * 256) + ',' +
                        Math.round(255 - intensity * 256) + ')';
                }

                if (intensity > 0.8) {
                    return colors.HEX_DARKFOREST;
                }
                if (intensity > 0.6) {
                    return colors.HEX_LIGHTFOREST;
                }
                if (intensity > 0.2) {
                    return colors.HEX_GRASSLAND;
                }
                if (intensity > 0.1) {
                    return colors.HEX_SAND;
                }
                if (intensity > 0) {
                    return colors.HEX_LIGHTWATER;
                }
                if (intensity === 0) {
                    return colors.HEX_DEEPWATER;
                }

                return colors.HEX_DEFAULT;
            }
        };

    return {
        initMap: function () {
            d3.select('#svgMapContainer')
                .append('svg')
                .attr('width', '100%')
                .attr('height', 600)
                .call(zoom.on('zoom', privateMethods.onZoom).scaleExtent([0.5, 10]))
                .append('g');
        },

        drawGrid: function (biome, isGrey, mode) {
            var chunks = biome.chunks,
                height = constants.HEX_WIDTH * Math.sqrt(3) / 2,
                radius = constants.HEX_WIDTH / 2,
                x = 0,
                y = 0,
                i,
                j,
                intensity,
                color,
                colorStroke,
                strokeWidth,
                hex;

            for (i = 0; i < chunks.length; i += 1) {

                y = (i % 2 !== 0) ? radius * Math.sqrt(3) / 2 : 0;
                x += constants.HEX_WIDTH * 3 / 4;

                for (j = 0; j < chunks[i].length; j += 1) {

                    y += height;

                    intensity = privateMethods.getIntensity(biome, i, j, mode);
                    color = privateMethods.getColor(intensity, isGrey);
                    colorStroke = (isGrey) ? 'black' : 'lightgrey';
                    strokeWidth = (isGrey) ? 0.5 : 0;

                    hex = d3.select('#x' + i + 'y' + j);
                    if (hex.empty()) {
                        d3.select('g')
                            .append('polygon')
                            .attr('id', 'x' + i + 'y' + j)
                            .attr('points', privateMethods.getHexagonPoints(x, y, radius))
                            .attr('fill', color)
                            .attr('stroke', colorStroke)
                            .attr('stroke-width', strokeWidth);
                    } else {
                        hex.attr('fill', color)
                            .attr('stroke', colorStroke)
                            .attr('stroke-width', strokeWidth);
                    }
                }
            }
        },

        clearGrid: function () {
            d3.selectAll('polygon').remove();
        }
    };

}]);
