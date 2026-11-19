import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/api';
import { Product } from '../../products/product.model';
@Injectable({ providedIn: 'root' })
export class AdminProductsService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<Product[]>(API_URL + '/admin/products');
  }
  save(data: Omit<Product, '_id'>, id: string) {
    return id
      ? this.http.put<Product>(API_URL + '/admin/products/' + id, data)
      : this.http.post<Product>(API_URL + '/admin/products', data);
  }
  remove(id: string) {
    return this.http.delete<void>(API_URL + '/admin/products/' + id);
  }
}
