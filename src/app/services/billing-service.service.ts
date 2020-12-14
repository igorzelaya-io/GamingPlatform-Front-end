import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { D1Transaction } from '../models/d1transaction';

const BILLING_API = 'http://localhost:8080/paypal';

@Injectable({
  providedIn: 'root'
})
export class BillingServiceService {

  constructor(private httpClient: HttpClient) {

  }

  public makePayment(paymnetSum: string): Observable<Map<string, object>> {
    return this.httpClient.post<Map<string, object>>(BILLING_API + '/pay?paymentSum=' + paymnetSum, {});
  }

  public confirmPayment(paymentId: string, payerId: string):Observable<Map<string, object>>{
    return this.httpClient.post<Map<string, object>>(BILLING_API + '/complete?paymentId=' + paymentId
                                                                 + '&payerId=' + payerId , {});
  }

  public savePayment(userId: string, transaction: D1Transaction): Observable<string>{
    return this.httpClient.post<string>(BILLING_API + '/save/payment?userId=' + userId,  transaction);
  }

}
