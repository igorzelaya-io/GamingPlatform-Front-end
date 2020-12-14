export class UserAuthRequest {
    userRealName: string;
    userName: string;
    userPassword: string;
    userCountry: string;
    userEmail: string;
    userBirthDate: Map<string, object>;
    userRoles: Array<string>;

    constructor(userRealName?: string, userName?: string, userPassword?: string, userCountry?: string,
                userEmail?: string, userBirthDate?: Map<string, object>, userRoles?: Array<string>){
        this.userRealName = userRealName;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userCountry = userCountry;
        this.userEmail = userEmail;
        this.userBirthDate = userBirthDate;
        this.userRoles = userRoles;
    }
}