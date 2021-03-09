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


  constructor(private tokenService: TokenStorageService, 
              private router: Router,
			  private tournamentService: TournamentService) {
	this.user = new User();
	this.allTournaments = [];
   }

   isAuthenticatedButton(){
    if(this.isAuthenticated){
      this.router.navigate(['/tournament-creation'], {queryParams: { user: this.user}});
      return;
    }
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
		if(this.tokenService.isTokenExpired()){
			this.isAuthenticated = false;
			this.tokenService.signOut();
			return;
		}
		this.isAuthenticated = true;		
	}
	this.getAllTournamentsNow();
  }

  getAllTournamentsNow(){
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

}
