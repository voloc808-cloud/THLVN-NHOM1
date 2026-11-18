import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';
import { Cart } from './cart.model';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private api = inject(CartService);
  cart = signal<Cart>({ items: [], total: 0 });
  loading = signal(true);
  busy = signal(false);
  error = signal('');
  constructor() {
    this.api.getCart().subscribe({
      next: (c) => {
        this.cart.set(c);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.loading.set(false);
      },
    });
  }
  update(id: string, quantity: number) {
    this.busy.set(true);
    this.error.set('');
    (quantity < 1 ? this.api.remove(id) : this.api.updateQuantity(id, quantity)).subscribe({
      next: (c) => {
        this.cart.set(c);
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
  imageError(e: Event) {
    (e.target as HTMLImageElement).src = '/phone-placeholder.svg';
  }
}
