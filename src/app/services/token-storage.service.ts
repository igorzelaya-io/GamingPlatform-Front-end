import { Injectable } from '@angular/core';
import { User } from '../models/user/user';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

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

  public saveUser(user: User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public loggedIn(): boolean{
	return localStorage.getItem(USER_KEY) !== null && localStorage.getItem(TOKEN_KEY) !== null;
  }

  public getUser(){
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  public isTokenExpired(){
     const expiry = (JSON.parse(atob(localStorage.getItem(TOKEN_KEY).split('.')[1]))).exp;	
  	 return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
