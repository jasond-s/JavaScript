'use strict';

//
// EXPLICIT COMPILE COMMAND
//
// tsc -target ES5 .\Player.ts --module 'commonjs'.
//

/*
 * Callback :
 * Interface for a simple method callback.
 *
 * -----------------------------------------------------------------------------------------------
 */
export interface ISimpleCallback { 
    (myArgument: any): void;
}

/*
 * Listener :
 * Interface for adding a listener to a DOM elements.
 *
 * -----------------------------------------------------------------------------------------------
 */
export interface IListener {
    addEventListener(name: string, callback: ISimpleCallback): void;
}

/*
 * Audio :
 * Interface for the audio DOM elements.
 *
 * -----------------------------------------------------------------------------------------------
 */
export interface IAudio {
    play(): void;
    pause(): void;
    load(): void;
}

export interface IAudioSource extends IListener {
    src: string;
}

/*
 * Player :
 * The player has a lot of mutable state.
 *
 * -----------------------------------------------------------------------------------------------
 */
export class Player {
    // FIELDS
    public isPlaying: boolean;
    public currentlyPlayingSong: Song;
    public thing: string;
    // CONSTRUCTOR
    constructor(private player: IAudio, private source: IAudioSource) {
        this.isPlaying = false;
        this.currentlyPlayingSong = null;

        // If the source exists then attach error logger.
        if (source){
            source.addEventListener('error', this.errorLoading)
        }
    }

    // METHODS
    errorLoading(error: string): void {
        console.log('error retriving source: ' + this.currentlyPlayingSong.getResourceLocation());
    }

    play(song: Song): void {
        this.isPlaying = true;
        this.currentlyPlayingSong = song;

        // If the player had a DOM player element then use it.
        if (this.player) {
            this.source.src = song.getResourceLocation();
            this.player.load();
            this.player.play();
        }
    }

    pause(): void {
        this.isPlaying = false;

        if (this.player) {
            this.player.pause();
        }
    }

    resume(): void {
        if (this.isPlaying) {
            throw new Error("song is already playing");
        }

        this.isPlaying = true;

        if (this.player) {
            this.player.play();
        }
    }

    toggleFavorite(): void {
        this.currentlyPlayingSong.persistFavoriteStatus(!this.currentlyPlayingSong.isFavourite);
    }
}

/*
 * Song :
 * The song type has a simple immutable name and a mutable favourite state.
 *
 * -----------------------------------------------------------------------------------------------
 */
export class Song {
    // FIELDS
    public isFavourite: boolean;

    // CONSTRUCTOR
    constructor(public name:string, public artist: string) {
        this.isFavourite = false;
    }

    // METHODS
    persistFavoriteStatus(state: boolean): void {
        this.isFavourite = state;
    }

    getResourceLocation(): string {
        return "/data/audio/" + this.artist.split(' ').join('_') + '_' + this.name.split(' ').join('_') + '.ogg';
    }

    save(): void {
        // Do all of the stuff you need to do for the things.
    }
}