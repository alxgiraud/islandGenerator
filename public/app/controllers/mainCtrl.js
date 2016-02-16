/*global app*/
app.controller('mainCtrl', ['$scope', 'mapServices', 'genericServices', 'Biome', function ($scope, mapServices, genericServices, Biome) {
    'use strict';

    var biome = new Biome(45, Math.round(45 * Math.sqrt(3) / 2));

    mapServices.initMap();

    /* Dropdown mode */
    $scope.modes = [
        {
            id: 0,
            name: 'Mixed'
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
        $scope.selectedMode = $scope.modes[id];
        mapServices.drawGrid(biome, $scope.isGrey, $scope.selectedMode.id);
    };

    /* Color mode */
    $scope.isGrey = false;
    $scope.onClickColorMode = function (isGrey) {
        mapServices.drawGrid(biome, $scope.isGrey, $scope.selectedMode.id);
    };

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
            value: 10,
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
        biome.setPerlinNoise($scope.perlin.intensity.value, $scope.perlin.frequency.value, $scope.perlin.octave.value);
        mapServices.drawGrid(biome, $scope.isGrey, $scope.selectedMode.id);
    };

    /* Button Refresh Perlin */
    $scope.refreshNoise = function () {
        biome.perlinSeed = Math.random();
        $scope.onChangePerlin();
    };

    $scope.gradients = {
        quantity: {
            id: 4,
            value: 3,
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
        if (biome.gradientSeeds.length < $scope.gradients.quantity.value) {
            biome.addGradientSeeds($scope.gradients.quantity.value - biome.gradientSeeds.length);

        } else if (biome.gradientSeeds.length > $scope.gradients.quantity.value) {
            biome.removeSeeds(biome.gradientSeeds.length - $scope.gradients.quantity.value);
        }

        biome.setGradients($scope.gradients.radius.value, $scope.gradients.intensity.value);
        mapServices.drawGrid(biome, $scope.isGrey, $scope.selectedMode.id);
    };

    /* Button Refresh Gradients */
    $scope.refreshGradients = function () {
        biome.setGradientSeeds($scope.gradients.quantity.value);
        $scope.onChangeGradients();
    };

    $scope.downloadPdf = function () {
        mapServices.downloadPdf();
    };

    $scope.browserCompliant = (!genericServices.isInternetExplorer() && !genericServices.isSafari());
    $scope.downloadPng = function () {
        mapServices.downloadPng();
    };

    biome.setGradientSeeds($scope.gradients.quantity.value);
    biome.setGradients($scope.gradients.radius.value, $scope.gradients.intensity.value);
    $scope.refreshNoise();
}]);
