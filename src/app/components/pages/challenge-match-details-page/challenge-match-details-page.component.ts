import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  userInspectingMatch: User;
  match: Match;

  challengeId: string;
  
  userTeamInChallenge: Team;
  userTeamPointsScored: FormControl;
  oppositeTeamPointsScored: FormControl;
  
  isWinningUserTeam: boolean = false;
  
  isTeamAdmin: boolean = false;

  isSubmittingResults: boolean = false;
  isClickedUploadButton: boolean = false;
  isClickedSentButton: boolean = false;
  isSuccessfulUpload: boolean = false;
  isFailedUpload: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
              private tokenService: TokenStorageService,
              private teamChallengeService: TeamChallengeService,
              private renderer: Renderer2,
              private sharedService: SharedService) {
    this.match = new Match();
    this.userTeamPointsScored = new FormControl();
    this.oppositeTeamPointsScored = new FormControl();
    this.wonButton = this.sharedService.get();
    this.lostButton = this.sharedService.get();
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
      this.hasTeamAdminRole(challengeId);
    });
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
          return;
        }
      }
    }
    let role: Role = this.userInspectingMatch.userRoles.filter(userRole => userRole.authority === 'ADMIN')
                                                        .find(userRole => userRole.authority === 'ADMIN');
    if(role){
      this.isTeamAdmin = true;
      return;
    }
    this.isTeamAdmin = false;
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
    });
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

  public isTryingToSubmitResults(){
    this.isClickedUploadButton = true;
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

}
