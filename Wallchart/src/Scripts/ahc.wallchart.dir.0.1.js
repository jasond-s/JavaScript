// app.directive('wallchart', function() {
//     'use strict';

//     var template = '<div id="{{ name }}Resource"></div>' +
//         '<div id="{{ name }}Header"></div>' +
//         '<div id="{{ name }}Event"></div>' +
//         '<canvas id="{{ name }}" width="{{ width }}" height="{{ height }}">' +
//         '</canvas>';

//     // We will need to inject the toast handle to the the 
//     // wallchart so that it can be shared across the app. 
//     var toast = document.querySelector('#toast');

//     return {
//         restrict: "E",
//         rep1ace: true,
//         template: template,
//         scope: {
//             name: '@',
//             type: '@',
//             options: '=',
//             height: '=',
//             width: '=',
//             wallchart: '='
//         },
//         controller: function($scope, $element, $attrs, $location) {
//             $scope.wallchart = ahc.wallchart.factory($scope.type, $scope.name, $scope.options);
//         }
//     };
// });