/*global app*/
app.controller('mainCtrl', ['$scope', 'mapServices', 'genericServices', 'Biome', function ($scope, mapServices, genericServices, Biome) {
    'use strict';

    var world = new Biome(45, Math.round(45 * Math.sqrt(3) / 2));

    mapServices.initMap();

    /* Dropdown mode */
    $scope.modes = [
        {
            id: 0,
            name: 'Normal'
        },
        {
            id: 1,
            name: 'Perlin Only'
        }, {
            id: 2,
            name: 'Gradients Only'
        }
    ];

    $scope.selectedMode = $scope.modes[0];
    $scope.selectMode = function (id) {
        if (id === 1 && $scope.selectedTab[2]) {
            $scope.selectedTab[2] = false;
        } else if (id === 2 && $scope.selectedTab[1]) {
            $scope.selectedTab[1] = false;
        }

        $scope.selectedMode = $scope.modes[id];
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);
        mapServices.drawGrid(world, $scope.isGrey, $scope.biomesDistribution);
    };


    /* Color mode */
    $scope.isGrey = false;
    $scope.onClickColorMode = function (isGrey) {
        if ($scope.selectedTab[0]) {
            $scope.selectedTab[0] = false;
        }
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);
        mapServices.drawGrid(world, $scope.isGrey, $scope.selectedMode.id);
    };

    /* Island Size */
    $scope.islandSize = {
        id: 10,
        value: 75,
        min: 1,
        max: 100,
        step: 1
    };
    $scope.onChangeIslandSize = function () {
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);
        mapServices.drawGrid(world, $scope.isGrey, $scope.biomesDistribution);
    };

    $scope.resfreshAll = function () {
        world.setGradientSeeds($scope.gradients.quantity.value);
        world.setGradients($scope.gradients.radius.value, $scope.gradients.intensity.value);
        $scope.refreshNoise();
    };

    /* Biomes Distribution */
    $scope.biomesDistribution = [
        {
            label: 'Shallow Water',
            id: 101,
            value: 15,
            min: 0,
            max: 100,
            step: 1
        },
        {
            label: 'Sand',
            id: 102,
            value: 30,
            min: 0,
            max: 100,
            step: 1
        },
        {
            label: 'Grass',
            id: 103,
            value: 35,
            min: 0,
            max: 100,
            step: 1
        },
        {
            label: 'Forest',
            id: 104,
            value: 15,
            min: 0,
            max: 100,
            step: 1
        },
        {
            label: 'Dark Forest',
            id: 105,
            value: 5,
            min: 0,
            max: 100,
            step: 1
        }
    ];
    $scope.onChangeBiomesDistribution = function () {
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);
        mapServices.drawGrid(world, $scope.isGrey, $scope.selectedMode.id);
    };

    $scope.getTotalBiomes = function () {
        var total = 0,
            i;

        for (i = 0; i < $scope.biomesDistribution.length; i += 1) {
            total += $scope.biomesDistribution[i].value;
        }

        return total;
    };

    $scope.randomizeBiomes = function () {
        var rands = [
                genericServices.rand(0, 100),
                genericServices.rand(0, 100),
                genericServices.rand(0, 100),
                genericServices.rand(0, 100),
                genericServices.rand(0, 100)
            ],
            total = 0,
            i,
            roundedValues = [],
            totalRounded = 0,
            gap;

        for (i = 0; i < rands.length; i += 1) {
            total += rands[i];
        }

        for (i = 0; i < rands.length; i += 1) {
            roundedValues.push(Math.round(rands[i] * 100 / total));
            totalRounded += Math.round(rands[i] * 100 / total);
        }

        gap = totalRounded - 100;

        if (gap > 0) {
            for (i = 0; i < roundedValues.length; i += 1) {
                if (roundedValues[i] < 100) {
                    roundedValues[i] -= 1;
                    gap -= 1;
                    if (gap === 0) {
                        break;
                    }
                }
            }
        }

        if (gap < 0) {
            for (i = 0; i < roundedValues.length; i += 1) {
                if (roundedValues[i] > 0) {
                    roundedValues[i] += 1;
                    gap += 1;
                    if (gap === 0) {
                        break;
                    }
                }
            }
        }

        for (i = 0; i < $scope.biomesDistribution.length; i += 1) {
            $scope.biomesDistribution[i].value = roundedValues[i];
        }

        $scope.onChangeBiomesDistribution();
    };

    /* Perlin Noise */
    $scope.perlin = {
        intensity: {
            id: 1,
            value: 1,
            min: 0.01,
            max: 5,
            step: 0.1
        },
        frequency: {
            id: 2,
            value: 15,
            min: 0.01,
            max: 50,
            step: 1
        },
        octave: {
            id: 3,
            value: 1,
            min: 0.01,
            max: 10,
            step: 1
        }
    };
    $scope.onChangePerlin = function () {
        world.setPerlinNoise($scope.perlin.intensity.value, $scope.perlin.frequency.value, $scope.perlin.octave.value);
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);
        mapServices.drawGrid(world, $scope.isGrey, $scope.biomesDistribution);
    };

    /* Button Refresh Perlin */
    $scope.refreshNoise = function () {
        world.perlinSeed = Math.random();
        $scope.onChangePerlin();
    };

    /* Gradients */
    $scope.gradients = {
        quantity: {
            id: 4,
            value: 4,
            min: 1,
            max: 20,
            step: 1
        },
        intensity: {
            id: 5,
            value: 1,
            min: 0.01,
            max: 5,
            step: 0.1
        },
        radius: {
            id: 6,
            value: 10,
            min: 0,
            max: 25,
            step: 1
        }
    };

    $scope.onChangeGradients = function () {
        if (world.gradientSeeds.length < $scope.gradients.quantity.value) {
            world.addGradientSeeds($scope.gradients.quantity.value - world.gradientSeeds.length);

        } else if (world.gradientSeeds.length > $scope.gradients.quantity.value) {
            world.removeSeeds(world.gradientSeeds.length - $scope.gradients.quantity.value);
        }

        world.setGradients($scope.gradients.radius.value, $scope.gradients.intensity.value);
        world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);

        mapServices.drawGrid(world, $scope.isGrey, $scope.biomesDistribution);
    };

    /* Button Refresh Gradients */
    $scope.refreshGradients = function () {
        world.setGradientSeeds($scope.gradients.quantity.value);
        $scope.onChangeGradients();
    };

    $scope.downloadPdf = function () {
        mapServices.downloadPdf();
    };

    $scope.browserCompliant = (!genericServices.isInternetExplorer() && !genericServices.isSafari());
    $scope.downloadPng = function () {
        mapServices.downloadPng();
    };

    $scope.selectedTab = [true, false, false, false];

    /* Init the grid on load */
    world.setGradientSeeds($scope.gradients.quantity.value);
    world.setGradients($scope.gradients.radius.value, $scope.gradients.intensity.value);
    world.perlinSeed = Math.random();
    world.setPerlinNoise($scope.perlin.intensity.value, $scope.perlin.frequency.value, $scope.perlin.octave.value);
    world.setBiomes($scope.selectedMode.id, $scope.islandSize.value, $scope.biomesDistribution, $scope.isGrey);

    mapServices.drawGrid(world, $scope.isGrey, $scope.biomesDistribution);
}]);
