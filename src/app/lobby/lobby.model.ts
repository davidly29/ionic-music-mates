export class LobbyModel {
    // tslint:disable-next-line:max-line-length
    constructor(public name: string, public password: string, public description: string, public allowedUsers: number, public userId?: string, public joinedUsers?: string[], public id?: string, public songs?: string[]) {

    }

}
