import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Challenge } from '../models/challenge';
import { catchError, retry } from 'rxjs/operators';

const USER_CHALLENGES_API = "/userchallengesapi/userChallenges";

@Injectable({
  providedIn: 'root'
})
export class UserChallengesService {

  constructor(private httpClient: HttpClient) {

  }

  private handleError<T>(operation: string = 'operation', result?: T){
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    }
  }

  private log(message: string): void{
    console.log(message);
  }

  public getAllUserChallenges(userId: string): Observable<Challenge[]>{
    return this.httpClient.get<Challenge[]>(USER_CHALLENGES_API + '/challenges?userId=' + userId)
    .pipe(retry(1), catchError(this.handleError('getAllUserChallenges', [])));
  } 

  
}
