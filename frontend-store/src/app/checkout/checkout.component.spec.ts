import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { AuthService } from '../auth/auth.service';
describe('Checkout failure recovery', () => {
  it('retains cart and reuses request key when retrying failed checkout', () => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.inject(AuthService).user.set({
      _id: 'user-1',
      fullName: 'User',
      email: 'user@example.com',
      phone: '0901234567',
      address: 'Test',
      avatar: '',
      role: 'USER',
      isLocked: false,
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(CheckoutComponent),
      component = fixture.componentInstance,
      http = TestBed.inject(HttpTestingController);
    http
      .expectOne('/api/cart')
      .flush({ items: [{ productId: 'p1', quantity: 1, price: 100, name: 'Phone' }], total: 100 });
    component.submit();
    const first = http.expectOne('/api/orders');
    const key = first.request.headers.get('Idempotency-Key');
    expect(first.request.body.paymentMethod).toBe('COD');
    expect(first.request.body.total).toBeUndefined();
    first.flush({ message: 'Không đủ tồn kho' }, { status: 409, statusText: 'Conflict' });
    expect(component.cart().items.length).toBe(1);
    expect(component.busy()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    component.submit();
    const retry = http.expectOne('/api/orders');
    expect(retry.request.headers.get('Idempotency-Key')).toBe(key);
    retry.flush({ _id: 'order-1' });
    expect(navigate).toHaveBeenCalledWith(['/orders', 'order-1'], { queryParams: { success: 1 } });
    http.verify();
    sessionStorage.clear();
  });
});
