import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from 'src/app/models/team';
import { Observable, of, pipe  } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TeamInviteRequest } from 'src/app/models/teamInviteRequest';
import { ImageModel } from '../../models/imagemodel';
import { User } from 'src/app/models/user/user';
import { TeamCreationRequest } from 'src/app/models/teamcreationrequest';


const TEAM_API = 'http://localhost:8081/teamsapi/teams';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

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

  public getTeamById(teamId: string): Observable<Team>{
    return this.httpClient.get<Team>(TEAM_API + '/search?teamId=' + teamId)
    .pipe(retry(1), catchError(this.handleError('getTeamById', {} as Team)));
  }
 
  public getTeamByName(teamName: string): Observable<Team>{
    return this.httpClient.get<Team>(TEAM_API + '/search?teamName=' + teamName)
    .pipe(retry(1), catchError(this.handleError('getTeamByName', {} as Team)));
  }

  public getAllTeams(): Observable<Team[]>{
    return this.httpClient.get<Team[]>(TEAM_API)
    .pipe(retry(1), catchError(this.handleError('getAllTeams', [])));
  }

  public getAllUsersInTeam(teamId: string): Observable<User[]>{
	return this.httpClient.get<User[]>(TEAM_API + '/users?teamId=' + teamId)
	.pipe(retry(1), catchError(this.handleError('getAllUsersInTeam', [])));
  }

  public postTeam(team: TeamCreationRequest, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(TEAM_API + '/create', team, 
	{ headers: new HttpHeaders( {'Authorization' : 'Bearer ' + jwtToken} )})
	.pipe(catchError(this.handleError('postTeam', {} as string)));
  }

  public postTeamWithImage(team: TeamCreationRequest, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(TEAM_API + '/create', team,
	{headers: new HttpHeaders( {'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('postTeamWithImage', {} as string)));
  }

  public addImageToTeam(team: Team, image: ImageModel): Observable<void>{
    const formData = new FormData();
    formData.append('image', image.imageFile, image.imageName);
    team.teamImage = formData;
    return;
  }

  public sendTeamInvite(teamInvite: TeamInviteRequest, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(TEAM_API + '/invite', teamInvite,
	{headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('sendTeamInvite', {} as string)));
  }

  public deleteTeam(teamId: string, jwtToken: string): Observable<string>{
    return this.httpClient.delete<string>(TEAM_API + '/delete?teamId=' + teamId,
	{headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('deleteTeam', {} as string)));
  }

  public banTeam(teamId: string, jwtToken: string): Observable<string>{
    return this.httpClient.delete<string>(TEAM_API + '/ban?teamId=' + teamId,
	{headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('banTeam',  {} as string)));
  }

  public deleteTeamField(teamId: string, teamField: string, jwtToken: string): Observable<string>{
    return this.httpClient.delete<string>(TEAM_API + '/update?teamId=' + teamId + '?teamField=' + teamField,
	{headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('deleteTeamField', {} as string)));
  }

  public updateTeam(team: Team, jwtToken: string): Observable<string>{
    return this.httpClient.put<string>(TEAM_API, team,
	{headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('updateTeam', {} as string)));
  }

  public updateTeamField(teamId: string, teamField: string, replaceValue: string, jwtToken: string): Observable<string>{
    return this.httpClient.put<string>(TEAM_API + '/update?teamId=' + teamId + 'teamField=' + teamField + '?replaceValue=' + replaceValue,
     {teamId, teamField, replaceValue}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken })})
    .pipe(catchError(this.handleError('updateTeamField', {} as string)));
  }

}
