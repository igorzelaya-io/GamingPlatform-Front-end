import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user-id';

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
	localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, userId);
  }

  public loggedIn(): boolean{
	return localStorage.getItem(USER_KEY) !== null && localStorage.getItem(TOKEN_KEY) !== null;
  }

  public getUserId(){
    return localStorage.getItem(USER_KEY);
  }

  public isTokenExpired(){
     const expiry = (JSON.parse(atob(localStorage.getItem(TOKEN_KEY).split('.')[1]))).exp;	
  	 return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
