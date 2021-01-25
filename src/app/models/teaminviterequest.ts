import { Team } from './team';
import { User } from './user/user';
export class TeamInviteRequest {
    teamRequest: Team;
    requestedUser: User;
    requestTime: Date;
    constructor(teamRequest?: Team, requestedUser?: User, requestTime?: Date){
        this.teamRequest = teamRequest;
        this.requestedUser = requestedUser;
        this.requestTime = requestTime;
    }
}