import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { Product } from './product.model';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  getProducts(search = '') {
    return this.http.get<Product[]>(API_URL + '/products', { params: { search } });
  }
  getProductById(id: string) {
    return this.http.get<Product>(API_URL + '/products/' + id);
  }
}
