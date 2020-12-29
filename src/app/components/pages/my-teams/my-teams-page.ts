import { Component, OnInit } from '@angular/core';
import { UserTeamService } from '../../../services/user-team.service';
import { User } from 'src/app/models/user/user';
import { Team } from '../../../models/team';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-teams-page',
  templateUrl: './my-teams-page.html',
  styleUrls: ['./my-teams-page.scss']
})
export class MyTeamsPageComponent implements OnInit {

  constructor(private userTeamService: UserTeamService,
              private tokenService: TokenStorageService,
              private router: Router) {

  }
  isEmpty = true;
  message = 'No teams available';
  user: User = new User();
  teams: Team[] = [];

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.getAllUserTeams();
  }

  getAllUserTeams(){
    this.userTeamService.getAllUserTeams(this.user.userId)
    .subscribe((data: Team[]) => {
      this.teams = data;
      console.log(data);
      this.isEmpty = false;
    },
    err => {
      console.error(err);
    });
  }

  createButton(){
    this.router.navigate(['/team-creation'], {queryParams: {userId: this.user.userId}});
  }

  passTeam(team: Team){
    this.router.navigate(['/team-details'], {queryParams: { teamId: team.teamId}});
  }
}
