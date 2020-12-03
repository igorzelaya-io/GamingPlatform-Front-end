export class JwtResponse {
    
    accessToken: string;
    tokenType:string;
    userName:string;
    userId: string;
    userEmail: string;
    userRoles: Array<string>;

    constructor(accessToken?: string, userName?: string, userId?: string, userEmail ?: string, userRoles ?: Array<string>){
        this.accessToken = accessToken;
        this.userName = userName;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userRoles = userRoles;
    }

}