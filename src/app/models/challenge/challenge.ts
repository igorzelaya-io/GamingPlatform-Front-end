import { User } from '../user/user';
import { Match } from '../match';
import { Team } from '../team';

export class Challenge {
    
    challengeId: string;
    challengeName: string;
    challengeDescription: string;
    challengeGame: string;
    challengeCodGameMode: string;
    challengeMatches: Match[];
    challengeMatchesNumber: string;
    challengeModerator: User;
    challengeNumberOfPlayersPerTeam: string;
    challengeStatus: string;
    challengeDate: Date;
    challengeHostTeam: Team;
    challengeOpponentTeam: Team;
    challengeWinningTeam: Team;
    challengeCashPrize: number;
    challengeTokenFee: number;
    challengeRegion: string;
    startedChallenge: boolean;

    constructor(challengeId?:string, challengeName?: string, challengeDescription?: string, challengeGame?: string,
                challengeCodGameMode?: string, challengeMatches?: Match[]) {
        this.challengeId = challengeId;
        this.challengeName = challengeName;
        this.challengeDescription = challengeDescription; 
        this.challengeGame = challengeGame;
        this.challengeCodGameMode = challengeCodGameMode;
        this.challengeMatches = challengeMatches;
    }

}