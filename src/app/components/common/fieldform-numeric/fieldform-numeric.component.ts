import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';


export interface DialogNumericData{
  replaceValueNumeric: number;
  field: string;
  format: string;
  min: number;
  value: number;
  step: number;
  chargeFee ?: number;
}


@Component({
  selector: 'app-fieldform-numeric',
  templateUrl: './fieldform-numeric.component.html',
  styleUrls: ['./fieldform-numeric.component.scss']
})
export class FieldformNumericComponent implements OnInit {

  txtField: FormControl;
  user: User;
  userName: string;
  public isChargedChange: boolean = false;
  public hasEnoughTokens: boolean = true;
  
  constructor(public dialogRef: MatDialogRef<FieldformNumericComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogNumericData,
              private tokenService: TokenStorageService) {
    this.txtField = new FormControl();
  }

  public confirm(){
    if(this.hasEnoughTokens){
      this.data.replaceValueNumeric = this.txtField.value;
      this.dialogRef.close(this.data.replaceValueNumeric);
    }
  }

  public onNoClick(){
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
