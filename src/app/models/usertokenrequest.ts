import { User } from './user/user';
import { D1Service } from './d1service';

export class UserTokenRequest {
    user: User;
    service: D1Service;

    contructor(user?: User, service?: D1Service){
        this.user = user;
        this.service = service;
    }
}