import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Match } from '../../../models/match';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-matchbracket',
  templateUrl: './matchbracket.component.html',
  styleUrls: ['./matchbracket.component.scss']
})
export class MatchbracketComponent implements OnInit {

  @Input() 
  matches: any;

  constructor() {
  }

  ngOnInit(): void {
    
  }  

}
