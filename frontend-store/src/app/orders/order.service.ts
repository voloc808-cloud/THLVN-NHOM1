import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { Order } from './order.model';
@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  listOrders() {
    return this.http.get<Order[]>(API_URL + '/orders');
  }
  detail(id: string) {
    return this.http.get<Order>(API_URL + '/orders/' + id);
  }
}
