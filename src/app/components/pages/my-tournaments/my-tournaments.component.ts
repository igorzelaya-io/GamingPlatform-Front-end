import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserTournamentService } from '../../../services/user-tournament.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss']
})
export class MyTournamentsComponent implements OnInit {

  user: User;
  userTournaments: Tournament[];
  isEmpty: boolean = false;

  allTournamentYears: number[];
  allTournamentMonths: string[];

  constructor(private tokenService: TokenStorageService,
			  private userTournamentService: UserTournamentService,
			  private router: Router) {
	this.user = new User();
	this.userTournaments = [];
	this.allTournamentYears = [];
	this.allTournamentMonths = [];
  }

  ngOnInit(): void {
  	if(this.tokenService.loggedIn()){
		this.user = this.tokenService.getUser();
		this.getAllTournamentsFromUser();
	}
  }

  getAllTournamentsFromUser(){
	this.userTournamentService.getAllTournamentsFromUser(this.user.userId)
	.subscribe((data: Tournament[]) => {
		if(data && data.length !== 0){
			this.userTournaments = data;
			this.getAllTournamentYears(data);
			this.getAllTournamentMonths(data);
			return;
		}
		this.isEmpty = true;
	},
	err => {
		console.error(err.error.message);
		this.isEmpty = true;	
	});
  }

  getAllTournamentYears(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
	}
  }
  getAllTournamentMonths(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()] + ' ' + tournaments[i].tournamentDate.toString().slice(8, 10));
	}
  }

  passTournamentToTournamentDetails(tournament: Tournament){
	this.router.navigate(['/tournament-details'],{queryParams: {tournamentId : tournament.tournamentId}} );
  }

}
