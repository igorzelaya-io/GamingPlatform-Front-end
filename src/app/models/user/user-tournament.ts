import { Tournament} from '../tournament/tournament';

export class UserTournament {

	userTournamentId: string;
	userTournament: Tournament;
	userTournamentMatchesWins: number;
	userTournamentMatchesLosses: number;
	
	constructor(userTournamentId?:string, userTournament?: Tournament, userTournamentMatchesWins?: number, userTournamentMatchesLosses?: number){
		this.userTournamentId = userTournamentId;
		this.userTournament = userTournament;
		this.userTournamentMatchesWins = userTournamentMatchesWins;
		this.userTournamentMatchesLosses = userTournamentMatchesLosses;
	}

}
