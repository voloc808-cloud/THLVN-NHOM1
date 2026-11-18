import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/api';
import { Order, OrderStatus } from '../../orders/order.model';
@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<Order[]>(API_URL + '/admin/orders');
  }
  status(id: string, status: OrderStatus) {
    return this.http.patch<Order>(API_URL + '/admin/orders/' + id + '/status', { status });
  }
}
