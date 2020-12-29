import { User } from './user/User';
import { Challenge} from './challenge';
import { Tournament } from './tournament';
import { ImageModel } from './imagemodel';
import { TeamInviteRequest } from './teamInviteRequest'; 

export class Team {
    teamId: string;
    teamCountry: string;
    teamName: string;
    teamStatus: string;
    teamUsers: Array<User>;
    teamChallenges: Array<Challenge>
    teamTournaments: Array<Tournament>;
    teamModerator: User;
    teamEmail: string;
    teamRequests: Array<TeamInviteRequest>;
    teamImage: FormData;
    imageToGet: ImageModel;

    constructor(teamId ?: string, teamCountry?: string, teamName?: string, 
                teamStatus ?:string, teamUsers?: Array<User>, teamChallenges?: Array<Challenge>,
                teamTournaments?: Array<Tournament>, teamModerator?: User, teamEmail?: string,
                teamRequests?: Array<TeamInviteRequest>, teamImage?: FormData){
        this.teamId = teamId;
        this.teamCountry = teamCountry;
        this.teamName = teamName;
        this.teamStatus = teamStatus;
        this.teamUsers = teamUsers;
        this.teamChallenges = teamChallenges;
        this.teamTournaments = teamTournaments;
        this.teamModerator = teamModerator;
        this.teamEmail = teamEmail;
        this.teamRequests = teamRequests;
        this.teamImage = teamImage;
    }
}