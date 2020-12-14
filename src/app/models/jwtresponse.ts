export class JwtResponse {
    
    accessToken: string;
    tokenType:string;
    userId: string;
    
    constructor(accessToken?: string, userId?: string){
        this.accessToken = accessToken;
        this.userId = userId;
    }

}