import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { D1Transaction } from '../models/d1transaction';

const BILLING_API = '/billing';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceService {

  constructor(private httpClient: HttpClient) {

  }

  public makePayment(paymnetSum: string, jwtToken: string): Observable<Map<string, object>> {
    return this.httpClient.post<Map<string, object>>(BILLING_API + '/pay?paymentSum=' + paymnetSum, 
	{ headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})});
  }

  public confirmPayment(paymentId: string, payerId: string, jwtToken: string):Observable<Map<string, object>>{
    return this.httpClient.post<Map<string, object>>(BILLING_API + '/complete?paymentId=' + paymentId
                                                                 + '?payerId=' + payerId , {headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})});
  }

  public savePayment(userId: string, transaction: D1Transaction, jwtToken: string): Observable<string>{
    return this.httpClient.post<string>(BILLING_API + '/save/payment?userId=' + userId,  transaction, 
	{headers: new HttpHeaders({'Authorization': 'Bearer ' + jwtToken})});
  }

}
