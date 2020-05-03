import {SongModel} from './song.model';

export class LobbyModel {
    // tslint:disable-next-line:max-line-length
    constructor(public name: string, public password: string, public description: string, public allowedUsers: number, public userId?: string, public videoTime?: number, public joinedUsers?: string[], public id?: string, public currentSong?: string,
                // tslint:disable-next-line:max-line-length
                public songs?: SongModel[], public isPassword?: boolean, public isAdmin?: boolean, public readyUrl?: any, public isReady?: boolean) {

    }

}
