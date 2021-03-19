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
	this.userTournamentService.getAllTournamentsFromUser(this.user.userId).subscribe(
		(data: Tournament[]) => {
			console.log(data);
			this.userTournaments = data;
		},
		err => {
			console.error(err.error.message);	
		});
  }

  passTournamentToTournamentDetails(tournament: Tournament){
	this.router.navigate(['/tournament-details'],{queryParams: {tournament : JSON.stringify(tournament)}} );
  }

}
