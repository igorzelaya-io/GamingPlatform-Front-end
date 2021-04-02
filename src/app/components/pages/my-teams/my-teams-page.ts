import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from 'src/app/models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-teams-page',
  templateUrl: './my-teams-page.html',
  styleUrls: ['./my-teams-page.scss']
})

export class MyTeamsPageComponent implements OnInit {

  user: User;
  userTeams: Team[];
  isEmpty = true;
  
  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
			  private router: Router) {
    
    this.user = new User();
	  this.userTeams = [];
  }

  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
		  this.user = this.tokenService.getUser();
	    this.getAllUserTeams();
    }
  }

  getAllUserTeams(){
    this.userTeamService.getAllUserTeams(this.user.userId)
    .subscribe((data: Team[]) => {
      if(data && data.length && Object.keys(data).length !== 0){
		    this.isEmpty = false;
	  	  this.userTeams = data;
        return;
      }
      this.isEmpty = true;
    },
    err => {
      console.error(err);
    });
  }

  createButton(){
   	if(this.tokenService.loggedIn()){
		  this.router.navigate(['/team-creation']);
	  }
  }

  passTeam(team: Team){
    if(this.tokenService.loggedIn()){
		  this.router.navigate(['/team-details'], {queryParams: { team: JSON.stringify(team)}});
	  }
  }

  passUser(user: User){
    if(this.tokenService.loggedIn()){
      this.router.navigate(['/player-details'], {queryParams: { user: JSON.stringify(user)}});
    }
  }
}
