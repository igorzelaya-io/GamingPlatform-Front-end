import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from '../../../models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from '../../../services/token-storage.service';
import { TeamInviteRequest } from '../../../models/teaminviterequest';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MessageResponse } from 'src/app/models/messageresponse';

@Component({
  selector: 'app-team-invites-page',
  templateUrl: './team-invites-page.html',
  styleUrls: ['./team-invites-page.scss']
})
export class TeamInvitesPageComponent implements OnInit {

  user: User;
  teamInvites: TeamInviteRequest[];
  team: Team;
  isEmpty: boolean = true;

  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
              private router: Router
              ) {
	  this.user = new User();
    this.teamInvites = [];
  	this.team = new Team();
  }
  
  
  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
		  this.user = this.tokenService.getUser();
	    this.getAllUserTeamRequests();
	  }
  }

  getAllUserTeamRequests(){
    this.userTeamService.getAllUserTeamRequests(this.user.userId)
    .subscribe((data: TeamInviteRequest[]) => {
      if(data.length){
		    this.teamInvites = data;
		    this.isEmpty = false;
	    }
	      this.teamInvites = data;	
        console.log(data);
    },
    err => {
      console.error(err.error.message);
    });
  }

  passTeam(teamInvite: TeamInviteRequest){
    this.router.navigate(['/team-details'], {queryParams: {teamId: teamInvite.teamRequest.teamId}});
  }

  acceptUserTeamInviteRequest(teamInviteRequest: TeamInviteRequest){
    this.userTeamService.acceptUserTeamRequest(teamInviteRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);  
    },
    err => {
      console.error(err.error.message);
    });
    window.location.reload();
  }

  declineUserTeamInviteRequests(teamInviteRequest: TeamInviteRequest){
    this.userTeamService.declineUserTeamRequest(teamInviteRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
    },
    err => {
      console.error(err.error.message);
    });
    window.location.reload();
  }

}
