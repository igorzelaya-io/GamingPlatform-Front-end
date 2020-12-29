import { Component, OnInit } from '@angular/core';
import { Team } from '../../../models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/team/team-service.service';

@Component({
  selector: 'app-team-details-page',
  templateUrl: './team-details-page.component.html',
  styleUrls: ['./team-details-page.component.scss']
})
export class TeamDetailsPageComponent implements OnInit {

  team: Team;
  constructor(private route: ActivatedRoute,
              private teamService: TeamService) {
    this.team = new Team();
  }

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.getTeamById(params['teamId']);
    });
  }

  getTeamById(teamId: string){
    this.teamService.getTeamById(teamId).subscribe((data: Team) => {
      this.team = data;
      console.log(data);
    },
    err => console.error(err));
  }

}
