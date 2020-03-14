import {SongModel} from '../lobby/song.model';

export class PlaylistModel {
    constructor(public name: string, public userId: string, public videoId: string, public songs: SongModel[], public id?: string) {}
}
