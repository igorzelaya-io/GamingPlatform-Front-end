import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { SharedService } from '../../../services/helpers/shared-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtDescription: FormControl;
  txtLimitNumberOfTeams: number;
  txtPlatforms: FormControl;
  tournamentTeamSize: TournamentTeamSize;
  tournamentFormat: TournamentFormat;
  tournamentModerator: User;
  tournamentDate: Date;
  tournamentRegion: FormControl;
  tournamentTeams: Array<Team>;
  
  tournamentFormatString: string;
  

  @ViewChild('leagueFormatElement')
  leagueFormatElement: ElementRef;

  @ViewChild('pvpFormatElement')
  pvpFormatElement: ElementRef;

  tournamentGameMode: TournamentMode;

  message = ' ';
  errorMessage = ' ';

  entryAndPriceForm: FormGroup;
 
  isSuccessfulTournamentCreation = false;
  isSubmittedDropDownContent = true;
  isClicked = false;
  tournament: Tournament = new Tournament();

  constructor(private router: Router,
			  private renderer: Renderer2,
	          private sharedService: SharedService,
			  @Inject(FormBuilder) private builder: FormBuilder) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.tournamentRegion = new FormControl();
	this.txtDescription = new FormControl();
    this.leagueFormatElement = this.sharedService.get();
	this.pvpFormatElement = this.sharedService.get();
  	this.entryAndPriceForm = this.builder.group({
		entryFee: new FormControl(),
		cashPrize: new FormControl()	
	});
  }

  get entryFee(){
	return this.entryAndPriceForm.get('entryFee');	
  }

  get cashPrice(){
	return this.entryAndPriceForm.get('cashPrize');	
  }

  ngOnInit(): void {
  	
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  selectLeagueTournamentFormat(): void{	
	if(this.pvpFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid red');
	}
	else if(this.leagueFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border', '3px solid red');
		this.tournamentFormat = undefined;
	}
	this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border','3px solid blue');
	//this.leagueFormatElement.nativeElement.style.border = '3px solid blue;';
	this.tournamentFormat = TournamentFormat.League;
  }

  selectPvPTournamentFormat(): void{
	if(this.leagueFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border', '3px solid red');
	}
	else if(this.pvpFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid red');
		this.tournamentFormat = undefined;
	}
	this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid blue');
	//this.pvpFormatElement.nativeElement.style.border = '3px solid blue;';
	this.tournamentFormat = TournamentFormat.PvP;
   }

   public onSubmit(): void{
   	this.tournament.tournamentName = this.txtName.value;
	this.tournament.tournamentDescription = this.txtDescription.value;
	this.tournament.tournamentCashPrice = this.cashPrice.value;
	this.tournament.tournamentEntryFee = this.entryFee.value;
	this.router.navigate(['/tournament-creation-config'], {queryParams: {tournament: this.tournament}}); 
  }

}
