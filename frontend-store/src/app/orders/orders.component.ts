import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from './order.service';
import { Order, STATUS_LABELS } from './order.model';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  orders = signal<Order[]>([]);
  error = signal('');
  loading = signal(true);
  labels = STATUS_LABELS;
  constructor() {
    inject(OrderService)
      .listOrders()
      .subscribe({
        next: (items) => {
          this.orders.set(items);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(errorMessage(e));
          this.loading.set(false);
        },
      });
  }
}
