import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService),
    router = inject(Router);
  const login = router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  if (!auth.token) return login;
  return auth.me().pipe(
    map(() => true),
    catchError(() => of(login)),
  );
};
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService),
    router = inject(Router);
  if (!auth.token) return router.createUrlTree(['/login']);
  return auth.me().pipe(
    map((user) => (user.role === 'ADMIN' ? true : router.createUrlTree(['/']))),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
