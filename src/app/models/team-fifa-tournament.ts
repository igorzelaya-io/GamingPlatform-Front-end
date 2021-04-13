import { Match } from './match';
import { Tournament } from './tournament/tournament';

export class TeamFifaTournament {

    teamTournamentId: string;
    
    teamFifaTournament: Tournament;
    
    teamTournamentMatches: Match[];
    
    teamTournamentPoints: number;

    teamTournamentNumberOfMatchesPlayed: number;

    teamTournamentNumberOfMatchesWins: number;
    
    teamTournamentNumberOfMatchesDraws: number;

    teamTournamentNumberOfMatchesLosses: number;

    teamTournamentGoalsScored: number;
    
    teamTournamentGoalsReceived: number;

    teamTournamentGoalsDifference: number;

    constructor(teamCodTournamentId?: string, teamCodTournament?: Tournament, teamCodTournamentMatches?: Match[],
                teamTournamentNumberOfMatchesPlayed?: number, teamTournamentNumberOfMatchesDraws?: number,
                teamTournamentNumberOfMatchesWins?: number, teamTournamentNumberOfMatchesLosses?:number,){
        this.teamTournamentId = teamCodTournamentId;
        this.teamFifaTournament = teamCodTournament;
        this.teamTournamentMatches = teamCodTournamentMatches;
        this.teamTournamentNumberOfMatchesPlayed = teamTournamentNumberOfMatchesPlayed;
        this.teamTournamentNumberOfMatchesWins = teamTournamentNumberOfMatchesWins;
        this.teamTournamentNumberOfMatchesDraws = teamTournamentNumberOfMatchesDraws;
        this.teamTournamentNumberOfMatchesLosses = teamTournamentNumberOfMatchesLosses;

    }


}