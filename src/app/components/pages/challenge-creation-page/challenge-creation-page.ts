import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../../services/helpers/shared-service';
import { Renderer2 } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { CountryService } from 'src/app/services/country.service';
import { Challenge } from 'src/app/models/challenge/challenge';


@Component({
  selector: 'app-challenge-creation-page',
  templateUrl: './challenge-creation-page.component.html',
  styleUrls: ['./challenge-creation-page.component.scss']
})

export class ChallengeCreationPageComponent implements OnInit {
  
  txtName: FormControl;   
  
  challengeModerator: User;
  
  challengePlatform: string;
 
  
  challengeGame: string;
  challengeCodGameMode: string;
  
  @ViewChild('challengeDateTimeElement')
  challengeDateElement: NgxMatDatetimePicker<Date>;

  @ViewChild('challengeAllPlatformsElement')
  challengeAllPlatformsElement: ElementRef;

  @ViewChild('challengeConsoleElement')
  challengeConsoleElement: ElementRef;

  @ViewChild('challengePcElement')
  challengePcElement: ElementRef;

  @ViewChild('challengeFifaGameElement')
  challengeFifaGameElement: ElementRef;

  @ViewChild('challengeCodGameElement')
  challengeCodGameElement: ElementRef;

  @ViewChild('challengeCodCdlElement')
  challengeCodCdlElement: ElementRef;

  @ViewChild('challengeCodWarzoneElement')
  challengeCodWarzoneElement: ElementRef;

  entryAndPriceForm: FormGroup;

  countryInfo: any[] = [];

  isSuccessfulTournamentInformationSubmission: boolean = false;

  isClicked = false;
  challenge: Challenge;

  constructor(private router: Router,
			  private httpClient: HttpClient,
			  private renderer: Renderer2,
			  private sharedService: SharedService,
			  @Inject(FormBuilder) private builder: FormBuilder,
			  private tokenService: TokenStorageService,
			  private countryService: CountryService) {
    this.txtName = new FormControl();
    this.challenge = new Challenge();
	this.challengeModerator = new User();
    this.entryAndPriceForm = this.builder.group({
		cashPrize: new FormControl(),	
		entryFee: new FormControl(),
		limitNumberOfTeams: new FormControl(),
		challengeCountry: new FormControl()
	});
	this.challengeDateElement = this.sharedService.get();
	this.challengeAllPlatformsElement = this.sharedService.get();
	this.challengePcElement = this.sharedService.get();
	this.challengeConsoleElement = this.sharedService.get();
  }

  get entryFee(){
	return this.entryAndPriceForm.get('entryFee') as FormControl;	
  }

  get cashPrice(){
	return this.entryAndPriceForm.get('cashPrize') as FormControl;	
  }

  get challengeCountry(){
	return this.entryAndPriceForm.get('challengeCountry') as FormControl;	
  }

  get limitNumberOfTeams(){
	return this.entryAndPriceForm.get('limitNumberOfTeams');	
  }

  ngOnInit(): void {
	this.challengeModerator = this.tokenService.getUser();
  	this.getAllCountries();
   }

  getAllCountries(){
	this.countryInfo = this.countryService.getCountriesData();
  }

  public onSubmit(): void{
	this.challenge.challengeName = this.txtName.value;   
	this.challenge.challengeTokenFee = this.entryFee.value;
	this.challenge.challengeCashPrize = this.entryFee.value * 2;
	this.challenge.challengeRegion = this.challengeCountry.value;
	this.challenge.challengePlatforms = this.challengePlatform.valueOf();
	this.challenge.challengeDate = this.challengeDateElement._selected;
	this.challenge.challengeModerator = this.challengeModerator;
	this.challenge.challengeGame = this.challengeGame.valueOf();
	if(this.challengeGame === 'Call Of Duty'){
		this.challenge.challengeCodGameMode = this.challengeCodGameMode;
	}
	this.router.navigate(['/challenge-creation-config'], {queryParams: { challenge: JSON.stringify(this.challenge)}}); 
  }

  public selectPcChallengePlatformElement(){
	if(this.isRedBorder(this.challengeAllPlatformsElement)){
		this.toWhiteBorder(this.challengeAllPlatformsElement);
	}
	else if(this.isRedBorder(this.challengePcElement)){
		this.toWhiteBorder(this.challengePcElement);
		this.challengePlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengeConsoleElement)){
		this.toWhiteBorder(this.challengeConsoleElement);
	}
	this.toRedBorder(this.challengePcElement);
  	this.challengePlatform = 'PC';
  }
  
  public selectConsoleChallengePlatformElement(){
	if(this.isRedBorder(this.challengePcElement)){
		this.toWhiteBorder(this.challengePcElement);
	}
  	else if(this.isRedBorder(this.challengeConsoleElement)){
		this.toWhiteBorder(this.challengeConsoleElement);
		this.challengePlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengeAllPlatformsElement)){
		this.toWhiteBorder(this.challengeAllPlatformsElement);
	}
  	this.toRedBorder(this.challengeConsoleElement);
  	this.challengePlatform = 'Console';
  }
  
  public selectAllPlatformsChallengePlatformElement(){
	if(this.isRedBorder(this.challengeAllPlatformsElement)){
		this.toWhiteBorder(this.challengeAllPlatformsElement);
		this.challengePlatform = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengePcElement)){
		this.toWhiteBorder(this.challengePcElement);
	}
	else if(this.isRedBorder(this.challengeConsoleElement)){
		this.toWhiteBorder(this.challengeConsoleElement);
	}
  	this.toRedBorder(this.challengeAllPlatformsElement);
  	this.challengePlatform = 'All Platforms';
  }

  public selectFifaChallengeGameElement(){
	if(this.isRedBorder(this.challengeCodGameElement)){
		this.toWhiteBorder(this.challengeCodGameElement);
	}
	else if(this.isRedBorder(this.challengeFifaGameElement)){
		this.toWhiteBorder(this.challengeFifaGameElement);
		this.challengeGame = undefined;
		return;
	}
	this.toRedBorder(this.challengeFifaGameElement);
  	this.challengeGame = 'Fifa';
  }

  public selectCodChallengeGameElement(){
	if(this.isRedBorder(this.challengeCodGameElement)){
		this.toWhiteBorder(this.challengeCodGameElement);
		this.challengeGame = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengeFifaGameElement)){
		this.toWhiteBorder(this.challengeFifaGameElement);
	}
	this.toRedBorder(this.challengeCodGameElement);
  	this.challengeGame = 'Call Of Duty';
  }

  selectCdlCodChallengeGameMode(){
	if(this.isRedBorder(this.challengeCodCdlElement)){
		this.toWhiteBorder(this.challengeCodCdlElement);
		this.challengeCodGameMode = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengeCodWarzoneElement)){
		this.toWhiteBorder(this.challengeCodWarzoneElement);
	}
  	this.toRedBorder(this.challengeCodCdlElement);
  	this.challengeCodGameMode = 'CDL';
  }

  selectWarzoneCodChallengeGameMode(){
	if(this.isRedBorder(this.challengeCodWarzoneElement)){
		this.toWhiteBorder(this.challengeCodWarzoneElement);
		this.challengeCodGameMode = undefined;
		return;
	}
	else if(this.isRedBorder(this.challengeCodCdlElement)){
		this.toWhiteBorder(this.challengeCodCdlElement);
	}
	this.toRedBorder(this.challengeCodWarzoneElement);
  	this.challengeCodGameMode = 'Warzone';
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
	this.challengeCountry.setValue(event.target.value, {
		onlySelf: true
	});
  }  

  clickedButton(): void{
    this.isClicked = true;
  }

}
