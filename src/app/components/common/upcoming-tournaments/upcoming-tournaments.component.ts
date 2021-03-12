import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from 'src/app/models/tournament/tournament';
import { TournamentService } from '../../../services/tournament/tournament.service';

const monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

const weekNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Component({
  selector: 'app-upcoming-tournaments',
  templateUrl: './upcoming-tournaments.component.html',
  styleUrls: ['./upcoming-tournaments.component.scss']
})
export class UpcomingTournamentsComponent implements OnInit {

  allTournaments: Tournament[];

  allTournamentMonthDates: number[];

  allTournamentYears: number[];

  allTournamentMonths: string[];

  allTournamentTime: string[];
 
  allTournamentWeekDays: string[];
  
  isEmptyTournaments = false;

  constructor(private tournamentService: TournamentService,
			  private router: Router) {
	this.allTournaments = [];
	this.allTournamentMonths = [];
	this.allTournamentTime = [];
 	this.allTournamentMonthDates = [];
	this.allTournamentYears = [];
	this.allTournamentWeekDays = [];
  }

  ngOnInit(): void {
  	this.getAllTournamentsAfterOneWeek();
  }

  getAllTournamentsAfterOneWeek(){
	this.tournamentService.getAllTournamentsAfterOneWeek()
	.subscribe((data: Tournament[]) => {
		if(data && data.length !== 0){
			this.allTournaments = data;
			this.getAllTournamentsYear(data);
			this.getAllTournamentsMonth(data);
			this.getAllTournamentsMonthDates(data);
			this.getAllTournamentsTime(data);
			this.getAllTournamentsWeekDay(data);
			this.isEmptyTournaments = false;
			return;
		}
		this.isEmptyTournaments = true;	
	},
	err => {
		console.error(err.error.message);
		this.isEmptyTournaments = true;
	});
  }

  public getAllTournamentsYear(tournaments: Tournament[]){
	for(let i = 0 ; i < tournaments.length; i++){
		this.allTournamentYears.push(new Date(tournaments[i].tournamentDate).getFullYear());
	}	
  }

  public getAllTournamentsMonth(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentMonths.push(monthNames[new Date(tournaments[i].tournamentDate).getMonth()]);
	}		
  }

  public getAllTournamentsMonthDates(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentMonthDates.push(new Date(tournaments[i].tournamentDate).getDate());
	}
  }

  getAllTournamentsTime(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentTime.push(tournaments[i].tournamentDate.toString().slice(11, 19) +
									 '  ' + new Date(tournaments[i].tournamentDate).toString()
											.match(/([A-Z]+[\+-][0-9]+)/)[1]);
	}
  }

  getAllTournamentsWeekDay(tournaments: Tournament[]){
	for(let i = 0; i < tournaments.length; i++){
		this.allTournamentWeekDays.push(weekNames[new Date(tournaments[i].tournamentDate).getDay()]);
	}
  }
	

  public viewTournament(tournament: Tournament){
	this.router.navigate(['tournament-details'], {queryParams: {tournament: JSON.stringify(tournament)}});
  }

  public isWarzoneTournament(tournament: Tournament): boolean{
	if(tournament.tournamentGame === 'Call Of Duty' && tournament.tournamentCodGameMode === 'Warzone'){
		return true;
	}
	return false; 
  }

  public isCDLTournament(tournament: Tournament): boolean{
  	if(tournament.tournamentGame === 'Call Of Duty' && tournament.tournamentCodGameMode === 'CDL'){
		return true;
	}
	return false; 
  }	

  public isFifaTournament(tournament: Tournament): boolean{
	if(tournament.tournamentGame === 'Fifa'){
		return true;
	}
	return false;
  }
  
  public isPvPTournament(tournament: Tournament): boolean{
	if(tournament.tournamentFormat === 'PVP'){
		return true; 
	}
	return false; 
  }

}
