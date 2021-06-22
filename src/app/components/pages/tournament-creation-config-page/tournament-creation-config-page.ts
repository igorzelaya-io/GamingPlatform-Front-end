import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Team } from '../../../models/team';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { SharedService } from '../../../services/helpers/shared-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { TournamentCreationRequest } from 'src/app/models/tournament/tournament-creation-request';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { UserTournamentRequest } from '../../../models/user/user-tournament-request';
import { UserTournamentService } from 'src/app/services/user-tournament.service';

@Component({
	selector: 'app-tournament-creation-config-page',
	templateUrl: './tournament-creation-config-page.component.html',
	styleUrls: ['./tournament-creation-config-page.component.scss']
})

export class TournamentCreationConfigPageComponent implements OnInit {

	tournamentTeamSize: TournamentTeamSize;
	tournamentFormat: TournamentFormat;
	tournamentFormatString: string;
	tournamentMatchesNumber: string;
	userTournamentRequest: UserTournamentRequest;

	tournamentGameMode: TournamentMode;

	@ViewChild('leagueFormatElement')
	leagueFormatElement: ElementRef;

	@ViewChild('pvpFormatElement')
	pvpFormatElement: ElementRef;

	@ViewChild('bestOfOneElement')
	bestOfOneElement: ElementRef;

	@ViewChild('bestOfThreeElement')
	bestOfThreeElement: ElementRef;

	@ViewChild('bestOfFiveElement')
	bestOfFiveElement: ElementRef;

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
	tournament: Tournament;
	tournamentCreation: TournamentCreationRequest;
	isFifaTournament: boolean = false;

	constructor(private route: ActivatedRoute,
				private renderer: Renderer2,
				private router: Router,
				private tokenService: TokenStorageService,
				private sharedService: SharedService,
				private tournamentService: TournamentService,
				private userTournamentService: UserTournamentService){
		
		this.leagueFormatElement = this.sharedService.get();
		this.pvpFormatElement = this.sharedService.get();
		this.killRaceModeElement = this.sharedService.get();
		this.survivalModeElement = this.sharedService.get();
		this.solosTeamSizeElement = this.sharedService.get();
		this.duosTeamSizeElement = this.sharedService.get();
		this.triosTeamSizeElement = this.sharedService.get();
		this.squadsTeamSizeElement = this.sharedService.get();
		this.tournament = new Tournament();
		this.tournamentCreation = new TournamentCreationRequest();
		this.userTournamentRequest = new UserTournamentRequest();
	}

	ngOnInit(): void {
		this.route.queryParams
			.subscribe(params => {
				this.tournament = JSON.parse(params['tournament']);
			});
		if(this.tournament.tournamentGame === 'Fifa'){
			this.isFifaTournament = true;
			// TODO:
		}
		
	}

	clickedButton(): void {
		this.isClicked = true;
	}

	public onSubmit() {
		this.tournament.tournamentFormat = TournamentFormat[this.tournamentFormat];
		this.tournament.tournamentMatchesNumber = this.tournamentMatchesNumber;
		this.tournament.tournamentGameMode = TournamentMode[this.tournamentGameMode];
		this.tournament.tournamentTeamSize = TournamentTeamSize[this.tournamentTeamSize];
		this.tournamentCreation.tournamentDateInMilliseconds = this.tournament.tournamentDateInMilliseconds;
		this.tournamentCreation.tournamentToBeCreated = this.tournament;
		this.tournamentCreation.tournamentUserModerator = this.tournament.tournamentModerator;
		this.userTournamentRequest.user = this.tournament.tournamentModerator;
		this.userTournamentRequest.tournament = this.tournament;
		this.tournamentService.postTournament(this.tournamentCreation, this.tokenService.getToken())
			.subscribe((data: Tournament) => {
				this.message = 'Tournament created Successfully';
				this.tournament = data;
				console.log(data);
				this.isSuccessfulTournamentCreation = true;
			},
				(err: any) => {
					console.error(err);
					this.isSuccessfulTournamentCreation = false;
					this.isSignUpFailed = true;
				},
				() => {
					if(this.isSuccessfulTournamentCreation){
						this.userTournamentRequest.tournament = this.tournament;
						this.userTournamentService.addTournamentToUserTournamentList(this.userTournamentRequest,
																					 this.tokenService.getToken())
						.subscribe((data: MessageResponse) => {
							console.log(data);
						},
						err => {
							console.error(err.error.message);
						});
					}
				});
	}

