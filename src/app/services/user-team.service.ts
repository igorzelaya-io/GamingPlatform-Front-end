import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Team } from '../models/team';
import { catchError } from 'rxjs/internal/operators';
import { TeamInviteRequest } from '../models/teamInviteRequest';

const USER_TEAMS_API = 'http://localhost:8080/userteamapi/userTeams';
const USER_TEAMS_REQUEST_API = 'http://localhost:8080/userteamapi/userTeamRequests';

@Injectable({
  providedIn: 'root'
})
export class UserTeamService {


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

  public getAllUserTeams(userId: string): Observable<Team[]>{
    return this.httpClient.get<Team[]>(USER_TEAMS_API + '?userId=' + userId)
    .pipe(catchError(this.handleError('getAllUserTeams', [])));
  }

  public getAllUserTeamRequests(userId: string): Observable<TeamInviteRequest[]>{
    return this.httpClient.get<TeamInviteRequest[]>(USER_TEAMS_REQUEST_API + '?userId=' + userId)
    .pipe(catchError(this.handleError('getAllUserTeams', [])));
  }

  public getTeamById(userId: string , teamId: string): Observable<Team>{
    return this.httpClient.get<Team>(USER_TEAMS_API + '/search?userId=' + userId +
                                                      '?teamId=' + teamId)
    .pipe(catchError(this.handleError('getTeamById', {} as Team)));
  }

  public getTeamByName(userId: string, teamName: string): Observable<Team>{
    return this.httpClient.get<Team>(USER_TEAMS_API + '/search?userId=' + userId +
                                                      '?teamName=' + teamName)
    .pipe(catchError(this.handleError('getTeamByName', {} as Team)));
  }

  public exitTeam(userId: string, teamId: string, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(USER_TEAMS_API + '/exit?userId=' + userId  +
                                                         '?teamId=' + teamId,
                                                        {userId, teamId},
	{headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('exitTeam', {} as string)));
  }

  public acceptUserTeamRequest(userTeamRequest: TeamInviteRequest, jwtToken: string ): Observable<string>{
    return this.httpClient.post<string>(USER_TEAMS_REQUEST_API + '/accept', userTeamRequest,
	{headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('acceptUserTeamRequest', {} as string)));
  }

  public declineUserTeamRequest(userTeamRequest: TeamInviteRequest, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(USER_TEAMS_REQUEST_API + '/decline', userTeamRequest,
	{headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})})
    .pipe(catchError(this.handleError('declineUserTeamRequest', {} as string)));
  }
}
