import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user/user';
import { Match } from 'src/app/models/match';
import { TeamTournamentService } from 'src/app/services/team/team-tournament.service';

@Component({
  selector: 'app-match-details-page',
  templateUrl: './match-details-page.component.html',
  styleUrls: ['./match-details-page.component.scss']
})
export class MatchDetailsPageComponent implements OnInit {

  userInspectingMatch: User;
  match: Match;

  constructor(private route: ActivatedRoute,
              private tokenService: TokenStorageService,
              private teamTournamentService: TeamTournamentService) {
    this.match = new Match();
  }

  ngOnInit(): void {
    this.userInspectingMatch = this.tokenService.getUser();
    this.route.queryParams.subscribe(params => {
      this.getMatchFromTournament(params['matchId'], params['tournamentId']);
    });

  }

  public getMatchFromTournament(matchId:string, tournamentId: string){
    this.teamTournamentService.getTeamMatchFromTournament(matchId, tournamentId)
    .subscribe((data: Match) => {
      if(data){
        console.log(data); 
        this.match = data;
      }
    }, err => {
      console.error(err);
    });
  }
  
  hasTeamAdminRole(){
    
  }
}
