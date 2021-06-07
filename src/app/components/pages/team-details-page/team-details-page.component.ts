import { Component, OnInit } from '@angular/core';
import { Team } from '../../../models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/team/team-service.service';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Tournament } from 'src/app/models/tournament/tournament';
import { MatDialog } from '@angular/material/dialog';
import { UserTeamService } from 'src/app/services/user-team.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';

export interface DialogData{
  field: string,
  replaceValueString: string,
  chargeFee?: number;

}


@Component({
  selector: 'app-team-details-page',
  templateUrl: './team-details-page.component.html',
  styleUrls: ['./team-details-page.component.scss']
})
export class TeamDetailsPageComponent implements OnInit {

  team: Team;
  userInspectingTeam: User;
  isAdminUser: boolean = false;
  isPartOfTeam: boolean = false;

  replaceValueString: string;
  teamTournament: Tournament[] = [];
  teamUsers: User[] = [];

  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private tokenService: TokenStorageService,
              private userTeamService: UserTeamService,
              public dialog: MatDialog,
              private router: Router) {
    this.team = new Team();
    this.userInspectingTeam = new User();
  }

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.getTeamById(params['teamId']);
    });
  }

  evaluateUserRoles(){
    if(this.team.teamUsers.filter(teamUser => teamUser.userName === this.userInspectingTeam.userName)){
      this.isPartOfTeam = true;
    }
    if(this.userInspectingTeam.userRoles.filter(userRole => userRole.authority === 'ADMIN')){
      this.isAdminUser = true;
    }
    else if(this.team.teamModerator.userName === this.userInspectingTeam.userName){
      this.isAdminUser = true;
    }
  }

  public getTeamById(teamId: string){
    let isSuccessfulGet: boolean = false; 
    this.teamService.getTeamById(teamId)
    .subscribe((data: Team) => {
      if(data && Object.keys(data)){
        this.team = data;
        this.teamUsers = this.team.teamUsers;
        isSuccessfulGet = true;
      }
    },
    err => {
      console.error(err);
    }, () => {
      if(this.tokenService.loggedIn() && isSuccessfulGet){
        this.userInspectingTeam = this.tokenService.getUser();
        this.evaluateUserRoles();
      }
    });
  }

  public viewUser(user: User){
    this.router.navigate(['/player-details'], {queryParams: {userId: user.userId}});
  }

  public openDialogForTeamName(){
    this.openDialogForField('teamName');
  }

  public openDialogForField(field: string){
    let dialogRef: any;
    if(field == 'teamName'){
      dialogRef = this.dialog.open(FieldformComponent, {
        width: '400px',
        data: { field: `${field}`, replaceValueString: this.replaceValueString, chargeFee: 100}
      });
    }
    else{
      dialogRef = this.dialog.open(FieldformComponent, {
        width: '250px',
        data: { field: `${field}`, replaceValueString: this.replaceValueString}
      });
    } 
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result.replaceValueString){
        this.replaceTeamField(this.team.teamId, field, result.replaceValueString);
      }
    }); 
  }

  public replaceTeamField(teamId: string, teamField: string, replaceValue: string){
    this.teamService.updateTeamField(teamId, teamField, replaceValue, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
    }, err => {
      console.error(err);
    });
  }

  public openConfirmationDialog(user: User){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.removeUserFromTeam(user);
      }
    });
  }

  
  public removeUserFromTeam(user: User){
    this.userTeamService.exitTeam(user.userId, this.team.teamId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      
    },
    err => {
      console.error(err.error.message);
    },
    () => {
      window.location.reload();
    });
  }
  
  public openConfirmationDialogForDeletion(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.deleteTeam();
      }
    });
  }

  public deleteTeam(){
    this.teamService.deleteTeam(this.team.teamId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err);
    });
  }
}
