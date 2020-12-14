import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
@Component({
  selector: 'app-popular-leagues',
  templateUrl: './popular-leagues.component.html',
  styleUrls: ['./popular-leagues.component.scss']
})
export class PopularLeaguesComponent implements OnInit {

  isAuthenticated = false;
  constructor(private tokenService: TokenStorageService, 
              private router: Router) {

   }

   user: User = new User();

   isAuthenticatedButton(){
    if(this.isAuthenticated){
      this.router.navigate(['/tournament-creation'], {queryParams: { user: this.user}});
      return;
    }
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    this.isAuthenticated = !!this.tokenService.getToken();
    if(this.isAuthenticated){
      this.user = this.tokenService.getUser();
    }
  }

}
