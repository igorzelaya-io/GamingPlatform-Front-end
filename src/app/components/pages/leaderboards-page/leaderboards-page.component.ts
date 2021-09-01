import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user/user';
import { Team } from 'src/app/models/team';
import { FormControl } from '@angular/forms';
import { TeamService } from 'src/app/services/team/team-service.service';
import { SharedService } from 'src/app/services/helpers/shared-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboards-page',
  templateUrl: './leaderboards-page.component.html',
  styleUrls: ['./leaderboards-page.component.scss']
})
export class LeaderboardsPageComponent implements OnInit {

  @ViewChild('userButton')
  userButton: ElementRef;

  @ViewChild('teamsButton')
  teamButton: ElementRef;

  @ViewChild('codButton')
  codButton: ElementRef;

  @ViewChild('fifaButton')
  fifaButton: ElementRef;
  
  fifaUsers: User[];
  isEmptyFifaUsers: boolean = false;

  codUsers: User[];
  isEmptyCodUsers: boolean = false;

  codTeams: Team[];
  isEmptyCodTeams: boolean = false;

  fifaTeams: Team[];
  isEmptyFifaTeams: boolean = false;

  isUserFind: boolean = false;
  isCodFind: boolean = false;
  
  constructor(private userService: UserService,
              private teamService: TeamService,
              private sharedService: SharedService,
              private renderer: Renderer2,
              private router: Router) {
    this.codUsers = [];
    this.codTeams = [];
    this.userButton = this.sharedService.get();
    this.teamButton = this.sharedService.get();
    this.codButton = this.sharedService.get();
    this.fifaButton = this.sharedService.get();
  } 


  ngOnInit(): void {
    this.toggleFindCodUsers();
  }

  toggleFindCodUsers(): void{
    this.isUserFind = true;
    this.isCodFind = true;
    this.getFirstFifteenUsersByCodWins();
  }

  toggleFindFifaUsers(): void{
    this.isUserFind = true;
    this.isCodFind = false;
    this.getFirstFifteenUsersByFifaWins();
  }

  toggleFindCodTeams(){
    this.isUserFind = false;
    this.isCodFind = true;
    this.getFirstFifteenTeamsByCodWins();
  }

  toggleFindFifaTeams(){
    this.isUserFind = false;
    this.isCodFind = false;
    this.getFirstFifteenTeamsByFifaWins();
  }

  getFirstFifteenUsersByCodWins(){
    this.userService.getFirstFifteenUsersByCodWins()
    .subscribe((data: User[]) => {
      if(data && data.length){
        this.codUsers = data;
        this.isEmptyCodUsers = false;
        return;
      }
      this.isEmptyCodUsers = true;
    },err => console.error(err.error.message));
  }

  getFirstFifteenUsersByFifaWins(){
    this.userService.getFirstFifteenUsersByFifaWins()
    .subscribe((data: User[]) => {
      if(data && data.length){
        this.fifaUsers = data;
        this.isEmptyFifaUsers = false;
        return;
      }
      this.isEmptyFifaUsers = true; 
    }, err => console.error(err));
  }

  getFirstFifteenTeamsByCodWins(){
    this.teamService.getFirstFifteenTeamsByCodWins()
    .subscribe((data: Team[]) => {
      if(data && data.length){
        this.codTeams = data;
        this.isEmptyCodTeams = false;
        return;
      }
      this.isEmptyCodTeams = true;
    }, err => console.error(err.error.message));
  }

  getFirstFifteenTeamsByFifaWins(){
    this.teamService.getFirstFifteenTeamsByFifaWins()
    .subscribe((data: Team[]) => {
      if(data && data.length){
        this.fifaTeams = data;
        this.isEmptyFifaTeams = false;
        return;
      }
      this.isEmptyFifaTeams = true;
    }, err => console.error(err));
  }

  getNextCodPageOfUsers(){
    this.userService.getNextCodPage(this.codUsers[this.codUsers.length].userId)
    .subscribe((data: User[]) => {
      if(data){
        this.codUsers = data;
        this.isEmptyCodUsers = false;
        return;
      }
      this.isEmptyCodUsers = true;
    }, err => console.error(err.error.message));
  }

