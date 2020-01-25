export class User {
    constructor(public id: string, public email: string, public userToken: string, public tokenExpiration: Date) {}

    get token() {
        if (!this.tokenExpiration || this.tokenExpiration <= new Date()) {
            return null;
        }
        return this.userToken;
    }
}
