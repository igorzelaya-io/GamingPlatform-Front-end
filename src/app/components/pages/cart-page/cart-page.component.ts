import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from '../../../services/service-service.service';
import { D1Service } from '../../../models/d1service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {

  servicesOnCart: D1Service[] = [];  

  constructor(private serviceService: ServiceServiceService) {
  }

  ngOnInit(): void {
 	this.getAllServicesFromCart();
  }
	
  getAllServicesFromCart(){
	this.servicesOnCart = this.serviceService.getAllServicesFromCart();
  }  

  removeServiceFromCart(serviceToRemove: D1Service){
	this.serviceService.removeItemFromCart(serviceToRemove.serviceName);	
  }
}