  getNextPageByCodTeams(){
    this.teamService.getNextPageByCodWins(this.codTeams[this.codTeams.length].teamId)
    .subscribe((data: Team[]) => {
      if(data){
        this.codTeams = data;
        this.isEmptyCodTeams = false;
        return;
      }
      this.isEmptyCodTeams = true;
    }, err => console.error(err.error.message));
  }


  selectUsersGet(){
    if(this.isWhiteBorder(this.userButton)){
      this.changeToBlackBorder(this.userButton);
      if(this.isWhiteBorder(this.codButton)){
        this.changeToBlackBorder(this.codButton);
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.changeToBlackBorder(this.fifaButton);
      }
    }
    
    else if(this.isWhiteBorder(this.teamButton)){
      this.changeToBlackBorder(this.teamButton);
      this.changeToWhiteBorder(this.userButton);
      if(this.isWhiteBorder(this.codButton)){
        this.toggleFindCodUsers();
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.toggleFindFifaUsers();
      }
    }
    else{
      this.changeToWhiteBorder(this.userButton);
      if(this.isWhiteBorder(this.codButton)){
        this.toggleFindCodUsers();
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.toggleFindFifaUsers();
      }
    }
  } 

  selectTeamsGet(){
    if(this.isWhiteBorder(this.teamButton)){
      this.changeToBlackBorder(this.teamButton);
      if(this.isWhiteBorder(this.codButton)){
        this.changeToBlackBorder(this.codButton);
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.changeToBlackBorder(this.fifaButton);
      }
    }
    else if(this.isWhiteBorder(this.userButton)){
      this.changeToBlackBorder(this.userButton);
      this.changeToWhiteBorder(this.teamButton);
      if(this.isWhiteBorder(this.codButton)){
        this.toggleFindCodTeams();
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.toggleFindFifaTeams();
      }
    }
    else{
      this.changeToWhiteBorder(this.teamButton);
      if(this.isWhiteBorder(this.codButton)){
        this.toggleFindCodTeams();
      }
      else if(this.isWhiteBorder(this.fifaButton)){
        this.toggleFindFifaTeams();
      }
    }
  }

  selectCodGet(){
    if(this.isWhiteBorder(this.codButton)){
      this.changeToBlackBorder(this.codButton);
    }
    else if(this.isWhiteBorder(this.fifaButton)){
      this.changeToWhiteBorder(this.codButton);
      this.changeToBlackBorder(this.fifaButton);
      if(this.isWhiteBorder(this.userButton)){
        this.toggleFindCodUsers();
      }
      else if(this.isWhiteBorder(this.teamButton)){
        this.toggleFindCodTeams();
      }
    }
    else{
     this.changeToWhiteBorder(this.codButton);
     if(this.isWhiteBorder(this.userButton)){
      this.toggleFindCodUsers();
     } 
     else if(this.isWhiteBorder(this.teamButton)){
      this.toggleFindCodTeams();
     }
    }
  }

  selectFifaGet(){
    if(this.isWhiteBorder(this.fifaButton) ){
      this.changeToBlackBorder(this.fifaButton);
    }
    else if(this.isWhiteBorder(this.codButton)){
      this.changeToBlackBorder(this.codButton);
      this.changeToWhiteBorder(this.fifaButton);
      if(this.isWhiteBorder(this.userButton)){
        this.toggleFindFifaUsers();
      }
      else if(this.isWhiteBorder(this.teamButton)){
        this.toggleFindFifaTeams();
      }
    }
    else {
      this.changeToWhiteBorder(this.fifaButton);
      if(this.isWhiteBorder(this.userButton)){
        this.toggleFindFifaUsers();
      }
      else if(this.isWhiteBorder(this.teamButton)){
        this.toggleFindFifaTeams();
      }
    }
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

  private changeToWhiteBorder(elementToChange: ElementRef): void{
    this.renderer.setStyle(elementToChange.nativeElement, 'border', '3px solid white');
  }

  public viewUser(user: User){
    this.router.navigate(['/player-details'], {queryParams: { userId: user.userId }});
  }

  public viewTeam(team: Team){
    this.router.navigate(['/team-details'], { queryParams: { teamId: team.teamId }});
  }
}
