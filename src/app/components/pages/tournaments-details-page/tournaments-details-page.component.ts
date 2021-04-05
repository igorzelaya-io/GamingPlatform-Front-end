import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { User } from 'src/app/models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Team } from '../../../models/team';
import { TeamTournamentRequest } from '../../../models/teamtournamentrequest';
import { TeamTournamentService } from '../../../services/team/team-tournament.service';
import { UserTournamentRequest } from '../../../models/user/user-tournament-request';
import { MessageResponse } from 'src/app/models/messageresponse';
import { UserTournamentService } from 'src/app/services/user-tournament.service';
import { UserTeamService } from 'src/app/services/user-team.service';


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
  hasNoTeams: boolean = false;  

  errorMessage: string = '';
  isFailedTournamentJoin = false;

  isClickedExitButton = false;
  isClickedJoinButton = false;
  isClickedSelectButton = false;

  alreadyJoinedTournament = false;


  constructor(private route: ActivatedRoute,
              private router: Router, 
              private tokenService: TokenStorageService,
              private userTournamentService: UserTournamentService,
              private userTeamService: UserTeamService, 
              private teamTournamentService: TeamTournamentService) {
	  this.tournament = new Tournament();
    this.userInspectingTournament = new User();
    this.userTeamsAvailableToJoinTournaments  = [];
    this.selectedTeamToJoinTournamentWith = new Team();
  }

  ngOnInit(): void {
    this.userInspectingTournament = this.tokenService.getUser();
  	this.route.queryParams.subscribe(params => {
		  this.tournament = JSON.parse(params['tournament']);
	  });
    this.getTournamentYear();
    this.getTournamentMonth();
    this.getTournamentTime();
    this.getTournamentMonthDate();
    this.isAlreadyPartOfTournament();
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
    if(this.selectedTeamToJoinTournamentWith || Object.keys(this.selectedTeamToJoinTournamentWith).length !== 0){
      const teamTournamentRequest = new TeamTournamentRequest(this.tournament, this.selectedTeamToJoinTournamentWith); 
      
      this.teamTournamentService.addTeamToTournament(teamTournamentRequest, this.tokenService.getToken())
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
      
      this.selectedTeamToJoinTournamentWith.teamUsers.forEach(user => {
        let userTeamRequest = new UserTournamentRequest(this.tournament, this.selectedTeamToJoinTournamentWith, user);
        this.addTournamentToUserTournamentList(userTeamRequest);
      });

      this.alreadyJoinedTournament = true;
      return;
    }
    this.isFailedTournamentJoin = true;
    this.errorMessage  = 'A team must be selected to join tournament';
  }

  public addTournamentToUserTournamentList(userTournamentRequest: UserTournamentRequest){
    this.userTournamentService.addTournamentToUserTournamentList(userTournamentRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);  
    },
    err => {
      console.error(err.error.message);
      this.isClickedJoinButton = false;
    });
  }

  public removeTeamFromTournament(): void{
    if(this.alreadyJoinedTournament){
      const teamOnTournament = this.userInspectingTournament
              .userTournament.filter(userTournaments => 
              userTournaments.userTournament.tournamentName === this.tournament.tournamentName)[0].userTournamentTeam;
      
      const teamTournamentRequest = new TeamTournamentRequest();
      teamTournamentRequest.team = teamOnTournament;
      teamTournamentRequest.tournament = this.tournament;
      this.teamTournamentService.removeTeamFromTournament(teamTournamentRequest, this.tokenService.getToken())
      .subscribe((data: MessageResponse) => {
        console.log(data);
        this.alreadyJoinedTournament = false;
      }, 
        err => {
        console.error(err.error.message);
        this.isClickedExitButton = false;
        return;
      });

      teamOnTournament.teamUsers.forEach(user => {
        let userTournamentRequest = new UserTournamentRequest();
        userTournamentRequest.tournament = this.tournament;
        userTournamentRequest.user = user;
        this.removeTournamentFromUserList(userTournamentRequest);
      });
    }
  }
  
  public removeTournamentFromUserList(userTournamentRequest: UserTournamentRequest):void{
    this.userTournamentService.removeTournamentFromUserTournamentList(userTournamentRequest, this.tokenService.getToken())
    .subscribe((data: MessageResponse) => {
      console.log(data);
    },
    err => {
      console.error(err.error.message);
      this.isClickedExitButton = false;
    });
  }

  public isAlreadyPartOfTournament(): void {
    if(this.userInspectingTournament.userTournament
          .filter(tournament => 
          tournament.userTournament.tournamentName === this.tournament.tournamentName).length !== 0){
        this.alreadyJoinedTournament = true;
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
	  this.tournamentTime = this.tournament.tournamentDate.toString().slice(11, 19) + '  ' + new Date(this.tournament.tournamentDate).toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
  }

  getTournamentMonthDate(){
	  this.tournamentMonthDate = new Date(this.tournament.tournamentDate).getDate();		
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
