'use strict';

describe("Player", function() {
    var player,
        song;

    beforeEach(function() {
        player = new Player();
        song = new Song('Helter Skelter', 'The Beatles');

        if (jasmine.addMatchers) {
            console.log('Jasmine matchers present.')
        }
    });

    it("should be able to play a Song", function() {
        player.play(song);

        expect(player.currentlyPlayingSong).toEqual(song);
    });

    describe("when song has been paused", function() {
        beforeEach(function() {
            player.play(song);
            player.pause();
        });

        it("should indicate that the song is currently paused", function() {
            expect(player.isPlaying).toBeFalsy();

            // demonstrates use of 'not' with a custom matcher, if they were present.
            expect(player.currentlyPlayingSong).toEqual(song);
        });

        it("should be possible to resume", function() {
            player.resume();

            expect(player.isPlaying).toBeTruthy();
            expect(player.currentlyPlayingSong).toEqual(song);
        });
    });

    describe("When interacting with favourite through the player", function() {
        // demonstrates use of spies to intercept and test method calls
        it("tells the current song if the user has made it a favorite", function() {
            spyOn(song, 'persistFavoriteStatus');

            player.play(song);
            player.toggleFavorite();

            expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
        });

        it("tells the current song if the user has unfavourited it", function() {
            spyOn(song, 'persistFavoriteStatus');
            song.isFavourite = true;

            player.play(song);
            player.toggleFavorite();

            expect(song.persistFavoriteStatus).toHaveBeenCalledWith(false);
        });
    });

    // Expected exceptions from the resume method.
    describe("resume", function() {
        it("should throw an exception if song is already playing", function() {
            player.play(song);

            expect(function() {
                player.resume();
            }).toThrow("song is already playing");
        });
    });
});