import { Team } from '../models/team';
import { User } from './user/user';

export class TeamCreationRequest{
	
	teamToRegister: Team;
	teamModerator: User;
	teamImage: FormData;
	
	constructor(teamToRegister?: Team, teamModerator?: User, teamImage?: FormData){
		this.teamToRegister = teamToRegister;
		this.teamModerator = teamModerator;
		this.teamImage = teamImage;
	}
	
	
}