import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Challenge } from 'src/app/models/challenge/challenge';
import { retry, catchError } from 'rxjs/operators';
import { Match } from 'src/app/models/match';
import { MessageResponse } from 'src/app/models/messageresponse';


const CHALLENGES_API = '/challengesapi/challenges';

@Injectable({
  providedIn: 'root'
})
export class ChallengeServiceService {

  constructor(private httpClient: HttpClient) {

  }
  
  private handleError<T>(operation = 'operation', result ?: T){
    return(error: HttpErrorResponse): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    };
  }

  private log(message: string): void{
    console.log(message);
  }

  getChallengeById(challengeId: string): Observable<Challenge>{
    return this.httpClient.get<Challenge>(CHALLENGES_API + '/search?challengeId=' + challengeId)
    .pipe(
      retry(1),
      catchError(this.handleError('getChallengeById', {} as Challenge))
    );
  }

  getAllChallenges(): Observable<Challenge[]>{
    return this.httpClient.get<Challenge[]>(CHALLENGES_API)
    .pipe(
      retry(1),
      catchError(this.handleError('getAllChallenges', []))
    );
  }

  getAllChallengesAfterOneWeek():Observable<Challenge[]>{
    return this.httpClient.get<Challenge[]>(CHALLENGES_API + '/upcoming')
    .pipe(
      retry(1),
      catchError(this.handleError('getAllChallengesAfterOneWeek', []))
    );
  }

  getAllChallengesBeforeOneWeek():Observable<Challenge[]>{
    return this.httpClient.get<Challenge[]>(CHALLENGES_API + '/now')
    .pipe(
      retry(1),
      catchError(this.handleError('getAllChallengesBeforeOneWeek', []))
    );
  }

  getAllActiveMatches(challengeId: string): Observable<Match[]>{
    return this.httpClient.get<Match[]>(CHALLENGES_API + '/matches/active?challengeId='+ challengeId)
    .pipe(
      retry(1),
      catchError(this.handleError('getAllActiveMatches', []))
    );
  }

  getAllInactiveMatches(challengeId: string): Observable<Match[]>{
    return this.httpClient.get<Match[]>(CHALLENGES_API + '/matches/inactive?challengeId='+ challengeId)
    .pipe(
      retry(2),
      catchError(this.handleError('getAllInactiveMatches', []))
    );
  }

  getAllUserMatches(userId: string, challengeId: string): Observable<Match[]>{
    return this.httpClient.get<Match[]>(CHALLENGES_API + '/users/matches/active?userId='+userId + '&challengeId='+ challengeId)
    .pipe(
      retry(1),
      catchError(this.handleError('getAllUserMatches', []))
    );
  }

  postChallenge(challenge: Challenge, jwtToken: string): Observable<{}>{
    return this.httpClient.post<Challenge>(CHALLENGES_API + '/add', challenge,
    {headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('postChallenge', {} as HttpErrorResponse))
    );
  }

  deleteChallengeById(challengeId: string, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(CHALLENGES_API + '?challengeId=' + challengeId,
    { headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('deleteChallengeById', {} as MessageResponse))
    );
  }

  updateChallenge(challenge: Challenge, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.put<MessageResponse>(CHALLENGES_API + '/update', challenge,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('updateChallenge', {} as MessageResponse))
    );
  }

  activateChallenge(challengeId: string, jwtToken: string): Observable<Challenge>{
    return this.httpClient.post<Challenge>(CHALLENGES_API + '/start?challengeId='+challengeId, 
    { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('activateChallenge', {} as Challenge))
    );
  }

}
