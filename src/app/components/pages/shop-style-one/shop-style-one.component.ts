import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from '../../../services/service-service.service';
import { D1Service } from '../../../models/d1service';

@Component({
  selector: 'app-shop-style-one',
  templateUrl: './shop-style-one.component.html',
  styleUrls: ['./shop-style-one.component.scss']
})
export class ShopStyleOneComponent implements OnInit {

  d1services: D1Service[];

  constructor(private serviceService: ServiceServiceService) {
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

}
