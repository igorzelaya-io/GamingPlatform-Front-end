export class DisputedMatch {
    
    disputedMatchDocumentId: string;

    disputedMatchChallengeId: string;

    disputedMatchTournamentId: string;

    disputedMatchMatchId: string;

    disputedMatchImageBytes: string;

    disputedMatchStatus: string;

    constructor(disputedMatchChallengeId?: string, 
                disputedMatchTournamentId?: string, disputedMatchMatchId?: string,
                disputedMatchImageBytes?: string){
        this.disputedMatchChallengeId = disputedMatchChallengeId;
        this.disputedMatchTournamentId = disputedMatchTournamentId;
        this.disputedMatchMatchId = disputedMatchMatchId;
        this.disputedMatchImageBytes = disputedMatchImageBytes;
    }

}