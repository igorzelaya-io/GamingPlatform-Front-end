import { Match } from './match';
import { Tournament } from './tournament/tournament';
import { User } from './user/user';
import { Team } from './team';

export class MatchTournamentRequest {
    matchTournamentMatch:Match;
    matchTournamentTournament:Tournament;
    matchTournamentUser: User;
    matchTournamentTeam: Team;

    constructor(matchTournamentTournament: Tournament, matchTournamentMatch : Match, matchTournamentUser: User
                , matchTournamentTeam: Team){
        this.matchTournamentMatch = matchTournamentMatch;
        this.matchTournamentTournament = matchTournamentTournament;
        this.matchTournamentUser = matchTournamentUser;
        this.matchTournamentTeam = matchTournamentTeam;
    }
}