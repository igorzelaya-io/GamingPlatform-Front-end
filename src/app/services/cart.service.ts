import { Injectable } from '@angular/core';
import { D1Service } from '../models/d1service';

const CART_KEY = 'user-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {
	
  }

  addServicesToCart(serviceToAdd: D1Service[]){
	sessionStorage.removeItem(CART_KEY);
	sessionStorage.setItem(CART_KEY, JSON.stringify(serviceToAdd));
  }
 
  addServiceToCart(serviceToAdd: D1Service){
	let currentServicesOnCart: D1Service[] = JSON.parse(sessionStorage.getItem(CART_KEY));	
  	currentServicesOnCart.push(serviceToAdd);
    sessionStorage.setItem(CART_KEY, JSON.stringify(currentServicesOnCart));
   }


  getServiceFromCart(serviceId: string): D1Service[]{
	let currentServicesOnCart: D1Service[] = JSON.parse(sessionStorage.getItem(CART_KEY));
  	return currentServicesOnCart.filter(service => service.serviceId === serviceId);
  }

  getAllServicesFromCart(): D1Service[]{
	return JSON.parse(sessionStorage.getItem(CART_KEY));
  }

  deleteAllServicesFromCart(): void{
	sessionStorage.clear();
  }

  deleteServiceFromCart(service: D1Service): void{
	let currentServicesFromCart: D1Service[] = JSON.parse(sessionStorage.getItem(CART_KEY));
  	sessionStorage.setItem(CART_KEY, JSON.stringify(currentServicesFromCart.filter(service => service.serviceId !== service.serviceId)));
  }

  isEmptyCart(): boolean{
	if( Array.isArray(JSON.parse(sessionStorage.getItem(CART_KEY))) ){
		let arrayOnStorage: D1Service[] = JSON.parse(sessionStorage.getItem(CART_KEY));
		if(arrayOnStorage.length !== 0){
			return false;
		}
	} 
	return true;
  }

  

}
