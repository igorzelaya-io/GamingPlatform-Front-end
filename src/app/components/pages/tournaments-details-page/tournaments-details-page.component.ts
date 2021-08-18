import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Team } from '../../../models/team';
import { TeamTournamentRequest } from '../../../models/teamtournamentrequest';
import { TeamTournamentService } from '../../../services/team/team-tournament.service';
import { MessageResponse } from 'src/app/models/messageresponse';
import { UserTeamService } from 'src/app/services/user-team.service';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { Match } from 'src/app/models/match';
import { UserService } from 'src/app/services/user.service';
import { UserTournament } from 'src/app/models/user/user-tournament';
import { TreeNode } from '../../../models/treenode';
import { MatchTournamentRequest } from 'src/app/models/matchtournamentrequest';
import { BinaryTree } from 'src/app/models/binarytree';
import { Stack } from 'src/app/models/helpers/stack';
import { TreeRound } from 'src/app/models/treeround';
import { TeamService } from 'src/app/services/team/team-service.service';
import { Role } from 'src/app/models/role';
import { MatDialog } from '@angular/material/dialog';
import { FieldformConfirmationComponent } from '../../common/fieldform-confirmation/fieldform-confirmation.component';
import { FieldformComponent } from '../../common/fieldform/fieldform.component';
import { FieldformNumericComponent } from '../../common/fieldform-numeric/fieldform-numeric.component';
import { FieldformDateComponent } from '../../common/fieldform-date/fieldform-date.component';
import { FieldformCountryComponent } from '../../common/fieldform-country/fieldform-country.component';

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
  selector: 'app-tournaments-details-page',
  templateUrl: './tournaments-details-page.component.html',
  styleUrls: ['./tournaments-details-page.component.scss']
})


export class TournamentsDetailsPageComponent implements OnInit {


  tournament: Tournament;
  tournamentYear: number;
  tournamentMonth: string;
  tournamentMonthDate: number;
  tournamentTime: string;

  isTryingToJoinTournament: boolean = false;

  isActivatedTournament: boolean = false;

  userInspectingTournament: User;
  selectedTeamToJoinTournamentWith: Team;
  userTeamsAvailableToJoinTournaments: Team[];
  userTeamEnrolledInTournament: Team;
  userTeamActiveMatches: Match[];
  tournamentMatches: Match[];
  tournamentInactiveMatches: Match[];

  hasNoTeams: boolean = false;  

  errorMessage: string = '';
  isFailedTournamentJoin = false;

  isUserAdmin: boolean = false;

  isClickedExitButton = false;
  isClickedJoinButton = false;
  isClickedSelectButton = false;

  alreadyJoinedTournament = false;
  
  isStartedTournament = false;


  constructor(private route: ActivatedRoute,
              private router: Router, 
              private tokenService: TokenStorageService,
              private userTeamService: UserTeamService, 
              private teamTournamentService: TeamTournamentService,
              private tournamentService: TournamentService,
              private userService: UserService,
              public dialog: MatDialog) {
	  this.tournament = new Tournament();
    this.userTeamsAvailableToJoinTournaments  = [];
    this.userTeamEnrolledInTournament = new Team();
    this.userTeamActiveMatches = [];
    this.tournamentMatches = [];
    this.tournamentInactiveMatches = [];
  }

  ngOnInit(): void {
    // this.arrangeTournamentMatchesToBracket();
  	this.route.queryParams.subscribe(params => {
      this.tournamentService.getTournamentById(params['tournamentId'])
      .subscribe((data: Tournament) => {
        if(data){
          this.tournament = data;
        }
      }, 
      err => {
        console.error(err);
      }, 
      () => {
        this.getAllTournamentDates();
        if(this.tokenService.loggedIn()){
          this.userInspectingTournament = this.tokenService.getUser();
          this.isAlreadyPartOfTournament();
          this.isAdminUser();
        }
        this.evaluateTournamentDate();    
      });
    });
  }

