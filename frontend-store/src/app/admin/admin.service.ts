import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  dashboard() {
    return this.http.get<{ products: number; users: number; orders: number; revenue: number }>(
      API_URL + '/admin/dashboard',
    );
  }
}
