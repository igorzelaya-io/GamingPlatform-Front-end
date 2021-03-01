import { Component, OnInit } from '@angular/core';
import { D1Service } from '../../../models/d1service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})


export class CartPageComponent implements OnInit {

  servicesOnCart: D1Service[]; 
 
  subTotalAmountOnServices:number;

  serviceFeeAmountOnServices: number;

  totalAmountOnServices: number;

  isEmptyCart: boolean = true;

  constructor(private cartService: CartService) {
  	this.servicesOnCart = [];
	this.subTotalAmountOnServices = 0;
	this.serviceFeeAmountOnServices = 0;
  	this.totalAmountOnServices = 0;
  }

  ngOnInit(): void {
	if(!this.isEmpty()){
		this.isEmptyCart = false;
		this.getAllServicesFromCart();
  		this.computeTotalAndSubTotal();	
	}
  }

  isEmpty(): boolean{
	if(this.cartService.isEmptyCart()){
		return true; 
	}	
	return false;
  }

  getAllServicesFromCart(): void{
	this.servicesOnCart = this.cartService.getAllServicesFromCart();
  }

  removeServiceFromCart(service: D1Service){
	this.cartService.deleteServiceFromCart(service);
	this.updateCart();
  }

  computeTotalAndSubTotal(){
	let userItemsOnCart: D1Service[]  = this.cartService.getAllServicesFromCart();
    userItemsOnCart.forEach(service => {
		this.subTotalAmountOnServices += service.serviceChargeAmount;
	});
	
	this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.06;
	this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
  }

  updateCart(){
	window.location.reload();	
  }
		
}
