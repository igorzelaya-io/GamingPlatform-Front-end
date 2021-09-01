import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user/user';
import { Match } from 'src/app/models/match';
import { TeamTournamentService } from 'src/app/services/team/team-tournament.service';
import { UserTournament } from 'src/app/models/user/user-tournament';
import { Team } from 'src/app/models/team';
import { FormControl } from '@angular/forms';
import { MatchTournamentRequest } from 'src/app/models/matchtournamentrequest';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { Renderer2 } from '@angular/core';
import { SharedService } from 'src/app/services/helpers/shared-service';
import { ImageModel } from '../../../models/imagemodel';
import { TeamService } from 'src/app/services/team/team-service.service';
import { DisputedMatchService } from 'src/app/services/disputedMatch/disputed-match.service';
import { DisputedMatch } from 'src/app/models/disputedmatch';
import { Role } from 'src/app/models/role';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-match-details-page',
  templateUrl: './match-details-page.component.html',
  styleUrls: ['./match-details-page.component.scss']
})
export class MatchDetailsPageComponent implements OnInit {

  @ViewChild('wonButton')
  wonButton: ElementRef;

  @ViewChild('lostButton')
  lostButton: ElementRef;

  @ViewChild('wonLocalButton')
  wonLocalButton: ElementRef;

  @ViewChild('wonAwayButton')
  wonAwayButton: ElementRef;

  userInspectingMatch: User;
  match: Match;
  tournamentId: string;
  userTeamInTournament: Team;
  userTeamPointsScored: FormControl;
  oppositeTeamPointsScored: FormControl;

  localTeamPointsScored: FormControl;
  awayTeamPointsScored: FormControl;

  localTeamImage: ImageModel;

  awayTeamImage: ImageModel;

  isWinningUserTeam: boolean = false;

  isWinningLocalTeam = false;
  
  isTeamAdmin: boolean = false;

  isAdminAdmin: boolean = false;

  isTeamSubmitted: boolean = false;

  isSubmittingResults: boolean = false;
  isClickedUploadButton: boolean = false;

  isClickedUploadDisputedButton = false;
  isClickedSentButton: boolean = false;
  isSuccessfulUpload: boolean = false;
  isFailedUpload: boolean = false;
  errorMessage: string = '';

  isUploadedImage = false;

  selectedImageFile: any;
  croppedImageFile: any;

  successfullyDisputed = false;
  disputeErrorMessage: string = '';
  isClickedUploadImageButton = false;
  
  disputedMatchImageSource: string;

  constructor(private route: ActivatedRoute,
              private tokenService: TokenStorageService,
              private teamTournamentService: TeamTournamentService,
              private tournamentService: TournamentService,
              private teamService: TeamService,
              private disputedMatchService: DisputedMatchService,
              private renderer: Renderer2,
              private sharedService: SharedService,
              private router: Router) {
    this.match = new Match();
    this.userTeamPointsScored = new FormControl();
    this.oppositeTeamPointsScored = new FormControl();
    this.wonButton = this.sharedService.get();
    this.lostButton = this.sharedService.get();
    this.wonLocalButton = this.sharedService.get();
    this.wonAwayButton = this.sharedService.get();
    this.localTeamPointsScored = new FormControl();
    this.awayTeamPointsScored = new FormControl();
  }

  ngOnInit(): void {
    this.userInspectingMatch = this.tokenService.getUser();
    this.route.queryParams.subscribe(params => {
      this.getMatchFromTournament(params['matchId'], params['tournamentId']);
      this.tournamentId = params['tournamentId'];
    });
  }
  
  
  public getMatchFromTournament(matchId:string, tournamentId: string){
    this.teamTournamentService.getTeamMatchFromTournament(matchId, tournamentId)
    .subscribe((data: Match) => {
      if(data){
        console.log(data); 
        this.match = data;
      }
    }, err => {
      console.error(err);
    }, 
    () => {
      this.evaluateTeamImages();
      this.hasTeamAdminRole(tournamentId);
      this.evaluateMatchUploadedStatus(this.match);
      if(this.match.hasImage){
        this.getDisputedMatchImage();
      }
    });
  }

  async evaluateTeamImages(){
    if(this.match.matchLocalTeam.hasImage){
      this.localTeamImage = await this.teamService.getTeamImage(this.match.matchLocalTeam.teamId).toPromise();
    }
    if(this.match.matchAwayTeam.hasImage){
      this.awayTeamImage = await this.teamService.getTeamImage(this.match.matchAwayTeam.teamId).toPromise();
    }
  }

  async getDisputedMatchImage(){
    this.disputedMatchImageSource = (await this.disputedMatchService.getDisputedMatchFromTournament(this.tournamentId, this.match.matchId).toPromise()).disputedMatchImageBytes;
  }
  
