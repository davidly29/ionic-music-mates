import {SongModel} from '../lobby/song.model';


export class PlaylistModel {
    constructor(public name: string, public userId: string, public username: string, public songs: SongModel[], public id?: string) {}
}
