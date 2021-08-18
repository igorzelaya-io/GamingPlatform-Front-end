import { Match } from './match';
import { Team } from './team';

export class MatchChallengeRequest {
    
    matchChallengeChallengeId: string;

    matchChallengeMatch: Match;

    matchChallengeTeam: Team;

    constructor(matchChallengeChallengeId?: string, matchChallengeMatch?: Match, matchChallengeTeam?: Team){
        this.matchChallengeChallengeId = matchChallengeChallengeId;
        this.matchChallengeMatch = matchChallengeMatch;
        this.matchChallengeTeam = matchChallengeTeam;
    }
}