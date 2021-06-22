import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Team } from '../../../models/team';
import { MessageResponse } from 'src/app/models/messageresponse';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';
import { UserTournament } from 'src/app/models/user/user-tournament';
import { UserTournamentService } from 'src/app/services/user-tournament.service';
import { Tournament } from 'src/app/models/tournament/tournament';
import { TeamInviteRequest } from 'src/app/models/teaminviterequest';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserLoginRequest } from 'src/app/models/user/userloginrequest';
import { UserTeamService } from 'src/app/services/user-team.service';
import { Challenge } from 'src/app/models/challenge';
import { UserChallengesService } from '../../../services/userchallenges.service';
import { D1Transaction } from 'src/app/models/d1transaction';


export interface DialogData{
  
  replaceValueString: string;
  field: string;
  chargeFee?: number;

}

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.scss']
})

export class AccountDetailsComponent implements OnInit {

  user: User;
  userTournaments: Tournament[];
  userChallenges: Challenge[];
  userTeamInvites: TeamInviteRequest[];
  userTransactions: D1Transaction[];
  isEmptyInvites: boolean = false;
  allTournamentYears: number[];
  allTournamentMonths: string[];
  isEmptyTournaments: boolean = false;
  isEmptyChallenges: boolean = false;
  isEmptyTransactions: boolean = false;
  isSuccessfulUpdate: boolean = false;

  replaceValueString: string;  

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              private userTournamentService: UserTournamentService,
              public dialog: MatDialog,
              private router: Router,
              private userTeamService: UserTeamService,
              private userChallengeService: UserChallengesService) {
      this.user = new User();
      this.userTournaments = [];
      this.userChallenges = [];
      this.allTournamentYears = [];
      this.allTournamentMonths = [];
      this.userTransactions = [];
  }
  

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.getAllTournamentsFromUser(this.user.userId);
    this.getAllTeamInvites();
    this.getUserChallenges(this.user.userId);
    this.getUserTransactions();
  }
  
  
  public openConfirmationDialogForDeletion(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.deleteUser();
      }
    });
  }

  public openConfirmationDialogForInviteDeletion(teamInviteRequest: TeamInviteRequest){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed()
    .subscribe((result: any) => {
        if(result){
          this.deleteUserTeamInvite(teamInviteRequest);
        }
      });
  }

  public deleteUserTeamInvite(teamInviteRequest: TeamInviteRequest): void{
    this.userTeamService.deleteUserTeamRequest(teamInviteRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
    }, 
    err => {
      console.error(err);
    });
  }
  
  public deleteUser(){
    let isSuccessfulDelete: boolean = false; 
    this.userService.deleteUser(this.user.userId, this.tokenService.getToken())
    .subscribe((response:MessageResponse) => {
        isSuccessfulDelete = true;
        console.log(response);
      },
      err => console.error(err.error.message),
      () => {
        if(isSuccessfulDelete){
          this.tokenService.signOut();
          this.router.navigate(['/']);
        }
      });
  }

  public openDialogUserName(){
    this.openDialogForField('userName');
  }

  public openDialogUserRealName(){
    this.openDialogForField('userRealName');
  }

  public openDialogForField(field: string){
    let dialogRef: any;
    if(field == 'userName'){
        dialogRef = this.dialog.open(FieldformComponent, {
        width: '400px',
        data: {field: `${field}`, replaceValueString: this.replaceValueString, chargeFee: 100}
      });
    }
    else{
      dialogRef = this.dialog.open(FieldformComponent, {
        width: '250px',
        data: {field: `${field}`, replaceValueString: this.replaceValueString}
      });
    }
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result.replaceValueString){
        this.updateUserStringField(this.user.userId, result.field, result.replaceValueString);
      }
    });
  }

  //update jwt userName in localstorage after replacing userName.
  public updateUserStringField(userId: string, userField: string, replaceValue: string){
    this.userService.updateUserField(userId, userField, replaceValue, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      if(data){
        this.isSuccessfulUpdate = true;
      }
    },
    err => {
      console.error(err.error.message);
      this.isSuccessfulUpdate = false;
    },
    () => {
      if(this.isSuccessfulUpdate){
        this.changeUserFieldInStorage(userField, replaceValue);
        if(userField === 'userName'){
          this.changeUserTokenInStorage();
        }
      }
    });
  }

  public changeUserFieldInStorage(userField: string, replaceValue: string): void{
    const userInStorage: User = this.tokenService.getUser();
    userInStorage[`${userField}`] = replaceValue;
    this.tokenService.saveUser(userInStorage);
  }

  public changeUserTokenInStorage(){
    this.tokenService.signOut();
    this.router.navigate(['/']);
  }

  public viewTeam(teamId: string) : void{
    this.router.navigate(['/team-details'], { queryParams: {teamId: teamId}});
  }

  public viewTeamModerator(userId: string): void{
    this.router.navigate(['/player-details'], {queryParams: {userId: userId}});
  }

  public viewTournamentDetails(tournament: Tournament): void{
    this.router.navigate(['/tournament-details'], {queryParams: { tournamentId: tournament.tournamentId} });
  }

  public getAllTournamentsFromUser(userId: string): void{
    this.userTournamentService.getAllTournamentsFromUser(userId)
    .subscribe((data: Tournament[]) => {
      if(data && data.length != 0){
        this.userTournaments = data;
        this.getAllTournamentYears(data);
        this.getAllTournamentMonths(data);
        return;
      }
      this.isEmptyTournaments = true;
    },
    err => {
      console.error(err);
      this.isEmptyTournaments = true; 
    });
  }

  public getAllTournamentYears(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
    }
  }

  public getAllTournamentMonths(tournaments: Tournament[]){
    for(let i = 0; i < tournaments.length; i++){
      this.allTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()] + ' ' + tournaments[i].tournamentDate.toString().slice(8, 10));
    }
  }

  public getAllTeamInvites(){
    this.userTeamService.getAllUserTeamRequests(this.user.userId)
    .subscribe((data: TeamInviteRequest[]) => {
      if(data && data.length > 0){
        this.userTeamInvites = data;
        console.log(data);
        return;
      }
      this.isEmptyInvites = true;
    }, err => {
      console.error(err);
      this.isEmptyInvites = true;
    });
  }

  public getUserChallenges(userId: string): void{
   this.userChallengeService.getAllUserChallenges(userId)
   .subscribe((data: Challenge[]) => {
     if(data && data.length != 0){
      this.userChallenges = data;
      return;
     }
     this.isEmptyChallenges = true;
   }, 
   err => {
     console.error(err);
     this.isEmptyChallenges = true;
   }); 
  }

  public getUserTransactions(){
    this.userService.getAllUserTransactions(this.user.userId, this.tokenService.getToken())
    .subscribe((data: D1Transaction[]) => {
      if(data && data.length){
        this.userTransactions = data;
        return;
      }
      this.isEmptyTransactions = true;
    },
    err => console.error(err));
  }

  public navigateToInvites(){
    this.router.navigate(['/team-invites']);
  }
  
  calculateUserWinLossRatio(){
    //TODO: 
  }
}
