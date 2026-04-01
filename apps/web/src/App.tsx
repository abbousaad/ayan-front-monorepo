import { brandColors } from '@acme/shared';
import { RouterProvider } from 'react-router-dom';

import { CartProvider } from './cart/cart-provider';
import { router } from './router';

export const App = () => (
  <CartProvider>
    <div style={{ backgroundColor: brandColors.white, color: brandColors.black, minHeight: '100vh' }}>
      <RouterProvider router={router} />
    </div>
  </CartProvider>
);
