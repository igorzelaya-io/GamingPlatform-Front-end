import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from 'src/app/services/service-service.service';
import { D1Service } from 'src/app/models/d1service';

@Component({
  selector: 'app-products-list-page-two',
  templateUrl: './products-list-page-two.component.html',
  styleUrls: ['./products-list-page-two.component.scss']
})
export class ProductsListPageTwoComponent implements OnInit {

  constructor(private serviceServiceService: ServiceServiceService) {

  }

  services: D1Service[] = [];
  isSuccessful = false;
  service: D1Service = new D1Service();

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(){
    this.serviceServiceService.getAllServices().subscribe(
      data => {
        console.log(data);
        this.services = data;
        this.isSuccessful = true;
      },
      err => {
        console.error(err);
        this.isSuccessful = false;
      }
    );
  }
  onSubmit(){
    
  
  }
}