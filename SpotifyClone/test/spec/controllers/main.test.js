'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(module('angularTesterApp'));

    var MainCtrl,
        scope,
        song;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    describe('will contain references to control a few things in the view scope', function() {
        it('should attach a list of tracks to the scope', function() {
            expect(scope.tracks.length).toBe(8);
        });

        it('should add a new player the scope', function() {
            expect(scope.player).toBeDefined();
        });
    });

    describe('will delegate control of the tracks to the player', function() {
        beforeEach(function() {
            song = new Song('test', 'test');
        });

        describe('when interacting with the play controls', function() {

            it('should play song in player if user plays a new song', function() {
                scope.play(song);

                expect(scope.player.currentlyPlayingSong).toBe(song);
            });

            it('should pause song in player if user pauses', function() {
                scope.play(song);
                scope.pause();

                expect(scope.player.isPlaying).toBeFalsy();
            });

            it('should resume song in player if user plays paused song', function() {
                scope.play(song);
                scope.pause();
                scope.pause();

                expect(scope.player.isPlaying).toBeTruthy();
            });
        });

        describe('when interacting with the favourite controls', function() {

            it('should favourite song if user favourites it', function() {
                scope.toggleFave(song);

                expect(song.isFavourite).toBeTruthy();
            });

            it('should unfavourite song if user unfavourites it', function() {
                scope.toggleFave(song);
                scope.toggleFave(song);

                expect(song.isFavourite).toBeFalsy();
            });

        });
    });
});