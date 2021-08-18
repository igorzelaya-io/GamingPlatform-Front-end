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
  
  users: User[];
  isEmptyUsers: boolean = false;

  teams: Team[];
  isEmptyTeams: boolean = false;

  isUserFind: boolean = false;
  
  constructor(private userService: UserService,
              private teamService: TeamService,
              private sharedService: SharedService,
              private renderer: Renderer2,
              private router: Router) {
    this.users = [];
    this.teams = [];
    this.userButton = this.sharedService.get();
    this.teamButton = this.sharedService.get();
  } 


  ngOnInit(): void {
    this.toggleFindUsers();
  }

  toggleFindUsers(){
    this.isUserFind = true;
    this.getFirstFifteenUsers();
  }

  toggleFindTeams(){
    this.isUserFind = false;
    this.getFirstFifteenTeams();
  }

  getFirstFifteenTeams(){
    this.teamService.getFirstFifteenTeams()
    .subscribe((data: Team[]) => {
      if(data){
        this.teams = data;
        this.isEmptyTeams = false;
        return;
      }
      this.isEmptyTeams = true;
    }, err => console.error(err.error.message));
  }

  getNextPageOfTeams(){
    this.teamService.getNextPageBy(this.teams[this.teams.length].teamId)
    .subscribe((data: Team[]) => {
      if(data){
        this.teams = data;
        this.isEmptyTeams = false;
        return;
      }
      this.isEmptyTeams = true;
    }, err => console.error(err.error.message));
  }

  getFirstFifteenUsers(){
    this.userService.getFirstFifteenUsersByWins()
    .subscribe((data: User[]) => {
      if(data){
        console.log(data);
        this.users = data;
        this.isEmptyUsers = false;
        return;
      }
      this.isEmptyUsers = true;
    },err => console.error(err.error.message));
  }

  getNextPageOfUsers(){
    this.userService.getNextPage(this.users[this.users.length].userId)
    .subscribe((data: User[]) => {
      if(data){
        this.users = data;
        this.isEmptyUsers = false;
        return;
      }
      this.isEmptyUsers = true;
    }, err => console.error(err.error.message));
  }

  selectUsersGet(){
    if(this.isWhiteBorder(this.userButton)){
      this.changeToBlackBorder(this.userButton);
      return;
    }
    else if(this.isWhiteBorder(this.teamButton)){
      this.changeToBlackBorder(this.teamButton);
      this.changeToWhiteBorder(this.userButton);
      this.toggleFindUsers();
      return;
    }
    this.changeToWhiteBorder(this.userButton);
    this.toggleFindUsers();
  } 
  
  selectTeamsGet(){
    if(this.isWhiteBorder(this.teamButton)){
      this.changeToBlackBorder(this.teamButton);
      return;
    }
    else if(this.isWhiteBorder(this.userButton)){
      this.changeToBlackBorder(this.userButton);
      this.changeToWhiteBorder(this.teamButton);
      this.toggleFindTeams();
      return;
    }
    this.changeToWhiteBorder(this.teamButton);
    this.toggleFindTeams();
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
