import { Tournament } from "./tournament/tournament";
import { Match } from "./match";

export class TeamCodTournament {
    
    teamCodTournamentId: string;
    teamCodTournament: Tournament;
    teamCodTournamentMatches: Match[];
    teamTournamentNumberOfMatchesPlayed: number;
    teamTournamentNumberOfMatchesWins: number;
    teamTournamentNumberOfMatchesDraws: number;
    teamTournamentNumberOfMatchesLosses: number;
    teamTournamentTotalKills: number;
    teamTournamentPoints: number;
    teamTournamentStatus: string;

    constructor(teamCodTournamentId?: string, teamCodTournament?: Tournament, teamCodTournamentMatches?: Match[],
                teamTournamentNumberOfMatchesPlayed?: number, teamTournamentNumberOfMatchesDraws?: number,
                teamTournamentNumberOfMatchesWins?: number, teamTournamentNumberOfMatchesLosses?:number, teamTournamentTotalKills?: number,
                teamTournamentPoints?: number){
        this.teamCodTournamentId = teamCodTournamentId;
        this.teamCodTournament = teamCodTournament;
        this.teamCodTournamentMatches = teamCodTournamentMatches;
        this.teamTournamentNumberOfMatchesPlayed = teamTournamentNumberOfMatchesPlayed;
        this.teamTournamentNumberOfMatchesWins = teamTournamentNumberOfMatchesWins;
        this.teamTournamentNumberOfMatchesDraws = teamTournamentNumberOfMatchesDraws;
        this.teamTournamentNumberOfMatchesLosses = teamTournamentNumberOfMatchesLosses;
        this.teamTournamentTotalKills = teamTournamentTotalKills;
        this.teamTournamentPoints = teamTournamentPoints;
    }
}