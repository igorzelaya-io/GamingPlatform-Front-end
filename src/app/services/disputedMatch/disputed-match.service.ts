import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DisputedMatch } from '../../models/disputedmatch';
import { MessageResponse } from 'src/app/models/messageresponse';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisputedMatchService {

  private baseUrl: string = '/disputedMatches';
   
  constructor(private httpClient: HttpClient) {

  }

  private handleError<T>(operation = 'operation', result ?: T){
    return(error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    };
  }

  private log(message: string){
    console.log(message);
  }

  postDisputedMatch(disputedMatch: DisputedMatch): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(this.baseUrl, disputedMatch)
    .pipe(
      retry(1),
      catchError(this.handleError('postDisputedMatch', {} as MessageResponse))
    );
  }

  getDisputedMatchFromChallenge(challengeId: string, matchId: string): Observable<DisputedMatch>{
    return this.httpClient.get<DisputedMatch>(this.baseUrl + '?challengeId=' + challengeId + '&matchId=' + matchId)
    .pipe(
      retry(1),
      catchError(this.handleError('getDisputedMatchFromChallenge', {} as DisputedMatch))
    );
  }

  getDisputedMatchFromTournament(tournamentId: string, matchId: string): Observable<DisputedMatch>{
    return this.httpClient.get<DisputedMatch>(this.baseUrl + '?tournamentId=' + tournamentId + '&matchId=' + matchId)
    .pipe(
      retry(1),
      catchError(this.handleError('getDisputedMatchFromChallenge', {} as DisputedMatch))
    );
  }

  getAllDisputedMatches(): Observable<DisputedMatch[]>{
    return this.httpClient.get<DisputedMatch[]>(this.baseUrl)
    .pipe(
      retry(1),
      catchError(this.handleError('getAllDisputedMatches', []))
    );
  }

}
