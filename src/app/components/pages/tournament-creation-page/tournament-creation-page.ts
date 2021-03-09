import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Tournament } from '../../../models/tournament/tournament';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../services/helpers/shared-service';
import { Renderer2 } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
  tournamentPlatform: string;
  tournamentDate: Date;
  tournamentGame: string;
  tournamentCodGameMode: string;
  
  @ViewChild('tournamentDateTimeElement')
  tournamentDateElement: ElementRef;

  @ViewChild('tournamentAllPlatformsElement')
  tournamentAllPlatformsElement: ElementRef;

  @ViewChild('tournamentConsoleElement')
  tournamentConsoleElement: ElementRef;

  @ViewChild('tournamentPcElement')
  tournamentPcElement: ElementRef;

  @ViewChild('tournamentFifaGameElement')
  tournamentFifaGameElement: ElementRef;

  @ViewChild('tournamentCodGameElement')
  tournamentCodGameElement: ElementRef;

  @ViewChild('tournamentCodCdlElement')
  tournamentCodCdlElement: ElementRef;

  @ViewChild('tournamentCodWarzoneElement')
  tournamentCodWarzoneElement: ElementRef;

  entryAndPriceForm: FormGroup;

  countryInfo: any[] = [];
  countriesUrl: string = 'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json'; 
 
  isSuccessfulTournamentInformationSubmission = false;
  isClicked = false;
  tournament: Tournament;

  constructor(private router: Router,
			  private httpClient: HttpClient,
			  private renderer: Renderer2,
			  private sharedService: SharedService,
			  @Inject(FormBuilder) private builder: FormBuilder,
			  private tokenService: TokenStorageService) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.txtDescription = new FormControl();
    this.tournament = new Tournament();
	this.tournamentModerator = new User();
	this.tournamentTimeZone = new FormControl();
    this.entryAndPriceForm = this.builder.group({
		cashPrize: new FormControl(),	
		entryFee: new FormControl(),
		tournamentCountry: new FormControl()
	});
	this.tournamentDateElement = this.sharedService.get();
	this.tournamentAllPlatformsElement = this.sharedService.get();
	this.tournamentPcElement = this.sharedService.get();
	this.tournamentConsoleElement = this.sharedService.get();
  }

  get entryFee(){
	return this.entryAndPriceForm.get('entryFee') as FormControl;	
  }

  get cashPrice(){
	return this.entryAndPriceForm.get('cashPrize') as FormControl;	
  }

  get tournamentCountry(){
	return this.entryAndPriceForm.get('tournamentCountry') as FormControl;	
  }

  ngOnInit(): void {
	this.tournamentModerator = this.tokenService.getUser();
  	this.getCountries();
   }

  getAllCountries(): Observable<any>{
	return this.httpClient.get<any>(this.countriesUrl);	
  }

  public onSubmit(): void{
   	this.tournament.tournamentName = this.txtName.value;
	this.tournament.tournamentDescription = this.txtDescription.value;
	this.tournament.tournamentCashPrice = this.cashPrice.value;
	this.tournament.tournamentEntryFee = this.entryFee.value;
	this.tournament.tournamentRegion = this.tournamentCountry.value;
	this.tournament.tournamentPlatforms = this.tournamentPlatform.valueOf();
	//this.tournament.tournamentDate = this.tournamentDate.value;
	this.tournament.tournamentModerator = this.tournamentModerator;
	this.router.navigate(['/tournament-creation-config'], {queryParams: { tournament: JSON.stringify(this.tournament)}}); 
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

  public selectPcTournamentPlatformElement(){
	if(this.isRedBorder(this.tournamentAllPlatformsElement)){
		this.toWhiteBorder(this.tournamentAllPlatformsElement);
	}
	else if(this.isRedBorder(this.tournamentPcElement)){
		this.toWhiteBorder(this.tournamentPcElement);
		this.tournamentPlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentConsoleElement)){
		this.toWhiteBorder(this.tournamentConsoleElement);
	}
	this.toRedBorder(this.tournamentPcElement);
  	this.tournamentPlatform = 'PC';
  }
  
  public selectConsoleTournamentPlatformElement(){
	if(this.isRedBorder(this.tournamentPcElement)){
		this.toWhiteBorder(this.tournamentPcElement);
	}
  	else if(this.isRedBorder(this.tournamentConsoleElement)){
		this.toWhiteBorder(this.tournamentConsoleElement);
		this.tournamentPlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentAllPlatformsElement)){
		this.toWhiteBorder(this.tournamentAllPlatformsElement);
	}
  	this.toRedBorder(this.tournamentConsoleElement);
  	this.tournamentPlatform = 'Console';
  }
  
  public selectAllPlatformsTournamentPlatformElement(){
	if(this.isRedBorder(this.tournamentAllPlatformsElement)){
		this.toWhiteBorder(this.tournamentAllPlatformsElement);
		this.tournamentPlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentPcElement)){
		this.toWhiteBorder(this.tournamentPcElement);
	}
	else if(this.isRedBorder(this.tournamentConsoleElement)){
		this.toWhiteBorder(this.tournamentConsoleElement);
	}
  	this.toRedBorder(this.tournamentAllPlatformsElement);
  	this.tournamentPlatform = 'All Platforms';
  }

  public selectFifaTournamentGameElement(){
	if(this.isRedBorder(this.tournamentCodGameElement)){
		this.toWhiteBorder(this.tournamentCodGameElement);
	}
	else if(this.isRedBorder(this.tournamentFifaGameElement)){
		this.toWhiteBorder(this.tournamentFifaGameElement);
		this.tournamentGame = undefined;
		return;
	}
	this.toRedBorder(this.tournamentFifaGameElement);
  	this.tournamentGame = 'Fifa';
  }

  public selectCodTournamentGameElement(){
	if(this.isRedBorder(this.tournamentCodGameElement)){
		this.toWhiteBorder(this.tournamentCodGameElement);
		this.tournamentGame = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentFifaGameElement)){
		this.toWhiteBorder(this.tournamentFifaGameElement);
	}
	this.toRedBorder(this.tournamentCodGameElement);
  	this.tournamentGame = 'Call Of Duty';
  }

  selectCdlCodTournamentGameMode(){
	if(this.isRedBorder(this.tournamentCodCdlElement)){
		this.toWhiteBorder(this.tournamentCodCdlElement);
		this.tournamentCodGameMode = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentCodWarzoneElement)){
		this.toWhiteBorder(this.tournamentCodWarzoneElement);
	}
  	this.toRedBorder(this.tournamentCodCdlElement);
  	this.tournamentCodGameMode = 'CDL';
  }

  selectWarzoneCodTournamentGameMode(){
	if(this.isRedBorder(this.tournamentCodWarzoneElement)){
		this.toWhiteBorder(this.tournamentCodWarzoneElement);
		this.tournamentCodGameMode = undefined;
		return;
	}
	else if(this.isRedBorder(this.tournamentCodCdlElement)){
		this.toWhiteBorder(this.tournamentCodCdlElement);
	}
	this.toRedBorder(this.tournamentCodWarzoneElement);
  	this.tournamentCodGameMode = 'Warzone';
  }
  
  private toRedBorder(elementToChange: ElementRef): void{
	this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid red');
  }

  private toWhiteBorder(elementToChange: ElementRef){
	this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid white');	
  }

  private isRedBorder(elementToEvaluate: ElementRef): boolean{
	if(elementToEvaluate.nativeElement.style.border === '3px solid red'){
		return true;
	}
	return false;
  }

  updateCountry(event: any){
	this.tournamentCountry.setValue(event.target.value, {
		onlySelf: true
	});
  }  

  clickedButton(): void{
    this.isClicked = true;
  }

}
