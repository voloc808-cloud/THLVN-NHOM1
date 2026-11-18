import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './auth/auth.guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'products/detail/:id',
    loadComponent: () =>
      import('./products/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./orders/order-detail.component').then((m) => m.OrderDetailComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./notifications/notifications.component').then((m) => m.NotificationsComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadComponent: () =>
      import('./admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/users/admin-users.component').then((m) => m.AdminUsersComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