  public isJoiningTournament(): void{
    if(this.tokenService.loggedIn()){
      if(this.userInspectingTournament.userTokens >= this.tournament.tournamentEntryFee){
        this.isTryingToJoinTournament = true;  
        this.getAllUserTeamsAvailable();
        return;
      }
      this.isFailedTournamentJoin = true;
      this.errorMessage = 'Not enough tokens to join tournament.';
      return;
    }
    this.router.navigate(['/login']);
  }

  public joinTournament(){
    if(this.tokenService.loggedIn()){
      if(this.selectedTeamToJoinTournamentWith){
        if(this.selectedTeamToJoinTournamentWith.teamModerator.userName !== this.userInspectingTournament.userName){
          this.isFailedTournamentJoin = true;
          this.errorMessage = 'Only Team Creator is allowed to join with this team.';
          this.isClickedJoinButton = false;
          return;
        }
        const teamTournamentRequest = new TeamTournamentRequest(this.tournament, this.selectedTeamToJoinTournamentWith); 
        
        if(this.tournament.tournamentGame === 'Fifa'){
          this.addTeamToFifaTournament(teamTournamentRequest);    
          return; 
        }
  
        this.addTeamToCodTournament(teamTournamentRequest);       
        return;
      }
      this.isFailedTournamentJoin = true;
      this.errorMessage  = 'A team must be selected to join tournament';
      this.isClickedJoinButton = false;
      return;
    }
    this.router.navigate(['/login']);
  }

  public removeTeamFromTournament(): void{
    if(this.alreadyJoinedTournament){
      const teamOnTournament = this.userInspectingTournament
              .userTournaments.filter(userTournaments => 
              userTournaments.userTournament.tournamentName === this.tournament.tournamentName)[0].userTournamentTeam;
      
      const teamTournamentRequest = new TeamTournamentRequest();
      teamTournamentRequest.team = teamOnTournament;
      teamTournamentRequest.tournament = this.tournament;
      
      if(this.tournament.tournamentName === 'Fifa'){
        this.removeTeamFromFifaTournament(teamTournamentRequest);
        return;
      }
      this.removeTeamFromCodTournament(teamTournamentRequest);
    }
  }
  
  public isAlreadyPartOfTournament(): void {
    if(this.userInspectingTournament){
      if(this.userInspectingTournament.userTournaments
            .filter(tournament => 
            tournament.userTournament.tournamentId === this.tournament.tournamentId).length !== 0){
          this.alreadyJoinedTournament = true;
          return;
      }
    }
    this.alreadyJoinedTournament = false;
  }

  public isClickedExitTournamentButton(){
    this.isClickedExitButton = true;
  }

  public clickJoinTournamentButton(){
    this.isClickedJoinButton = true;
  }

  public clickSelectTeamButton(){
    this.isClickedSelectButton = true;
  }

  public selectTeamToJoinTournament(team: Team){
    this.selectedTeamToJoinTournamentWith = team;
  }

  public deselectTeamToJoinTournament(){
    this.selectedTeamToJoinTournamentWith = undefined;
    this.isClickedSelectButton = false;
  }

  getTournamentYear(){
	  this.tournamentYear = new Date(this.tournament.tournamentDate).getFullYear();	
  }

  getTournamentMonth(){
	  this.tournamentMonth = monthNames[new Date(this.tournament.tournamentDate).getMonth()];	
  } 

  getTournamentTime(){
	  this.tournamentTime = new Date(this.tournament.tournamentDate).toString().slice(15, 25) + '  ' + new Date(this.tournament.tournamentDate).toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
  }

  getTournamentMonthDate(){
	  this.tournamentMonthDate = new Date(this.tournament.tournamentDate).getDate();		
  } 

