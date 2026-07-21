import { createBrowserRouter } from 'react-router-dom';

import { AdminAuthProvider } from './admin/admin-auth-provider';
import { AdminLayout } from './admin/admin-layout';
import { RequireAdmin } from './admin/require-admin';
import { AppLayout } from './routes/app-layout';
import { AdminChangePasswordPage } from './routes/admin/admin-change-password-page';
import { AdminCouponsPage } from './routes/admin/admin-coupons-page';
import { AdminCurrencyPage } from './routes/admin/admin-currency-page';
import { AdminDashboardPage } from './routes/admin/admin-dashboard-page';
import { AdminThemePage } from './routes/admin/admin-theme-page';
import { AdminLoginPage } from './routes/admin/admin-login-page';
import { AdminOrdersPage } from './routes/admin/admin-orders-page';
import { AdminPublicOrdersPage } from './routes/admin/admin-public-orders-page';
import { AdminPricingPage } from './routes/admin/admin-pricing-page';
import { AdminProductsPage } from './routes/admin/admin-products-page';
import { AdminStoresPage } from './routes/admin/admin-stores-page';
import { CheckoutPage } from './routes/checkout-page';
import { HomePage } from './routes/home-page';
import { ProductPage } from './routes/product-page';
import { ProductsPage } from './routes/products-page';
import { StoreProductsPage } from './routes/store-products-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'products/:productId',
        element: <ProductPage />
      },
      {
        path: 'stores/:storeId/products',
        element: <StoreProductsPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      }
    ]
  },
  {
    path: '/admin/login',
    element: (
      <AdminAuthProvider>
        <AdminLoginPage />
      </AdminAuthProvider>
    )
  },
  {
    path: '/admin',
    element: (
      <AdminAuthProvider>
        <RequireAdmin />
      </AdminAuthProvider>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />
          },
          {
            path: 'stores',
            element: <AdminStoresPage />
          },
          {
            path: 'products',
            element: <AdminProductsPage />
          },
          {
            path: 'coupons',
            element: <AdminCouponsPage />
          },
          {
            path: 'pricing',
            element: <AdminPricingPage />
          },
          {
            path: 'currency',
            element: <AdminCurrencyPage />
          },
          {
            path: 'theme',
            element: <AdminThemePage />
          },
          {
            path: 'orders',
            element: <AdminOrdersPage />
          },
          {
            path: 'public-orders',
            element: <AdminPublicOrdersPage />
          },
          {
            path: 'change-password',
            element: <AdminChangePasswordPage />
          }
        ]
      }
    ]
  }
]);
