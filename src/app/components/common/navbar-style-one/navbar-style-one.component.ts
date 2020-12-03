import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-navbar-style-one',
    templateUrl: './navbar-style-one.component.html',
    styleUrls: ['./navbar-style-one.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class NavbarStyleOneComponent implements OnInit {

    location: any;
    containerClass: any;

    isAuthenticated = false;
    user: User = new User();
    
    constructor(private router: Router,
                location: Location,
                private tokenService: TokenStorageService
                ) {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.location = this.router.url;
                    if (this.location == '/bosting' || this.location == '/magazine' || this.location == '/tournaments' 
                        || this.location == '/streaming') {
                        this.containerClass = 'container';
                    } else {
                        this.containerClass = 'container-fluid';
                    }
                }
            });
    }

    logOut(){
        this.tokenService.signOut();
        window.location.reload();
    }

    ngOnInit(): void {
        this.isAuthenticated = !!this.tokenService.getToken();
    }
    
}