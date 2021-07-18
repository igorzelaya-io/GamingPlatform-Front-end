import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Match } from '../../../models/match';
import { Team } from '../../../models/team';
import { BinaryTree } from 'src/app/models/binarytree';

@Component({
  selector: 'app-matchbracket',
  templateUrl: './matchbracket.component.html',
  styleUrls: ['./matchbracket.component.scss']
})
export class MatchbracketComponent implements OnInit {

  @Input() 
  public tournamentBracketTree: any;

  constructor() {
  
  }
  
  ngOnInit(): void {
    
  }  

}
