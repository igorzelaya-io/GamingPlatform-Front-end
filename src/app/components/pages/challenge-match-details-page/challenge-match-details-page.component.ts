import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user/user';
import { Match } from 'src/app/models/match';
import { Team } from 'src/app/models/team';
import { FormControl } from '@angular/forms';
import { MessageResponse } from 'src/app/models/messageresponse';
import { Renderer2 } from '@angular/core';
import { SharedService } from 'src/app/services/helpers/shared-service';
import { UserChallenge } from 'src/app/models/user/userchallenge';
import { TeamChallengeService } from 'src/app/services/team/team-challenge.service';
import { MatchChallengeRequest } from 'src/app/models/matchchallengerequest';
import { Role } from 'src/app/models/role';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DisputedMatchService } from '../../../services/disputedMatch/disputed-match.service';
import { DisputedMatch } from 'src/app/models/disputedmatch';
import { TeamService } from 'src/app/services/team/team-service.service';
import { ImageModel } from 'src/app/models/imagemodel';

@Component({
  selector: 'app-challenge-match-details-page',
  templateUrl: './challenge-match-details-page.component.html',
  styleUrls: ['./challenge-match-details-page.component.scss']
})
export class ChallengeMatchDetailsPageComponent implements OnInit {

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

  challengeId: string;
  
  userTeamInChallenge: Team;

  localTeamPointsScored: FormControl;
  awayTeamPointsScored: FormControl;

  userTeamPointsScored: FormControl;
  oppositeTeamPointsScored: FormControl;

  localTeamImage: ImageModel;

  awayTeamImage: ImageModel;
  
  isWinningUserTeam: boolean = false;

  isWinningLocalTeam: boolean = false;
  
  isTeamAdmin: boolean = false;

  isAdminAdmin: boolean = false;

  isTeamSubmitted: boolean = false;

  isSubmittingResults: boolean = false;
  isClickedUploadButton: boolean = false;
  
  isClickedUploadDisputedButton: boolean = false;

  isClickedSentButton: boolean = false;
  isSuccessfulUpload: boolean = false;
  isFailedUpload: boolean = false;
  errorMessage: string = '';

  isUploadedImage: boolean = false; 

  selectedImageFile: any;
  croppedImageFilePreview: any;

  successfullyDisputed: boolean = false;
  disputeErrorMessage: string = '';
  isClickedUploadImageButton: boolean = false;

