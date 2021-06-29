
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../../services/team/team-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { TeamInviteRequest } from 'src/app/models/teaminviterequest';
import { TeamCreationRequest } from '../../../models/teamcreationrequest';
import { Router } from '@angular/router';
import { MessageResponse } from 'src/app/models/messageresponse';
import { UserTeamService } from 'src/app/services/user-team.service';
import { CountryService } from '../../../services/country.service';
//import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface Country{
  
  code: string;
  code3: string;
  name: string;
  number: string;

}

@Component({
  selector: 'app-team-creation-page',
  templateUrl: './team-creation-page.component.html',
  styleUrls: ['./team-creation-page.component.scss']
})

export class TeamCreationPageComponent implements OnInit {


  teamForm: FormGroup;

  txtUserToSearch: FormControl;
  userFound: User;  

  usersToInvite: User[];
  teamInviteRequestUsersToInvite: TeamInviteRequest[];

  isUserFound: boolean = false;
  
  isClickedSearchButton: boolean = false;
  isClickedInviteButton: boolean = false;

  errorMessage: string = ' ';

  countryInfo: Country[] = [];
  countriesUrl = 'https://github.com/dr5hn/countries-states-cities-database/blob/master/countries.json';

  isSuccessfulRegister = false;
  isSignUpFailed = false;
  isClicked = false;

  team: Team;

  teamCreationRequest: TeamCreationRequest;

  selectedImageFile: any;
  cropImagePreview: any;

  constructor(private teamService: TeamService,
              private userService: UserService,
              private countryService: CountryService,
			        private tokenService: TokenStorageService,
			        private formBuilder: FormBuilder,
              private router: Router) {

  	this.team = new Team();
    this.teamCreationRequest = new TeamCreationRequest();
	  this.teamInviteRequestUsersToInvite = [];
	  this.txtUserToSearch = new FormControl();
	  this.userFound = new User();
	  this.usersToInvite = [];
	
	  this.teamForm = this.formBuilder.group({
		  txtName: ['', [Validators.required]],
		  txtEmail: ['',[Validators.required]],
		  txtCountry: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.getCountries();
  }

  public onFileChange(event: any){
    this.selectedImageFile = event;
  }
  
  // cropImage(e: ImageCroppedEvent){
  //   this.cropImagePreview = e.base64;
  // }

  onSubmit(){
    this.isClicked = true;
    this.team.teamName = this.txtName.value;
    this.team.teamEmail = this.txtEmail.value;
    this.team.teamCountry = this.txtCountry.value;
    this.team.teamModerator = this.tokenService.getUser();
	  this.teamCreationRequest.teamToRegister = this.team; 
    this.teamCreationRequest.teamModerator = this.tokenService.getUser();
    this.teamService.postTeam(this.teamCreationRequest, this.tokenService.getToken())
	  .subscribe((response: any) => {
      console.log(response.message);
      this.team = response;
	    this.isClicked = true;
      this.isSuccessfulRegister = true;
	  },
    err => {
	    this.errorMessage = err.error.message;
	    this.isSignUpFailed = true;
      console.error(err.error.message);
	    this.isClicked = false;
    },
    () => {
		  if(this.isSuccessfulRegister || !this.isSignUpFailed){
        this.sendTeamInviteToEachUser();
        this.tokenService.addTeamAdminRoleToSavedUser();
        this.tokenService.addTeamToSavedUser(this.team);
      }
    });
  }

  public sendTeamInviteToEachUser(){
    this.usersToInvite.forEach(userToInvite => {
		   this.teamInviteRequestUsersToInvite.push(new TeamInviteRequest(this.team, userToInvite))
    });
    
    const observablesList: Observable<MessageResponse>[] = []; 
    this.teamInviteRequestUsersToInvite.forEach(userToInvite => {
      observablesList.push(this.teamService.sendTeamInvite(userToInvite, this.tokenService.getToken()));
	  });
    forkJoin(observablesList)
    .subscribe(data => {
      console.log(data);
    },
    err => {
      console.error(err.error.message);
      this.errorMessage = err.error.message;
      this.isClicked = false;
      this.isSuccessfulRegister = false;
    });
  }
  
  clickedButton(): void{
    this.isClicked = true;
  }

  public getTeamByName(teamName: string): void{
    this.teamService.getTeamByName(teamName)
    .subscribe((data: Team) => {
      this.team.teamId = data.teamId;
      console.log(data);
    }, 
    err => {
      console.error(err.error.message);
    });
  }

  public getUserByUserName(){
	  if(this.txtUserToSearch === null){
		  return;
    }
	  this.userService.getUserByUserName(this.txtUserToSearch.value.trim())
	  .subscribe(data => {
		  if(data && Object.keys(data).length !== 0){			
			  this.userFound = data;
			  console.log(data);
			  this.isUserFound = true;
			  this.isClickedSearchButton = true;
			  return;
		  }
		  this.isClickedSearchButton = false;
		  this.isUserFound = false;
	  },
	  err => {
		  console.error(err.error.message);
		  this.isClickedSearchButton = false;	
		  this.isUserFound = false;
	  });
  }

  public addUserToPendingInvites(){
	  this.usersToInvite.push(this.userFound);
	  this.isClickedInviteButton = true;
  }

  public removeUserFromPendingInvites(){
	  this.usersToInvite = this.usersToInvite.filter(user => user.userName !== this.userFound.userName);	
  	this.isClickedInviteButton = false;
  }

  public navigateToTeams(){
	  this.router.navigate(['/my-teams']);
  }

  public postTeamWithImage(){
    console.log(this.selectedImageFile);
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedImageFile, this.selectedImageFile.name);
    this.teamService.postTeamWithImage(this.teamCreationRequest, this.tokenService.getToken())
    .subscribe((resp: MessageResponse) => {
      console.log(resp);
    },
    err => {
      console.error(err);
    });
  }

  public getCountries(): void{  
    this.countryInfo = this.countryService.getCountriesData();
  }

  changeCountry(event: any){
	  this.txtCountry.setValue(event.target.value, {
		  onlySelf: true
	  });
  }

  // allCountries(): Observable<any> {
  //   return this.httpClient.get<any>(this.countriesUrl);
  // }

  get txtName(){
	  return this.teamForm.get('txtName') as FormControl;	
  }

  get txtEmail(){
	  return this.teamForm.get('txtEmail') as FormControl;	
  }

  get txtCountry(){
	  return this.teamForm.get('txtCountry') as FormControl;	
  }

  public reloadPage(){
    window.location.reload();
  }
}