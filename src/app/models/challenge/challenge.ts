import { User } from '../user/user';
import { Match } from '../match';
import { Team } from '../team';

export class Challenge {
    
    challengeId: string;
    challengeName: string;
    challengeGame: string;
    challengeCodGameMode: string;
    challengeGameMode: string;
    challengeMatches: Match[];
    challengePlatforms: string;
    challengeMatchesNumber: string;
    challengeModerator: User;
    challengeNumberOfPlayersPerTeam: string;
    challengeStatus: string;
    challengeDate: Date;
    challengeHostTeam: Team;
    challengeAwayTeam: Team;
    challengeWinningTeam: Team;
    challengeCashPrize: number;
    challengeTokenFee: number;
    challengeRegion: string;
    startedChallenge: boolean;

    constructor(challengeId?:string, challengeName?: string, challengeGame?: string,
                challengeCodGameMode?: string, challengeMatches?: Match[]) {
        this.challengeId = challengeId;
        this.challengeName = challengeName;
        this.challengeGame = challengeGame;
        this.challengeCodGameMode = challengeCodGameMode;
        this.challengeMatches = challengeMatches;
    }

}