import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from './order.service';
import { Order, STATUS_LABELS } from './order.model';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  private route = inject(ActivatedRoute);
  order = signal<Order | null>(null);
  error = signal('');
  labels = STATUS_LABELS;
  success = this.route.snapshot.queryParamMap.has('success');
  constructor() {
    inject(OrderService)
      .detail(this.route.snapshot.paramMap.get('id') || '')
      .subscribe({ next: (o) => this.order.set(o), error: (e) => this.error.set(errorMessage(e)) });
  }
}
