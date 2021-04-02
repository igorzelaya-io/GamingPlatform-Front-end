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
      this.team = JSON.parse(params['team']);
    });
  }


}
