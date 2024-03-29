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
import { MatchTournamentRequest } from '../../models/matchtournamentrequest';
import { TreeNodeRequest } from '../../models/treenoderequest';

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
    return this.httpClient.get<Match>(TEAM_TOURNAMENT_API + '/matches/search?matchId=' + matchId + '&tournamentId=' + tournamentId)
    .pipe(retry(1), catchError(this.handleError('getMatchFromTournament', {} as Match)));
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
	  return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/fifa/search?teamId=' + teamId +'&tournamenId='+ tournamentId)
	  .pipe(retry(1), catchError(this.handleError('getTournamentFromTeamById', {} as Tournament)));
  }

  public getCodTournamentFromTeamById(teamId: string , tournamentId: string): Observable<Tournament>{
	  return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/cod/search?teamId=' + teamId +'&tournamenId='+ tournamentId)
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

  public uploadCodMatchResult(matchTournamentRequest: MatchTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/matches/cod/save', matchTournamentRequest,
     {headers: new HttpHeaders( {'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('uploadMatchResult', {} as MessageResponse)));
  }

  public uploadFifaMatchResult(matchTournamentRequest: MatchTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/matches/fifa/save', matchTournamentRequest,
    {headers: new HttpHeaders( {'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('uploadMatchResult', {} as MessageResponse)));
  }

  public addBracketToTournament(treeNodeRequest: TreeNodeRequest): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/matches/bracket', treeNodeRequest)
    .pipe(catchError(this.handleError('addBracketToTournament', {} as MessageResponse)));
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

}
