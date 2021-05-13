import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tournament } from '../models/tournament/tournament';
import { catchError, retry } from 'rxjs/operators';
import { MessageResponse } from '../models/messageresponse';
import { UserTournamentRequest } from '../models/user/user-tournament-request';
import { TreeNodeRequest } from '../models/treenoderequest';

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

  public addTournamentToUserTournamentList(userTournamentRequest: UserTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_TOURNAMENTS_API + '/add', userTournamentRequest,
    {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('addTournamentToUserTournamentList', {} as MessageResponse)));
  }

  public removeTournamentFromUserTournamentList(userTournamentRequest: UserTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization': 'Bearer ' + jwtToken,
		  }),
		  body: userTournamentRequest
	  }
    return this.httpClient.delete<MessageResponse>(USER_TOURNAMENTS_API + '/delete', httpOptions)
    .pipe(catchError(this.handleError('removeTournamentFromUserTournamentList', {} as MessageResponse)));
  }

  public addBracketToTournament(treeNodeRequest: TreeNodeRequest): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_TOURNAMENTS_API + '/matches/bracket', treeNodeRequest)
    .pipe(catchError(this.handleError('addBracketToTournament', {} as MessageResponse)));
  }

  public addWToUserTournament(userTournamentRequest: UserTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_TOURNAMENTS_API + '/matches/addW', userTournamentRequest,
    {headers: new HttpHeaders({'Authorization': 'Bearer '+ jwtToken })})
    .pipe(catchError(this.handleError('addWinToUserTournament', {} as MessageResponse)));
  }
  
  public addLToUserTournament(userTournamentRequest: UserTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(USER_TOURNAMENTS_API + '/matches/addL', userTournamentRequest,
    {headers: new HttpHeaders({'Authorization': 'Bearer '+ jwtToken })})
    .pipe(catchError(this.handleError('addLToUserTournament', {} as MessageResponse)));
  }

}