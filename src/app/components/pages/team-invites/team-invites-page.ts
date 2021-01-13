import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from '../../../models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from '../../../services/token-storage.service';
import { TeamInviteRequest } from '../../../models/teamInviteRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-invites-page',
  templateUrl: './team-invites-page.html',
  styleUrls: ['./team-invites-page.scss']
})
export class TeamInvitesPageComponent implements OnInit {

  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
              private router: Router
              ) {

  }
  isEmpty = true;
  message = 'No teams invites available';
  user: User = new User();
  teamInvites: TeamInviteRequest[] = [];
  team: Team = new Team();
  
  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.getAllUserTeamRequests();
  }

  getAllUserTeamRequests(){
    this.userTeamService.getAllUserTeamRequests(this.user.userId)
    .subscribe((data: TeamInviteRequest[]) => {
      this.teamInvites = data;
      console.log(data);
      this.isEmpty = false;
    },
    err => {
      console.error(err);
    });
  }

  passTeam(teamInvite: TeamInviteRequest){
    this.router.navigate(['/team-details'], {queryParams: {teamId: teamInvite.teamRequest.teamId}});
  }

  acceptUserTeamInviteRequest(teamRequest: TeamInviteRequest){
    this.userTeamService.acceptUserTeamRequest(teamRequest);
    window.location.reload();
  }

  declineUserTeamInviteRequests(teamRequest: TeamInviteRequest){
    this.userTeamService.declineUserTeamRequest(teamRequest);
    window.location.reload();
  }

}
