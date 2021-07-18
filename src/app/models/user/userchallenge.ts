import { Team } from '../team';
import { Challenge } from '../challenge/challenge';
import { User } from './user';
import { Match } from '../match';

export class UserChallenge {
    
    userChallenge: Challenge;
    userChallengeTeam: Team; 
    userChallengeMatches: Match[];
    userChallengeMatchesWins: number;
    userChallengeLosses: number;
    userChallengeStatus: string;

    constructor(userChallenge?: Challenge, userChallengeTeam?: Team, userChallengeMatches?: Match[], userChallengeMatchesWins?: number, userChallengeLosses?: number,
                userChallengeStatus?: string){
        this.userChallenge = userChallenge;
        this.userChallengeTeam = userChallengeTeam;
        this.userChallengeMatches = userChallengeMatches;
        this.userChallengeMatchesWins = userChallengeMatchesWins;
        this.userChallengeLosses = userChallengeLosses;
        this.userChallengeStatus = userChallengeStatus;
    }


}