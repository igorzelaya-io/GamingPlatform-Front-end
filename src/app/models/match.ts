import { Tournament } from './tournament/tournament';
import { Team } from '../models/team';

export class Match {
    
    matchId: string;
    matchTournament: Tournament;
    matchLocalTeam: Team;
    matchAwayTeam: Team;
    localTeamMatchScore: number;
    awayTeamMatchScore: number;
    isUploadedMatchResult: boolean;
    matchDate: Date;

    constructor(matchId?: string, matchTournament?: Tournament, matchLocalTeam?: Team, matchAwayTeam?:Team,
                localTeamMatchScore?: number, awayTeamMatchScore?: number, isUploadedMatchResult?: boolean, matchDate?: Date){
        this.matchId = matchId;
        this.matchTournament = matchTournament;
        this.matchLocalTeam = matchLocalTeam;
        this.matchAwayTeam = matchAwayTeam;
        this.localTeamMatchScore = localTeamMatchScore;
        this.awayTeamMatchScore = awayTeamMatchScore;
        this.isUploadedMatchResult = isUploadedMatchResult;
        this.matchDate = matchDate;
    }

}