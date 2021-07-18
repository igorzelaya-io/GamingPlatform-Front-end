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
import { TeamTournamentService } from 'src/app/services/team/team-tournament.service';
import { TeamInviteRequest } from 'src/app/models/teaminviterequest';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ImageModel } from 'src/app/models/imagemodel';

export interface DialogData{
  field: string,
  replaceValueString: string,
  chargeFee?: number;

}

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-team-details-page',
  templateUrl: './team-details-page.component.html',
  styleUrls: ['./team-details-page.component.scss']
})
export class TeamDetailsPageComponent implements OnInit {

  team: Team;

  teamCodTournaments: Tournament[];
  isEmptyCodTournaments: boolean = false;
  
  teamFifaTournaments: Tournament[];
  isEmptyFifaTournaments: boolean = false;

  userInspectingTeam: User;
  isAdminUser: boolean = false;
  isPartOfTeam: boolean = false;

  allCodTournamentYears: number[];
  allCodTournamentMonths: string[];

  allFifaTournamentYears: number[];
  allFifaTournamentMonths: string[];

  teamImage: string;

  replaceValueString: string;
  
  teamUsers: User[] = [];
  teamUsersWithImage: User[] = [];
  teamUsersWithoutImage: User[] = [];

  teamUsersImage: string[] = [];

  txtUserToSearch: FormControl;
  userFound: User;
  userFoundImage: string;

  isClickedSearchButton: boolean = false;
  isClickedInviteButton: boolean = false;
  isUserFound: boolean = false;
  isSuccesfulInvite: boolean = false;
  
  constructor(private route: ActivatedRoute,
              private teamService: TeamService,
              private tokenService: TokenStorageService,
              private userTeamService: UserTeamService,
              public dialog: MatDialog,
              private router: Router,
              private teamTournamentService: TeamTournamentService,
              private userService: UserService) {
    this.team = new Team();
    this.userInspectingTeam = new User();
    this.allCodTournamentMonths = [];
    this.allCodTournamentYears = [];
    this.allFifaTournamentMonths = [];
    this.allFifaTournamentYears = [];
    this.teamCodTournaments = [];
    this.teamFifaTournaments = [];
    this.txtUserToSearch = new FormControl();
    this.userFound = new User();
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
        this.evaluateTeamUsersImages();
        isSuccessfulGet = true;
      }
    },
    err => {
      console.error(err);
    }, () => {
      if(this.tokenService.loggedIn() && isSuccessfulGet){
        this.userInspectingTeam = this.tokenService.getUser();
        this.evaluateUserRoles();
        this.getAllTeamCodTournaments();
        this.getAllTeamFifaTournaments();
      }
      if(this.team.hasImage){
        this.getTeamImage();
      }
    });
  }

  evaluateTeamUsersImages(){
    if(this.teamUsers){
      for(let i = 0; i < this.teamUsers.length; i++){
        const currUser: User = this.teamUsers[i];
        if(currUser.hasImage){
          this.getUserImageResult(currUser.userId);
          this.teamUsersWithImage.push(currUser);
        }
        else{
          this.teamUsersWithoutImage.push(currUser);
        }
      }
    }
  }
  
  getUserImageResult(userId: string ): void{
    this.userService.getUserImage(userId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.teamUsersImage.push(data.imageBytes);
      }
    });
  }

  getTeamImage(){
    this.teamService.getTeamImage(this.team.teamId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.teamImage = data.imageBytes;
      }
    },
    err => {
      console.error(err);
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
    let successfulDelete: boolean = false;
    this.teamService.deleteTeam(this.team, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      successfulDelete = true;
    },
    err => {
      console.error(err);
    },
    () => {
      if(successfulDelete){
        this.removeTeamFromLocalStorage();
        this.router.navigate(['/my-teams']);
      }
    });
  }

  public getAllTeamCodTournaments(){
    this.teamTournamentService.getAllCodTournamentsFromTeam(this.team.teamId)
    .subscribe((data: Tournament[]) => {
      if(data && data.length){
        this.teamCodTournaments = data;
        this.getAllCodTournamentYears(data);
        this.getAllCodTournamentMonths(data);
        return;
      }
      this.isEmptyCodTournaments = true;
    }, err => {
      console.error(err);
      this.isEmptyCodTournaments = true;
    });
  }

  public getAllTeamFifaTournaments(){
    this.teamTournamentService.getAllFifaTournamentsFromTeam(this.team.teamId)
    .subscribe((data: Tournament[]) => {
      if(data && data.length){
        this.teamFifaTournaments = data;
        this.getAllFifaTournamentYears(data);
        this.getAllFifaTournamentMonths(data);
        return; 
      }
      this.isEmptyFifaTournaments = true;
    }, err => {
      console.error(err);
      this.isEmptyFifaTournaments = true;
    });
  }

  public getAllCodTournamentYears(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allCodTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
    }
  }

  public getAllCodTournamentMonths(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allCodTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()] + ' ' + tournaments[i].tournamentDate.toString().slice(8, 10));
    }
  }

  public getAllFifaTournamentYears(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allFifaTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
    }
  }

  public getAllFifaTournamentMonths(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allFifaTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()] + ' ' + tournaments[i].tournamentDate.toString().slice(8, 10));
    }
  }

  removeTeamFromLocalStorage(){
    let userTeams: Team[] = this.userInspectingTeam.userTeams;
    this.userInspectingTeam.userTeams = userTeams.filter(team => team.teamId !== this.team.teamId);
    this.tokenService.saveUser(this.userInspectingTeam);
  }

  viewTournamentDetails(tournament: Tournament): void{
    this.router.navigate(['/tournament-details'], {queryParams: { tournamentId: tournament.tournamentId}});
  }

  getUserByUserName(){
    if(!this.txtUserToSearch.value){
      return;
    }
    this.userService.getUserByUserName(this.txtUserToSearch.value)
    .subscribe((data: User) => {
      if(data && Object.keys(data).length){
        this.userFound = data;
        this.isUserFound = true;
        this.isClickedSearchButton = true;
        if(data.hasImage){
          this.getUserImage(data.userId)
        }
        return;
      }
      this.isUserFound = false;
      this.isClickedSearchButton = false;

    },
    err => {
      console.error(err);
      this.isUserFound = false;
      this.isClickedSearchButton = false;
    });
  }

  getUserImage(userId: string){
    this.userService.getUserImage(userId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.userFoundImage = data.imageBytes;
      }
    }, err => console.error(err));
  }
  
  openConfirmationDialogForTeamInvite(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed()
    .subscribe((result: any) => {
      if(result){
        this.inviteUser();    
      }
    });
  }

  public inviteUser(){
    let teamInviteRequest: TeamInviteRequest = new TeamInviteRequest();
    teamInviteRequest.requestedUser = this.userFound;
    teamInviteRequest.teamRequest = this.team;
    this.teamService.sendTeamInvite(teamInviteRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      this.isSuccesfulInvite = true;
    },
    err => {
      console.error(err.error.message);
    },
    () => {
      if(this.isSuccesfulInvite){
        window.location.reload();
      }
    });
  }

  viewUserDetails(user: User){
    this.router.navigate(['/player-details'], { queryParams: { userId: user.userId}});
  }

  // openConfirmationForInviteDeletion(): void{
  //   const dialogRef = this.dialog.open(FieldformConfirmationComponent);
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if(result){

  //     }
  //   });
  // } 

}
