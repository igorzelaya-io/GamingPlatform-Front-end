import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { User } from '../../../models/user/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.scss']
})

export class AccountDetailsComponent implements OnInit {

  isAdmin = false;
  user: User;
  userTeams: Array<Team>;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
			  private route: ActivatedRoute) {
  	this.user = new User();
	this.userTeams = new Array<Team>();	
	}
  

  ngOnInit(): void {
  	this.route.queryParams
	.subscribe(params => {
		this.userService.getUserById(params.userId)
		.subscribe((data: User) => {
			console.log(data);
			this.user = data;
		},
		err => {
			console.error(err.error.error)
		});
	});
  	if(this.tokenService.getUserId() === this.user.userId){
		this.isAdmin = true;
	}
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
