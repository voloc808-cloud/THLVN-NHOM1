import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  form = { fullName: '', email: '', password: '', phone: '', address: '' };
  error = signal('');
  busy = signal(false);
  submit() {
    this.busy.set(true);
    this.error.set('');
    this.auth
      .register(this.form)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { registered: 1 } }),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
