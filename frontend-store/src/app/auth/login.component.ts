import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { errorMessage } from '../core/api';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  email = '';
  password = '';
  error = signal('');
  busy = signal(false);
  submit() {
    this.busy.set(true);
    this.error.set('');
    this.auth
      .login(this.email, this.password)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (result) => {
          const target = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(
            result.user.role === 'ADMIN'
              ? '/admin'
              : target?.startsWith('/') && !target.startsWith('//')
                ? target
                : '/',
          );
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
