import { Team } from '../team';

import { Stack } from '../helpers/stack';

import { BinaryTree } from '../binarytree';
export class Tournament {

    tournamentId: string;
    tournamentName: string;
    tournamentTeams: Array<Team>;
    tournamentLimitNumberOfTeams: number;
    tournamentNumberOfTeams: number;
    tournamentStatus: string;
    tournamentModeratorId: string;
    tournamentDate: Date;
    tournamentGameMode: string;
    tournamentPlatforms: string;
    tournamentCashPrize: number;
    tournamentEntryFee: number;
    tournamentRegion: string;
    tournamentFormat: string;
    tournamentTeamSize: string;
    tournamentDescription: string;
	tournamentGame: string;
	tournamentCodGameMode: string;
    tournamentMatchesNumber: string;
    tournamentTeamBracketStack: Stack<Team>;
    tournamentLeaderboardForLeague: Array<Team>;
    startedTournament: boolean;
    tournamentDateInMilliseconds: number;
    tournamentBinaryTree: BinaryTree;
    tournamentWinningTeam: Team;
    
    constructor(tournamentName?: string, tournamentStatus?: string, tournamentModeratorId?: string,
                tournamentDate?: Date, tournamentTeams?: Array<Team>){
        this.tournamentName = tournamentName;
        this.tournamentTeams = tournamentTeams;
        this.tournamentStatus = tournamentStatus;
        this.tournamentModeratorId = tournamentModeratorId;
        this.tournamentDate = tournamentDate;
    }
}