  hasTeamAdminRole(tournamentId: string){
    const userTournaments: UserTournament[] = this.userInspectingMatch.userTournaments
        .filter(userTournament => userTournament.userTournamentId === tournamentId);
    if(userTournaments.length !== 0){
      const userTeamInTournament: Team = userTournaments[0].userTournamentTeam;
      this.userTeamInTournament = userTeamInTournament;
      if(userTeamInTournament.teamId === this.match.matchLocalTeam.teamId || userTeamInTournament.teamId === this.match.matchAwayTeam.teamId){
        const userTeamModerator = userTeamInTournament.teamModerator; 
        if(this.userInspectingMatch.userId === userTeamModerator.userId){
          this.isTeamAdmin = true;
        }
      }
    }
    let role: Role = this.userInspectingMatch.userRoles
                        .filter(userRole => userRole.authority === 'ADMIN')
                        .find(userRole => userRole.authority === 'ADMIN');
    if(role){
      this.isTeamAdmin = true;
      this.isAdminAdmin = true;
    }
    if(this.isTeamAdmin){
      return;
    }
    this.isTeamAdmin = false;
    this.isAdminAdmin = false;
  }

  evaluateMatchUploadedStatus(match: Match): void{
    let isLocalTeam: boolean = match.matchLocalTeam.teamId === this.userTeamInTournament.teamId ? true : false;
    if(isLocalTeam){
      if(match.localTeamUploaded){
        this.isTeamSubmitted = true;
      }
    }
    else{
      if(match.awayTeamUploaded){
        this.isTeamSubmitted = true;
      }
    }
  }

  uploadResults(): void{
    this.isClickedSentButton = true;
    if(this.isWinningUserTeam === true){
      this.match.matchWinningTeam = this.userTeamInTournament;
    }
    else {
      this.match.matchWinningTeam = this.match.matchLocalTeam.teamId === this.userTeamInTournament.teamId ? this.match.matchAwayTeam : this.match.matchLocalTeam
    }
    if(this.match.matchLocalTeam.teamId === this.userTeamInTournament.teamId){
      this.match.localTeamMatchScore = this.userTeamPointsScored.value;
      this.match.awayTeamMatchScore = this.oppositeTeamPointsScored.value;
    }
    else{
      this.match.awayTeamMatchScore = this.userTeamPointsScored.value;
      this.match.localTeamMatchScore = this.oppositeTeamPointsScored.value;
    }
    const matchTournamentRequest: MatchTournamentRequest = new MatchTournamentRequest();
    matchTournamentRequest.matchTournamentMatch = this.match;
    matchTournamentRequest.matchTournamentTeam = this.userTeamInTournament;
    matchTournamentRequest.matchTournamentTournamentId = this.tournamentId;
    if(this.match.matchTournament.tournamentGame === 'Fifa'){
      this.uploadFifaMatchResults(matchTournamentRequest);
      return;
    }
    this.uploadCodMatchResults(matchTournamentRequest);
  }

  uploadDisputedResults(): void{
    this.isClickedSentButton = true;
    if(this.isWinningLocalTeam){
      this.match.matchWinningTeam = this.match.matchLocalTeam;
    }
    else{
      this.match.matchWinningTeam = this.match.matchAwayTeam;
    }
    this.match.localTeamMatchScore = this.localTeamPointsScored.value;
    this.match.awayTeamMatchScore = this.awayTeamPointsScored.value;
    const matchTournamentRequest: MatchTournamentRequest = new MatchTournamentRequest();
    matchTournamentRequest.matchTournamentMatch = this.match;
    matchTournamentRequest.matchTournamentTeam = this.userTeamInTournament;
    matchTournamentRequest.matchTournamentTournamentId = this.tournamentId;
    if(this.match.matchTournament.tournamentGame === 'Fifa'){
      this.uploadFifaMatchResults(matchTournamentRequest);
      return;
    }
    this.uploadCodMatchResults(matchTournamentRequest);
  }

