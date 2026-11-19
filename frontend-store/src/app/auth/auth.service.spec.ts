import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { adminGuard } from './auth.guard';
describe('Authentication and permissions', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    localStorage.clear();
  });
  it('stores token and sends it only to API requests', () => {
    auth.login('user@example.com', 'Password123').subscribe();
    const login = http.expectOne('/api/auth/login');
    expect(login.request.body.email).toBe('user@example.com');
    login.flush({ token: 'valid-token', user: { _id: '1', fullName: 'User', role: 'USER' } });
    expect(auth.token).toBe('valid-token');
    auth.me().subscribe();
    const me = http.expectOne('/api/auth/me');
    expect(me.request.headers.get('Authorization')).toBe('Bearer valid-token');
    me.flush({ _id: '1', fullName: 'User', role: 'USER' });
    TestBed.inject(HttpClient).get('https://example.com/image').subscribe();
    const external = http.expectOne('https://example.com/image');
    expect(external.request.headers.has('Authorization')).toBe(false);
    external.flush({});
  });
  it('clears session when API returns expired JWT', () => {
    localStorage.setItem('phone-store.token', 'expired');
    auth.me().subscribe({ error: () => {} });
    http
      .expectOne('/api/auth/me')
      .flush({ message: 'Expired' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBeNull();
    expect(auth.user()).toBeNull();
  });
  it('admin guard checks server role rather than client storage', async () => {
    localStorage.setItem('phone-store.token', 'user-token');
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any),
    ) as Observable<boolean | UrlTree>;
    const pending = firstValueFrom(result);
    http.expectOne('/api/auth/me').flush({ _id: '1', fullName: 'User', role: 'USER' });
    expect(TestBed.inject(Router).serializeUrl((await pending) as UrlTree)).toBe('/');
  });
});
