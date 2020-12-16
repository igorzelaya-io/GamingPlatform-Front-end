import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 
import { Team } from '../models/team';
import { catchError } from 'rxjs/internal/operators';

const USER_TEAMS_API = '/userteamapi/userTeams';
const USER_TEAMS_REQUEST_API = '/userteamapi/userTeamRequests';

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

  public getAllUserTeams():Observable<Team[]>{
    return this.httpClient.get<Team[]>(USER_TEAMS_API).pipe(
      catchError(this.handleError('getAllUserTeams', []))
    );
  }

  public getTeamById(userId: string ,teamId: string):Observable<Team>{
    return this.httpClient.get<Team>(USER_TEAMS_API + '/search?userId=' + userId + 
                                                      'teamId=' + teamId).pipe(
      catchError(this.handleError('getTeamById', {} as Team))
    );
  }

  public getTeamByName(userId: string, teamName: string): Observable<Team>{
    return this.httpClient.get<Team>(USER_TEAMS_API + '/search?userId=' + userId + 
                                                      '?teamName=' + teamName);
  }

  public exitTeam(userId: string, teamId: string):Observable<string>{
    return this.httpClient.post<string>(USER_TEAMS_API+ '/exit?userId=' + userId  +
                                                        '?teamId=' + teamId, 
                                                        {userId, teamId}).pipe(
    catchError(this.handleError('exitTeam', {} as string)));
  }

  public acceptUserTeamRequest(){
    
  }


}
