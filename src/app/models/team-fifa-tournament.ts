import { Match } from './match';


export class TeamFifaTournament {

    teamFifaTournamentId: string;
    
    teamTournamentId: string;
    
    teamTournamentMatches: Match[];
    
    teamTournamentPoints: number;

    teamTournamentNumberOfMatchesPlayed: number;

    teamTournamentNumberOfMatchesWins: number;
    
    teamTournamentNumberOfMatchesDraws: number;

    teamTournamentNumberOfMatchesLosses: number;

    teamTournamentGoalsScored: number;
    
    teamTournamentGoalsReceived: number;

    teamTournamentGoalsDifference: number;

    teamTournamentStatus: string;

    constructor(teamFifaTournamentId?: string, teamTournamentId?: string, teamFifaTournamentMatches?: Match[],
                teamTournamentNumberOfMatchesPlayed?: number, teamTournamentNumberOfMatchesDraws?: number,
                teamTournamentNumberOfMatchesWins?: number, teamTournamentNumberOfMatchesLosses?:number,){
        this.teamTournamentId = teamFifaTournamentId;
        this.teamTournamentId = teamTournamentId;
        this.teamTournamentMatches = teamFifaTournamentMatches;
        this.teamTournamentNumberOfMatchesPlayed = teamTournamentNumberOfMatchesPlayed;
        this.teamTournamentNumberOfMatchesWins = teamTournamentNumberOfMatchesWins;
        this.teamTournamentNumberOfMatchesDraws = teamTournamentNumberOfMatchesDraws;
        this.teamTournamentNumberOfMatchesLosses = teamTournamentNumberOfMatchesLosses;

    }


}