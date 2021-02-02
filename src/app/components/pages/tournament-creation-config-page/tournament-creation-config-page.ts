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
  tournamentRegion: FormControl;
  tournamentTeams: Array<Team>;
  tournamentGameMode: TournamentMode;

  @ViewChild('leagueFormatElement')
  leagueFormatElement: ElementRef;

  @ViewChild('pvpFormatElement')
  pvpFormatElement: ElementRef;
  
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
    this.tournamentRegion = new FormControl();
	this.leagueFormatElement = this.sharedService.get();
	this.pvpFormatElement = this.sharedService.get();
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
	if(this.pvpFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid red');
	}
	else if(this.leagueFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border', '3px solid red');
		this.tournamentFormat = undefined;
		return;
	}
	this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border','3px solid blue');
	this.tournamentFormat = TournamentFormat.League;
  }

  selectPvPTournamentFormat(): void{
	if(this.leagueFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.leagueFormatElement.nativeElement, 'border', '3px solid red');
	}
	else if(this.pvpFormatElement.nativeElement.style.border === '3px solid blue'){
		this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid red');
		this.tournamentFormat = undefined;
		return;
	}
	this.renderer.setStyle(this.pvpFormatElement.nativeElement, 'border', '3px solid blue');
	this.tournamentFormat = TournamentFormat.PvP;
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
		});
	}
}
