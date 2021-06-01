import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user/user';
import { FormControl } from '@angular/forms';

export interface DialogData{
  
  replaceValueString: string;
  field: string;
  chargeFee ?: number;

}


@Component({
  selector: 'app-fieldform',
  templateUrl: './fieldform.component.html',
  styleUrls: ['./fieldform.component.scss']
})
export class FieldformComponent implements OnInit {

  user: User;
  userName: string;
  isChargedChange: boolean = false;
  hasEnoughTokens: boolean = true;

  txtValue: FormControl;

  constructor(public dialogRef: MatDialogRef<FieldformComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private tokenService: TokenStorageService) {
      this.txtValue = new FormControl();
  }

  public confirm(){
    this.data.replaceValueString = this.txtValue.value;
    this.dialogRef.close(this.data);
  }

  public onNoClick(): void{
    this.dialogRef.close();
  }
  
  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
      const user: User = this.tokenService.getUser();
      if(this.data.chargeFee){
        this.isChargedChange = true;
        if(user.userTokens < this.data.chargeFee){
          this.hasEnoughTokens = false;
        }
      }
    }
  }

}
