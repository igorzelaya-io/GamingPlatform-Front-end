import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Team } from '../../../models/team';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { SharedService } from '../../../services/helpers/shared-service';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../../services/tournament/tournament.service';

@Component({
  selector: 'app-tournament-creation-config-page',
  templateUrl: './tournament-creation-config-page.component.html',
  styleUrls: ['./tournament-creation-config-page.component.scss']
})

export class TournamentCreationConfigPageComponent implements OnInit {
  txtLimitNumberOfTeams: number;
  tournamentTeamSize: TournamentTeamSize;
  tournamentFormat: TournamentFormat;
  tournamentTeams: Array<Team>;
  

  tournamentGameMode: TournamentMode;

  @ViewChild('leagueFormatElement')
  leagueFormatElement: ElementRef;

  @ViewChild('pvpFormatElement')
  pvpFormatElement: ElementRef;

  @ViewChild('killRaceModeElement')
  killRaceModeElement: ElementRef;

  @ViewChild('survivalModeElement')
  survivalModeElement: ElementRef;

  @ViewChild('solosTeamSizeElement')
  solosTeamSizeElement: ElementRef;

  @ViewChild('duosTeamSizeElement')
  duosTeamSizeElement: ElementRef;

  @ViewChild('triosTeamSizeElement')
  triosTeamSizeElement: ElementRef;

  @ViewChild('squadsTeamSizeElement')
  squadsTeamSizeElement: ElementRef;
    
  message = ' ';
  errorMessage = ' ';
 
  isSuccessfulTournamentCreation = false;
  isSignUpFailed = false;
  isClicked = false;
  tournament: Tournament = new Tournament();

  constructor(private router: ActivatedRoute,
			  private renderer: Renderer2,
	          private sharedService: SharedService,
			  private tournamentService: TournamentService) {
    this.leagueFormatElement = this.sharedService.get();
	this.pvpFormatElement = this.sharedService.get();
	this.killRaceModeElement = this.sharedService.get();
	this.survivalModeElement = this.sharedService.get();
  	this.solosTeamSizeElement = this.sharedService.get();
	this.duosTeamSizeElement = this.sharedService.get();
	this.triosTeamSizeElement = this.sharedService.get();
	this.squadsTeamSizeElement = this.sharedService.get();
  }

