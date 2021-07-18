import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  userInspectingMatch: User;
  match: Match;
  tournamentId: string;
  userTeamInTournament: Team;
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
              private teamTournamentService: TeamTournamentService,
              private tournamentService: TournamentService,
              private renderer: Renderer2,
              private sharedService: SharedService) {
    this.match = new Match();
    this.userTeamPointsScored = new FormControl();
    this.oppositeTeamPointsScored = new FormControl();
    this.wonButton = sharedService.get();
    this.lostButton = sharedService.get();
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
      this.hasTeamAdminRole(tournamentId);
    });
  }
  
  hasTeamAdminRole(tournamentId: string){
    const userTournaments: UserTournament[] = this.userInspectingMatch.userTournaments
        .filter(userTournament => userTournament.userTournament.tournamentId === tournamentId);
    if(userTournaments.length !== 0){
      const userTeamInTournament: Team = userTournaments[0].userTournamentTeam;
      this.userTeamInTournament = userTeamInTournament;
      if(userTeamInTournament.teamId === this.match.matchLocalTeam.teamId || userTeamInTournament.teamId === this.match.matchAwayTeam.teamId){
        const userTeamModerator = userTeamInTournament.teamModerator; 
        if(this.userInspectingMatch.userId === userTeamModerator.userId){
          this.isTeamAdmin = true;
          return;
        }
      }
    }
    this.isTeamAdmin = false;
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
    });
  }

  uploadCodMatchResults(matchTournamentRequest: MatchTournamentRequest){
    this.teamTournamentService.uploadCodMatchResult(matchTournamentRequest, this.tokenService.getToken())
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
