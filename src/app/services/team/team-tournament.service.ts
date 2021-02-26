import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../../models/tournament/tournament';
import { Team } from '../../models/team';

const TEAM_TOURNAMENT_API = 'http://localhost:8081/teamtournamentsapi';


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
	return this.httpClient.get<Array<Tournament>>(TEAM_TOURNAMENT_API + '/teamTournaments?teamId='+ teamId)
	.pipe(retry(1), catchError(this.handleError('getAllTournamentsFromTeam', [] as Array<Tournament>)));
  }

  public getTournamentFromTeamById(teamId: string , tournamentId: string){
	return this.httpClient.get<Tournament>(TEAM_TOURNAMENT_API + '/teamTournaments/search?teamId=' + teamId +'?tournamenId='+ tournamentId)
	.pipe(retry(1), catchError(this.handleError('getTournamentFromTeamById', {} as Tournament)));
  }

  public addTeamToTournament(team: Team, tournament: Tournament): Observable<string>{
    return this.httpClient.post<string>(TEAM_TOURNAMENT_API + '/teamTournaments/add', {team, tournament})
    .pipe(catchError(this.handleError('addTeamToTournament', {} as string)));
  }

  public removeTeamFromTournament(team: Team, tournament: Tournament): Observable<string> {
     return this.httpClient.request<string>('DELETE', TEAM_TOURNAMENT_API + '/teamTournaments/remove', {body: {team, tournament}}) 
    .pipe(catchError(this.handleError('removeTeamFromTournament', {} as string)));
  }

}
