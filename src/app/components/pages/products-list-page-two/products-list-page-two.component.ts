import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from 'src/app/services/service-service.service';
import { D1Service } from 'src/app/models/d1service';
import { CartService } from 'src/app/services/cart.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list-page-two',
  templateUrl: './products-list-page-two.component.html',
  styleUrls: ['./products-list-page-two.component.scss']
})
export class ProductsListPageTwoComponent implements OnInit {

  allServices: D1Service[];

  constructor(private serviceServiceService: ServiceServiceService,
              private cartService: CartService,
			  private tokenService: TokenStorageService,
	          private router: Router) {
	this.allServices = [];

  }

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(){
    this.serviceServiceService.getAllServices().subscribe(
      (data: D1Service[]) => {
        console.log(data);
        this.allServices = data;
      },
      err => {
        console.error(err.error.message);
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