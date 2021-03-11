import { Team } from '../team';
import { User } from '../user/user';


export class Tournament {

    tournamentId: string;
    tournamentName: string;
    tournamentTeams: Array<Team>;
    tournamentLimitNumberOfTeams: number;
    tournamentNumberOfTeams: number;
    tournamentPlatforms: string;
    tournamentStatus: string;
	tournamentTeamSize: string;
	tournamentGameMode: string;
	tournamentFormat: string;
    tournamentModerator: User;
    tournamentDate: Date;
	tournamentDateInMilliseconds: number;
    tournamentCashPrice: number;
    tournamentEntryFee: number;
    tournamentRegion: string;
    tournamentDescription: string;
	tournamentGame: string;
	tournamentCodGameMode: string;
	tournamentMatchesNumber: string;

    constructor(tournamentName?: string, tournamentStatus?: string, tournamentModerator?: User,
                tournamentDate?: Date, tournamentTeams?: Array<Team>){
        this.tournamentName = tournamentName;
        this.tournamentTeams = tournamentTeams;
        this.tournamentStatus = tournamentStatus;
        this.tournamentModerator = tournamentModerator;
        this.tournamentDate = tournamentDate;
    }
}