import { Team } from '../team';
import { User } from '../user/user';
import { TournamentStatus } from './tournament-status.enum';
import { TournamentTeamSize } from './tournament-team-size.enum';
import { TournamentFormat } from './tournament-format.enum';
import { TournamentMode } from './tournament-mode.enum';

export class Tournament {

    tournamentId: string;
    tournamentName: string;
    tournamentTeams: Array<Team>;
    tournamentLimitNumberOfTeams: number;
    tournamentNumberOfTeams: number;
    tournamentPlatforms: Array<string>;
    tournamentStatus: TournamentStatus;
	tournamentTeamSize: TournamentTeamSize;
	tournamentGameMode: TournamentMode;
	tournamentFormat: TournamentFormat;
    tournamentModerator: User;
    tournamentDate: Date;
    tournamentCashPrice: number;
    tournamentEntryFee: number;
    tournamentRegion: string;
    tournamentDescription: string;

    constructor(tournamentName?: string, tournamentStatus?: TournamentStatus, tournamentModerator?: User,
                tournamentDate?: Date, tournamentTeams?: Array<Team>){
        this.tournamentName = tournamentName;
        this.tournamentTeams = tournamentTeams;
        this.tournamentStatus = tournamentStatus;
        this.tournamentModerator = tournamentModerator;
        this.tournamentDate = tournamentDate;
    }
}