import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private api = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  product = signal<Product | null>(null);
  error = signal('');
  message = signal('');
  loading = signal(true);
  busy = signal(false);
  quantity = 1;
  constructor() {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(),
        switchMap((params) => {
          this.loading.set(true);
          this.error.set('');
          return this.api.getProductById(params.get('id') || '').pipe(
            catchError((e) => {
              this.error.set(errorMessage(e));
              return of(null);
            }),
          );
        }),
      )
      .subscribe((p) => {
        this.product.set(p);
        this.loading.set(false);
      });
  }
  addToCart(buy = false) {
    const p = this.product();
    if (!p) return;
    if (!this.auth.token) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.busy.set(true);
    this.cart.addToCart(p._id, this.quantity).subscribe({
      next: () => {
        this.busy.set(false);
        if (buy) this.router.navigate(['/checkout']);
        else this.message.set('Đã thêm vào giỏ hàng.');
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorMessage(e));
      },
    });
  }
  imageError(event: Event) {
    (event.target as HTMLImageElement).src = '/phone-placeholder.svg';
  }
}
