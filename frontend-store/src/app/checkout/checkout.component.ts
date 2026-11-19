import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.model';
import { AuthService } from '../auth/auth.service';
import { CheckoutService } from './checkout.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private api = inject(CheckoutService);
  private cartApi = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);
  cart = signal<Cart>({ items: [], total: 0 });
  loading = signal(true);
  busy = signal(false);
  error = signal('');
  form = {
    fullName: this.auth.user()?.fullName || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
  };
  private keyName = 'phone-store.checkout.' + this.auth.user()?._id;
  private key = sessionStorage.getItem(this.keyName) || crypto.randomUUID();
  constructor() {
    sessionStorage.setItem(this.keyName, this.key);
    this.cartApi.getCart().subscribe({
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
  submit() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.api.placeOrder(this.form, this.key).subscribe({
      next: (order) => {
        sessionStorage.removeItem(this.keyName);
        this.router.navigate(['/orders', order._id], { queryParams: { success: 1 } });
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorMessage(e));
      },
    });
  }
}
