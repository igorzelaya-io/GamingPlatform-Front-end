import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-player-details-page',
  templateUrl: './player-details-page.component.html',
  styleUrls: ['./player-details-page.component.scss']
})
export class PlayerDetailsPageComponent implements OnInit {

  isAdmin = false;
  constructor(private tokenService: TokenStorageService) {

  }
  
  user: User = new User();
  
  ngOnInit(): void {
    
  }

}
