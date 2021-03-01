import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from '../../../services/service-service.service';
import { from } from 'rxjs';
import { D1Service } from 'src/app/models/d1service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop-style-two',
  templateUrl: './shop-style-two.component.html',
  styleUrls: ['./shop-style-two.component.scss']
})
export class ShopStyleTwoComponent implements OnInit {

  allServices: D1Service[];

  constructor(private serviceServiceService: ServiceServiceService,
			  private tokenService: TokenStorageService,
		      private cartService: CartService,
			  private router: Router) {
	this.allServices = [];
  }

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(): void{
    this.serviceServiceService.getAllServices().subscribe(
      (data: D1Service[]) => {
        console.log(data);
        this.allServices = data;
      },
      err => {
        console.error(err);
      }
    );
  }

  addServiceToCart(serviceToAdd: D1Service){
	if(this.tokenService.loggedIn()){
		if(this.cartService.isEmptyCart()){
			this.cartService.addServicesToCart([]);
			this.cartService.addServiceToCart(serviceToAdd);
			this.router.navigate(['/cart']);
			return;
		}
		this.cartService.addServiceToCart(serviceToAdd);
		this.router.navigate(['/cart']);
		return;
	}
	this.router.navigate(['/login']);
  }
}