  public removeTeamFromFifaTournament(teamTournamentRequest: TeamTournamentRequest){   
    this.teamTournamentService.removeTeamFromFifaTournament(teamTournamentRequest, this.tokenService.getToken())
      .subscribe((data: MessageResponse) => {
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

  public addTeamToFifaTournament(teamTournamentRequest: TeamTournamentRequest){
    this.teamTournamentService.addTeamToFifaTournament(teamTournamentRequest, this.tokenService.getToken())
      .subscribe((data: MessageResponse) => {
        this.alreadyJoinedTournament = true;
        console.log(data);
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

  public addUserTournamentToUser(teamTournamentRequest: TeamTournamentRequest){
     const user: User = this.userInspectingTournament;
     let userTournament: UserTournament = new UserTournament(teamTournamentRequest.tournament, teamTournamentRequest.team, 0, 0, [], 'ACTIVE');
     user.userTournaments.push(userTournament);
     this.tokenService.saveUser(user);
  }

  public removeUserTournamentFromUser(teamTournamentRequest: TeamTournamentRequest){
    const user: User = this.userInspectingTournament;
    user.userTournaments = user.userTournaments.filter(userTournament => userTournament.userTournament.tournamentId !== teamTournamentRequest.tournament.tournamentId);
    this.tokenService.saveUser(user);
  }
  
  public activateTournament(){
    this.tournamentService.activateTournament(this.tournament, this.tokenService.getToken())
    .subscribe((data: Tournament) => {
      if(data && Object.keys(data).length !== 0){
        this.tournament = data;
        console.log(data);
        this.isActivatedTournament = true;
        window.location.reload();
        return;
      }
    }, 
    err => {
      console.error(err);
      this.isActivatedTournament = false;
    });
  }
  
  getAllUserTeamsAvailable(){
    this.userTeamService.getAllUserTeams(this.userInspectingTournament.userId)
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

  getAllActiveTournamentMatches(){
    this.tournamentService.getAllActiveTournamentMatches(this.tournament.tournamentId)
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

  getAllTournamentInactiveMatches(){
    this.tournamentService.getAllTournamentInactiveMatches(this.tournament.tournamentId)
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
    this.tournamentService.getAllUserActiveMatches(this.userInspectingTournament.userId, this.tournament.tournamentId)
    .subscribe((data: Match[]) => {
      if(data){
        this.userTeamActiveMatches = data;
        return;
      }
    });
  }

  addMatchToTeams(matchTournamentRequest: MatchTournamentRequest): void{
    if(this.tournament.tournamentGame === 'Fifa'){
      this.teamTournamentService.addFifaMatchToTeams(matchTournamentRequest)
      .subscribe(data => {

      }, err => {
        console.error(err.error.message);
      });
      return;
    }
    this.teamTournamentService.addCodMatchToTeams(matchTournamentRequest)
    .subscribe(data => {

    },
    err => {
      console.error(err.error.message);
    });
  }

  passMatch(matchId: string){
    this.router.navigate(['/match-details'], { queryParams: {matchId: matchId, tournamentId: this.tournament.tournamentId}});
  }

  evaluateTournamentDate(){
    if(new Date().getTime() > new Date(this.tournament.tournamentDate).getTime()){
      this.isStartedTournament = true;
      if(this.tournament.startedTournament){
        this.isActivatedTournament = true;
        if(this.alreadyJoinedTournament){
          this.getAllUserActiveMatches();
        }
        if(this.isPvPTournament()){
          this.displayTournamentBracket();
          this.getAllActiveTournamentMatches();
          this.getAllTournamentInactiveMatches();
          this.displayTournamentBracket();
          return;
        }
        //getTournamentLeaderboard
      }
    }
  }

  openConfirmationDialogForTournamentInitialization(){
    const dialogRef = this.dialog.open(FieldformConfirmationComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.startTournament();
      }
    });
  } 
  
  startTournament(){
    if(new Date().getTime() > new Date(this.tournament.tournamentDate).getTime()){
      if(this.isStartedTournament && !this.isActivatedTournament){
        this.activateTournament();
      }
    }
  }

  getAllTournamentDates(): void{
    this.getTournamentYear();
    this.getTournamentMonth();
    this.getTournamentTime();
    this.getTournamentMonthDate(); 
  }

  public isPvPTournament(): boolean{
    if(this.tournament.tournamentFormat === 'PvP'){
      return true; 
    }
    return false; 
  }

  public isAdminUser(){
    let role: Role = this.userInspectingTournament.userRoles.filter(userRole => userRole.authority === 'ADMIN').find(userRole => userRole.authority === 'ADMIN');
    if(role || this.userInspectingTournament.userName === this.tournament.tournamentModerator.userName){
      this.isUserAdmin = true;
      return;
    }
    this.isUserAdmin = false;
  }

  public navigateToTeamCreation(){
    this.router.navigate(['/team-creation']);
  }

  public getTournamentBracketRoundsNumber(){
    const numberOfTeamsInTournament: number = this.tournament.tournamentNumberOfTeams;
    let splitNumberOfTeams: number = numberOfTeamsInTournament;
    let numberOfRounds: number = 0; 
    if(numberOfTeamsInTournament % 2 == 0){
      for(let i = 0; i < numberOfTeamsInTournament; i++){
        if(splitNumberOfTeams === 2 ){
          break;
        }
        splitNumberOfTeams = splitNumberOfTeams / 2;
        numberOfRounds++;
      }
      return numberOfRounds;
    }
  }

  public createMatchForTeams(awayTeam: Team, localTeam?: Team ): Match{
    let match: Match = new Match();
    if(localTeam){
      match.matchLocalTeam = localTeam;
      match.localTeamMatchScore = 0;
      match.matchAwayTeam = awayTeam;
      match.awayTeamMatchScore = 0;
      match.matchTournament = this.tournament;
      match.matchStatus = 'ACTIVE';
      match.uploaded = false;
      const matchTournamentRequest: MatchTournamentRequest = new MatchTournamentRequest();
      matchTournamentRequest.matchTournamentMatch = match;
      this.addMatchToTeams(matchTournamentRequest);
      return match;
    }
    match.matchAwayTeam = awayTeam;
    match.awayTeamMatchScore = 0;
    match.matchTournament = this.tournament;
    match.matchStatus = 'ACTIVE';
    match.uploaded = false;
    return match;
  }

  //DISPLAY TOURNAMENT BRACKET
  public displayTournamentBracket(){
    
  }

  openDialogForPrizePool(){
    this.openDialogForNumericField('tournamentCashPrize', 'c2', 0, 0, 25);
  }

  openDialogForLimitNumberOfTeams(){
    this.openDialogForNumericField('tournamentLimitNumberOfTeams', '###.##', 2, 2, 1);
  }

  openDialogForEntryFee(){
    this.openDialogForNumericField('tournamentEntryFee', '###', 0, 0, 50);
  }

  public openDialogForNumericField(field: string, format: string, min: number, value: number, step: number, chargeFee?: number){
    const dialogRef = this.dialog.open(FieldformNumericComponent, {
      width: '400px',
      data: {field: field, replaceValueNumeric: undefined, format: format, min: min, value: value, step: step}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.updateTournamentNumericField(field, result);
      }
    });
  }

  public updateTournamentNumericField(field: string, replaceValueNumeric: number){
    this.tournament[field] = replaceValueNumeric;
    this.tournamentService.updateTournament(this.tournament, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => console.error(err),
    () => {
      window.location.reload();
    });
  }

  public openDialogForDescription(){
    this.openDialogForFieldString('tournamentDescription');
  }

  public openDialogForFieldString(field: string){
    const dialogRef = this.dialog.open(FieldformComponent, {
      width: '350px',
      data: {field: `${field}`, replaceValueString: undefined}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result.replaceValueString){
        this.updateTournamentFieldString(field, result.replaceValueString);
      }
    });
  }

  public updateTournamentFieldString(field: string, replaceValue: string){
    this.tournament[field] = replaceValue;
    this.tournamentService.updateTournament(this.tournament, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err);
    });
  }

  public openDialogForDate(){
    const dialogRef = this.dialog.open(FieldformDateComponent, {
      width: '350px',
      data: {replaceValue: undefined, alreadySelectedDate: this.tournament.tournamentDate, isValid: false}
    });
    dialogRef.afterClosed().subscribe((result: DialogDataDate) => {
      if(result.replaceValueDate && result.isValid){
        this.tournament['tournamentDate'] = result.replaceValueDate;
        this.tournamentService.updateTournament(this.tournament, this.tokenService.getToken())
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
        this.updateTournamentFieldString('tournamentRegion', result.replaceValueCountry);
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
    this.tournamentService.deleteTournament(this.tournament, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {

    },
    err => {
      console.error(err);
    },
    () => {
      this.router.navigate(['/tournaments']);
    });
  }

}