  ngOnInit(): void {
	this.router.queryParams
	.subscribe(params => {
		this.tournament = params['tournament'];
	});
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  selectLeagueTournamentFormat(): void{	
	if(this.isRedBorder(this.pvpFormatElement)){
		this.changeToWhiteBorder(this.pvpFormatElement);
	}
	else if(this.isRedBorder(this.leagueFormatElement)){
		this.changeToWhiteBorder(this.leagueFormatElement);
		this.tournamentFormat = undefined;
		return;
	}
	this.changeToRedBorder(this.leagueFormatElement);
	this.tournamentFormat = TournamentFormat.League;
  }

  selectPvPTournamentFormat(): void{
	if(this.isRedBorder(this.leagueFormatElement)){
		this.changeToWhiteBorder(this.leagueFormatElement);
	}
	else if(this.isRedBorder(this.pvpFormatElement)){
		this.changeToWhiteBorder(this.pvpFormatElement);
		this.tournamentFormat = undefined;
		return;
	}
	this.changeToRedBorder(this.pvpFormatElement);
	this.tournamentFormat = TournamentFormat.PvP;
   }

   selectKillRaceTournamentGameMode(): void{
    if(this.isRedBorder(this.survivalModeElement)){
		this.changeToWhiteBorder(this.survivalModeElement);
	}
	else if(this.isRedBorder(this.killRaceModeElement)){
		this.changeToWhiteBorder(this.killRaceModeElement);
		this.tournamentGameMode = undefined;
		return;
	}
	this.changeToRedBorder(this.killRaceModeElement);
	this.tournamentGameMode = TournamentMode.KillRace;
   }
   
   selectSurvivalTournamentGameMode(){
	if(this.isRedBorder(this.killRaceModeElement)){
		this.changeToWhiteBorder(this.killRaceModeElement);
	}
	else if(this.isRedBorder(this.survivalModeElement)){
		this.changeToWhiteBorder(this.survivalModeElement);
		this.tournamentGameMode = undefined;
		return;
	}
	this.changeToRedBorder(this.survivalModeElement);
	this.tournamentGameMode = TournamentMode.Survival;
   }

   selectSoloTournamentTeamSize(){
	 if(this.isRedBorder(this.duosTeamSizeElement)){
		this.changeToWhiteBorder(this.duosTeamSizeElement);
     }
	 else if(this.isRedBorder(this.solosTeamSizeElement)){
	 	this.changeToWhiteBorder(this.solosTeamSizeElement);
     	this.tournamentTeamSize = undefined;
		return;
	 }
	 else if(this.isRedBorder(this.triosTeamSizeElement)){
		this.changeToWhiteBorder(this.triosTeamSizeElement);
	 }
	 else if(this.isRedBorder(this.squadsTeamSizeElement)){
		this.changeToWhiteBorder(this.squadsTeamSizeElement);
	 }
	 this.changeToRedBorder(this.solosTeamSizeElement);
   	 this.tournamentTeamSize = TournamentTeamSize.Solos;
   }

   selectDuosTournamentTeamSize(){
	if(this.isRedBorder(this.solosTeamSizeElement)){
		this.changeToWhiteBorder(this.solosTeamSizeElement);
	}
	else if(this.isRedBorder(this.duosTeamSizeElement)){
		this.changeToWhiteBorder(this.duosTeamSizeElement);
		this.tournamentTeamSize = undefined;
		return;
	}
	else if(this.isRedBorder(this.triosTeamSizeElement)){
		this.changeToWhiteBorder(this.triosTeamSizeElement)
	}
	else if(this.isRedBorder(this.squadsTeamSizeElement)){
		this.changeToWhiteBorder(this.squadsTeamSizeElement);
	}
	this.changeToRedBorder(this.duosTeamSizeElement);
	this.tournamentTeamSize = TournamentTeamSize.Duos;   
   }

   selectTriosTournamentTeamSize(){
   	if(this.isRedBorder(this.solosTeamSizeElement)){
		this.changeToWhiteBorder(this.solosTeamSizeElement);
	}
	else if(this.isRedBorder(this.triosTeamSizeElement)){
		this.changeToWhiteBorder(this.triosTeamSizeElement);
		this.tournamentTeamSize = undefined;
		return;
	}
	else if(this.isRedBorder(this.squadsTeamSizeElement)){
		this.changeToWhiteBorder(this.squadsTeamSizeElement);
	}
	else if(this.isRedBorder(this.duosTeamSizeElement)){
		this.changeToWhiteBorder(this.duosTeamSizeElement);
	}
	this.changeToRedBorder(this.triosTeamSizeElement);
	this.tournamentTeamSize = TournamentTeamSize.Trios;
   }

   selectSquadTournamentTeamSize(){
	 if(this.isRedBorder(this.solosTeamSizeElement)){
		this.changeToWhiteBorder(this.solosTeamSizeElement);
	 }
	 else if(this.isRedBorder(this.duosTeamSizeElement)){
		this.changeToWhiteBorder(this.duosTeamSizeElement);
	 }
	 else if(this.isRedBorder(this.triosTeamSizeElement)){
		this.changeToWhiteBorder(this.triosTeamSizeElement);
	 }
	 else if(this.isRedBorder(this.squadsTeamSizeElement)){
		this.changeToWhiteBorder(this.squadsTeamSizeElement);
		this.tournamentTeamSize = undefined;
		return;
	 }
	 this.changeToRedBorder(this.squadsTeamSizeElement);
     this.tournamentTeamSize = TournamentTeamSize.Squads;
   }

	private isRedBorder(elementToEvaluate: ElementRef): boolean{
		if(elementToEvaluate.nativeElement.style.border === '3px solid red'){
			return true; 
		}
		return false;
	}

	private changeToRedBorder(elementToChange: ElementRef): void{
		this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid red');
	}
	
	private changeToWhiteBorder(elementToChange: ElementRef): void{
		this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid white');
	}

	public onSubmit(){
		this.tournamentService.postTournament(this.tournament.tournamentModerator, this.tournament)
		.subscribe((data: string) => {
			this.message = data;
			console.log(data);
			this.isSuccessfulTournamentCreation = true;
		},
		(err: string) => {
			console.error(err);
			this.errorMessage = err;
			this.isSuccessfulTournamentCreation = false;
			this.isSignUpFailed = true;
		},() => {
			console.log('complete');
		});
	}
}
