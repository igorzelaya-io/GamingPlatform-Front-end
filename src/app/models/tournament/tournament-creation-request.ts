import { User } from '../user/user';
import { Tournament } from '../tournament/tournament';

export class TournamentCreationRequest{
	tournamentToBeCreated: Tournament;
	tournamentDateInMilliseconds: number;
	tournamentUserModerator: User;	
	
	constructor(tournamentToCreate ?: Tournament,tournamentDateInMilliseconds?:number, tournamentModerator?: User){
		this.tournamentToBeCreated = tournamentToCreate;
		this.tournamentDateInMilliseconds = tournamentDateInMilliseconds;
		this.tournamentUserModerator = tournamentModerator;
	}
	
}