import { Tournament } from '../tournament/tournament';

import { Team } from '../team';
export class UserTournamentRequest {
    
    tournament: Tournament;
    team: Team;
    userId: string;

    constructor(tournament?: Tournament, team?: Team, user?: string){
        this.tournament = tournament;
        this.team = team;
        this.userId = user;
    }
}