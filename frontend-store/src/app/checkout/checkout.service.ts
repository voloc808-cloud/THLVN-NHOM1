import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { Order } from '../orders/order.model';
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private http = inject(HttpClient);
  placeOrder(recipient: { fullName: string; phone: string; address: string }, key: string) {
    return this.http.post<Order>(
      API_URL + '/orders',
      { ...recipient, paymentMethod: 'COD' },
      { headers: { 'Idempotency-Key': key } },
    );
  }
}
