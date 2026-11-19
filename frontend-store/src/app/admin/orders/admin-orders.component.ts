import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrdersService } from './admin-orders.service';
import { Order, OrderStatus, STATUS_LABELS, STATUS_NEXT } from '../../orders/order.model';
import { errorMessage } from '../../core/api';
@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  private api = inject(AdminOrdersService);
  items = signal<Order[]>([]);
  selected = signal<Order | null>(null);
  error = signal('');
  busy = signal(false);
  labels = STATUS_LABELS;
  next = STATUS_NEXT;
  constructor() {
    this.api
      .list()
      .subscribe({ next: (o) => this.items.set(o), error: (e) => this.error.set(errorMessage(e)) });
  }
  update(o: Order, status: OrderStatus) {
    if (status === 'CANCELLED' && !confirm('Hủy đơn hàng và hoàn tồn kho?')) return;
    this.busy.set(true);
    this.error.set('');
    this.api.status(o._id, status).subscribe({
      next: (updated) => {
        this.items.update((items) => items.map((i) => (i._id === o._id ? updated : i)));
        if (this.selected()?._id === o._id) this.selected.set(updated);
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
}
