import { Tournament } from '../tournament/tournament';
import { User } from './user';
import { Team } from '../team';
export class UserTournamentRequest {
    
    tournament: Tournament;
    team: Team;
    user: User;

    constructor(tournament?: Tournament, team?: Team, user?: User){
        this.tournament = tournament;
        this.team = team;
        this.user = user;
    }
}