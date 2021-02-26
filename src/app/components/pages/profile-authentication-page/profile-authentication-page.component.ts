import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormControl } from '@angular/forms';
import { UserLoginRequest} from '../../../models/user/userloginrequest';
import { TokenStorageService } from '../../../services/token-storage.service'; 
import { User } from 'src/app/models/user/user';
import { UserService } from '../../../services/user.service';
import { JwtResponse } from 'src/app/models/jwtresponse';
import { Router } from '@angular/router';
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

  isClicked = false;
  
  constructor(private authenticationService: AuthenticationService,
              private tokenService: TokenStorageService,
              private userService: UserService,
			  private router: Router) {
    this.txtUserName = new FormControl();
    this.txtPassword = new FormControl();
  }
  
  userToLogin: UserLoginRequest = new UserLoginRequest();
  userToSave: User = new User();
  
  
  public onSubmit(){
    this.userToLogin.userName = this.txtUserName.value;
	this.userToLogin.userPassword = this.txtPassword.value;
	this.authenticationService.login(this.userToLogin).subscribe(
      (data: JwtResponse) => {
        if (data != null){
		  this.tokenService.saveToken(data.token);
          this.tokenService.saveUserId(data.id);
          this.isLoggedIn = true;
		  this.router.navigate(['/']);
        }
        this.isLoginFailed = true;
      },
      err => {
        console.error(err.error.error);
		if(err.error.status === 401){
			this.isLoginFailed = true;
			this.isClicked = false;
			this.errorMessage = 'Username or password is incorrect.';
			return;
		}
        this.isLoginFailed = true;
		this.isClicked = false;
        this.errorMessage = err.error.error;
      }
    );
  }

  getUserById(userId: string): void{
    this.userService.getUserById(userId).subscribe(
      (data: User) => {
		console.log(data);
        this.userToSave = data;
      },
      err => console.error(err)); 
  }
 
  click(){
	this.isClicked = true;
  }

  onRetryClick(){
	window.location.reload();
	this.isClicked = false;
  }

  ngOnInit(): void {
  }
}
