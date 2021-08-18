import { Tournament } from './tournament/tournament';
import { Team } from '../models/team';

export class Match {
    
    matchId: string;
    
    matchTournament: Tournament;
    
    matchChallengeId: string;

    matchLocalTeam: Team;

    matchAwayTeam: Team;
    
    localTeamMatchScore: number;
    awayTeamMatchScore: number;
    matchStatus: string;
    matchWinningTeam: Team;
    uploaded: boolean;
    matchRoundInTournament: number;

    constructor(matchId?: string, matchTournament?: Tournament, matchLocalTeam?: Team, matchAwayTeam?:Team,
                localTeamMatchScore?: number, awayTeamMatchScore?: number){
        this.matchId = matchId;
        this.matchTournament = matchTournament;
        this.matchLocalTeam = matchLocalTeam;
        this.matchAwayTeam = matchAwayTeam;
        this.localTeamMatchScore = localTeamMatchScore;
        this.awayTeamMatchScore = awayTeamMatchScore;
    }

}