import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Tournament } from '../../../models/tournament/tournament';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tournament-creation-page',
  templateUrl: './tournament-creation-page.component.html',
  styleUrls: ['./tournament-creation-page.component.scss']
})

export class TournamentCreationPageComponent implements OnInit {
  txtName: FormControl;   
  txtDescription: FormControl;
  //txtLimitNumberOfTeams: number;
  txtPlatforms: FormControl;
  //tournamentTeamSize: TournamentTeamSize;
  tournamentModerator: User;
  tournamentDate: Date;
  tournamentRegion: FormControl;
  
  @ViewChild('tournamentDateTimeElement')
  tournamentDateElement: ElementRef;

  entryAndPriceForm: FormGroup;
 
  isSuccessfulTournamentInformationSubmission = false;
  isClicked = false;
  tournament: Tournament;

  constructor(private router: Router,
			  private route: ActivatedRoute,
			  @Inject(FormBuilder) private builder: FormBuilder) {
    this.txtName = new FormControl();
    this.txtPlatforms = new FormControl();
	this.tournamentRegion = new FormControl();
	this.txtDescription = new FormControl();
    this.tournament = new Tournament();
	this.tournamentModerator = new User();
    this.entryAndPriceForm = this.builder.group({
		entryFee: new FormControl(),
		cashPrize: new FormControl()	
	});
  }

  get entryFee(){
	return this.entryAndPriceForm.get('entryFee') as FormControl;	
  }

  get cashPrice(){
	return this.entryAndPriceForm.get('cashPrize') as FormControl;	
  }

  ngOnInit(): void {
  	this.route.queryParams
	.subscribe((params: User) => {
		this.tournamentModerator = params['user'];
	});
  	this.tournament.tournamentModerator = this.tournamentModerator;
  }

  clickedButton(): void{
    this.isClicked = true;
  }

  public onSubmit(): void{
   	this.tournament.tournamentName = this.txtName.value;
	this.tournament.tournamentDescription = this.txtDescription.value;
	this.tournament.tournamentCashPrice = this.cashPrice.value;
	this.tournament.tournamentEntryFee = this.entryFee.value;
	if(this.txtName.valid && this.txtDescription.valid && this.cashPrice.valid && this.entryFee.valid){
		this.router.navigate(['/tournament-creation-config'], {queryParams: {tournament: this.tournament}}); 	
	}
	return; 
  }

}
