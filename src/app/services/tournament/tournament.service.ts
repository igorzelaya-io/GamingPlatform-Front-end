import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tournament } from '../../models/tournament/tournament';
import {retry, catchError } from 'rxjs/operators';
import { Team } from '../../models/team';
import { TournamentCreationRequest } from '../../models/tournament/tournament-creation-request';
import { MessageResponse } from 'src/app/models/messageresponse';
import { Match } from '../../models/match';
import { MatchTournamentRequest } from '../../models/matchtournamentrequest';


const TOURNAMENTS_API = '/tournamentsapi/tournaments';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

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

  public getAllTournaments(): Observable<Tournament[]>{
    return this.httpClient.get<Tournament[]>(TOURNAMENTS_API)
    .pipe(retry(1), catchError(this.handleError('getAllTournaments', [])));
  }

  public getAllTournamentsAfterOneWeek(): Observable<Tournament[]>{
	  return this.httpClient.get<Tournament[]>(TOURNAMENTS_API + '/upcoming')
	  .pipe(retry(1), catchError(this.handleError('getAllTournamentsAfterOneWeek', [])));
  }

  public getAllTournamentsNow(): Observable<Tournament[]>{
	  return this.httpClient.get<Tournament[]>(TOURNAMENTS_API + '/now')
	  .pipe(retry(1), catchError(this.handleError('getAllTournamentsNow', [])));	
  }

  public getAllActiveTournamentMatches(tournamentId: string):Observable<Match[]>{
    return this.httpClient.get<Match[]>(TOURNAMENTS_API + '/matches/all?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllTournamentMatches', [])));
  }

  public getAllTournamentInactiveMatches(tournamentId: string): Observable<Match[]>{
    return this.httpClient.get<Match[]>(TOURNAMENTS_API + '/matches/inactive?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllTournamentInactiveMatches', [])));
  }

  public getAllUserActiveMatches(userId: string, tournamentId: string): Observable<Match[]>{
    return this.httpClient.get<Match[]>(TOURNAMENTS_API + '/user/matches/active?userId=' + userId + '&tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllUserActiveMatches', [])));
  }

  public getTournamentById(tournamentId: string): Observable<Tournament>{
    return this.httpClient.get<Tournament>(TOURNAMENTS_API + '/search?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getTournamentById', {} as Tournament)));
  }

  public getTournamentByName(tournamentName: string): Observable<Tournament>{
    return this.httpClient.get<Tournament>(TOURNAMENTS_API + '/search?tournamentName=' + tournamentName)
    .pipe(retry(1), catchError(this.handleError('getTournamentByName', {} as Tournament)));
  }

  public getAllTeamsOnTournament(tournamentId: string): Observable<Team[]>{
    return this.httpClient.get<Team[]>(TOURNAMENTS_API + '/teams?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllTeamsOnTournament', [])));
  }

  public postTournament(tournament: TournamentCreationRequest, jwtToken: string):Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TOURNAMENTS_API + '/save', tournament,
	    {headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('postTournament', {} as MessageResponse)));
  }

  public deleteTournament(tournamentId: string, jwtToken:string): Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(TOURNAMENTS_API + '/delete?tournamentId=' + tournamentId,
	  {headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('deleteTournament', {} as MessageResponse)));
  }

  public deleteTournamentField(tournamentId: string, tournamentField: string, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.delete<MessageResponse>(TOURNAMENTS_API + '/delete?tournamentId=' + tournamentId
                                                            + '?tournamentField=' + tournamentField,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('deleteTournamentField', {} as MessageResponse)));
  }

  public updateTournament(tournament: Tournament, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.put<MessageResponse>(TOURNAMENTS_API + '/update', tournament,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateTournament', {} as MessageResponse)));
  }

   public activateTournament(tournament: Tournament): Observable<Tournament>{
    return this.httpClient.post<Tournament>(TOURNAMENTS_API + '/start', tournament)
    .pipe(catchError(this.handleError('activateTournament', {} as Tournament)));
  }
}
