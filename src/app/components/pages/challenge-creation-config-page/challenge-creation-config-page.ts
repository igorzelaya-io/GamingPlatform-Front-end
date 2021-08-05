import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Team } from '../../../models/team';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { SharedService } from '../../../services/helpers/shared-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { UserTournamentRequest } from '../../../models/user/user-tournament-request';
import { UserTournamentService } from '../../../services/user-tournament.service';
import { TournamentCreationRequest } from '../../../models/tournament/tournament-creation-request';
import { TokenStorageService } from '../../../services/token-storage.service';
import { MessageResponse } from '../../../models/messageresponse';
import { ChallengeServiceService } from '../../../services/challenges/challenge-service.service';
import { Challenge } from 'src/app/models/challenge/challenge';
import { UserService } from 'src/app/services/user.service';
import { UserTeamService } from 'src/app/services/user-team.service';
import { UserChallengesService } from 'src/app/services/userchallenges.service';
import { UserChallengeRequest } from 'src/app/models/userchallengerequest';

@Component({
	selector: 'app-challenge-creation-config-page',
	templateUrl: './challenge-creation-config-page.component.html',
	styleUrls: ['./challenge-creation-config-page.component.scss']
})

export class ChallengeCreationConfigPageComponent implements OnInit {

	challengeTeamSize: TournamentTeamSize;
	
	challengeMatchesNumber: string;

	userChallengeRequest: UserChallengeRequest;

	challengeGameMode: TournamentMode;

	userModeratorTeams: Team[];
	isEmptyTeams: boolean = false;
	selectedTeamToJoinChallenge: Team;
	isClickedSelectButton: boolean = false;

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

	isSuccessfulChallengeCreation = false;
	isSignUpFailed = false;
	isClicked = false;
	challenge: Challenge;
	tournamentCreation: TournamentCreationRequest;
	isFifaChallenge: boolean = false;
	isCdlChallenge: boolean = false;
	isWarzoneChallenge: boolean = false;
	constructor(private route: ActivatedRoute,
				private renderer: Renderer2,
				private router: Router,
				private tokenService: TokenStorageService,
				private sharedService: SharedService,
				private tournamentService: TournamentService,
				private userChallengeService: UserChallengesService,
				private challengeService: ChallengeServiceService,
				private userService: UserTeamService){
		
		this.leagueFormatElement = this.sharedService.get();
		this.pvpFormatElement = this.sharedService.get();
		this.killRaceModeElement = this.sharedService.get();
		this.survivalModeElement = this.sharedService.get();
		this.solosTeamSizeElement = this.sharedService.get();
		this.duosTeamSizeElement = this.sharedService.get();
		this.triosTeamSizeElement = this.sharedService.get();
		this.squadsTeamSizeElement = this.sharedService.get();
		this.challenge = new Challenge();
		this.userModeratorTeams = [];
		this.tournamentCreation = new TournamentCreationRequest();
		this.userChallengeRequest = new UserChallengeRequest();
	}

	ngOnInit(): void {
		this.route.queryParams
			.subscribe(params => {
				this.challenge = JSON.parse(params['challenge']);
			});
		if(this.challenge.challengeGame === 'Fifa'){
			this.isFifaChallenge = true;
			// TODO FIFA LOGOS:
		}
		else if(this.challenge.challengeGame === 'CDL'){
			this.isCdlChallenge = true;
		}
		else{
			this.isWarzoneChallenge = true;
		}
		this.getAllUserTeams();

	}

	getAllUserTeams(){
		this.userService.getAllUserTeams(this.challenge.challengeModerator.userId)
		.subscribe((data: Team[]) => {
			if(data && data.length){
				this.userModeratorTeams = data;
				this.isEmptyTeams = false; 
				return;
			}		
			this.isEmptyTeams = true;
		},
		err => {
			console.error(err);
			this.isEmptyTeams = true;
		});
	}

	clickedButton(): void {
		this.isClicked = true;
	}

	public onSubmit() {
		this.isClicked = true;
		if(this.selectedTeamToJoinChallenge){
			if(this.selectedTeamToJoinChallenge.teamModerator.userId !== this.challenge.challengeModerator.userId){
				this.isSignUpFailed = true;
				this.errorMessage = 'Only Team creator is allowed to join a challenge with this team.';
				this.isClicked = false;
			}
			this.challenge.challengeMatchesNumber = this.challengeMatchesNumber.valueOf();
			this.challenge.challengeGameMode = TournamentMode[this.challengeGameMode].valueOf();
			this.challenge.challengeNumberOfPlayersPerTeam = TournamentTeamSize[this.challengeTeamSize].valueOf();
			this.challenge.challengeHostTeam = this.selectedTeamToJoinChallenge;
			this.challengeService.postChallenge(this.challenge, this.tokenService.getToken())
			.subscribe((data: Challenge) => {
				if(data){
					console.log(data);
					this.message = 'Tournament created Successfully.'
					this.challenge = data;
					this.isSuccessfulChallengeCreation = true;
					this.isSignUpFailed = false;
					this.isClicked = true;
					return;
				}
				this.isClicked = false;
				this.isSignUpFailed = true;
				this.errorMessage = 'Not enough tokens to create challenge';
				this.isSuccessfulChallengeCreation = false;
			},
			err => {
				console.error(err);
				this.isSignUpFailed = true;
				this.isClicked = false;
				this.isSuccessfulChallengeCreation = false;
				this.errorMessage = err.error.message;
			}, () => {
				if(this.isSuccessfulChallengeCreation && !this.isSignUpFailed){
					this.userChallengeRequest.challenge = this.challenge;
					this.userChallengeRequest.user = this.challenge.challengeModerator;
					this.userChallengeRequest.team = this.selectedTeamToJoinChallenge;
					this.userChallengeService.addChallengeToTeamCodChallengeList(this.userChallengeRequest, this.tokenService.getToken())
					.subscribe((data: MessageResponse) => {
						console.log(data);
					}, err => console.error(err.error.message));
				}
			});
		}
	}

