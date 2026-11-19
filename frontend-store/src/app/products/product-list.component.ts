import { Component, inject, signal, DestroyRef } from '@angular/core';
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
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  private productsApi = inject(ProductService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  message = signal('');
  adding = signal('');
  search = '';
  constructor() {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(),
        switchMap((params) => {
          this.search = params.get('search') || '';
          this.loading.set(true);
          this.error.set('');
          return this.productsApi.getProducts(this.search).pipe(
            catchError((e) => {
              this.error.set(errorMessage(e));
              return of([]);
            }),
          );
        }),
      )
      .subscribe((items) => {
        this.products.set(items);
        this.loading.set(false);
      });
  }
  find() {
    this.router.navigate(['/products'], { queryParams: { search: this.search || null } });
  }
  add(product: Product) {
    if (!this.auth.token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/products/detail/' + product._id },
      });
      return;
    }
    this.adding.set(product._id);
    this.cart.addToCart(product._id).subscribe({
      next: () => {
        this.message.set('Đã thêm ' + product.name + ' vào giỏ hàng.');
        this.adding.set('');
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.adding.set('');
      },
    });
  }
  imageError(event: Event) {
    (event.target as HTMLImageElement).src = '/phone-placeholder.svg';
  }
}
