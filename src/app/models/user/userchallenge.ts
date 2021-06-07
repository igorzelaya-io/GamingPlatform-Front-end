import { Team } from '../team';
import { Challenge } from '../challenge';
import { User } from './user';
import { Match } from '../match';

export class UserChallenge {
    
    userChallenge: Challenge;
    userChallengeTeam: Team; 
    userChallengeUser: User;
    userChallengeMatches: Match[];
    userChallengeMatchesWins: number;
    userChallengeLosses: number;
    userChallengeStatus: string;

    constructor(userChallenge?: Challenge, userChallengeTeam?: Team, userChallengeUser?: User,
                userChallengeMatches?: Match[], userChallengeMatchesWins?: number, userChallengeLosses?: number,
                userChallengeStatus?: string){
        this.userChallenge = userChallenge;
        this.userChallengeTeam = userChallengeTeam;
        this.userChallengeUser = userChallengeUser;
        this.userChallengeMatches = userChallengeMatches;
        this.userChallengeMatchesWins = userChallengeMatchesWins;
        this.userChallengeLosses = userChallengeLosses;
        this.userChallengeStatus = userChallengeStatus;
    }


}