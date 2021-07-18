import { Challenge } from './challenge/challenge';
import { User } from './user/user';
import { Team } from './team';
export class UserChallengeRequest {

    challenge: Challenge;
    user: User;
    team: Team;

}