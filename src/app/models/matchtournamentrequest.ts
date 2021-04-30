import { Match } from './match';
import { Team } from './team';

export class MatchTournamentRequest {
    matchTournamentMatch:Match;
    matchTournamentTournamentId: string;
    matchTournamentTeam: Team;

    constructor(matchTournamentTournamentId?: string, matchTournamentMatch?: Match
                , matchTournamentTeam?: Team){
        this.matchTournamentMatch = matchTournamentMatch;
        this.matchTournamentTournamentId = matchTournamentTournamentId;
        this.matchTournamentTeam = matchTournamentTeam;
    }
}