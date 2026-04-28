import { useState } from 'react';

import { CartProvider } from './src/cart/cart-provider';
import { HomeScreen } from './src/home-screen';
import { StoreProductsScreen } from './src/store-products-screen';

type ActiveScreen =
  | { name: 'home' }
  | {
      name: 'store';
      storeId: string;
    };

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>({ name: 'home' });

  return (
    <CartProvider>
      {activeScreen.name === 'store' ? (
        <StoreProductsScreen onBack={() => setActiveScreen({ name: 'home' })} storeId={activeScreen.storeId} />
      ) : (
        <HomeScreen onSelectStore={(storeId) => setActiveScreen({ name: 'store', storeId })} />
      )}
    </CartProvider>
  );
}
