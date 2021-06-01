import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';
import { UserService } from 'src/app/services/user.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';

export interface DialogData{
  field: string;
  replaceValueString: string;
  chargeFee?: number;
}

@Component({
  selector: 'app-player-details-page',
  templateUrl: './player-details-page.component.html',
  styleUrls: ['./player-details-page.component.scss']
})
export class PlayerDetailsPageComponent implements OnInit {

  isAdmin = false;
  user: User;

  userInspectingUser: User;
  replaceValueString: string;

  userWinLossRatio: number;


  constructor(private tokenService: TokenStorageService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private userService: UserService) {
    this.user = new User();
    this.userInspectingUser = new User();
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
    }
    // else if(this.userInspectingUser.userName === this.user.userName){
    //   this.isAdmin = true;
    // }
  }

  public openConfirmationDialogForBanning(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.banPlayer();
      }
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
      }
    }); 
  }

}
