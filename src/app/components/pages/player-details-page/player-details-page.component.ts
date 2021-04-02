import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user/user';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-details-page',
  templateUrl: './player-details-page.component.html',
  styleUrls: ['./player-details-page.component.scss']
})
export class PlayerDetailsPageComponent implements OnInit {

  isAdmin = false;
  user: User;

  userWinLossRatio: number;
  constructor(private tokenService: TokenStorageService,
              private route: ActivatedRoute) {
    this.user = new User();
  }
  
  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.user = JSON.parse(params['user']);
    });
  }

  calculateUserWinLossRatio(){

  }

}