  uploadFifaMatchResults(matchTournamentRequest: MatchTournamentRequest){
    this.teamTournamentService.uploadFifaMatchResult(matchTournamentRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      if(data){
        this.isSuccessfulUpload = true;
        this.errorMessage = data.message;
      }
    }, err => {
      this.isSuccessfulUpload = false;
      this.isFailedUpload = true;
      console.error(err.error.message);
      this.errorMessage = err.error.message;
      this.isClickedSentButton = false; 
    }, 
    () => {
      window.location.reload();
      this.addResultsToUser(matchTournamentRequest.matchTournamentMatch);
    });
  }

  uploadCodMatchResults(matchTournamentRequest: MatchTournamentRequest){
    this.teamTournamentService.uploadCodMatchResult(matchTournamentRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      if(data){
        this.isSuccessfulUpload = true;
        this.errorMessage = data.message;
      }
    }, 
    err => {
      this.isSuccessfulUpload = false;
      this.isFailedUpload = true;
      console.error(err.error.message);
      this.errorMessage = err.error.message;
      this.isClickedSentButton = false;
    }, 
    () => {
      window.location.reload();
      this.addResultsToUser(matchTournamentRequest.matchTournamentMatch);
    });
  }

  addResultsToUser(match: Match){
    if(match.matchGame === 'Fifa'){
      if(match.matchWinningTeam.teamId === this.userTeamInTournament.teamId){
        this.userInspectingMatch.userFifaTotalWs++;
        this.tokenService.saveUser(this.userInspectingMatch);
        return;
      }
      this.userInspectingMatch.userFifaTotalLs++;
      this.tokenService.saveUser(this.userInspectingMatch);
      return;
    }  
    else{
      if(match.matchWinningTeam.teamId === this.userTeamInTournament.teamId){
        this.userInspectingMatch.userCodTotalWs++;
        this.tokenService.saveUser(this.userInspectingMatch);
        return;
      }
      this.userInspectingMatch.userCodTotalLs++;
      this.tokenService.saveUser(this.userInspectingMatch);
      return;
    }

  }

  selectLostMatchOption(): void{
    if(this.isWhiteBorder(this.lostButton)){
      this.changeToBlackBorder(this.lostButton);
      return; 
    }
    else if(this.isWhiteBorder(this.wonButton)){
      this.changeToBlackBorder(this.wonButton);
      this.changeToWhiteBorder(this.lostButton);
      this.isWinningUserTeam = false;
      return;
    }
    this.changeToWhiteBorder(this.lostButton);
    this.isWinningUserTeam = false;
  }

  selectWonMatchOption(): void{
    if(this.isWhiteBorder(this.wonButton)){
      this.changeToBlackBorder(this.wonButton);
      this.isWinningUserTeam = false;
      return;
    }
    else if(this.isWhiteBorder(this.lostButton)){
      this.changeToBlackBorder(this.lostButton);
      this.changeToWhiteBorder(this.wonButton);
      this.isWinningUserTeam = true;
      return;
    }
    this.changeToWhiteBorder(this.wonButton);
    this.isWinningUserTeam = true;
  }

  selectLocalWonButton(): void{
    if(this.isWhiteBorder(this.wonLocalButton)){
      this.changeToBlackBorder(this.wonLocalButton);
      this.isWinningLocalTeam = false;
      return;
    }
    else if(this.isWhiteBorder(this.wonAwayButton)){
      this.changeToBlackBorder(this.wonAwayButton);
      this.changeToWhiteBorder(this.wonLocalButton);
      this.isWinningLocalTeam = true;
      return;
    }
    this.changeToWhiteBorder(this.wonLocalButton);
    this.isWinningLocalTeam = true;
  }

  selectAwayWonButton(): void{
    if(this.isWhiteBorder(this.wonAwayButton)){
      this.changeToBlackBorder(this.wonAwayButton);
      this.isWinningLocalTeam = true;
      return;
    }
    else if(this.isWhiteBorder(this.wonLocalButton)){
      this.changeToBlackBorder(this.wonLocalButton);
      this.changeToWhiteBorder(this.wonAwayButton);
      this.isWinningLocalTeam = false;
      return;
    }
    this.changeToWhiteBorder(this.wonAwayButton);
    this.isWinningLocalTeam = false;
  }

  public isTryingToSubmitResults(){
    this.isClickedUploadButton = true;
  }

  public isTryingToSubmitDisputedResults(){
    this.isClickedUploadDisputedButton = true;
  }

  private isWhiteBorder(elementToEvaluate: ElementRef){
    if(elementToEvaluate.nativeElement.style.border === '3px solid white'){
      return true;
    }
    return false;
  }

  private changeToBlackBorder(elementToChange: ElementRef): void{
    this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid black');
  }

  private changeToWhiteBorder(elementToChange: ElementRef){
    this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid white');
  }

  public goBack(){
    this.router.navigate(['/tournament-details'], { queryParams: { tournamentId: this.tournamentId}});
  }

  onFileChange(event: any){
    this.selectedImageFile = event;
  }

  cropImage(e: ImageCroppedEvent){
    this.croppedImageFile = e.base64;
  }

  unselectImage(){
    this.selectedImageFile = '';
    this.croppedImageFile = '';
  }

  postDisputedMatch(){
    if(this.selectedImageFile && this.croppedImageFile){
     let disputedMatch: DisputedMatch = new DisputedMatch(); 
      disputedMatch.disputedMatchTournamentId = this.tournamentId;
      disputedMatch.disputedMatchMatchId = this.match.matchId;
      disputedMatch.disputedMatchImageBytes = this.croppedImageFile;
      disputedMatch.disputedMatchStatus = 'DISPUTED';
      this.disputedMatchService.postDisputedMatch(disputedMatch)
      .subscribe((data: MessageResponse) => {
        this.successfullyDisputed = true;
        this.isClickedUploadImageButton = true;
      }, 
      err => {
        console.error(err);
        this.successfullyDisputed = false;
        this.disputeErrorMessage = err;
      });
      return;
    }
    this.successfullyDisputed = false;
    this.isClickedUploadImageButton =  false;
    this.disputeErrorMessage = 'Image must be selected.';
  }
}
