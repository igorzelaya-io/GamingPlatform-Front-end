import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from '../../../services/service-service.service';
import { D1Service } from '../../../models/d1service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shop-style-one',
  templateUrl: './shop-style-one.component.html',
  styleUrls: ['./shop-style-one.component.scss']
})
export class ShopStyleOneComponent implements OnInit {

  d1services: D1Service[];

  constructor(private serviceService: ServiceServiceService,
			  private cartService: CartService, 
			  private tokenService: TokenStorageService, 
			  private router: Router) {
	this.d1services = [];	
  }

  
  ngOnInit(): void {
	this.getAllServices();
  }

  public getAllServices(): void{
	this.serviceService.getAllServices()
	.subscribe((data: D1Service[]) => {
		console.log(data);
		this.d1services = data;		
	},
	(err) => {
		console.error(err);	
	});
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
