import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SharedService {

	element: any;
		
	set(element: any){
		this.element = element;
	}
	
	get(){
		return this.element;
	}
}
