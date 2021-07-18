import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Team } from '../../../models/team';
import { TeamTournamentRequest } from '../../../models/teamtournamentrequest';
import { TeamTournamentService } from '../../../services/team/team-tournament.service';
import { MatDialog } from '@angular/material/dialog';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';
import { FieldformNumericComponent } from '../../common/fieldform-numeric/fieldform-numeric.component';
import { FieldformDateComponent } from '../../common/fieldform-date/fieldform-date.component';
import { FieldformCountryComponent } from '../../common/fieldform-country/fieldform-country.component';
import { Match } from 'src/app/models/match';
import { ChallengeServiceService } from 'src/app/services/challenges/challenge-service.service';
import { UserService } from 'src/app/services/user.service';
import { UserTeamService } from 'src/app/services/user-team.service';
import { Challenge } from '../../../models/challenge/challenge';
import { Role } from '../../../models/role';
import { UserChallenge } from 'src/app/models/user/userchallenge';
import { MessageResponse } from 'src/app/models/messageresponse';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

export interface DialogData{
  replaceValueString: string,
  field: string,
  chargeFee?: string;
}

export interface DialogDataNumeric{
  replaceValueNumeric: number;
  field: string;
  format: string;
  min: number;
  value: number;
  step: number;
  chargeFee?: number;
}

export interface DialogDataDate{
  replaceValueDate: Date;
  alreadySelectedDate: Date;
  isValid: boolean;
}

export interface DialogDataCountry{
  replaceValueCountry: string;
}


@Component({
  selector: 'app-challenges-details-page',
  templateUrl: './challenges-details-page.component.html',
  styleUrls: ['./challenges-details-page.component.scss']
})


export class ChallengesDetailsPageComponent implements OnInit {


  challenge: Challenge;
  
  challengeYear: number;
  
  challengeMonth: string;
  
  challengeMonthDate: number;
  
  challengeTime: string;

  isTryingToJoinChallenge: boolean = false;

  isActivatedChallenge: boolean = false;

  userInspectingChallenge: User;

  selectedTeamToJoinTournamentWith: Team;

  userTeamsAvailableToJoinChallenge: Team[];

  userTeamEnrolledInTournament: Team;
  userTeamActiveMatches: Match[];
  tournamentMatches: Match[];
  tournamentInactiveMatches: Match[];

  hasNoTeams: boolean = false;  

  errorMessage: string = '';
  isFailedChallengeJoin = false;

  isUserAdmin: boolean = false;

  isClickedExitButton = false;
  isClickedJoinButton = false;
  isClickedSelectButton = false;

  alreadyJoinedChallenge = false;
  
  isStartedChallenge = false;


  constructor(private route: ActivatedRoute,
              private router: Router, 
              private tokenService: TokenStorageService,
              private userTeamService: UserTeamService, 
              private teamTournamentService: TeamTournamentService,
              private challengeService: ChallengeServiceService,
              private userService: UserService,
              public dialog: MatDialog) {
	  this.challenge = new Challenge();
    this.userTeamsAvailableToJoinChallenge  = [];
    this.userTeamEnrolledInTournament = new Team();
    this.userTeamActiveMatches = [];
    this.tournamentMatches = [];
    this.tournamentInactiveMatches = [];
  }

  ngOnInit(): void {
    // this.arrangeTournamentMatchesToBracket();
    this.route.queryParams.subscribe(params => {
      this.challengeService.getChallengeById(params['challengeId'])
      .subscribe((data: Challenge) => {
        if(data){
          this.challenge = data;
        }    
      },
      err => {
        console.error(err.error.message);
      },
      () => {
        this.getAllChallengeDates();
        if(this.tokenService.loggedIn()){
          this.userInspectingChallenge = this.tokenService.getUser();
          this.isAlreadyPartOfChallenge();
          this.isAdminUser();
        }
        this.evaluateChallengeDate();    
      });
    });
  }

  getAllChallengeDates(): void{
    this.getChallengeYear();
    this.getChallengeMonth();
    this.getChallengeTime();
    this.getChallengeMonthDate(); 
  }

  getChallengeYear(){
    this.challengeYear = new Date(this.challenge.challengeDate).getFullYear();	
  }

  getChallengeMonth(){
	  this.challengeMonth = monthNames[new Date(this.challenge.challengeDate).getMonth()];	
  } 

  getChallengeTime(){
	  this.challengeTime = new Date(this.challenge.challengeDate).toString().slice(15, 25) + '  ' + new Date(this.challenge.challengeDate).toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
  }

  getChallengeMonthDate(){
	  this.challengeMonthDate = new Date(this.challenge.challengeDate).getDate();		
  }

  evaluateChallengeDate(){
    if(new Date().getTime() > new Date(this.challenge.challengeDate).getTime()){
      this.isStartedChallenge = true;
      if(this.challenge.startedChallenge){
        this.isActivatedChallenge = true;
        if(this.alreadyJoinedChallenge){
          this.getAllUserActiveMatches();
        }
        this.getAllActiveChallengeMatches();
        this.getAllChallengeInactiveMatches();
      }
    }
  }

