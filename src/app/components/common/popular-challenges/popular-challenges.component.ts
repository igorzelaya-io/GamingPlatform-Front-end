import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { Team } from '../../../models/team';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { Tournament } from '../../../models/tournament/tournament';
import { Role } from '../../../models/role';
import { Challenge } from 'src/app/models/challenge/challenge';
import { ChallengeServiceService } from 'src/app/services/challenges/challenge-service.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-popular-challenges',
  templateUrl: './popular-challenges.component.html',
  styleUrls: ['./popular-challenges.component.scss']
})

export class PopularChallengesComponent implements OnInit {

  isAuthenticated = false;

  isAdmin = false;

  isEmptyChallenges = true;

  allChallenges: Challenge[];

  allChallengeYears:number[];

  allChallengeMonths:string[];

  allChallengeTime:string[]; 


  constructor(private tokenService: TokenStorageService, 
              private router: Router,
			  private challengeService: ChallengeServiceService) {
	this.allChallenges = [];
	this.allChallengeYears = [];
	this.allChallengeMonths = [];
	this.allChallengeTime = [];  
  }

  isAuthenticatedButton(){
    if(this.isAuthenticated){
      this.router.navigate(['/challenge-creation']);
      return;
    }
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
	this.getAllChallengesNow();
	if(this.tokenService.loggedIn()){
		this.hasAdminRole();
		if(this.tokenService.isTokenExpired()){
			this.isAuthenticated = false;
			this.tokenService.signOut();
			this.getAllChallengesNow();
			return;
		}
		this.isAuthenticated = true;		
	}
  }

  getAllChallengesNow(): void{
	this.challengeService.getAllChallengesBeforeOneWeek()
	.subscribe((data: Challenge[]) => {
		if(data && data.length){
			this.allChallenges = data;
			this.getAllChallengeYears(data);
			this.getAllChallengeMonths(data);
			this.getAllChallengeTime(data);
			this.isEmptyChallenges = false;
			return;
		}
		this.isEmptyChallenges = true;
	},
	err => {
		console.error(err);
		this.isEmptyChallenges = true;		
	});
	
  }

  getAllChallengeYears(challenges: Challenge[]): void{
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeYears.push(new Date(challenges[i].challengeDate).getFullYear());
	}
  }

  getAllChallengeMonths(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeMonths.push(monthNames[new Date(challenges[i].challengeDate).getMonth()] + ' ' + challenges[i].challengeDate.toString().slice(8, 10));
	}
  }

  getAllChallengeTime(challenges: Challenge[]){
	for(let i = 0; i < challenges.length; i++){
		this.allChallengeTime.push(challenges[i].challengeDate.toString().slice(11, 19) + '  ' + new Date(challenges[i].challengeDate).toString().match(/([A-Z]+[\+-][0-9]+)/)[1]);
	}
  }

  public viewTournament(tournament: Tournament){
	this.router.navigate(['/tournament-details'], {queryParams: {tournamentId: tournament.tournamentId}});
  }

  public hasAdminRole(): void{
	  const user = this.tokenService.getUser();
	  if(user.userRoles.filter((role: Role) => role.authority === "ADMIN").length !== 0){
		this.isAdmin = true;
		return;
	  }
	  this.isAdmin = false;
  }

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
