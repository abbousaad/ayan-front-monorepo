import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AdminCategoriesPage } from './admin/categories-page';
import { AdminCurrencyPage } from './admin/currency-page';
import { AdminLayout } from './admin/admin-layout';
import { AdminLoginPage } from './admin/login-page';
import { AdminOrdersPage } from './admin/orders-page';
import { AdminProductsPage } from './admin/products-page';
import { AboutPage } from './routes/about-page';
import { AppLayout } from './routes/app-layout';
import { CategoryPage } from './routes/category-page';
import { CheckoutPage } from './routes/checkout-page';
import { ContactPage } from './routes/contact-page';
import { HomePage } from './routes/home-page';
import { ProductPage } from './routes/product-page';
import { ShopPage } from './routes/shop-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'category/:storeId', element: <CategoryPage /> },
      { path: 'products/:productId', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'contact', element: <ContactPage /> }
    ]
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate replace to="/admin/products" /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'currency', element: <AdminCurrencyPage /> }
    ]
  }
]);
