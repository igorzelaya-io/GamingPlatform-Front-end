import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import { Challenge } from 'src/app/models/challenge/challenge';
import { UserChallengesService } from 'src/app/services/userchallenges.service';
import { DisputedMatch } from 'src/app/models/disputedmatch';
import { DisputedMatchService } from 'src/app/services/disputedMatch/disputed-match.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-disputed-matches',
  templateUrl: './disputed-matches.component.html',
  styleUrls: ['./disputed-matches.component.scss']
})
export class DisputedMatchesComponent implements OnInit {

  user: User;
  disputedMatches: DisputedMatch[];
  isEmptyDisputedMatches = false;

  userChallenges: Challenge[];
  isEmpty: boolean = false;

  allChallengeYears: number[];
  allChallengeMonths: string[];

  constructor(private tokenService: TokenStorageService,
			  private userChallengeService: UserChallengesService,
			  private router: Router,
			  private disputedMatchesService: DisputedMatchService) {
	this.user = new User();
	this.disputedMatches = [];
	this.userChallenges = [];
	this.allChallengeYears = [];
	this.allChallengeMonths = [];
  }

  ngOnInit(): void {
  	if(this.tokenService.loggedIn()){
		this.user = this.tokenService.getUser();
		this.getAllDisputedMatches();
	}
  }

  getAllDisputedMatches(){
	this.disputedMatchesService.getAllDisputedMatches()
	.subscribe((data: DisputedMatch[]) => {
		if(data && data.length){
			this.disputedMatches = data;
			this.isEmptyDisputedMatches = false;
			return;
		}
		this.isEmptyDisputedMatches = true;
	}, err => console.error(err));
  }
	
  passChallenge(challenge: Challenge){
	this.router.navigate(['/challenge-details'], { queryParams: { challengeId: challenge.challengeId}});
  }

  passMatch(disputedMatch: DisputedMatch){
	if(disputedMatch.disputedMatchChallengeId){
		this.router.navigate(['/challenge-match-details'], {queryParams: { matchId: disputedMatch.disputedMatchMatchId, challengeId: disputedMatch.disputedMatchChallengeId }});
	}
	else{
		this.router.navigate(['/match-details'], { queryParams: { matchId: disputedMatch.disputedMatchMatchId, tournamentId: disputedMatch.disputedMatchTournamentId}});
	}
  }
}
