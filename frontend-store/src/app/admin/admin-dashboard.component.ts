import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './admin.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  data = signal<{ products: number; users: number; orders: number; revenue: number } | null>(null);
  error = signal('');
  constructor() {
    inject(AdminService)
      .dashboard()
      .subscribe({ next: (d) => this.data.set(d), error: (e) => this.error.set(errorMessage(e)) });
  }
}
