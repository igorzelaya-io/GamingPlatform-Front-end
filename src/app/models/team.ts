import { User } from './user/user';
import { Challenge} from './challenge/challenge';
import { TeamInviteRequest } from './teaminviterequest'; 

export class Team {
    teamId: string;
    teamCountry: string;
    teamName: string;
    teamStatus: string;
    teamUsers: Array<User>;
    teamChallenges: Array<Challenge>
    teamModerator: User;
    teamEmail: string;
    teamRequests: Array<TeamInviteRequest>;
    hasImage: boolean;
    teamTotalLs: number;
    teamTotalWs: number;
    teamTotalPlays: number;

    constructor(teamId ?: string, teamCountry?: string, teamName?: string, 
                teamStatus ?:string, teamUsers?: Array<User>, teamChallenges?: Array<Challenge>,
                teamModerator?: User, teamEmail?: string,
                teamRequests?: Array<TeamInviteRequest>){
        this.teamId = teamId;
        this.teamCountry = teamCountry;
        this.teamName = teamName;
        this.teamStatus = teamStatus;
        this.teamUsers = teamUsers;
        this.teamChallenges = teamChallenges;
        this.teamModerator = teamModerator;
        this.teamEmail = teamEmail;
        this.teamRequests = teamRequests;
    }
}