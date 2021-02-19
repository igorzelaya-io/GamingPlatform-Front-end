export class JwtResponse {
    
    token: string;
    id: string;
    
    constructor(accessToken?: string, userId?: string){
        this.token = accessToken;
        this.id = userId;
    }

}