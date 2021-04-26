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



const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

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
              private userService: UserService) {
	  this.tournament = new Tournament();
    this.userTeamsAvailableToJoinTournaments  = [];
    this.userTeamEnrolledInTournament = new Team();
    this.userTeamActiveMatches = [];
    this.tournamentMatches = [];
    this.tournamentInactiveMatches = [];
  }

  ngOnInit(): void {
    this.userInspectingTournament = this.tokenService.getUser();
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
        this.isAlreadyPartOfTournament();
        this.evaluateTournamentDate();    
      });
    });
  }

  public isJoiningTournament(): void{
   if(this.userInspectingTournament.userTokens >= this.tournament.tournamentEntryFee){
      this.isTryingToJoinTournament = true;  
      this.getAllUserTeamsAvailable();
      return;
    }
    this.isFailedTournamentJoin = true;
    this.errorMessage = 'Not enough tokens to join tournament.';
  }

  public joinTournament(){
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
        this.getUserByName();
        window.location.reload();
        return; 
      }

      this.addTeamToCodTournament(teamTournamentRequest);       
      this.getUserByName();
      window.location.reload();
      return;
    }
    this.isFailedTournamentJoin = true;
    this.errorMessage  = 'A team must be selected to join tournament';
    this.isClickedJoinButton = false;
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
    });
  }

  public getUserByName(){
    this.userService.getUserByUserName(this.userInspectingTournament.userName)
    .subscribe((data: User) => {
      if(data){
        this.userInspectingTournament = data;
        this.tokenService.saveUser(data);
      }
    },
    err => {
      this.isFailedTournamentJoin = true;
      this.errorMessage = 'Failed to join tournament, please try again later';
    }); 
  }
  
  public activateTournament(){
    this.tournamentService.activateTournament(this.tournament)
    .subscribe((data: Tournament) => {
      if(data && Object.keys(data).length !== 0){
        this.tournament = data;
        console.log(data);
        this.isStartedTournament = true;
        window.location.reload();
        return;
      }
    }, err => {
      console.error(err);
      this.isStartedTournament = false;
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
  //This method belongs to match-details.
  // getTeamMatchFromTournament(matchId: string, tournamentId: string){
  //   this.teamTournamentService.getTeamMatchFromTournament(matchId, this.tournament.tournamentId)
  //   .subscribe();
  // }
  passMatch(matchId: string){
    this.router.navigate(['/match-details'], { queryParams: {matchId: matchId, tournamentId: this.tournament.tournamentId}});
  }

  evaluateTournamentDate(){
    if(new Date().getTime() > new Date(this.tournament.tournamentDate).getTime()){
      if(!this.tournament.isStartedTournament){
        this.activateTournament();    
      }
      this.isStartedTournament = true;
      if(this.alreadyJoinedTournament){
        this.getAllUserActiveMatches();
      }
      if(!this.isPvPTournament()){
        this.getAllActiveTournamentMatches();
        this.getAllTournamentInactiveMatches();
        return;
      }
      //getTournamentLeaderboard
    }
  }

  getAllTournamentDates(): void{
    this.getTournamentYear();
    this.getTournamentMonth();
    this.getTournamentTime();
    this.getTournamentMonthDate(); 
  }

  public isPvPTournament(): boolean{
    if(this.tournament.tournamentFormat === 'PVP'){
      return true; 
    }
    return false; 
  }

  public navigateToTeamCreation(){
    this.router.navigate(['/team-creation']);
  }

}
