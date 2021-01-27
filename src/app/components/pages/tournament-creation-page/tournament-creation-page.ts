import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeamService } from '../../../services/team/team-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../../models/team';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user.service';
import { TournamentTeamSize } from '../../../models/tournament/tournament-team-size.enum';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentMode } from '../../../models/tournament/tournament-mode.enum';
import { TournamentFormat } from '../../../models/tournament/tournament-format.enum';
import { TournamentService } from '../../../services/tournament/tournament.service';

@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtLimitNumberOfTeams: number;
  txtPlatforms: FormControl;
  tournamentTeamSize: TournamentTeamSize;
  tournamentGameMode: TournamentMode;
  tournamentFormat: TournamentFormat;
  tournamentModerator: User;
  tournamentDate: Date;
  tournamentCashPrice: FormControl;
  tournamentEntryFee: FormControl;
  tournamentRegion: FormControl;
  tournamentTeams: Array<Team>;
  
  message = ' ';
  errorMessage = ' ';
 
  isSuccessfulTournamentCreation = false;
  isSubmittedDropDownContent = true;
  isClicked = false;
  tournament: Tournament = new Tournament();

  constructor(private tournamentService: TournamentService) {
    this.txtName = new FormControl();
    
  }

  ngOnInit(): void {
   
  }


  onSubmit(){
    
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  //dropdownOnSubmit(): void{
    //if (this.txtCountry.valid){
      //this.isSubmittedDropDownContent = true;
      //return
    //}
    //this.isSubmittedDropDownContent = false;
  //}

}