  getAllActiveChallengeMatches(){
    this.challengeService.getAllActiveMatches(this.challenge.challengeId)
    .subscribe((data: Match[]) => {
      if(data){
        console.log(data);
        this.tournamentMatches = data;
        return;
      }
    },
    err => {
      console.error(err);
    });
  }

  getAllChallengeInactiveMatches(){
    this.challengeService.getAllInactiveMatches(this.challenge.challengeId)
    .subscribe((data: Match[]) => {
      if(data){
        console.log(data);
        this.tournamentInactiveMatches = data;
        return;
      }
    },
    err => {
      console.error(err);
    });  
  }

  getAllUserActiveMatches(){
    this.challengeService.getAllUserMatches(this.userInspectingChallenge.userId, this.challenge.challengeId)
    .subscribe((data: Match[]) => {
      if(data){
        this.userTeamActiveMatches = data;
      }
    }, 
    err => console.error(err));
  }

  public isAlreadyPartOfChallenge(): void {
    if(this.userInspectingChallenge){
      if(this.userInspectingChallenge.userChallenges.filter((userChallenge: UserChallenge) => 
          userChallenge.userChallenge.challengeId === this.challenge.challengeId).length){
          this.alreadyJoinedChallenge = true;
          return;
      }
    }
    this.alreadyJoinedChallenge = false;
  }

  public isJoiningTournament(): void{
    if(this.tokenService.loggedIn()){
      if(this.userInspectingChallenge.userTokens >= this.challenge.challengeTokenFee){
        this.isTryingToJoinChallenge = true;  
        this.getAllUserTeamsAvailable();
        return;
      }
      this.isFailedChallengeJoin = true;
      this.errorMessage = 'Not enough tokens to join tournament.';
      return;
    }
    this.router.navigate(['/login']);
  }

  public joinChallenge(){
    if(this.tokenService.loggedIn()){
      if(this.selectedTeamToJoinTournamentWith){
        if(this.selectedTeamToJoinTournamentWith.teamModerator.userName !== this.userInspectingChallenge.userName){
          this.isFailedChallengeJoin = true;
          this.errorMessage = 'Only Team Creator is allowed to join with this team.';
          this.isClickedJoinButton = false;
          return;
        }
        const teamTournamentRequest = new TeamTournamentRequest(this.tournament, this.selectedTeamToJoinTournamentWith); 
        this.addTeamToCodTournament(teamTournamentRequest);       
        return;
      }
      this.isFailedChallengeJoin = true;
      this.errorMessage  = 'A team must be selected to join tournament';
      this.isClickedJoinButton = false;
      return;
    }
    this.router.navigate(['/login']);
  }

  public removeTeamFromTournament(): void{
    if(this.alreadyJoinedChallenge){
      const teamOnTournament = this.userInspectingChallenge
              .userChallenges.filter((userChallenge: UserChallenge) => 
              userChallenge.userChallenge.challengeName === this.challenge.challengeName)[0].userChallengeTeam;
      
      const teamTournamentRequest = new TeamTournamentRequest();
      teamTournamentRequest.team = teamOnTournament;
      // teamTournamentRequest.tournament = this.challenge;
      
      // this.removeTeamFromCodTournament(teamTournamentRequest);
    }
  }

  public isClickedExitChallengeButton(){
    this.isClickedExitButton = true;
  }

  public clickJoinChallengeButton(){
    this.isClickedJoinButton = true;
  }

  public clickSelectTeamButton(){
    this.isClickedSelectButton = true;
  }

  public selectTeamToJoinChallenge(team: Team){
    this.selectedTeamToJoinTournamentWith = team;
  }

  public deselectTeamToJoinChallenge(){
    this.selectedTeamToJoinTournamentWith = undefined;
    this.isClickedSelectButton = false;
  } 
  
  public removeTeamFromCodTournament(teamTournamentRequest: TeamTournamentRequest){
    this.teamTournamentService.removeTeamFromCodTournament(teamTournamentRequest, this.tokenService.getToken())
      .subscribe((data: MessageResponse) => {
        console.log(data);
        this.alreadyJoinedTournament = false;
      }, 
      err => {
        console.error(err.error.message);
        this.isClickedExitButton = false;
        return;
      },
      () => {
        if(!this.alreadyJoinedTournament){
          this.removeUserTournamentFromUser(teamTournamentRequest);
        }
      });
    }

