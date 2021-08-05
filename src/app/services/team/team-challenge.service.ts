import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Match } from 'src/app/models/match';
import { map, catchError, retry } from 'rxjs/operators';
import { Challenge } from 'src/app/models/challenge/challenge';
import { MessageResponse } from 'src/app/models/messageresponse';
import { TeamChallengeRequest } from '../../models/teamchallengerequest';



const TEAM_CHALLENGES_API = '/teamchallengesapi/teamChallenges';

@Injectable({
  providedIn: 'root'
})
export class TeamChallengeService {

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

  getAllChallengesFromUser(matchId: string, challengeId: string): Observable<Match>{
    return this.httpClient.get<Match>(TEAM_CHALLENGES_API + '/matches/search?matchId=' + matchId + '&challengeId=' + challengeId)
    .pipe(
      retry(1),
      catchError(this.handleError('getAllChallengesFrom', {} as Match))
    )
  }

  getAllCodChallengesFromTeam(teamId: string): Observable<Challenge[]>{
    return this.httpClient.get<Challenge[]>(TEAM_CHALLENGES_API + '/cod/all')
    .pipe(
      retry(1),
      catchError(this.handleError('getAllCodChallengesFromTeam', []))
    );
  }

  getCodChallengeFromTeam(): Observable<Challenge>{
    return this.httpClient.get<Challenge>(TEAM_CHALLENGES_API + '/cod/search')
    .pipe(
      retry(1),
      catchError(this.handleError('getCodChallengeFromTeam', {} as Challenge))
    );
  }

  addTeamToCodChallenge(teamChallengeRequest: TeamChallengeRequest, jwtToken: string): Observable<MessageResponse>{
    return this.httpClient.post<MessageResponse>(TEAM_CHALLENGES_API + '/cod/add', teamChallengeRequest,
    {headers: new HttpHeaders({ 'Authorization': 'Bearer ' + jwtToken})})
    .pipe(
      catchError(this.handleError('addTeamToCodChallenge', {} as MessageResponse))
    );
  }

  removeTeamFromCodChallenge(teamChallengeRequest: TeamChallengeRequest, jwtToken: string): Observable<MessageResponse>{
    const httpOptions = {
      headers: new HttpHeaders({'Authorization' : 'Bearer ' + jwtToken}),
      body: teamChallengeRequest
    };
    return this.httpClient.delete<MessageResponse>(TEAM_CHALLENGES_API + '/cod/remove', httpOptions)
    .pipe(
      catchError(this.handleError('removeTeamFromCodChallenge', {} as MessageResponse))
    );
  }
}
