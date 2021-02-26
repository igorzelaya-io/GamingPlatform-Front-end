import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthRequest } from '../../../models/user/userauthrequest';
import { AuthenticationService } from '../../../services/authentication.service'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  txtCountry: FormControl;
  txtDay: FormControl;
  txtMonth: FormControl;
  txtYear: FormControl;
  user: UserAuthRequest;
   
  countryBirthDateForm: FormGroup;

  errorMessage = ' ';
  countryInfo: any[] = [];
  countriesUrl = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json';
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  isSuccessfulRegister = false;
  isSignUpFailed = false;
  areEqualPasswords = true;
  isClicked = false;
  isSubmittedDropDownContent = true;
  isValidYear = true;
  
  constructor(private authService: AuthenticationService,
			  private formBuilder: FormBuilder,
              private httpClient: HttpClient) {
    this.txtFirstName = new FormControl();
    this.txtBirthName = new FormControl();
    this.txtUserName = new FormControl();
    this.txtPassword = new FormControl();
    this.txtPasswordRepeat = new FormControl();
    this.txtEmail = new FormControl();
    this.txtCountry = new FormControl();
    this.txtDay = new FormControl();
    this.txtMonth = new FormControl();
    this.txtYear = new FormControl();

    this.countryBirthDateForm = formBuilder.group({
		day: ['', [Validators.required]],
		month: ['', [Validators.required]],
		year: ['', [Validators.required]],
		country: ['', [Validators.required]]
	});
	
	
    this.user = new UserAuthRequest();
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

  userBirthDate: Map<string, object> = new Map();
  
  onSubmit(){
    this.validatePasswords();
    this.validateYearInput();
    if (this.areEqualPasswords && this.isValidYear){
      this.submitForm();
      this.clickedButton();
      return
    }
  }

  public submitForm(){
    this.user.userRealName = this.toRealName();
    this.user.userName = this.txtUserName.value;
    this.user.userPassword = this.txtPassword.value;
    this.user.userCountry = this.country.value;
    this.user.userEmail = this.txtEmail.value;
    this.userBirthDate = this.toBirthDate();
    this.authService.signup(this.user).subscribe(
      data => {
        console.log(data);
        this.isSuccessfulRegister = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.errorMessage;
        this.isSignUpFailed = true;
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
    if(this.txtYear.value > 2021 || this.txtYear.value < 1950){
      this.isValidYear = false;
    }
    this.isValidYear = true;
  }

  ngOnInit(): void {
    this.getCountries();
  }

  private toBirthDate(): Map<string, object> {
    let map: Map<string, object> = new Map();   
    map.set('day', this.day.value);      
    map.set('month', this.month.value);
    map.set('year', this.year.value);
    return map;
  }

  private toRealName(): string {
    return this.txtFirstName.value + ' ' + this.txtBirthName.value;
  }

}
