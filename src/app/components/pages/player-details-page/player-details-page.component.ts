import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';
import { UserService } from 'src/app/services/user.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';
import { Tournament } from 'src/app/models/tournament/tournament';
import { UserTournamentService } from 'src/app/services/user-tournament.service';
import { Challenge } from 'src/app/models/challenge/challenge';
import { TeamInviteRequest } from 'src/app/models/teaminviterequest';
import { UserTeamService } from 'src/app/services/user-team.service';
import { D1Transaction } from '../../../models/d1transaction';
import { UserChallengesService } from 'src/app/services/userchallenges.service';
import { ImageModel } from 'src/app/models/imagemodel';

export interface DialogData{
  field: string;
  replaceValueString: string;
  chargeFee?: number;
}

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-player-details-page',
  templateUrl: './player-details-page.component.html',
  styleUrls: ['./player-details-page.component.scss']
})
export class PlayerDetailsPageComponent implements OnInit {

  isAdmin = false;
  user: User;
  userImage: any;
  
  userTournaments: Tournament[];
  userChallenges: Challenge[];
  userTeamInvites: TeamInviteRequest[];
  userTransactions: D1Transaction[];
  isEmptyTransactions: boolean = false;
  isEmptyTournaments: boolean = false;
  isEmptyChallenges: boolean = false;
  isEmptyInvites: boolean = false;
  allTournamentYears: number[];
  allTournamentMonths: string[];
  
  userInspectingUser: User;
  replaceValueString: string;

  userWinLossRatio: number;


  constructor(private tokenService: TokenStorageService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private userService: UserService,
              private router: Router,
              private userTournamentService: UserTournamentService,
              private userTeamService: UserTeamService,
              private userChallengeService: UserChallengesService) {
    this.user = new User();
    this.userInspectingUser = new User();
    this.userTournaments = [];
    this.userChallenges = [];
    this.allTournamentYears = [];
    this.allTournamentMonths = [];
    
  }
  
  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.getUserById(params['userId']);
    });
  }

  public evaluateRole(){
    if(this.userInspectingUser.userRoles.filter(userRole => userRole.authority === 'ADMIN')){
      this.isAdmin = true;
      this.getAllTeamInvites();
      this.getAllTournamentsFromUser(this.user.userId);
    }
  }

  public openConfirmationDialogForBanning(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.banPlayer();
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
    }, err => {
      console.error(err);
    });
  }
  
  public banPlayer(){
    this.userService.banPlayer(this.user.userId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err);
    });
  }

  public openConfirmationDialogForDeletion(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent); 
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.deleteUserById();
      } 
    });
  }

  
  public deleteUserById(){
    this.userService.deleteUser(this.user.userId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err); 
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

  public updateUserStringField(userId: string, userField: string, replaceValue: string){
    this.userService.updateUserField(userId, userField, replaceValue, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
    }, err => {
      console.error(err.error.message);
    });
  }

  calculateUserWinLossRatio(){
    //TODO:
  }

  public getUserById(userId: string){
    let isSuccessfulUserGet: boolean = false;
    this.userService.getUserById(userId)
    .subscribe((data: User) => {
      if(data){
        this.user = data;
        isSuccessfulUserGet = true;
        
      }
    }, err => {
      console.error(err);
    },
    () => {
      if(isSuccessfulUserGet && this.tokenService.loggedIn()){
        this.userInspectingUser = this.tokenService.getUser();
        this.evaluateRole();
        this.getAllTournamentsFromUser(this.user.userId);
        this.getAllChallengesFromUser();
        this.getAllTransactionsFromUser();
        if(this.user.hasImage){
          this.getUserImage();
        }
      }
    }); 
  }

  getUserImage(){
    this.userService.getUserImage(this.user.userId)
    .subscribe((data: ImageModel) => {
      if(data){
        this.userImage = data.imageBytes;
      }
    }, 
    err => {
      console.error(err);
    });
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
        return;
      }
      this.isEmptyInvites = true;
    }, err => {
      console.error(err);
      this.isEmptyInvites = true;
    });
  }

  public getAllChallengesFromUser(){
    this.userChallengeService.getAllUserChallenges(this.user.userId)
    .subscribe((data: Challenge[]) => {
      if(data && data.length){
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

  public getAllTransactionsFromUser(){
    this.userService.getAllUserTransactions(this.user.userId, this.tokenService.getToken())
    .subscribe((data: D1Transaction[]) => {
      if(data && data.length){
        this.userTransactions = data;
        return; 
      }
      this.isEmptyTransactions = true; 
    }, err => {
      console.error(err);
      this.isEmptyTransactions = true;
    });
  }

  public deleteTransactionFromUser(transactionId: string): void{
    this.userService.deleteUserTransaction(this.user.userId, transactionId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => console.error(err));
  }

  public openConfirmationDialogForTransactionDeletion(transactionToDelete: D1Transaction){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed()
      .subscribe((result: any) => {
        if(result){
          this.deleteTransactionFromUser(transactionToDelete.transactionId);
        }
      });
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

  public navigateToInvites(){
    this.router.navigate(['/team-invites']);
  }

}
