import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-main-banner',
  templateUrl: './main-banner.component.html',
  styleUrls: ['./main-banner.component.scss']
})
export class MainBannerComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private tokenService: TokenStorageService) {

  }

  ngOnInit(): void {
    this.evaluateLogin();
  }

  evaluateLogin(){
    if(this.tokenService.loggedIn()){
      this.isLoggedIn = true;
      return;
    }
  }

}
