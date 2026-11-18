import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from './cart.model';
import { API_URL } from '../core/api';
@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  getCart() {
    return this.http.get<Cart>(API_URL + '/cart');
  }
  addToCart(productId: string, quantity = 1) {
    return this.http.post<Cart>(API_URL + '/cart/items', { productId, quantity });
  }
  updateQuantity(productId: string, quantity: number) {
    return this.http.patch<Cart>(API_URL + '/cart/items/' + productId, { quantity });
  }
  remove(productId: string) {
    return this.http.delete<Cart>(API_URL + '/cart/items/' + productId);
  }
}
