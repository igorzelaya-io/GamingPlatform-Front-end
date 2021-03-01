import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthRequest } from '../../../models/user/userauthrequest';
import { AuthenticationService } from '../../../services/authentication.service'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginRequest } from '../../../models/user/userloginrequest';
import { JwtResponse } from '../../../models/jwtresponse';
import { TokenStorageService } from '../../../services/token-storage.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user/user'; 
import { Router} from '@angular/router';

@Component({
  selector: 'app-profile-registration-page',
  templateUrl: './profile-registration-page.component.html',
  styleUrls: ['./profile-registration-page.component.scss']
})
export class ProfileRegistrationPageComponent implements OnInit {
  txtFirstName: FormControl;
  txtBirthName: FormControl;
  txtUserName: FormControl;
  txtPassword: FormControl;
  txtPasswordRepeat: FormControl;
  txtEmail: FormControl;

  userToRegister: UserAuthRequest;
  userToLogin: UserLoginRequest;  
  userToSaveOnStorage: User;
 

  countryBirthDateForm: FormGroup;

  errorMessage = ' ';
  countryInfo: any[] = [];
  countriesUrl = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json';
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  isSuccessfulRegister = false;
  isSignUpFailed = false;
  areEqualPasswords = true;
  isClicked = false;
  isValidYear = true;
  
  constructor(private authService: AuthenticationService,
			  private formBuilder: FormBuilder,
			  private tokenService: TokenStorageService,
			  private router: Router,
		      private userService: UserService,
              private httpClient: HttpClient) {
    this.txtFirstName = new FormControl();
    this.txtBirthName = new FormControl();
    this.txtUserName = new FormControl();
    this.txtPassword = new FormControl();
    this.txtPasswordRepeat = new FormControl();
    this.txtEmail = new FormControl();
    this.userToRegister = new UserAuthRequest();
	this.userToLogin = new UserLoginRequest();
	this.userToSaveOnStorage = new User();


    this.countryBirthDateForm = formBuilder.group({
		day: ['', Validators.required],
		month: ['', [Validators.required]],
		year: ['', [Validators.required]],
		country: ['', [Validators.required]]
	});
	
  }

  get day(){
	return this.countryBirthDateForm.get('day') as FormControl;	
  }

  get month(){
	return this.countryBirthDateForm.get('month') as FormControl;	
  }

  get year(){
	return this.countryBirthDateForm.get('year') as FormControl;	
  }

  get country(){
	return this.countryBirthDateForm.get('country') as FormControl;	
  } 
  
  onSubmit(){
    this.validatePasswords();
    this.validateYearInput();
    if (this.areEqualPasswords && this.isValidYear){
	  this.clickedButton();
	  this.submitForm();
      return
    }
  }

  public submitForm(){
    this.userToRegister.userRealName = this.toRealName();
    this.userToRegister.userName = this.txtUserName.value;
    this.userToRegister.userPassword = this.txtPassword.value;
    this.userToRegister.userCountry = this.country.value;
    this.userToRegister.userEmail = this.txtEmail.value;
	this.userToRegister.userBirthDate = this.toBirthDate();
    this.authService.signup(this.userToRegister).subscribe(
      data => {
        console.log(data);
        this.isSuccessfulRegister = true;
        this.isSignUpFailed = false;
	  },
      err => {
		console.error(err.error.message);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
	  },
	  () => {
		if(this.isSuccessfulRegister){
			this.loginUser();
			this.getUserById();
		}	
	});
  }

  public loginUser(){
	this.userToLogin.userName = this.userToRegister.userName;
	this.userToLogin.userPassword = this.userToRegister.userPassword;
	this.authService.login(this.userToLogin)
	.subscribe((data: JwtResponse) => {
		console.log(data);
		this.tokenService.saveToken(data.token);
		this.tokenService.saveUserId(data.id);
	},
	err => {
		console.error(err.error.error.message);	
	});
  }

  public getUserById(){
	this.userService.getUserById(this.tokenService.getUserId())
	.subscribe((data: User) => {
		this.tokenService.saveUser(data);
		console.log(data);
	},
	err => {
		console.error(err.error.message)
	});
  }

  validatePasswords(): void{
    if(this.txtPassword.value === this.txtPasswordRepeat.value){
      this.areEqualPasswords = true;
      return
    }
    this.areEqualPasswords = false;
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  getCountries(){
    this.allCountries().subscribe(
      data => {
        this.countryInfo = data.Countries;
      },
      err => {
        console.log(err);  
      },
      () => console.log('complete'));
  }

  allCountries(): Observable<any>{
    return this.httpClient.get<any>(this.countriesUrl);
  }

  navigateToHome(){
	this.router.navigate(['/']);
  }

  public updateCountry(event: any){
	this.country.setValue(event.target.value, {
		onlySelf: true
	});
  }

  public updateUserMonth(event: any){
	this.month.setValue(event.target.value, {
		onlySelf: true
	}); 	
  }

  validateYearInput():void{
    if(this.year.value > 2021 || this.year.value < 1950){
      this.isValidYear = false;
    }
    this.isValidYear = true;
  }

  ngOnInit(): void {
    this.getCountries();
  }

  private toBirthDate(): any {
    let map: Map<string, object> = new Map();   
    map.set('day', this.day.value);      
    map.set('month', this.month.value);
    map.set('year', this.year.value);
    const convertedMap = {};
	map.forEach((val: object, key: string) => {
		convertedMap[key] = val;
	});
	return convertedMap;
  }

  private toRealName(): string {
    return this.txtFirstName.value + ' ' + this.txtBirthName.value;
  }

}
