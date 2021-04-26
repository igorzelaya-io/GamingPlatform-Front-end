import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserTournamentService } from '../../../services/user-tournament.service';

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss']
})
export class MyTournamentsComponent implements OnInit {

  user: User;  
  userTournaments: Tournament[];
  isEmpty: boolean = false;

  constructor(private tokenService: TokenStorageService,
			  private userTournamentService: UserTournamentService,
			  private router: Router) {
	this.user = new User();
	this.userTournaments = [];
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
			console.log(data);
			this.userTournaments = data;
			return;
		}
		this.isEmpty = true;
		},
		err => {
			console.error(err.error.message);
			this.isEmpty = true;	
		});
  }

  passTournamentToTournamentDetails(tournament: Tournament){
	this.router.navigate(['/tournament-details'],{queryParams: {tournamentId : tournament.tournamentId}} );
  }

}
