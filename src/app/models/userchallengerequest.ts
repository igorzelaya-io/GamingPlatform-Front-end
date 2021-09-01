import { Challenge } from './challenge/challenge';
import { User } from './user/user';
import { Team } from './team';
export class UserChallengeRequest {

    challenge: Challenge;
    userId: string;
    team: Team;

    constructor(challenge?: Challenge, userId?: string, team?: Team){
        this.challenge = challenge;
        this.userId = userId;
        this.team = team;
    }

}