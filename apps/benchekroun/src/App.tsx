import { RouterProvider } from 'react-router-dom';

import { AdminAuthProvider } from './admin/admin-auth';
import { CartProvider } from './cart/cart-provider';
import { I18nProvider } from './contexts/i18n-context';
import { router } from './router';

// No ThemeProvider: this brand site owns its Andalusian identity in index.css
// and is intentionally not styled by the admin back-office.
export const App = () => (
  <I18nProvider>
    <CartProvider>
      <AdminAuthProvider>
        <div className="min-h-screen bg-brand-black text-brand-ink">
          <RouterProvider router={router} />
        </div>
      </AdminAuthProvider>
    </CartProvider>
  </I18nProvider>
);
