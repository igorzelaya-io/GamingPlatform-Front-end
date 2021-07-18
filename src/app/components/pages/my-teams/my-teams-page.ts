import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from 'src/app/models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/team/team-service.service';
import { ImageModel } from 'src/app/models/imagemodel';

@Component({
  selector: 'app-my-teams-page',
  templateUrl: './my-teams-page.html',
  styleUrls: ['./my-teams-page.scss']
})

export class MyTeamsPageComponent implements OnInit {

  user: User;
  userTeams: Team[];

  teamsWithImages: Team[];
  teamsWithoutImages: Team[];
  teamImages: string[];


  isEmpty = true;
  
  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
        private router: Router,
        private teamService: TeamService) {
    this.user = new User();
    this.userTeams = [];
    this.teamsWithImages = [];
    this.teamsWithoutImages = [];
    this.teamImages = [];
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
      if(data && data.length){
		    this.isEmpty = false;
	  	  this.userTeams = data;
        return;
      }
      this.isEmpty = true;
    },
    err => {
      console.error(err);
    }, 
    () => {
      if(!this.isEmpty){
        this.evaluateImagesOnTeams();
      }
    });
  }

  evaluateImagesOnTeams(){
    if(!this.isEmpty){
      this.teamsWithImages = this.userTeams.filter(team => team.hasImage === true);
      this.teamsWithoutImages = this.userTeams.filter(team => team.hasImage === false);
      console.log(this.teamsWithImages);
      for(let i = 0; i < this.teamsWithImages.length; i++){
        this.getTeamImage(this.teamsWithImages[i].teamId);
      }  
    }
  }

  getTeamImage(teamId: string){
    this.teamService.getTeamImage(teamId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.teamImages.push(data.imageBytes);
      }
    });
  }

  createButton(){
   	if(this.tokenService.loggedIn()){
		  this.router.navigate(['/team-creation']);
	  }
  }

  passTeam(team: Team){
    if(this.tokenService.loggedIn()){
		  this.router.navigate(['/team-details'], {queryParams: { teamId: team.teamId }});
	  }
  }

  passUser(user: User){
    this.router.navigate(['/player-details'], {queryParams: {userId: user.userId}});
  }
}
