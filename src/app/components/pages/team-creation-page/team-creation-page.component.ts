import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../../services/team/team-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { TeamInviteRequest } from 'src/app/models/teaminviterequest';
import { TeamCreationRequest } from '../../../models/teamcreationrequest';
import { Router } from '@angular/router';

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

  countryInfo: any[] = [];
  countriesUrl = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json';

  isSuccessfulRegister = false;
  isSignUpFailed = false;
  isClicked = false;

  team: Team;

  teamCreationRequest: TeamCreationRequest;

  selectedImageFile: File;

  constructor(private teamService: TeamService,
              private userService: UserService,
              private httpClient: HttpClient,
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
  
  get txtName(){
	return this.teamForm.get('txtName') as FormControl;	
  }

  get txtEmail(){
	return this.teamForm.get('txtEmail') as FormControl;	
  }

  get txtCountry(){
	return this.teamForm.get('txtCountry') as FormControl;	
  }

  ngOnInit(): void {
    this.getCountries();
  }

  onSubmit(){
    this.team.teamName = this.txtName.value;
    this.team.teamEmail = this.txtEmail.value;
   	this.team.teamCountry = this.txtCountry.value;
	this.usersToInvite.forEach(userToInvite => {
		this.teamInviteRequestUsersToInvite.push(new TeamInviteRequest(this.team, userToInvite, Date.now()))
	});
	this.team.teamUsers = [ this.tokenService.getUser() ];
	this.team.teamRequests = this.teamInviteRequestUsersToInvite;
	this.teamCreationRequest.teamToRegister = this.team; 
	this.teamCreationRequest.teamModerator = this.tokenService.getUser();
   // if (this.selectedImageFile !== null){
   //   this.postTeamWithImage();
   // }
    this.teamService.postTeam(this.teamCreationRequest, this.tokenService.getToken())
	  .subscribe((response: string) => {
      console.log(response);
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
		}
	});
  }

  public sendTeamInviteToEachUser(){
	this.team.teamRequests.forEach(userToInvite => {
		this.sendTeamInviteToUser(userToInvite);
	});
  }

  public sendTeamInviteToUser(userToInvite: TeamInviteRequest){
	this.teamService.sendTeamInvite(userToInvite, this.tokenService.getToken())
	.subscribe((data: string) => {
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

  public onFileChanged(event){
    this.selectedImageFile = event.target.files[0];
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
    .subscribe((resp: string) => {
      console.log(resp);
    },
    err => {
      console.error(err);
    });
  }

  public getCountries(){
    this.allCountries().subscribe(
      data => {
        this.countryInfo = data.Countries;
      },
      err => {
        console.log(err);
      });
  }

  changeCountry(event: any){
	this.txtCountry.setValue(event.target.value, {
		onlySelf: true
	});
  }

  allCountries(): Observable<any> {
    return this.httpClient.get<any>(this.countriesUrl);
  }


}