	public navigateToTournaments() {
		this.router.navigate(['/tournaments']);
	}

	selectLeagueTournamentFormat(): void {
		if (this.isRedBorder(this.pvpFormatElement)) {
			this.changeToWhiteBorder(this.pvpFormatElement);
		}
		else if (this.isRedBorder(this.leagueFormatElement)) {
			this.changeToWhiteBorder(this.leagueFormatElement);
			this.tournamentFormat = undefined;
			this.tournamentFormatString = '';
			return;
		}
		this.changeToRedBorder(this.leagueFormatElement);
		this.tournamentFormat = TournamentFormat.League;
		this.tournamentFormatString = TournamentFormat[this.tournamentFormat];
	}

	selectPvPTournamentFormat(): void {
		if (this.isRedBorder(this.leagueFormatElement)) {
			this.changeToWhiteBorder(this.leagueFormatElement);
		}
		else if (this.isRedBorder(this.pvpFormatElement)) {
			this.changeToWhiteBorder(this.pvpFormatElement);
			this.tournamentFormat = undefined;
			this.tournamentFormatString = '';
			return;
		}
		this.changeToRedBorder(this.pvpFormatElement);
		this.tournamentFormat = TournamentFormat.PvP;
		this.tournamentFormatString = TournamentFormat[this.tournamentFormat];
	}

	selectKillRaceTournamentGameMode(): void {
		if (this.isRedBorder(this.survivalModeElement)) {
			this.changeToWhiteBorder(this.survivalModeElement);
		}
		else if (this.isRedBorder(this.killRaceModeElement)) {
			this.changeToWhiteBorder(this.killRaceModeElement);
			this.tournamentGameMode = undefined;
			return;
		}
		this.changeToRedBorder(this.killRaceModeElement);
		this.tournamentGameMode = TournamentMode.KillRace;
	}

	selectSurvivalTournamentGameMode() {
		if (this.isRedBorder(this.killRaceModeElement)) {
			this.changeToWhiteBorder(this.killRaceModeElement);
		}
		else if (this.isRedBorder(this.survivalModeElement)) {
			this.changeToWhiteBorder(this.survivalModeElement);
			this.tournamentGameMode = undefined;
			return;
		}
		this.changeToRedBorder(this.survivalModeElement);
		this.tournamentGameMode = TournamentMode.Survival;
	}

	selectSolosTournamentTeamSize() {
		if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
		}
		else if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
			this.tournamentTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement);
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		this.changeToRedBorder(this.solosTeamSizeElement);
		this.tournamentTeamSize = TournamentTeamSize.Solos;
	}

	selectDuosTournamentTeamSize() {
		if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
		}
		else if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
			this.tournamentTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement)
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		this.changeToRedBorder(this.duosTeamSizeElement);
		this.tournamentTeamSize = TournamentTeamSize.Duos;
	}

	selectTriosTournamentTeamSize() {
		if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement);
			this.tournamentTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		else if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
		}
		this.changeToRedBorder(this.triosTeamSizeElement);
		this.tournamentTeamSize = TournamentTeamSize.Trios;
	}

	selectSquadTournamentTeamSize() {
		if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
		}
		else if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement);
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
			this.tournamentTeamSize = undefined;
			return;
		}
		this.changeToRedBorder(this.squadsTeamSizeElement);
		this.tournamentTeamSize = TournamentTeamSize.Quads;
	}

	selectBestOfOneTournamentMatchesNumber() {
		if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
			this.tournamentMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
		}
		this.changeToRedBorder(this.bestOfOneElement);
		this.tournamentMatchesNumber = 'Best of 1';
	}

	selectBestOfThreeTournamentMatchesNumber() {
		if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
			this.tournamentMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
		}
		else if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
		}
		this.changeToRedBorder(this.bestOfThreeElement);
		this.tournamentMatchesNumber = 'Best of 3';
	}

	selectBestOfFiveTournamentMatchesNumber() {
		if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
			this.tournamentMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
		}
		this.changeToRedBorder(this.bestOfFiveElement);
		this.tournamentMatchesNumber = 'Best of 5';
	}

	private isRedBorder(elementToEvaluate: ElementRef): boolean {
		if (elementToEvaluate.nativeElement.style.border === '3px solid red') {
			return true;
		}
		return false;
	}

	private changeToRedBorder(elementToChange: ElementRef): void {
		this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid red');
	}

	private changeToWhiteBorder(elementToChange: ElementRef): void {
		this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid white');
	}
}
