import { Challenge } from './challenge/challenge';
import { Team } from './team';

export class TeamChallengeRequest {
    
    challenge: Challenge;

    team: Team;

    constructor(challenge?: Challenge, team?: Team) {
        this.challenge = challenge;
        this.team = team;
    }
}