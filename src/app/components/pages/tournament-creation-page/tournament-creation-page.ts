import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { SharedService } from '../../../services/helpers/shared-service';


@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtLimitNumberOfTeams: number;
  txtPlatforms: FormControl;
  tournamentTeamSize: TournamentTeamSize;
  tournamentFormat: TournamentFormat;
  tournamentModerator: User;
  tournamentDate: Date;
  tournamentCashPrice: FormControl;
  tournamentEntryFee: FormControl;
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
 
  isSuccessfulTournamentCreation = false;
  isSubmittedDropDownContent = true;
  isClicked = false;
  tournament: Tournament = new Tournament();

  constructor(private tournamentService: TournamentService,
			  private renderer: Renderer2,
	          private sharedService: SharedService) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.tournamentCashPrice = new FormControl();
	this.tournamentEntryFee = new FormControl();
	this.tournamentRegion = new FormControl();
    this.leagueFormatElement = this.sharedService.get();
	this.pvpFormatElement = this.sharedService.get();
  }

  ngOnInit(): void {
  	
  }


  onSubmit(){
    this.tournament.tournamentCashPrice = this.tournamentCashPrice.value;
	this.tournament.tournamentEntryFee = this.tournamentEntryFee.value;
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  selectLeagueTournamentFormat(): void{	
	if(this.pvpFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid red');
	}
	this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border','3px solid blue');
	//this.leagueFormatElement.nativeElement.style.border = '3px solid blue;';
	this.tournamentFormat = TournamentFormat.League;
  	this.tournamentFormatString = TournamentFormat[this.tournamentFormat];
  }

  selectPvPTournamentFormat(): void{
	if(this.leagueFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border', '3px solid red');
	}
	this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid blue');
	//this.pvpFormatElement.nativeElement.style.border = '3px solid blue;';
	this.tournamentFormat = TournamentFormat.PvP;
	this.tournamentFormatString = TournamentFormat[this.tournamentFormat];	 
   }

  //dropdownOnSubmit(): void{
    //if (this.txtCountry.valid){
      //this.isSubmittedDropDownContent = true;
      //return
    //}
    //this.isSubmittedDropDownContent = false;
  //}
}
