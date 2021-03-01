import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamService } from '../../../services/team/team-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


@Component({
  selector: 'app-team-creation-page',
  templateUrl: './team-creation-page.component.html',
  styleUrls: ['./team-creation-page.component.scss']
})

export class TeamCreationPageComponent implements OnInit {
  txtName: FormControl;
  txtCountry: FormControl;
  txtEmail: FormControl;
  txtPlayers: User[];
  txtTeamModerator: FormControl;

  allUsers: User[];
  message = ' ';

  errorMessage = ' ';
  countryInfo: any[] = [];
  countriesUrl = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json';

  isSuccessfulRegister = false;
  isSubmittedDropDownContent = true;
  isSignUpFailed = false;
  isClicked = false;

  team: Team = new Team();

  selectedImageFile: File;

  constructor(private teamService: TeamService,
              private userService: UserService,
              private httpClient: HttpClient,
			  private tokenService: TokenStorageService) {
    this.txtName = new FormControl();
    this.txtEmail = new FormControl();
    this.txtCountry = new FormControl();
    this.txtTeamModerator = new FormControl();
  }

  ngOnInit(): void {
    this.getCountries();
    this.getAllUsers();
  }


  onSubmit(){
    this.team.teamName = this.txtName.value;
    this.team.teamEmail = this.txtEmail.value;
    this.team.teamCountry = this.txtCountry.value;
    if (this.selectedImageFile !== null){
      this.postTeamWithImage();
    }
    this.teamService.postTeam(this.team, this.tokenService.getToken()).subscribe((response: string) => {
      this.message = response;
      console.log(response);
    },
    err => {
      console.error(err);
      this.errorMessage = err;
    });
  }


  submitForm(){
    this.team.teamName = this.txtName.value;
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

  getAllUsers(){
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.allUsers = data;
      this.userService.userData = data;
      console.log(data);
    },
    err => {
      console.error(err); 
    });
  }

  dropdownOnSubmit(): void{
    if (this.txtCountry.valid){
      this.isSubmittedDropDownContent = true;
      return
    }
    this.isSubmittedDropDownContent = false;
  }

  allCountries(): Observable<any> {
    return this.httpClient.get<any>(this.countriesUrl);
  }

  onSelectedFilter(e){
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList(){
    if (this.userService.searchOption.length > 0){
      this.allUsers = this.userService.filteredListOptions();
    }
    else{
      this.allUsers = this.userService.userData;
    }
  }

  public onFileChanged(event){
    this.selectedImageFile = event.target.files[0];
  }

  public postTeamWithImage(){
    console.log(this.selectedImageFile);
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedImageFile, this.selectedImageFile.name);
    this.teamService.postTeamWithImage(this.team, uploadImageData, this.tokenService.getToken())
    .subscribe((resp: string) => {
      console.log(resp);
      this.message = resp;
    },
    err => {
      console.error(err);
      this.errorMessage = err;
    });
  }


}
