import { Tournament} from '../tournament/tournament';
import { Team } from '../team';
import { Match } from '../match';

export class UserTournament {
	userTournament: Tournament;
	userTournamentTeam: Team;
	userTournamentMatchesWins: number;
	userTournamentMatchesLosses: number;
	userTournamentMatches: Array<Match>;
	userTournamentStatus: string;
	
	constructor(userTournament?: Tournament, userTournamentTeam?: Team, userTournamentMatchesWins?: number, 
				userTournamentMatchesLosses?: number, userTournamentMatches?: Array<Match>, userTournamentStatus?: string){
		this.userTournamentTeam = userTournamentTeam
		this.userTournament = userTournament;
		this.userTournamentMatchesWins = userTournamentMatchesWins;
		this.userTournamentMatchesLosses = userTournamentMatchesLosses;
		this.userTournamentMatches = userTournamentMatches;
		this.userTournamentStatus = userTournamentStatus;

	}

}
