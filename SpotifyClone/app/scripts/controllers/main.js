'use strict';

app.controller('MainCtrl', ['$scope', 'audioComponents', 'trackCatalog',
    function($scope, audioComponents, trackCatalog) {

        // Var up all the stuff.
        var tracks = trackCatalog.search(),
            player = audioComponents.player,
            startSong = new Song('None', 'None');


        // Do all the view model type logic 
        player.play(startSong);


        // Scope up all the scope stuff.
        $scope.tracks = tracks;

        $scope.player = audioComponents.player;

        $scope.play = function(song) {
            player.play(song);

            console.log(JSON.stringify($scope.player));
        }

        $scope.pause = function() {
            if (player.isPlaying) {
                player.pause();
            } else {
                player.resume();
            }

            console.log(JSON.stringify($scope.player));
        }

        $scope.toggleFave = function(song) {
            song.persistFavoriteStatus(!song.isFavourite);

            song.save();
            console.log(JSON.stringify($scope.player));
        }
    }
]);