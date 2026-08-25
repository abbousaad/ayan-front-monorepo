import { RouterProvider } from 'react-router-dom';

import { CartProvider } from './cart/cart-provider';
import { I18nProvider } from './contexts/i18n-context';
import { router } from './router';

// No ThemeProvider, no AdminAuthProvider: this brand site owns its clinical
// Dermadive identity in index.css and is intentionally not styled by the admin
// back-office (mirrors apps/benchekroun's self-contained approach).
export const App = () => (
  <I18nProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </I18nProvider>
);
