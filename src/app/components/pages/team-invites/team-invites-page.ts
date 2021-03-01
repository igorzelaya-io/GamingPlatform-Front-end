import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from '../../../models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from '../../../services/token-storage.service';
import { TeamInviteRequest } from '../../../models/teamInviteRequest';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-team-invites-page',
  templateUrl: './team-invites-page.html',
  styleUrls: ['./team-invites-page.scss']
})
export class TeamInvitesPageComponent implements OnInit {

  user: User;
  teamInvites: TeamInviteRequest[];
  team: Team;

  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
			  private userService: UserService,
              private router: Router
              ) {
	this.user = new User();
    this.teamInvites = [];
    this.team = new Team();
  }
  
  
  ngOnInit(): void {
    
    this.getAllUserTeamRequests();
  }

  getAllUserTeamRequests(){
    this.userTeamService.getAllUserTeamRequests(this.user.userId)
    .subscribe((data: TeamInviteRequest[]) => {
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

  acceptUserTeamInviteRequest(teamRequest: TeamInviteRequest){
    this.userTeamService.acceptUserTeamRequest(teamRequest, this.tokenService.getToken());
    window.location.reload();
  }

  declineUserTeamInviteRequests(teamRequest: TeamInviteRequest){
    this.userTeamService.declineUserTeamRequest(teamRequest, this.tokenService.getToken());
    window.location.reload();
  }

}
