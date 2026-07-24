import { brandColors } from '@acme/shared';
import { RouterProvider } from 'react-router-dom';

import { CartProvider } from './cart/cart-provider';
import { I18nProvider } from './contexts/i18n-context';
import { ThemeProvider } from './contexts/theme-context';
import { router } from './router';

export const App = () => (
  <ThemeProvider>
    <I18nProvider>
      <CartProvider>
        <div style={{ backgroundColor: brandColors.white, color: brandColors.black, minHeight: '100vh' }}>
          <RouterProvider router={router} />
        </div>
      </CartProvider>
    </I18nProvider>
  </ThemeProvider>
);
