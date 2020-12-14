import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormControl } from '@angular/forms';
import { UserLoginRequest} from '../../../models/user/userloginrequest';
import { TokenStorageService } from '../../../services/token-storage.service'; 
import { User } from 'src/app/models/user/user';
import { UserService } from '../../../services/user.service';
import { JwtResponse } from 'src/app/models/jwtresponse';
@Component({
  selector: 'app-profile-authentication-page',
  templateUrl: './profile-authentication-page.component.html',
  styleUrls: ['./profile-authentication-page.component.scss']
})
export class ProfileAuthenticationPageComponent implements OnInit {

  txtUserName: FormControl;
  txtPassword: FormControl;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  
  constructor(private authenticationService: AuthenticationService,
              private tokenService: TokenStorageService,
              private userService: UserService) {
    this.txtUserName = new FormControl();
    this.txtPassword = new FormControl();
  }
  
  userToLogin: UserLoginRequest = new UserLoginRequest();
  userToSave: User = new User();
  
  
  onSubmit(){
    this.authenticationService.login(this.userToLogin).subscribe(
      (data: JwtResponse) => {
        if (data != null){
          this.tokenService.saveToken(data.accessToken);
          this.getUserById(data.userId);
          this.tokenService.saveUser(this.userToSave);
          this.isLoggedIn = true;
        }
        this.isLoginFailed = true;
      },
      err => {
        console.log(err);
        this.isLoginFailed = false;
        this.errorMessage = err.error.errorMessage;
      }
    );
  }

  getUserById(userId: string): void{
    this.userService.getUserById(userId).subscribe(
      (data: User) => {
        this.userToSave = data;
      },
      err => console.log(err)); 
  }

  ngOnInit(): void {
  }
}
