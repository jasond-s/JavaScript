export interface ISimpleCallback {
    (myArgument: any): void;
}
export interface IListener {
    addEventListener(name: string, callback: ISimpleCallback): void;
}
export interface IAudio {
    play(): void;
    pause(): void;
    load(): void;
}
export interface IAudioSource extends IListener {
    src: string;
}
export declare class AudioHolder {
    public player: IAudio;
    public source: IAudioSource;
    constructor(player: IAudio, source: IAudioSource);
}
export declare class Player extends AudioHolder {
    public isPlaying: boolean;
    public currentlyPlayingSong: Song;
    public thing: string;
    constructor(player: IAudio, source: IAudioSource);
    public errorLoading(error: string): void;
    public play(song: Song): void;
    public pause(): void;
    public resume(): void;
    public toggleFavorite(): void;
}
export declare class Song {
    public name: string;
    public artist: string;
    public isFavourite: boolean;
    constructor(name: string, artist: string);
    public persistFavoriteStatus(state: boolean): void;
    public getResourceLocation(): string;
    public save(): void;
}
