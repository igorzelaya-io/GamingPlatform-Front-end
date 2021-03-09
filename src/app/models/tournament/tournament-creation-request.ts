import { User } from '../user/user';
import { Tournament } from '../tournament/tournament';

export class TournamentCreationRequest{
	tournamentToBeCreated: Tournament;
	tournamentUserModerator: User;	
	
	constructor(tournamentToCreate ?: Tournament, tournamentModerator?: User){
		this.tournamentToBeCreated = tournamentToCreate;
		this.tournamentUserModerator = tournamentModerator;
	}
	
}