import { Team } from '../team';
import { Challenge } from '../challenge/challenge';
import { User } from './user';
import { Match } from '../match';

export class UserChallenge {
    
    userChallengeId: string;
    userChallengeTeam: Team; 
    userChallengeMatches: Match[];
    userChallengeMatchesWins: number;
    userChallengeLosses: number;
    userChallengeStatus: string;

    constructor(userChallengeId?: string, userChallengeTeam?: Team, userChallengeMatches?: Match[], userChallengeMatchesWins?: number, userChallengeLosses?: number,
                userChallengeStatus?: string){
        this.userChallengeId = userChallengeId;
        this.userChallengeTeam = userChallengeTeam;
        this.userChallengeMatches = userChallengeMatches;
        this.userChallengeMatchesWins = userChallengeMatchesWins;
        this.userChallengeLosses = userChallengeLosses;
        this.userChallengeStatus = userChallengeStatus;
    }


}