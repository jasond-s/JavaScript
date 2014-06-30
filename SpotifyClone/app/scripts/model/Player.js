'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};



var AudioHolder = (function () {
    function AudioHolder(player, source) {
        this.player = player;
        this.source = source;
    }
    return AudioHolder;
})();
exports.AudioHolder = AudioHolder;

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(player, source) {
        _super.call(this, player, source);

        this.isPlaying = false;
        this.currentlyPlayingSong = null;

        if (source) {
            source.addEventListener('error', this.errorLoading);
        }
    }
    Player.prototype.errorLoading = function (error) {
        console.log('error retriving source: ' + this.currentlyPlayingSong.getResourceLocation());
    };

    Player.prototype.play = function (song) {
        this.isPlaying = true;
        this.currentlyPlayingSong = song;

        if (this.player) {
            this.source.src = song.getResourceLocation();
            this.player.load();
            this.player.play();
        }
    };

    Player.prototype.pause = function () {
        this.isPlaying = false;

        if (this.player) {
            this.player.pause();
        }
    };

    Player.prototype.resume = function () {
        if (this.isPlaying) {
            throw new Error("song is already playing");
        }

        this.isPlaying = true;

        if (this.player) {
            this.player.play();
        }
    };

    Player.prototype.toggleFavorite = function () {
        this.currentlyPlayingSong.persistFavoriteStatus(!this.currentlyPlayingSong.isFavourite);
    };
    return Player;
})(AudioHolder);
exports.Player = Player;

var Song = (function () {
    function Song(name, artist) {
        this.name = name;
        this.artist = artist;
        this.isFavourite = false;
    }
    Song.prototype.persistFavoriteStatus = function (state) {
        this.isFavourite = state;
    };

    Song.prototype.getResourceLocation = function () {
        return "/data/audio/" + this.artist.split(' ').join('_') + '_' + this.name.split(' ').join('_') + '.ogg';
    };

    Song.prototype.save = function () {
    };
    return Song;
})();
exports.Song = Song;
//# sourceMappingURL=Player.js.map
