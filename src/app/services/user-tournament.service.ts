import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../models/tournament/tournament';
import { catchError, retry } from 'rxjs/operators';

const USER_TOURNAMENTS_API = '/usertournamentsapi/userTournaments';

@Injectable({
  providedIn: 'root'
})
export class UserTournamentService {

  constructor(private httpClient: HttpClient) {
	
	}

  private handleError<T>(operation = 'operation', result ?: T){
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    };
  }

  private log(message: string): void{
    console.log(message);
  }

  public getAllTournamentsFromUser(userId: string): Observable<Array<Tournament>>{
	return this.httpClient.get<Array<Tournament>>(USER_TOURNAMENTS_API + '?userId=' + userId).pipe(
		retry(1), catchError(this.handleError('getAllTournamentsFromUser', [] as Array<Tournament>)));
  }

}
