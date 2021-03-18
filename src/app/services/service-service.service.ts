import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { D1Service } from '../models/d1service';


const SERVICES_API = '/servicesapi';

const httpOptions = {
	headers: new HttpHeaders({'Content-Type': 'application/json',
							   'Access-Control-Allow-Origin': '*'})
};

@Injectable({
  providedIn: 'root'
})
export class ServiceServiceService {

  constructor(private httpClient: HttpClient) {
  }

  userCart: D1Service[] = [];

  public getAllServices(): Observable<D1Service[]>{
    return this.httpClient.get<D1Service[]>(SERVICES_API + '/services', httpOptions);
  }

  public getServiceById(serviceId: string):Observable<D1Service>{
    return this.httpClient.get<D1Service>(SERVICES_API + '/services/search?serviceId=' + serviceId, httpOptions);
  }

}
