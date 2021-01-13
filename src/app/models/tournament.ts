import { Team } from './team';
import { User } from './user/user';

export class Tournament {

    tournamentId: string;
    tournamentName: string;
    tournamentTeams: Array<Team>;
    tournamentNumberOfTeams: number;
    tournamentPlatforms: Array<string>;
    tournamentStatus: string;
    tournamentModerator: User;
    tournamentDate: Date;
    tournamentType: string;
    tournamentCashPrice: number;
    tournamentEntryFee: number;
    tournamentRegion: string;

    constructor(tournamentName?: string, tournamentStatus?: string, tournamentModerator?: User,
                tournamentDate?: Date, tournamentType?: string, tournamentTeams?: Array<Team>){
        this.tournamentName = tournamentName;
        this.tournamentTeams = tournamentTeams;
        this.tournamentStatus = tournamentStatus;
        this.tournamentModerator = tournamentModerator;
        this.tournamentDate = tournamentDate;
        this.tournamentType = tournamentType;
    }
}