import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';

import { TournamentService } from '../../../services/tournament/tournament.service';
import { Tournament } from 'src/app/models/tournament/tournament';
import { Role } from 'src/app/models/role';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-popular-leagues',
  templateUrl: './popular-leagues.component.html',
  styleUrls: ['./popular-leagues.component.scss']
})

export class PopularLeaguesComponent implements OnInit {

  isAuthenticated = false;

  isAdmin = false;

  isEmptyTournaments = true;
  allTournaments: Tournament[];

  allTournamentYears:number[];

  allTournamentMonths:string[];

  allTournamentTime:string[]; 


  constructor(private tokenService: TokenStorageService, 
              private router: Router,
			  private tournamentService: TournamentService) {
	this.allTournaments = [];
  	this.allTournamentYears = []; 
	this.allTournamentMonths = [];
	this.allTournamentTime = [];
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
		this.hasAdminRole();
		if(this.tokenService.isTokenExpired()){
			this.isAuthenticated = false;
			this.tokenService.signOut();
			this.getAllTournamentsNow();

			return;
		}
		this.isAuthenticated = true;		
	}
	this.getAllTournamentsNow();
  }

  getAllTournamentsNow(): void{
	this.tournamentService.getAllTournamentsNow()
	.subscribe((data: Tournament[]) => {
		if(data && data.length !== 0){			
			this.allTournaments = data;
			this.getAllTournamentYears(data);
			this.getAllTournamentMonths(data);
			this.getAllTournamentTime(data);
			this.isEmptyTournaments = false;
			return;
		}
		this.isEmptyTournaments = true;
	},
	err => {
		console.error(err.error.message);
		this.isEmptyTournaments = true;
	});
  }

  getAllTournamentYears(tournaments: Tournament[]): void{
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
	}
  }

  getAllTournamentMonths(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()] + ' ' + tournaments[i].tournamentDate.toString().slice(8, 10));
	}
  }

  getAllTournamentTime(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentTime.push(tournaments[i].tournamentDate.toString().slice(11, 19) + '  ' + new Date(tournaments[i].tournamentDate).toString().match(/([A-Z]+[\+-][0-9]+)/)[1]);
	}
  }

  public viewTournament(tournament: Tournament){
	this.router.navigate(['tournament-details'], {queryParams: {tournament: JSON.stringify(tournament)}});
  }

  public hasAdminRole(): void{
	  const user = this.tokenService.getUser();
	  if(user.userRoles.filter((role: Role) => role.authority === "ADMIN").length !== 0){
		this.isAdmin = true;
		return;
	  }
	  this.isAdmin = false;
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
  
  public isPvPTournament(tournament: Tournament): boolean{
	if(tournament.tournamentFormat === 'PVP'){
		return true; 
	}
	return false; 
  }
}
