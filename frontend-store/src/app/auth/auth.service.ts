import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from '../core/api';
import { AppUser, Registration } from './auth.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  readonly user = signal<AppUser | null>(null);
  get token() {
    return localStorage.getItem('phone-store.token');
  }
  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: AppUser }>(API_URL + '/auth/login', { email, password })
      .pipe(
        tap((result) => {
          localStorage.setItem('phone-store.token', result.token);
          this.user.set(result.user);
        }),
      );
  }
  register(data: Registration) {
    return this.http.post<AppUser>(API_URL + '/auth/register', data);
  }
  me() {
    return this.http.get<AppUser>(API_URL + '/auth/me').pipe(tap((user) => this.user.set(user)));
  }
  logout() {
    return this.http.post<void>(API_URL + '/auth/logout', {}).pipe(tap(() => this.clear()));
  }
  clear() {
    localStorage.removeItem('phone-store.token');
    this.user.set(null);
  }
  isAdmin() {
    return this.user()?.role === 'ADMIN';
  }
}
