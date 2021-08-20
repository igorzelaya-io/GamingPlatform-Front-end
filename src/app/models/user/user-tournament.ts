import { Team } from '../team';
import { Match } from '../match';

export class UserTournament {
	userTournamentId: string;
	userTournamentTeam: Team;
	userTournamentMatchesWins: number;
	userTournamentMatchesLosses: number;
	userTournamentMatches: Array<Match>;
	userTournamentStatus: string;
	
	constructor(userTournamentId?: string, userTournamentTeam?: Team, userTournamentMatchesWins?: number, 
				userTournamentMatchesLosses?: number, userTournamentMatches?: Array<Match>, userTournamentStatus?: string){
		this.userTournamentTeam = userTournamentTeam
		this.userTournamentId = userTournamentId;
		this.userTournamentMatchesWins = userTournamentMatchesWins;
		this.userTournamentMatchesLosses = userTournamentMatchesLosses;
		this.userTournamentMatches = userTournamentMatches;
		this.userTournamentStatus = userTournamentStatus;

	}

}
