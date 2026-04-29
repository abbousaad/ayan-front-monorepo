import { useState } from 'react';

import { CartProvider } from './src/cart/cart-provider';
import { CartScreen } from './src/cart-screen';
import { HomeScreen } from './src/home-screen';
import { StoreProductsScreen } from './src/store-products-screen';

type ReturnScreen =
  | { name: 'home' }
  | {
      name: 'store';
      storeId: string;
    };

type ActiveScreen =
  | ReturnScreen
  | {
      name: 'cart';
      returnTo: ReturnScreen;
    };

const getOpenCartState = (returnTo: ReturnScreen): ActiveScreen => ({
  name: 'cart',
  returnTo
});

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>({ name: 'home' });

  const screen =
    activeScreen.name === 'cart' ? (
      <CartScreen
        onBack={() => setActiveScreen(activeScreen.returnTo)}
        onProceed={() => {
          // MT-5 will replace this with the auth choice flow.
        }}
      />
    ) : activeScreen.name === 'store' ? (
      <StoreProductsScreen
        onBack={() => setActiveScreen({ name: 'home' })}
        onOpenCart={() => setActiveScreen(getOpenCartState(activeScreen))}
        storeId={activeScreen.storeId}
      />
    ) : (
      <HomeScreen
        onOpenCart={() => setActiveScreen(getOpenCartState(activeScreen))}
        onSelectStore={(storeId) => setActiveScreen({ name: 'store', storeId })}
      />
    );

  return (
    <CartProvider>
      {screen}
    </CartProvider>
  );
}
