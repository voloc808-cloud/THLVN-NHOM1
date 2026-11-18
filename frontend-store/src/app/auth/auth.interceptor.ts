import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const isApi = request.url.startsWith('/api/');
  const token = auth.token;
  if (isApi && token) request = request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  return next(request).pipe(
    catchError((error) => {
      if (isApi && error.status === 401 && auth.token === token) auth.clear();
      return throwError(() => error);
    }),
  );
};
