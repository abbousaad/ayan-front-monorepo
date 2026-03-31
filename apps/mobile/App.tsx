import { useState } from 'react';

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

  if (activeScreen.name === 'store') {
    return <StoreProductsScreen onBack={() => setActiveScreen({ name: 'home' })} storeId={activeScreen.storeId} />;
  }

  return <HomeScreen onSelectStore={(storeId) => setActiveScreen({ name: 'store', storeId })} />;
}
