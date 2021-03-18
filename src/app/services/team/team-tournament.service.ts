import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../../models/tournament/tournament';
import { Team } from '../../models/team';
import { MessageResponse } from 'src/app/models/messageresponse';
import { TeamTournamentRequest } from '../../models/teamtournamentrequest';
import { HttpHeaders } from '@angular/common/http';

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

  public getAllTournamentsFromTeam(teamId: string): Observable<Array<Tournament>>{
	return this.httpClient.get<Array<Tournament>>(TEAM_TOURNAMENT_API + '?teamId='+ teamId)
	.pipe(retry(1), catchError(this.handleError('getAllTournamentsFromTeam', [] as Array<Tournament>)));
  }

  public getTournamentFromTeamById(teamId: string , tournamentId: string): Observable<Tournament>{
	return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/search?teamId=' + teamId +'?tournamenId='+ tournamentId)
	.pipe(retry(1), catchError(this.handleError('getTournamentFromTeamById', {} as Tournament)));
  }

  public addTeamToTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse>{
    	return this.httpClient.post<MessageResponse>(TEAM_TOURNAMENT_API + '/add', teamTournamentRequest,
		{headers: new HttpHeaders(
			{'Authorization': 'Bearer ' + jwtToken})
		})
		.pipe(catchError(this.handleError('teamTournamentRequest' , {} as MessageResponse)));
  }

  public removeTeamFromTournament(teamTournamentRequest: TeamTournamentRequest, jwtToken: string): Observable<MessageResponse> {
    const httpOptions = {
		headers: new HttpHeaders({
			'Authorization': 'Bearer ' + jwtToken,
		}),
		body: teamTournamentRequest
	}	 
	return this.httpClient.delete<MessageResponse>(TEAM_TOURNAMENT_API + '/remove', httpOptions)
	.pipe(catchError(this.handleError('removeTeamFromTournament', {} as MessageResponse)));
  }

}
