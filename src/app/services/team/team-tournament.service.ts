import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../../models/tournament/tournament';
import { Team } from '../../models/team';
import { MessageResponse } from 'src/app/models/messageresponse';
import { TeamTournamentRequest } from '../../models/teamtournamentrequest';
import { HttpHeaders } from '@angular/common/http';
import { Match } from 'src/app/models/match';

const TEAM_TOURNAMENT_API = '/teamtournamentsapi/teamTournaments';


@Injectable({
  providedIn: 'root'
})
export class TeamTournamentService {

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
  
  public getTeamMatchFromTournament(matchId: string, tournamentId: string): Observable<Match>{
    return this.httpClient.get<Match>(TEAM_TOURNAMENT_API + '/teamTournaments/matches/search?matchId=' + matchId + '?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getMatchFromTournament', {} as Match)));
  }
  
  public getAllActiveFifaMatchesFromTournament(teamId: string, tournamentId: string): Observable<Array<Match>>{
    return this.httpClient.get<Array<Match>>(TEAM_TOURNAMENT_API + '/fifa/matches/active/all?teamId=' + teamId + '?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllActiveFifaTournamentsFromTournament', [])));
  }

  public getAllActiveCodMatchesFromTournament(teamId:string, tournamentId: string): Observable<Array<Match>>{
    return this.httpClient.get<Array<Match>>(TEAM_TOURNAMENT_API + '/cod/matches/active/all?teamId=' + teamId + '?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllActiveCodTournamentsFromTournament', [])));
  }

  public getAllInactiveFifaMatchesFromTournament(teamId: string, tournamentId: string): Observable<Array<Match>>{
    return this.httpClient.get<Array<Match>>(TEAM_TOURNAMENT_API + '/fifa/matches/inactive/all?teamId=' + teamId + '?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllInactiveFifaTournamentsFromTournament', [])));
  }

  public getAllInactiveCodMatchesFromTournament(teamId: string, tournamentId: string): Observable<Array<Match>>{
    return this.httpClient.get<Array<Match>>(TEAM_TOURNAMENT_API + '/cod/matches/inactive/all?teamId=' + teamId + '?tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getAllInactiveFifaTournamentsFromTournament', [])));
  }

  public getAllFifaTournamentsFromTeam(teamId: string): Observable<Array<Tournament>>{
	  return this.httpClient.get<Array<Tournament>>(TEAM_TOURNAMENT_API + '/fifa/all?teamId='+ teamId)
	  .pipe(retry(1), catchError(this.handleError('getAllTournamentsFromTeam', [] as Array<Tournament>)));
  }

  public getAllCodTournamentsFromTeam(teamId: string): Observable<Array<Tournament>>{
	  return this.httpClient.get<Array<Tournament>>(TEAM_TOURNAMENT_API + '/cod/all?teamId='+ teamId)
	  .pipe(retry(1), catchError(this.handleError('getAllTournamentsFromTeam', [] as Array<Tournament>)));
  }

  public getFifaTournamentFromTeamById(teamId: string , tournamentId: string): Observable<Tournament>{
	  return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/fifa/search?teamId=' + teamId +'?tournamenId='+ tournamentId)
	  .pipe(retry(1), catchError(this.handleError('getTournamentFromTeamById', {} as Tournament)));
  }

  public getCodTournamentFromTeamById(teamId: string , tournamentId: string): Observable<Tournament>{
	  return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/cod/search?teamId=' + teamId +'?tournamenId='+ tournamentId)
	  .pipe(retry(1), catchError(this.handleError('getTournamentFromTeamById', {} as Tournament)));
  }

  public addTeamToFifaTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/fifa/add', teamTournamentRequest,
		  {headers: new HttpHeaders(
			      {'Authorization': 'Bearer ' + jwtToken})
	  	})
		  .pipe(catchError(this.handleError('teamTournamentRequest' , {} as MessageResponse)));
  }

  public addTeamToCodTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/cod/add', teamTournamentRequest,
		  {headers: new HttpHeaders(
			      {'Authorization': 'Bearer ' + jwtToken})
	  	})
		  .pipe(catchError(this.handleError('teamTournamentRequest' , {} as MessageResponse)));
  }

  public removeTeamFromFifaTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse> {
    const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization': 'Bearer ' + jwtToken,
		  }),
		  body: teamTournamentRequest
	  }	 
	  return this.httpClient.delete<MessageResponse>(TEAM_TOURNAMENT_API + '/fifa/remove', httpOptions)
	  .pipe(catchError(this.handleError('removeTeamFromTournament', {} as MessageResponse)));
  }

  public removeTeamFromCodTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse> {
    const httpOptions = {
		  headers: new HttpHeaders({
			  'Authorization': 'Bearer ' + jwtToken,
		  }),
		  body: teamTournamentRequest
	  }	 
	  return this.httpClient.delete<MessageResponse>(TEAM_TOURNAMENT_API + '/cod/remove', httpOptions)
	  .pipe(catchError(this.handleError('removeTeamFromTournament', {} as MessageResponse)));
  }

  public activateTournament(tournament: Tournament): Observable<Tournament>{
    return this.httpClient.post<Tournament>(TEAM_TOURNAMENT_API + '/start', tournament)
    .pipe(catchError(this.handleError('activateTournament', {} as Tournament)));
  }
 
  

}
