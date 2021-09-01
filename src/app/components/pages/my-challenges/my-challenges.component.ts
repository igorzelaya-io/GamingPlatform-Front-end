import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import { Challenge } from 'src/app/models/challenge/challenge';
import { UserChallengesService } from 'src/app/services/userchallenges.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-my-challenges',
  templateUrl: './my-challenges.component.html',
  styleUrls: ['./my-challenges.component.scss']
})
export class MyChallengesComponent implements OnInit {

  user: User;
  userChallenges: Challenge[];
  isEmpty: boolean = false;

  allChallengeYears: number[];
  allChallengeMonths: string[];

  constructor(private tokenService: TokenStorageService,
			  private userChallengeService: UserChallengesService,
			  private router: Router) {
	this.user = new User();
	this.userChallenges = [];
	this.allChallengeYears = [];
	this.allChallengeMonths = [];
  }

  ngOnInit(): void {
  	if(this.tokenService.loggedIn()){
		this.user = this.tokenService.getUser();
		this.getAllChallengesFromUser();
	}
  }

  getAllChallengesFromUser(){
	this.userChallengeService.getAllUserChallenges(this.user.userId)
	.subscribe((data: Challenge[]) => {
		if(data && data.length){
			this.userChallenges = data;
			this.getAllChallengeYears(data);
			this.getAllChallengeMonths(data);
			return;
		}
		this.isEmpty = true;
	}, err => {
		console.error(err);
		this.isEmpty = true;
	});
  }

  getAllChallengeYears(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeYears.push(new Date(challenges[i].challengeDate).getFullYear());
	}
  }

  getAllChallengeMonths(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeMonths.push(monthNames[new Date(challenges[i].challengeDate).getMonth()] + ' ' + challenges[i].challengeDate.toString().slice(8, 10));
	}
  }
	
  passChallenge(challenge: Challenge){
	this.router.navigate(['/challenge-details'], { queryParams: { challengeId: challenge.challengeId}});
  }
}
