import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { D1Service } from '../models/d1service';

const SERVICES_API = 'http:localhost:8081/servicesapi';

@Injectable({
  providedIn: 'root'
})
export class ServiceServiceService {

  constructor(private httpClient: HttpClient) {
  }

  userCart: D1Service[];

  public getAllServices(): Observable<D1Service[]>{
    return this.httpClient.get<D1Service[]>(SERVICES_API + '/services');
  }

  public getServiceById(serviceId: string):Observable<D1Service>{
    return this.httpClient.get<D1Service>(SERVICES_API + '/services/search?serviceId=' + serviceId);
  }

  public addServiceToUserCart(service: D1Service): void{
    this.userCart.push(service);
  }

  public removeItemFromCart(serviceName: string): void{
    const services: D1Service[] = this.getServiceFromCart(serviceName);
    let service: D1Service;
    services.forEach(d1service => service = d1service);
    this.userCart = this.userCart.filter(d1service => 
      d1service !== service);
  }

  public getServiceFromCart(serviceName: string): D1Service[] {
     const service: D1Service[] = this.userCart.filter((d1service: D1Service) => d1service.serviceName === serviceName);
     return service;
    }

}
