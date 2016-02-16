/*global app*/
app.factory('Biome', ['Hexagon', 'Perlin', 'genericServices', function (Hexagon, Perlin, genericServices) {
    'use strict';
    /* Constructor */
    function Biome(width, height) {
        var i, j;

        this.width = width;
        this.height = height;

        this.chunks = [];
        this.gradients = [];
        this.perlinNoise = [];

        this.perlinSeed = Math.round();

        this.gradientSeeds = [];

        for (i = 0; i < width; i += 1) {
            this.chunks[i] = [];
            this.gradients[i] = [];
            this.perlinNoise[i] = [];

            for (j = 0; j < height; j += 1) {
                this.chunks[i][j] = new Hexagon(i, j);
                this.gradients[i][j] = 0;
                this.perlinNoise[i][j] = 0;
            }
        }
    }

    function getRing(center, radius) {
        var results = [],
            hex = center.add(new Hexagon(-1, 1, 0).scale(radius)),
            i,
            j;

        for (i = 0; i < 6; i += 1) {
            for (j = 0; j < radius; j += 1) {
                results.push(hex);
                hex = hex.getNeighbour(i);
            }
        }

        return results;
    }

    function getRings(gradient, radius) {
        var rings = [],
            i;
        rings[0] = [];
        rings[0][0] = gradient;

        for (i = 1; i <= radius; i += 1) {
            rings[i] = getRing(gradient, i);
        }

        return rings;
    }

    /* Public functions */
    Biome.prototype = {

        setGradientSeeds: function (quantity) {
            var i,
                gapWidth = this.width / 3,
                gapHeight = this.height / 3;

            for (i = 0; i < quantity; i += 1) {
                this.gradientSeeds[i] = [];
                this.gradientSeeds[i][0] = genericServices.rand(gapWidth - 1, this.width - gapWidth);
                this.gradientSeeds[i][1] = genericServices.rand(gapHeight - 1, this.height - gapHeight);
            }
        },

        addGradientSeeds: function (quantity) {
            var i,
                l = this.gradientSeeds.length,
                gapWidth = this.width / 3,
                gapHeight = this.height / 3;

            for (i = l; i < l + quantity; i += 1) {
                this.gradientSeeds[i] = [];
                this.gradientSeeds[i][0] = genericServices.rand(gapWidth - 1, this.width - gapWidth);
                this.gradientSeeds[i][1] = genericServices.rand(gapHeight - 1, this.height - gapHeight);
            }
        },

        removeSeeds: function (quantity) {
            var i;

            for (i = 0; i < quantity; i += 1) {
                this.gradientSeeds.pop();
            }
        },

        setGradients: function (radius, intensity) {
            var h,
                i,
                j,
                rings = [],
                gradient,
                ci,
                cj;

            this.clearGradients();
            for (h = 0; h < this.gradientSeeds.length; h += 1) {

                rings = getRings(this.chunks[this.gradientSeeds[h][0]][this.gradientSeeds[h][1]], radius);

                for (i = 0; i < this.chunks.length; i += 1) {
                    for (j = 0; j < this.chunks[i].length; j += 1) {
                        gradient = 0;

                        for (ci = 0; ci < rings.length; ci += 1) {
                            for (cj = 0; cj < rings[ci].length; cj += 1) {
                                if (rings[ci][cj].x === this.chunks[i][j].x && rings[ci][cj].y === this.chunks[i][j].y && rings[ci][cj].z === this.chunks[i][j].z) {
                                    gradient = (rings.length - ci) / rings.length * intensity;
                                }
                            }
                        }

                        if (typeof this.gradients[i][j] === 'undefined' || this.gradients[i][j] < gradient) {
                            this.gradients[i][j] = Math.max(Math.min(gradient, 1), 0);
                        }
                    }
                }
            }
        },

        clearGradients: function () {
            var i, j;
            for (i = 0; i < this.gradients.length; i += 1) {
                this.gradients[i] = [];
                for (j = 0; j < this.gradients[i].length; j += 1) {
                    this.gradients[i][j] = 0;
                }
            }
        },

        setPerlinNoise: function (intensity, frequency, octaves) {
            var perlin = new Perlin(),
                i,
                j,
                noise,
                octave;

            perlin.seed(this.perlinSeed);
            for (i = 0; i < this.chunks.length; i += 1) {
                for (j = 0; j < this.chunks[i].length; j += 1) {

                    noise = 0;

                    for (octave = 1; octave <= octaves; octave += 1) {
                        noise += (perlin.simplex2(i / frequency * octave, j / frequency * octave) + 1) / (2 * octave);
                    }

                    this.perlinNoise[i][j] = Math.max(Math.min(Math.pow(noise, 1 / intensity), 1), 0);
                }
            }
        },

        setSize: function (width, height) {
            var l = this.chunks.length;
            while (this.chunks.length > width) {
                this.chunks.pop();
            }
        }
    };

    return Biome;
}]);
