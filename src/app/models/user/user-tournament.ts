import { Tournament} from '../tournament/tournament';
import { Team } from '../team';

export class UserTournament {

	userTournamentId: string;
	userTournament: Tournament;
	userTournamentTeam: Team;
	userTournamentMatchesWins: number;
	userTournamentMatchesLosses: number;
	
	constructor(userTournamentId?:string, userTournament?: Tournament, userTournamentTeam?: Team, userTournamentMatchesWins?: number, userTournamentMatchesLosses?: number){
		this.userTournamentId = userTournamentId;
		this.userTournament = userTournament;
		this.userTournamentMatchesWins = userTournamentMatchesWins;
		this.userTournamentMatchesLosses = userTournamentMatchesLosses;
	}

}
