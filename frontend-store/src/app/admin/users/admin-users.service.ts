import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/api';
import { AppUser } from '../../auth/auth.model';
@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<AppUser[]>(API_URL + '/admin/users');
  }
  lock(id: string, isLocked: boolean) {
    return this.http.patch<AppUser>(API_URL + '/admin/users/' + id + '/lock', { isLocked });
  }
}
