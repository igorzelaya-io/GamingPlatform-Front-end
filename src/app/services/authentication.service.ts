import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthRequest } from '../models/user/userauthrequest';
import { UserLoginRequest } from '../models/user/userloginrequest';
import { MessageResponse} from '../models/messageresponse';
import { JwtResponse } from '../models/jwtresponse';

const AUTH_API_ENDPOINT = '/auth';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient){
  
  }

  public login(credentials: UserLoginRequest): Observable<JwtResponse>{
    return this.httpClient.post<JwtResponse>(AUTH_API_ENDPOINT + '/login', credentials, httpOptions);
  }

  public signup(userAuthRequest: UserAuthRequest): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(AUTH_API_ENDPOINT + '/register', userAuthRequest, httpOptions);
  }
}
