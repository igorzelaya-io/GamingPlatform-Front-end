import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Tournament } from '../../../models/tournament/tournament';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtDescription: FormControl;
  //txtLimitNumberOfTeams: number;
  txtPlatforms: FormControl;
  tournamentTimeZone: FormControl;
  //tournamentTeamSize: TournamentTeamSize;
  tournamentModerator: User;
  
  tournamentDate: Date;
  tournamentCountry: FormControl;
  
  @ViewChild('tournamentDateTimeElement')
  tournamentDateElement: ElementRef;

  entryAndPriceForm: FormGroup;

  countryInfo: any[] = [];
  countriesUrl: string = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json'; 
 
  isSuccessfulTournamentInformationSubmission = false;
  isClicked = false;
  tournament: Tournament;

  constructor(private router: Router,
			  private httpClient: HttpClient,
			  private route: ActivatedRoute,
			  @Inject(FormBuilder) private builder: FormBuilder) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.tournamentCountry = new FormControl();
	this.txtDescription = new FormControl();
    this.tournament = new Tournament();
	this.tournamentModerator = new User();
	this.tournamentTimeZone = new FormControl();
    this.entryAndPriceForm = this.builder.group({
		cashPrize: new FormControl(),	
		entryFee: new FormControl()
	});
  }

  get entryFee(){
	return this.entryAndPriceForm.get('entryFee') as FormControl;	
  }

  get cashPrice(){
	return this.entryAndPriceForm.get('cashPrize') as FormControl;	
  }

  ngOnInit(): void {
  	this.route.queryParams
	.subscribe((params: User) => {
		this.tournamentModerator = params['user'];
	},
	(err: any) => {
		console.error(err);
	});
  	this.getCountries();
   }

  getAllCountries(): Observable<any>{
	return this.httpClient.get<any>(this.countriesUrl);	
  }

  getCountries(){
	this.getAllCountries()
	.subscribe((data: any) => {
		console.log(data);
		this.countryInfo = data.Countries;
	},
	(err: any) => {
		console.error(err);
	});
  }

  updateCountry(event: any){
	this.tournamentCountry = event.target.value;
  }  

  clickedButton(): void{
    this.isClicked = true;
  }

  public onSubmit(): void{
   	this.tournament.tournamentName = this.txtName.value;
	this.tournament.tournamentDescription = this.txtDescription.value;
	this.tournament.tournamentCashPrice = this.cashPrice.value;
	this.tournament.tournamentEntryFee = this.entryFee.value;
	this.tournament.tournamentRegion = this.tournamentCountry.value;
	//this.tournament.tournamentDate = this.tournamentDate.value;
	this.tournament.tournamentModerator = this.tournamentModerator;
	this.router.navigate(['/tournament-creation-config'], {queryParams: { tournament: this.tournament}}); 
  }

}