  disputedMatchImageSource: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tokenService: TokenStorageService,
              private teamChallengeService: TeamChallengeService,
              private renderer: Renderer2,
              private sharedService: SharedService,
              private disputedMatchService: DisputedMatchService,
              private teamService: TeamService) {
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
      this.getMatchFromChallenge(params['matchId'], params['challengeId']);
      this.challengeId = params['challengeId'];
    });
  }
  
  public getMatchFromChallenge(matchId: string, challengeId: string){
    this.teamChallengeService.getTeamMatchFromChallenge(matchId, challengeId)
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
      this.hasTeamAdminRole(challengeId);
      this.evaluateMatchUploadedStatus(this.match);
      if(this.match.hasImage){
        this.getDisputedMatchImage();
      }
    });
  }

  async evaluateTeamImages(){
    if(this.match.matchLocalTeam.hasImage){
      this.localTeamImage = await this.getTeamImage(this.match.matchLocalTeam.teamId); 
    }
    if(this.match.matchAwayTeam.hasImage){
      this.awayTeamImage = await this.getTeamImage(this.match.matchAwayTeam.teamId);
    }
  }
  
  hasTeamAdminRole(challengeId: string){
    const userChallenges: UserChallenge[] = this.userInspectingMatch.userChallenges
        .filter(userChallenge => userChallenge.userChallengeId === challengeId);
    if(userChallenges.length !== 0){
      const userTeamInChallenge: Team = userChallenges[0].userChallengeTeam;
      this.userTeamInChallenge = userTeamInChallenge;
      if(userTeamInChallenge.teamId === this.match.matchLocalTeam.teamId || userTeamInChallenge.teamId === this.match.matchAwayTeam.teamId){
        const userTeamModerator = userTeamInChallenge.teamModerator; 
        if(this.userInspectingMatch.userId === userTeamModerator.userId){
          this.isTeamAdmin = true;
        }
      }
    }
    let role: Role = this.userInspectingMatch.userRoles.filter(userRole => userRole.authority === 'ADMIN')
                                                       .find(userRole => userRole.authority === 'ADMIN');
    if(role){
      this.isTeamAdmin = true;
      this.isAdminAdmin = true;
      return;
    }
    if(this.isTeamAdmin){
      return;
    }
    this.isTeamAdmin = false;
    this.isAdminAdmin = false;
  }

  evaluateMatchUploadedStatus(match: Match): void{
    let isLocalTeam: boolean = match.matchLocalTeam.teamId === this.userTeamInChallenge.teamId ? true : false; 
    if(isLocalTeam){
      if(match.localTeamUploaded){
        this.isTeamSubmitted = true;
      }
    }
    else {
      if(match.awayTeamUploaded){
        this.isTeamSubmitted = true;
      }
    }
  }

  getDisputedMatchImage(): void{
    this.disputedMatchService.getDisputedMatchFromChallenge(this.challengeId, this.match.matchId)
    .subscribe((data: DisputedMatch) => {
      if(data){
        this.disputedMatchImageSource = data.disputedMatchImageBytes;
        return;
      }
    },err => console.error(err));
  }

  uploadResults(): void{
    this.isClickedSentButton = true;
    if(this.isWinningUserTeam === true){
      this.match.matchWinningTeam = this.userTeamInChallenge;
    }
    else {
      let isLocalTeam: boolean = this.userTeamInChallenge.teamId === this.match.matchLocalTeam.teamId ? true : false;
      this.match.matchWinningTeam = isLocalTeam ? this.match.matchAwayTeam : this.match.matchLocalTeam;
    }
    if(this.match.matchLocalTeam.teamId === this.userTeamInChallenge.teamId){
      this.match.localTeamMatchScore = this.userTeamPointsScored.value;
      this.match.awayTeamMatchScore = this.oppositeTeamPointsScored.value;
    }
    else{
      this.match.awayTeamMatchScore = this.userTeamPointsScored.value;
      this.match.localTeamMatchScore = this.oppositeTeamPointsScored.value;
    }
    const matchChallengeRequest: MatchChallengeRequest = new MatchChallengeRequest();
    matchChallengeRequest.matchChallengeMatch = this.match; 
    matchChallengeRequest.matchChallengeTeam = this.userTeamInChallenge;
    matchChallengeRequest.matchChallengeChallengeId = this.challengeId;
    this.uploadCodMatchResults(matchChallengeRequest);
  }

  uploadDisputedResults(){
    this.isClickedSentButton = true;
    if(this.isWinningLocalTeam){
      this.match.matchWinningTeam = this.match.matchLocalTeam;
    }
    else{
      this.match.matchWinningTeam = this.match.matchAwayTeam;
    }
    this.match.localTeamMatchScore = this.localTeamPointsScored.value;
    this.match.awayTeamMatchScore = this.awayTeamPointsScored.value;
    const matchChallengeRequest: MatchChallengeRequest = new MatchChallengeRequest();
    matchChallengeRequest.matchChallengeChallengeId = this.challengeId;
    matchChallengeRequest.matchChallengeMatch = this.match;
    matchChallengeRequest.matchChallengeTeam = this.match.matchLocalTeam;
    this.uploadCodMatchResults(matchChallengeRequest); 
  }

  uploadCodMatchResults(matchChallengeRequest: MatchChallengeRequest){
    this.teamChallengeService.uploadCodMatchResult(matchChallengeRequest, this.tokenService.getToken())
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
      this.addResultsToUser(matchChallengeRequest.matchChallengeMatch);
    });
  }

  addResultsToUser(match: Match){
    if(match.matchGame === 'Fifa'){
      if(match.matchWinningTeam.teamId === this.userTeamInChallenge.teamId){
        this.userInspectingMatch.userFifaTotalWs++;
        this.tokenService.saveUser(this.userInspectingMatch);
        return;
      }
      this.userInspectingMatch.userFifaTotalLs++;
      this.tokenService.saveUser(this.userInspectingMatch);
      return;
    }  
    else{
      if(match.matchWinningTeam.teamId === this.userTeamInChallenge.teamId){
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

  goBack(){
    this.router.navigate(['/challenge-details'], { queryParams: {challengeId: this.match.matchChallengeId}});
  }

  getTeamImage(teamId: string): Promise<ImageModel>{
    return this.teamService.getTeamImage(teamId).toPromise();
  }

  onFileChange(event: any){
    this.selectedImageFile = event;
  }

  cropImage(e: ImageCroppedEvent){
    this.croppedImageFilePreview = e.base64;
  }

  unselectedImage(){
    this.selectedImageFile = '';
    this.croppedImageFilePreview = '';
  }

  postDisputedMatch(){
    if(this.selectedImageFile && this.croppedImageFilePreview){
     let disputedMatch: DisputedMatch = new DisputedMatch(); 
      disputedMatch.disputedMatchChallengeId = this.challengeId;
      disputedMatch.disputedMatchMatchId = this.match.matchId;
      disputedMatch.disputedMatchImageBytes = this.croppedImageFilePreview;
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
