import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { Tournament } from 'src/app/models/tournament/tournament';


@Component({
  selector: 'app-popular-leagues',
  templateUrl: './popular-leagues.component.html',
  styleUrls: ['./popular-leagues.component.scss']
})

export class PopularLeaguesComponent implements OnInit {

  isAuthenticated = false;
  user: User;

  isEmptyTournaments = true;
  allTournaments: Tournament[];

  allTournamentYears:number[]; 


  constructor(private tokenService: TokenStorageService, 
              private router: Router,
			  private tournamentService: TournamentService) {
	this.user = new User();
	this.allTournaments = [];
  	this.allTournamentYears = []; 
  }

   isAuthenticatedButton(){
    if(this.isAuthenticated){
      this.router.navigate(['/tournament-creation']);
      return;
    }
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
		if(this.tokenService.isTokenExpired()){
			this.isAuthenticated = false;
			this.tokenService.signOut();
			this.getAllTournamentsNow();
			this.getAllTournamentYears();
			return;
		}
		this.isAuthenticated = true;		
	}
	this.getAllTournamentsNow();
	this.getAllTournamentYears();
  
  }

  getAllTournamentsNow(): void{
	this.tournamentService.getAllTournamentsNow()
	.subscribe((data: Tournament[]) => {
		this.allTournaments = data;
		this.isEmptyTournaments = false;
	},
	err => {
		console.error(err.error.message);
		this.isEmptyTournaments = true;
	});
  }

  getAllTournamentYears(): void{
	for(let i = 0 ; i < this.allTournaments.length; i++){
		this.allTournamentYears.push(this.allTournaments[i].tournamentDate.getFullYear());
	}
	
  }

  public isWarzoneTournament(tournament: Tournament): boolean{
	if(tournament.tournamentGame === 'Call Of Duty' && tournament.tournamentCodGameMode === 'Warzone'){
		return true;
	}
	return false; 
  }

  public isCDLTournament(tournament: Tournament): boolean{
  	if(tournament.tournamentGame === 'Call Of Duty' && tournament.tournamentCodGameMode === 'CDL'){
		return true;
	}
	return false; 
  }	

  public isFifaTournament(tournament: Tournament): boolean{
	if(tournament.tournamentGame === 'Fifa'){
		return true;
	}
	return false;
  }

  public getYearFromTournamentDate(tournament: Tournament): number{
	return tournament.tournamentDate.getFullYear();	
  }

  

}
