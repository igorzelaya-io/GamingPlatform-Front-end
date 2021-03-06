import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Tournament } from '../../../models/tournament/tournament';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '../../../services/helpers/shared-service';
import { Renderer2 } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { CountryService } from 'src/app/services/country.service';



@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtDescription: FormControl;
  txtPlatforms: FormControl;
  tournamentModerator: User;
  tournamentPlatform: string;
  tournamentDate: Date;
  tournamentGame: string;
  tournamentCodGameMode: string;
  
  @ViewChild('tournamentDateTimeElement')
  tournamentDateElement: NgxMatDatetimePicker<Date>;

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
 
  isSuccessfulTournamentInformationSubmission = false;
  isClicked = false;
  tournament: Tournament;

  constructor(private router: Router,
			  private httpClient: HttpClient,
			  private renderer: Renderer2,
			  private sharedService: SharedService,
			  @Inject(FormBuilder) private builder: FormBuilder,
			  private tokenService: TokenStorageService,
			  private countryService: CountryService) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.txtDescription = new FormControl();
    this.tournament = new Tournament();
	this.tournamentModerator = new User();
    this.entryAndPriceForm = this.builder.group({
		cashPrize: new FormControl(),	
		entryFee: new FormControl(),
		limitNumberOfTeams: new FormControl(),
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

  get limitNumberOfTeams(){
	return this.entryAndPriceForm.get('limitNumberOfTeams');	
  }

  ngOnInit(): void {
	this.tournamentModerator = this.tokenService.getUser();
  	this.getAllCountries();
   }

  getAllCountries(){
	this.countryInfo = this.countryService.getCountriesData();
  }

  public onSubmit(): void{
   	this.tournament.tournamentName = this.txtName.value;
	this.tournament.tournamentDescription = this.txtDescription.value;
	this.tournament.tournamentCashPrize = this.cashPrice.value;
	this.tournament.tournamentEntryFee = this.entryFee.value;
	this.tournament.tournamentRegion = this.tournamentCountry.value;
	this.tournament.tournamentPlatforms = this.tournamentPlatform.valueOf();
	this.tournament.tournamentDate = this.tournamentDateElement._selected;
	this.tournament.tournamentModerator = this.tournamentModerator;
	this.tournament.tournamentLimitNumberOfTeams = this.limitNumberOfTeams.value;
	this.tournament.tournamentGame = this.tournamentGame;
	this.tournament.tournamentCodGameMode = this.tournamentCodGameMode;
	this.router.navigate(['/tournament-creation-config'], {queryParams: { tournament: JSON.stringify(this.tournament)}}); 
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
