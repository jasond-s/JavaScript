'use strict';

app.controller('MainCtrl', ['$scope', 'nsHttp', 'audioComponents', 'trackCatalog', 'logger',
    function($scope, nsHttp, audioComponents, trackCatalog, logger) {

        // Var up all the stuff.
        var player = audioComponents.player,
            startSong = new Song('None', 'None');

        // Do all the view model type logic 
        player.play(startSong);

        // Scope up all the scope stuff.
        trackCatalog.getAll(function(tracks) {
            $scope.tracks = tracks;
        });

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

            nsHttp.put('/song/' + song.name.replace(/\s/g, '-'), song);
        }
    }
]);