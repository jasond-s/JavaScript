'use strict';

app.directive('trackItem', function() {
    var template = '<div><b><i><span ng-bind="track.name"></span></i></b> by <span ng-bind="track.artist"></span>' +
        '<span class="animate-switch-container" ng-switch on="track.isFavourite">' +
        '<span ng-switch-when="true" ng-click="fave()" class="animate-switch glyphicon glyphicon-star btn btn-xs pull-right" ></span>' +
        '<span ng-switch-when="false" ng-click="fave()" class="animate-switch glyphicon glyphicon-star-empty btn btn-xs pull-right" ></span>' +
        '</span>' +
        '<span class="animate-switch-container" ng-switch on="playicon">' +
        '<span ng-switch-when="false" ng-click="play()" class="glyphicon glyphicon-play btn btn-xs pull-right"></span>' +
        '<span ng-switch-when="true" ng-click="play()" class="glyphicon glyphicon-pause btn btn-xs pull-right"></span>' +
        '</span></div>';

    return {
        restrict: "E",
        rep1ace: true,
        template: template,
        scope: {
            track: '=',
            playicon: '=',
            favouriteaction: "&",
            playaction: "&"
        },
        controller: function($scope, $element, $attrs, $location) {
            $scope.fave = function() {
                console.log('favourite: From directive');
                $scope.favouriteaction()
            }
            $scope.play = function() {
                console.log('play: From directive');
                $scope.playaction()
            }
        }
    };
});