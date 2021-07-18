import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from '../../../models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from '../../../services/token-storage.service';
import { TeamInviteRequest } from '../../../models/teaminviterequest';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { TeamService } from 'src/app/services/team/team-service.service';
import { ImageModel } from 'src/app/models/imagemodel';

@Component({
  selector: 'app-team-invites-page',
  templateUrl: './team-invites-page.html',
  styleUrls: ['./team-invites-page.scss']
})
export class TeamInvitesPageComponent implements OnInit {

  user: User;
  teamInvites: TeamInviteRequest[];
  
  teamInvitesWithImage: TeamInviteRequest[];
  teamInvitesWithoutImage: TeamInviteRequest[];

  teamImages: string[] = [];
  isEmpty: boolean = true;
  

  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
              private router: Router,
              private teamService: TeamService
              ) {
	  this.user = new User();
    this.teamInvites = [];
    this.teamInvitesWithImage = [];
    this.teamInvitesWithoutImage = [];
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
        if(this.evaluateLength(data)){
          return;
        }
        this.getTeamsWithImages();
        this.isEmpty = false;
        
        return;
      }
      this.isEmpty = true;	
    },
    err => {
      console.error(err.error.message);
    });
  }

  getTeamsWithImages(){
    for(let i = 0; i < this.teamInvites.length; i++){
      let currTeam: Team = this.teamInvites[i].teamRequest;
      if(currTeam.hasImage){
        this.teamInvitesWithImage.push(this.teamInvites[i]);
        this.getTeamImage(currTeam.teamId);
      }
      else {
        this.teamInvitesWithoutImage.push(this.teamInvites[i]);
      }
    }
  }

  getTeamImage(teamId: string){
    this.teamService.getTeamImage(teamId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.teamImages.push(data.imageBytes);
      }
    },
    err => console.error(err));
  }

  private evaluateLength(teamInviteRequests: TeamInviteRequest[]): boolean{
    if(teamInviteRequests.length === 1){
      const teamInviteRequest = teamInviteRequests[0]['requestStatus'];
      if(teamInviteRequest === 'ACCEPTED' || teamInviteRequest === 'INVALID' || teamInviteRequest === 'DECLINED'){
        this.isEmpty = true;
        return true;
      }
    }
    return false;
  }

  passTeam(teamInvite: TeamInviteRequest){
    this.router.navigate(['/team-details'], {queryParams: {teamId: teamInvite.teamRequest.teamId}});
  }

  passUser(userId: string){
    this.router.navigate(['/player-details'], { queryParams: { userId: userId}});
  }

  public hasPendingStatus(teamInviteRequest: TeamInviteRequest): boolean{
    if(teamInviteRequest.requestStatus === 'PENDING'){
      return true;
    }
    return false;
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
