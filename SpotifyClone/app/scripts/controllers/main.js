'use strict';

app.controller('MainCtrl', ['$scope', 'ahcHttp', 'audioComponents', 'trackCatalog', 'logger',
    function($scope, ahcHttp, audioComponents, trackCatalog, logger) {

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

            logger.info('mainController', $scope.player);
        }

        $scope.pause = function() {
            if (player.isPlaying) {
                player.pause();
            } else {
                player.resume();
            }

            logger.info('mainController', $scope.player);
        }

        $scope.toggleFave = function(song) {
            song.persistFavoriteStatus(!song.isFavourite);

            song.save();
            logger.info('mainController', $scope.player);

            ahcHttp.put('/song/' + song.name.replace(/\s/g, '-'), song);
        }
    }
]);