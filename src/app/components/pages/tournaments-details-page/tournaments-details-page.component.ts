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
import { NgttTournament, NgttRound } from 'ng-tournament-tree';
import { TreeNode } from '../../../models/treenode';
import { MatchTournamentRequest } from 'src/app/models/matchtournamentrequest';
import { BinaryTree } from 'src/app/models/binarytree';
import { Stack } from 'src/app/models/helpers/stack';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { TreeRound } from 'src/app/models/treeround';
import { TeamService } from 'src/app/services/team/team-service.service';
import { Role } from 'src/app/models/role';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

@Component({
  selector: 'app-tournaments-details-page',
  templateUrl: './tournaments-details-page.component.html',
  styleUrls: ['./tournaments-details-page.component.scss']
})


export class TournamentsDetailsPageComponent implements OnInit {

  public singleEliminationTournament: NgttTournament;

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
              private userService: UserService) {
	  this.tournament = new Tournament();
    this.userTeamsAvailableToJoinTournaments  = [];
    this.userTeamEnrolledInTournament = new Team();
    this.userTeamActiveMatches = [];
    this.tournamentMatches = [];
    this.tournamentInactiveMatches = [];
  }

  ngOnInit(): void {
    // this.arrangeTournamentMatchesToBracket();
    if(this.tokenService.loggedIn()){
      this.userInspectingTournament = this.tokenService.getUser();
      this.isAdminUser();
    }
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
        return; 
      }

      this.addTeamToCodTournament(teamTournamentRequest);       
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
    this.tournamentService.activateTournament(this.tournament)
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
      if(this.isActivatedTournament){
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
    if(role){
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

  public displayTournamentBracket(){
    let tournamentTeamBracketTree: BinaryTree = this.tournament.tournamentBracketTree;
    if(tournamentTeamBracketTree){
      const binaryTreeNumberOfRounds: number = tournamentTeamBracketTree.binaryTreeNumberOfRounds;
      let singleEliminationTournamentRounds: NgttRound[] = [];
      
      for(let i = 0; i < binaryTreeNumberOfRounds; i++){
        let roundX: TreeRound = tournamentTeamBracketTree.binaryTreeRounds[i];
        let roundXNodes: TreeNode[] = roundX.treeRoundNodes;
              
        let ngRound: any = {
          type: 'WinnerBracket',
          matches: []
        }
        if(i === binaryTreeNumberOfRounds - 1){
          ngRound.type = 'Final';
        }
        let matches = [];
        for(let j = 0 ; j < roundXNodes.length; j++){
          let match: Match = roundXNodes[i].value;
          let ngMatch: any = {
            teams:{}
          };
          if(match.matchAwayTeam){
            ngMatch.teams = {name: `${match.matchAwayTeam.teamName}`, score: match.awayTeamMatchScore};
          }
          else{
            ngMatch.teams = {name: 'Winning Team', score: 0};  
          }
          if(match.matchLocalTeam){
            ngMatch.teams = {name: `${match.matchLocalTeam.teamName}`, score: match.localTeamMatchScore};
          }
          else{
            ngMatch.teams = {name: 'Winning Team', score: 0};
          }
          matches.push(ngMatch);
        }
        ngRound.matches = matches;
      } 
      this.singleEliminationTournament.rounds = singleEliminationTournamentRounds;
    }
    
    this.singleEliminationTournament = {
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            }
          ]
        }, {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  F', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  B', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  F', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Team  D',
                  score: 1
                },
                {
                  name: 'Team  H',
                  score: 2
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
