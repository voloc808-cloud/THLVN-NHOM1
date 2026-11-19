import { Component, inject, signal } from '@angular/core';
import { AdminUsersService } from './admin-users.service';
import { AppUser } from '../../auth/auth.model';
import { errorMessage } from '../../core/api';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  private api = inject(AdminUsersService);
  items = signal<AppUser[]>([]);
  selected = signal<AppUser | null>(null);
  error = signal('');
  busy = signal(false);
  constructor() {
    this.api
      .list()
      .subscribe({ next: (u) => this.items.set(u), error: (e) => this.error.set(errorMessage(e)) });
  }
  toggle(u: AppUser) {
    this.busy.set(true);
    this.api.lock(u._id, !u.isLocked).subscribe({
      next: (updated) => {
        this.items.update((items) => items.map((i) => (i._id === u._id ? updated : i)));
        if (this.selected()?._id === u._id) this.selected.set(updated);
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
}
