import { useContext } from 'react';

import { CartContext } from './cart-provider';

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart() must be used within a <CartProvider>');
  }

  return context;
}
