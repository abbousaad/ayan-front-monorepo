import { brandColors } from '@acme/shared';
import { RouterProvider } from 'react-router-dom';

import { CartProvider } from './cart/cart-provider';
import { ThemeProvider } from './contexts/theme-context';
import { router } from './router';

export const App = () => (
  <ThemeProvider>
    <CartProvider>
      <div style={{ backgroundColor: brandColors.white, color: brandColors.black, minHeight: '100vh' }}>
        <RouterProvider router={router} />
      </div>
    </CartProvider>
  </ThemeProvider>
);
