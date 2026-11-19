import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { Notification } from './notification.model';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<Notification[]>(API_URL + '/notifications');
  }
  read(id: string) {
    return this.http.patch<Notification>(API_URL + '/notifications/' + id + '/read', {});
  }
}
