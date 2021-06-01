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

export interface DialogData{
  
  replaceValueString: string;
  field: string;
  chargeFee?: number;

}

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.scss']
})

export class AccountDetailsComponent implements OnInit {

  user: User;
  userTeams: Array<Team>;

  isSuccessfulUpdate: boolean = false;

  replaceValueString: string;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              public dialog: MatDialog) {
  		this.user = new User();
		  this.userTeams = new Array<Team>();	
  }
  

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    
  }
  
  public openConfirmationDialogForDeletion(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.deleteUser();
      }
    });
  }
  
  public deleteUser(){
    this.userService.deleteUser(this.user.userId, this.tokenService.getToken())
    .subscribe((response:MessageResponse) => {
        console.log(response);
      },
      err => console.error(err.error.message)
    );
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
      }
    });
  }

  public changeUserFieldInStorage(userField: string, replaceValue: string): void{
    const userInStorage: User = this.tokenService.getUser();
    userInStorage[`${userField}`] = replaceValue;
    this.tokenService.saveUser(userInStorage);
    window.location.reload();
  }

  calculateUserWinLossRatio(){
    //TODO: 
  }
}