  public addTeamToCodTournament(teamTournamentRequest: TeamTournamentRequest){
    this.teamTournamentService.addTeamToCodTournament(teamTournamentRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
      this.alreadyJoinedTournament = true;
    },
    err => {
      console.error(err.error.message);
      this.errorMessage = err.error.message;
      this.isClickedJoinButton = false;
      this.isFailedTournamentJoin = true;
      return;
    },
    () => {
      if(this.alreadyJoinedTournament){
        this.addUserTournamentToUser(teamTournamentRequest);
      }
    });
  }

  public addUserChallengeToUser(teamTournamentRequest: TeamTournamentRequest){
     const user: User = this.userInspectingTournament;
     let userTournament: UserTournament = new UserTournament(teamTournamentRequest.tournament, teamTournamentRequest.team, 0, 0, [], 'ACTIVE');
     user.userTournaments.push(userTournament);
     this.tokenService.saveUser(user);
  }

  public removeUserChallengeFromUser(teamTournamentRequest: TeamTournamentRequest){
    const user: User = this.userInspectingTournament;
    user.userTournaments = user.userTournaments.filter(userTournament => userTournament.userTournament.tournamentId !== teamTournamentRequest.tournament.tournamentId);
    this.tokenService.saveUser(user);
  }
  
  public activateTournament(){
    this.challengeService.activateChallenge(this.challenge.challengeId, this.tokenService.getToken())
    .subscribe((data: Challenge) => {
      if(data && Object.keys(data).length !== 0){
        this.challenge = data;
        this.isActivatedChallenge = true;
        window.location.reload();
        return;
      }
    }, 
    err => {
      console.error(err);
      this.isActivatedChallenge = false;
    });
  }
  
  getAllUserTeamsAvailable(){
    this.userTeamService.getAllUserTeams(this.userInspectingChallenge.userId)
    .subscribe((data: Team[]) => {
      if(data && data.length !== 0){
        this.userTeamsAvailableToJoinTournaments = data;
        this.hasNoTeams = false;
        return;
      }
      this.hasNoTeams = true;
    },
    err => console.error(err));
  }

  passMatch(matchId: string){
    this.router.navigate(['/match-details'], { queryParams: {matchId: matchId, tournamentId: this.challenge.challengeId}});
  }


  openConfirmationDialogForChallengeInitialization(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.startChallenge();
      }
    });
  } 
  
  startChallenge(){
    if(new Date().getTime() > new Date(this.challenge.challengeDate).getTime()){
      if(this.isStartedChallenge && !this.isActivatedChallenge){
        this.activateTournament();
      }
    }
  }

  public isAdminUser(){
    let role: Role = this.userInspectingChallenge.userRoles.filter(userRole => userRole.authority === 'ADMIN').find(userRole => userRole.authority === 'ADMIN');
    if(role || this.userInspectingChallenge.userName === this.challenge.challengeModerator.userName){
      this.isUserAdmin = true;
      return;
    }
    this.isUserAdmin = false;
  }

  public navigateToTeamCreation(){
    this.router.navigate(['/team-creation']);
  }

  openDialogForEntryFee(){
    this.openDialogForNumericField('challengeTokenFee', '###', 0, 0, 50);
  }

  public openDialogForNumericField(field: string, format: string, min: number, value: number, step: number){
    const dialogRef = this.dialog.open(FieldformNumericComponent, {
      width: '400px',
      data: {field: field, replaceValueNumeric: undefined, format: format, min: min, value: value, step: step}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.updateChallengeNumericField(field, result);
        if(field === 'challengeTokenFee'){
          this.updateChallengeNumericField('challengeCashPrize', result * 2);
        }
      }
    });
  }

  public updateChallengeNumericField(field: string, replaceValueNumeric: number){
    this.challenge[field] = replaceValueNumeric;
    this.challengeService.updateChallenge(this.challenge, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => console.error(err),
    () => {
      window.location.reload();
    });
  }

  public openDialogForFieldString(field: string){
    const dialogRef = this.dialog.open(FieldformComponent, {
      width: '350px',
      data: {field: `${field}`, replaceValueString: undefined}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result.replaceValueString){
        this.updateChallengeFieldString(field, result.replaceValueString);
      }
    });
  }

  public updateChallengeFieldString(field: string, replaceValue: string){
    this.challenge[field] = replaceValue;
    this.challengeService.updateChallenge(this.challenge, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err);
    });
  }

  public openDialogForDate(){
    const dialogRef = this.dialog.open(FieldformDateComponent, {
      width: '350px',
      data: {replaceValue: undefined, alreadySelectedDate: this.challenge.challengeDate, isValid: false}
    });
    dialogRef.afterClosed().subscribe((result: DialogDataDate) => {
      if(result.replaceValueDate && result.isValid){
        this.challenge['challengeDate'] = result.replaceValueDate;
        this.challengeService.updateChallenge(this.challenge, this.tokenService.getToken())
        .subscribe((data: MessageResponse) => {
        },
        err => {
          console.error(err);
        },
        () => {
          window.location.reload();
        });
      }
    });
  }

  public openDialogForCountry(){
    const dialogRef = this.dialog.open(FieldformCountryComponent,{
      width: '350px',
      data: { replaceValueCountry: undefined}
    });
    dialogRef.afterClosed().subscribe((result: DialogDataCountry) => {
      if(result){
        this.updateChallengeFieldString('challengeRegion', result.replaceValueCountry);
      }
    });
  }

  public openConfirmationDialogForDeletion(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.deleteTournament(); 
      }      
    });
  }

  public deleteTournament(){
    this.challengeService.deleteChallengeById(this.challenge.challengeId, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
    },
    err => {
      console.error(err);
    },
    () => {
      this.router.navigate(['/challenges']);
    });
  }

}
