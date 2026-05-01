import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { brandColors } from '@acme/shared';
import type { PublicOrder } from '@acme/api-client';

import { CartProvider } from './src/cart/cart-provider';
import { CartScreen } from './src/cart-screen';
import { CheckoutScreen } from './src/checkout-screen';
import { HomeScreen } from './src/home-screen';
import { Screen } from './src/components/screen';
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
      <PendingConfirmationScreen onBackToHome={() => setActiveScreen({ name: 'home' })} order={activeScreen.order} />
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

function PendingConfirmationScreen({ onBackToHome, order }: { onBackToHome: () => void; order: PublicOrder }) {
  return (
    <Screen>
      <StatusBar style="dark" />
      <View style={styles.pendingScreen}>
        <Text style={styles.pendingEyebrow}>Order placed</Text>
        <Text style={styles.pendingTitle}>Confirmation screen is next</Text>
        <Text style={styles.pendingDescription}>
          Order <Text style={styles.pendingOrderId}>#{order.id.slice(-8).toUpperCase()}</Text> was submitted successfully. MT-7 will replace this placeholder with the full confirmation experience.
        </Text>
        <Pressable onPress={onBackToHome} style={styles.pendingButton}>
          <Text style={styles.pendingButtonText}>Back to home</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pendingScreen: {
    alignItems: 'center',
    backgroundColor: '#f7f5f1',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  pendingEyebrow: {
    color: '#9c6b2f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  pendingTitle: {
    color: brandColors.black,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center'
  },
  pendingDescription: {
    color: '#6d6255',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center'
  },
  pendingOrderId: {
    color: brandColors.black,
    fontWeight: '700'
  },
  pendingButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  pendingButtonText: {
    color: brandColors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
