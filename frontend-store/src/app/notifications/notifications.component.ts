import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-notifications',
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private api = inject(NotificationService);
  items = signal<Notification[]>([]);
  error = signal('');
  loading = signal(true);
  constructor() {
    this.api.list().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.loading.set(false);
      },
    });
  }
  read(item: Notification) {
    this.api
      .read(item._id)
      .subscribe({
        next: (updated) =>
          this.items.update((items) => items.map((i) => (i._id === updated._id ? updated : i))),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
