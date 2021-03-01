import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.scss']
})

export class AccountDetailsComponent implements OnInit {

  user: User;
  userTeams: Array<Team>;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
			  private router: Router) {
  		this.user = new User();
		this.userTeams = new Array<Team>();	
  }
  

  ngOnInit(): void {
	this.user = this.tokenService.getUser();
  }
  
  deleteUser(){
    this.userService.deleteUser(this.user.userId).subscribe(
      response => {
        console.log(response);
      },
      err => console.log(err)
    );
  }


}
