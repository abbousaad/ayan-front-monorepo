import { RouterProvider } from 'react-router-dom';

import { AdminAuthProvider } from './admin/admin-auth';
import { CartProvider } from './cart/cart-provider';
import { I18nProvider } from './contexts/i18n-context';
import { router } from './router';

// No ThemeProvider: this brand site owns its clinical Dermadive identity in
// index.css. The admin back-office (utilitarian, slate-on-white) lives under
// /admin and is intentionally not brand-styled — mirrors apps/benchekroun.
export const App = () => (
  <I18nProvider>
    <CartProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </CartProvider>
  </I18nProvider>
);
