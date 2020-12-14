import { Component, OnInit } from '@angular/core';
import { ServiceServiceService } from '../../../services/service-service.service';
import { from } from 'rxjs';
import { D1Service } from 'src/app/models/d1service';
@Component({
  selector: 'app-shop-style-two',
  templateUrl: './shop-style-two.component.html',
  styleUrls: ['./shop-style-two.component.scss']
})
export class ShopStyleTwoComponent implements OnInit {

  constructor(private serviceServiceService: ServiceServiceService) {

  }
  services: D1Service[] = [];

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices(): void{
    this.serviceServiceService.getAllServices().subscribe(
      (data: D1Service[]) => {
        console.log(data);
        this.services = data;
      },
      err => {
        console.error(err);
      }
    );
  }

}
