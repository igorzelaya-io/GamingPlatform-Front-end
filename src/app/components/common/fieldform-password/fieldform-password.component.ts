import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user/user';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserPasswordChangeRequest } from 'src/app/models/userpasswordchangerequest';
import { MessageResponse } from 'src/app/models/messageresponse';

export interface DialogDataPassword {
  isSuccessfulUpdate: boolean;
}

@Component({
  selector: 'app-fieldform-password',
  templateUrl: './fieldform-password.component.html',
  styleUrls: ['./fieldform-password.component.scss']
})
export class FieldformPasswordComponent implements OnInit {

  user: User;
  userPasswordForm: FormGroup;
  response: string;
  isValidCredentials: boolean = false;
  isFailedUpdate: boolean = false;
  isClickedConfirmButton: boolean = false;
  
  constructor(public dialogRef: MatDialogRef<FieldformPasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogDataPassword,
              private tokenService: TokenStorageService,
              private authService: AuthenticationService,
              @Inject(FormBuilder) private formBuilder: FormBuilder) {
    this.userPasswordForm = this.formBuilder.group({
      userCurrentPassword: new FormControl(),
      userNewPassword: new FormControl(),
      userNewPasswordRepeat: new FormControl()
    });
  }

  ngOnInit(): void {
    if(this.tokenService.loggedIn()){
      this.user = this.tokenService.getUser();
    }
  }

  get userCurrentPassword(){
    return this.userPasswordForm.get('userCurrentPassword') as FormControl;
  }

  get userNewPassword(){
    return this.userPasswordForm.get('userNewPassword') as FormControl;
  }

  get userNewPasswordRepeat(){
    return this.userPasswordForm.get('userNewPasswordRepeat') as FormControl;
  }

  
  public onSubmit(){
    const userNewPassword: string = this.userNewPassword.value;
    const userNewPasswordRepeat: string = this.userNewPasswordRepeat.value;
    if(userNewPassword === userNewPasswordRepeat){
      let userPasswordRequest: UserPasswordChangeRequest = new UserPasswordChangeRequest(this.user.userName, this.userCurrentPassword.value, userNewPassword);
      this.isClickedConfirmButton = true;
      this.authService.updateUserPassword(userPasswordRequest, this.tokenService.getToken())
      .subscribe((data: MessageResponse) => {
        if(data){
          this.isValidCredentials = true;
          this.isFailedUpdate = false;
          this.data.isSuccessfulUpdate = true;
          return;
        }
        this.isFailedUpdate = true; 
        this.isValidCredentials = false;
        this.isClickedConfirmButton = false;
        this.response = 'Error';
      },
      err => {
        console.error(err.error.message);
        if(err.error.status === 401){
          this.isFailedUpdate = true;
          this.isValidCredentials = false;
          this.isClickedConfirmButton = false;
          this.response = 'Inserted password is incorrect.';
        }
      }, 
      () => {
        if(this.isValidCredentials && !this.isFailedUpdate){
          this.dialogRef.close(this.data);
        }
      });
      return;      
    }
    this.isFailedUpdate = true;
    this.isValidCredentials = false;
    this.response = 'Passwords do not match.';
    this.isClickedConfirmButton = false;
  }

  public onNoClick(){
    this.dialogRef.close();
  }
}
