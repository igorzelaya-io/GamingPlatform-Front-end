import { Component, OnInit } from '@angular/core';
import { D1Service } from '../../../models/d1service';
import { CartService } from 'src/app/services/cart.service';
import { BillingServiceService } from '../../../services/billing-service.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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

  constructor(private cartService: CartService,
			  private billingService: BillingServiceService,
			  private tokenService: TokenStorageService) {
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
	if(this.subTotalAmountOnServices <= 15){
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.03 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
	else if(this.subTotalAmountOnServices > 15 && this.subTotalAmountOnServices <= 30){
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.04 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
	else if(this.subTotalAmountOnServices > 30 && this.subTotalAmountOnServices <= 50){
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.05 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
	else if(this.subTotalAmountOnServices > 50 && this.subTotalAmountOnServices <= 100){
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.06 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
	else if(this.subTotalAmountOnServices > 100 && this.subTotalAmountOnServices <= 200){
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices * 0.07 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
	else{
		this.serviceFeeAmountOnServices = this.subTotalAmountOnServices *0.08 + 0.20;
		this.totalAmountOnServices = this.serviceFeeAmountOnServices + this.subTotalAmountOnServices;
		return;
	}
  }

  updateCart(){
	window.location.reload();	
  }

  makePayment(){
	this.billingService.makePayment(this.totalAmountOnServices.toString(), this.tokenService.getToken());	
  }
		
}
