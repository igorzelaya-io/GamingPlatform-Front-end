import { Tournament} from './tournament/tournament';
import { Team } from '../models/team';

export class TeamTournamentRequest{
	tournament: Tournament;
	team: Team;
	
	constructor(tournament?: Tournament, team?: Team){
		this.tournament = tournament;
		this.team = team;
	}
	
}