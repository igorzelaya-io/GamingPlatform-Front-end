import { Tournament } from '../tournament/tournament';
import { User } from './user';
export class UserTournamentRequest {
    
    tournament: Tournament;
    user: User;

    constructor(tournament?: Tournament, user?: User){
        this.tournament = tournament;
        this.user = user;
    }
}