	public navigateToTournaments() {
		this.router.navigate(['/challenges']);
	}

	selectKillRaceChallengeGameMode(): void {
		if (this.isRedBorder(this.survivalModeElement)) {
			this.changeToWhiteBorder(this.survivalModeElement);
		}
		else if (this.isRedBorder(this.killRaceModeElement)) {
			this.changeToWhiteBorder(this.killRaceModeElement);
			this.challengeGameMode = undefined;
			return;
		}
		this.changeToRedBorder(this.killRaceModeElement);
		this.challengeGameMode = TournamentMode.KillRace;
	}

	selectSurvivalChallengeGameMode() {
		if (this.isRedBorder(this.killRaceModeElement)) {
			this.changeToWhiteBorder(this.killRaceModeElement);
		}
		else if (this.isRedBorder(this.survivalModeElement)) {
			this.changeToWhiteBorder(this.survivalModeElement);
			this.challengeGameMode = undefined;
			return;
		}
		this.changeToRedBorder(this.survivalModeElement);
		this.challengeGameMode = TournamentMode.Survival;
	}

	//TODO: SELECT HARDPOINT, SELECT SND, SELECT VARIANT for CDL

	selectSolosChallengeTeamSize() {
		if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
		}
		else if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
			this.challengeTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement);
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		this.changeToRedBorder(this.solosTeamSizeElement);
		this.challengeTeamSize = TournamentTeamSize.Solos;
	}

	selectDuosChallengeTeamSize() {
		if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
		}
		else if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
			this.challengeTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement)
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		this.changeToRedBorder(this.duosTeamSizeElement);
		this.challengeTeamSize = TournamentTeamSize.Duos;
	}

	selectTriosChallengeTeamSize() {
		if (this.isRedBorder(this.solosTeamSizeElement)) {
			this.changeToWhiteBorder(this.solosTeamSizeElement);
		}
		else if (this.isRedBorder(this.triosTeamSizeElement)) {
			this.changeToWhiteBorder(this.triosTeamSizeElement);
			this.challengeTeamSize = undefined;
			return;
		}
		else if (this.isRedBorder(this.squadsTeamSizeElement)) {
			this.changeToWhiteBorder(this.squadsTeamSizeElement);
		}
		else if (this.isRedBorder(this.duosTeamSizeElement)) {
			this.changeToWhiteBorder(this.duosTeamSizeElement);
		}
		this.changeToRedBorder(this.triosTeamSizeElement);
		this.challengeTeamSize = TournamentTeamSize.Trios;
	}

	selectSquadChallengeTeamSize() {
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
			this.challengeTeamSize = undefined;
			return;
		}
		this.changeToRedBorder(this.squadsTeamSizeElement);
		this.challengeTeamSize = TournamentTeamSize.Quads;
	}

	selectBestOfOneChallengeMatchesNumber() {
		if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
			this.challengeMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
		}
		this.changeToRedBorder(this.bestOfOneElement);
		this.challengeMatchesNumber = 'Best of 1';
	}

	selectBestOfThreeChallengeMatchesNumber() {
		if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
			this.challengeMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
		}
		else if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
		}
		this.changeToRedBorder(this.bestOfThreeElement);
		this.challengeMatchesNumber = 'Best of 3';
	}

	selectBestOfFiveChallengeMatchesNumber() {
		if (this.isRedBorder(this.bestOfThreeElement)) {
			this.changeToWhiteBorder(this.bestOfThreeElement);
		}
		else if (this.isRedBorder(this.bestOfFiveElement)) {
			this.changeToWhiteBorder(this.bestOfFiveElement);
			this.challengeMatchesNumber = undefined;
			return;
		}
		else if (this.isRedBorder(this.bestOfOneElement)) {
			this.changeToWhiteBorder(this.bestOfOneElement);
		}
		this.changeToRedBorder(this.bestOfFiveElement);
		this.challengeMatchesNumber = 'Best of 5';
	}

	clickSelectButton(){
		this.isClickedSelectButton = true;
	}

	selectTeamToJoinTournament(team: Team){
		this.selectedTeamToJoinChallenge = team;
	}

	deselectTeamToJoinTournament(){
		this.selectedTeamToJoinChallenge = undefined;
		this.isClickedSelectButton = false;
	}

	public goBack(){
		this.router.navigate(['/challenge-creation']);
	}

	public navigateToTeams(){
   		this.router.navigate(['/team-creation']);
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
