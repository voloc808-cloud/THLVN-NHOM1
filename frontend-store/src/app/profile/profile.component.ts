import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private api = inject(ProfileService);
  private router = inject(Router);
  form = {
    fullName: this.auth.user()?.fullName || '',
    email: this.auth.user()?.email || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
    avatar: this.auth.user()?.avatar || '',
  };
  currentPassword = '';
  newPassword = '';
  error = signal('');
  message = signal('');
  busy = signal(false);
  save() {
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    this.api.update(this.form).subscribe({
      next: (u) => {
        this.auth.user.set(u);
        this.message.set('Đã cập nhật thông tin.');
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
  password() {
    this.busy.set(true);
    this.error.set('');
    this.api.password(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.auth.clear();
        this.router.navigate(['/login'], { queryParams: { passwordChanged: 1 } });
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
}
