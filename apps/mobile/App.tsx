import { useState } from 'react';
import type { PublicOrder } from '@acme/api-client';

import { CartProvider } from './src/cart/cart-provider';
import { CartScreen } from './src/cart-screen';
import { CheckoutScreen } from './src/checkout-screen';
import { HomeScreen } from './src/home-screen';
import { OrderConfirmationScreen } from './src/order-confirmation-screen';
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
    }
  | {
      name: 'checkout';
      returnTo: ReturnScreen;
    }
  | {
      name: 'order-confirmation';
      order: PublicOrder;
    };

const getOpenCartState = (returnTo: ReturnScreen): ActiveScreen => ({
  name: 'cart',
  returnTo
});

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>({ name: 'home' });

  const screen =
    activeScreen.name === 'order-confirmation' ? (
      <OrderConfirmationScreen onBackToHome={() => setActiveScreen({ name: 'home' })} order={activeScreen.order} />
    ) : activeScreen.name === 'checkout' ? (
      <CheckoutScreen
        onBack={() => setActiveScreen({ name: 'cart', returnTo: activeScreen.returnTo })}
        onSuccess={(order) => setActiveScreen({ name: 'order-confirmation', order })}
      />
    ) : activeScreen.name === 'cart' ? (
      <CartScreen
        onBack={() => setActiveScreen(activeScreen.returnTo)}
        onProceed={() => setActiveScreen({ name: 'checkout', returnTo: activeScreen.returnTo })}
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
