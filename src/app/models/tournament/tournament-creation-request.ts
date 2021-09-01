import { User } from '../user/user';
import { Tournament } from '../tournament/tournament';

export class TournamentCreationRequest{
	
	tournamentToBeCreated: Tournament;
	tournamentDateInMilliseconds: number;
	tournamentUserModeratorId: string;	
	
	constructor(tournamentToCreate ?: Tournament,tournamentDateInMilliseconds?:number, tournamentModeratorId?: string){
		this.tournamentToBeCreated = tournamentToCreate;
		this.tournamentDateInMilliseconds = tournamentDateInMilliseconds;
		this.tournamentUserModeratorId = tournamentModeratorId;
	}
	
}