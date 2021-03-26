import { Injectable } from '@angular/core';
import { User } from '../models/user/user';
import { D1Service } from '../models/d1service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_ID_KEY = 'auth-user-id';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {

  }

  public signOut(): void{
    localStorage.clear();
  }

  public saveToken(token: string): void{
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken():string{
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUserId(userId: string): void{
	  localStorage.removeItem(USER_ID_KEY);
    localStorage.setItem(USER_ID_KEY, userId);
  }

  public saveUser(user: User): void{
	  localStorage.removeItem(USER_KEY);
	  localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User{
	  return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public addTokensToSavedUser(d1service: D1Service): void{
    const user: User = this.getUser();
    user.userTokens = user.userTokens + d1service.serviceGivingAmount;
    this.saveUser(user);
  }

  public loggedIn(): boolean{
	  return localStorage.getItem(USER_KEY) !== null && localStorage.getItem(TOKEN_KEY) !== null && !this.isTokenExpired() && localStorage.getItem(USER_KEY) !== null;
  }

  public getUserId(){
    return localStorage.getItem(USER_ID_KEY);
  }

  public isTokenExpired(){
     const expiry = (JSON.parse(atob(localStorage.getItem(TOKEN_KEY).split('.')[1]))).exp;	
  	 return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
