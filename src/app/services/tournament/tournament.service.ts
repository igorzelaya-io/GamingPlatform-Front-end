import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tournament } from '../../models/tournament/tournament';
import {retry, catchError } from 'rxjs/operators';
import { Team } from '../../models/team';
import { TournamentCreationRequest } from '../../models/tournament/tournament-creation-request';

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

  public getAllTournamentsNow(){
	return this.httpClient.get<Tournament[]>(TOURNAMENTS_API + '/now')
	.pipe(retry(1), catchError(this.handleError('getAllTournamentsNow', [])));	
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

  public postTournament(tournament: TournamentCreationRequest, jwtToken: string):Observable<string>{
    return this.httpClient.post<string>(TOURNAMENTS_API + '/save', tournament,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('postTournament', {} as string)));
  }

  public deleteTournament(tournamentId: string, jwtToken:string): Observable<string>{
    return this.httpClient.delete<string>(TOURNAMENTS_API + '/delete?tournamentId=' + tournamentId,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('deleteTournament', {} as string)));
  }

  public deleteTournamentField(tournamentId: string, tournamentField: string, jwtToken: string){
    return this.httpClient.delete<string>(TOURNAMENTS_API + '/delete?tournamentId=' + tournamentId
                                                            + '?tournamentField=' + tournamentField,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('deleteTournamentField', {} as string)));
  }

  public updateTournament(tournament: Tournament, jwtToken: string): Observable<string>{
    return this.httpClient.put<string>(TOURNAMENTS_API + '/update', tournament,
	{headers: new HttpHeaders( { 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('updateTournament', {} as string)));
  }
}
