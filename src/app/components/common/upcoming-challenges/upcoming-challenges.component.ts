import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { Challenge } from 'src/app/models/challenge/challenge';
import { ChallengeServiceService } from 'src/app/services/challenges/challenge-service.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

const weekNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Component({
  selector: 'app-upcoming-challenges',
  templateUrl: './upcoming-challenges.component.html',
  styleUrls: ['./upcoming-challenges.component.scss']
})
export class UpcomingChallengesComponent implements OnInit {

  allChallenges: Challenge[];

  allChallengeMonthDates: number[];

  allChallengeYears: number[];

  allChallengeMonths: string[];

  allChallengeTime: string[];
 
  allChallengeWeekDays: string[];
  
  isEmptyChallenges = false;

  constructor(private challengeService: ChallengeServiceService,
			  private router: Router) {
	this.allChallenges = [];
	this.allChallengeMonths = [];
	this.allChallengeTime = [];
 	this.allChallengeMonthDates = [];
	this.allChallengeYears = [];
	this.allChallengeWeekDays = [];
  }

  ngOnInit(): void {
  	this.getAllChallengesAfterOneWeek();
  }

  getAllChallengesAfterOneWeek(){
	this.challengeService.getAllChallengesAfterOneWeek()
	.subscribe((data: Challenge[]) => {
		if(data && data.length !== 0){
			this.allChallenges = data;
			this.getAllChallengesYear(data);
			this.getAllChallengesMonth(data);
			this.getAllChallengesMonthDates(data);
			this.getAllChallengesTime(data);
			this.getAllChallengesWeekDay(data);
			this.isEmptyChallenges = false;
			return;
		}
		this.isEmptyChallenges = true;	
	},
	err => {
		console.error(err.error.message);
		this.isEmptyChallenges = true;
	});
  }

  public getAllChallengesYear(challenges: Challenge[]){
	for(let i = 0 ; i < challenges.length; i++){
		this.allChallengeYears.push(new Date(challenges[i].challengeDate).getFullYear());
	}	
  }

  public getAllChallengesMonth(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeMonths.push(monthNames[new Date(challenges[i].challengeDate).getMonth()]);
	}		
  }

  public getAllChallengesMonthDates(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeMonthDates.push(new Date(challenges[i].challengeDate).getDate());
	}
  }

  getAllChallengesTime(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeTime.push(challenges[i].challengeDate.toString().slice(11, 19) +
									 '  ' + new Date(challenges[i].challengeDate).toString()
											.match(/([A-Z]+[\+-][0-9]+)/)[1]);
	}
  }

  getAllChallengesWeekDay(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeWeekDays.push(weekNames[new Date(challenges[i].challengeDate).getDay()]);
	}
  }
	

//   public viewChallenge(Challenge: Challenge){
// 	this.router.navigate(['Challenge-details'], {queryParams: {ChallengeId: Challenge.ChallengeId}});
//   }

  public isWarzoneChallenge(challenge: Challenge): boolean{
	if(challenge.challengeGame === 'Call Of Duty' && challenge.challengeCodGameMode === 'Warzone'){
		return true;
	}
	return false; 
  }

  public isCDLChallenge(challenge: Challenge): boolean{
  	if(challenge.challengeGame === 'Call Of Duty' && challenge.challengeCodGameMode === 'CDL'){
		return true;
	}
	return false; 
  }	

  public isFifaChallenge(challenge: Challenge): boolean{
	if(challenge.challengeGame === 'Fifa'){
		return true;
	}
	return false;
  }
  
}
