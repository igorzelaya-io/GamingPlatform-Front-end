import { Component, OnInit } from '@angular/core';
import { D1Service } from '../../../models/d1service';
import { CartService } from 'src/app/services/cart.service';
import { BillingServiceService } from '../../../services/billing-service.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SliderTickEventArgs } from '@syncfusion/ej2-angular-inputs';
import { UserService } from 'src/app/services/user.service';
import { UserTokenRequest } from 'src/app/models/usertokenrequest';
import { MessageResponse } from 'src/app/models/messageresponse';

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

  paymentId: string = '';
  payerId: string = '';

  isSucessfulPayment = false;
  isEmptyCart: boolean = true;

  constructor(private cartService: CartService,
			  private billingService: BillingServiceService,
			  private tokenService: TokenStorageService,
			  private router: Router,
			  private route: ActivatedRoute,
			  private userService: UserService) {
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
	if(this.cartService.getAllServicesFromCart().length !== 0){
		return this.billingService.makePayment(this.totalAmountOnServices.toString(), this.tokenService.getToken())
		.subscribe((data: Map<string, object>) => {
			const mapValues = Object.values(data);
			if(mapValues.find(value => value === 'success') !== undefined){
				this.isSucessfulPayment = true;
				window.location.href= mapValues[0];
				this.route.queryParams.subscribe(params => {
					this.billingService.confirmPayment(params['paymentId'], params['payerId'], this.tokenService.getToken())
					.subscribe((data: any) => {
						if(data.get("status") as string === 'success'){
							this.isSucessfulPayment = true;
							return;
						}		
					});
				});
				this.isSucessfulPayment = false;
			}
		},
		err => console.error(err),
		() => {
			if(this.isSucessfulPayment){
				const d1services: D1Service[] = this.cartService.getAllServicesFromCart();
				d1services.forEach(d1service => {
					let userTokenRequest = new UserTokenRequest();
					userTokenRequest.service = d1service;
					userTokenRequest.user = this.tokenService.getUser();
					this.addTokensToUserInStorage(d1service);
					this.addTokensToUser(userTokenRequest);
				});
			}
		});	
	  }
	}

	public addTokensToUserInStorage(d1service: D1Service): void{
		this.tokenService.addTokensToSavedUser(d1service);
	}

  addTokensToUser(userTokenRequest: UserTokenRequest){
	return this.userService.updateUserTokens(userTokenRequest, this.tokenService.getToken())
	.subscribe((data: MessageResponse) => {
		console.log(data.message);
	},
	err => {
		console.error(err.error.message);
	});
  }
		
}
