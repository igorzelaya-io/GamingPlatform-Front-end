export class UserLoginRequest {
    userName: string;
    userPassword: string;

    constructor(userName?: string, userPassword?: string){
        this.userName = userName;
        this.userPassword = userPassword;
    }
}