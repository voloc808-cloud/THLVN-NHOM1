import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { AppUser } from '../auth/auth.model';
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  update(data: Partial<AppUser>) {
    return this.http.patch<AppUser>(API_URL + '/users/me', data);
  }
  password(currentPassword: string, newPassword: string) {
    return this.http.patch<void>(API_URL + '/users/me/password', { currentPassword, newPassword });
  }
}
