import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';

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

  constructor(private route: ActivatedRoute) {
	this.tournament = new Tournament();
  }

  ngOnInit(): void {
  	this.route.queryParams.subscribe(params => {
		this.tournament = JSON.parse(params['tournament']);
	});
	this.getTournamentYear();
	this.getTournamentMonth();
	this.getTournamentTime();
	this.getTournamentMonthDate();
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

  public isPvPTournament(): boolean{
	if(this.tournament.tournamentFormat === 'PVP'){
		return true; 
	}
	return false; 
  }
  
}
