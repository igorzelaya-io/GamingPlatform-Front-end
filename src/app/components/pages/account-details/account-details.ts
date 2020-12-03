import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { User } from '../../../models/user';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.html',
  styleUrls: ['./account-details.scss']
})

export class AccountDetailsComponent implements OnInit {

  isAdmin = false;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService) {
  }
  user: User = new User();

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    if (this.user.userRoles.includes('ROLE_ADMIN') || this.tokenService.getToken()){
      this.isAdmin = true;
    }
  }

  updateUser(){
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
