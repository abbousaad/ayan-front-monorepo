import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCartState, type CartState } from '@acme/cart';

const CART_STORAGE_KEY = 'ayan-market-cart';

export async function loadCartState(): Promise<CartState> {
  try {
    const rawValue = await AsyncStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return createCartState();
    }

    let parsedValue: Partial<CartState>;

    try {
      parsedValue = JSON.parse(rawValue) as Partial<CartState>;
    } catch (error) {
      console.warn('Failed to parse stored cart state. Falling back to an empty cart.', error);
      return createCartState();
    }

    if (!Array.isArray(parsedValue.items)) {
      console.warn('Stored cart state is invalid. Falling back to an empty cart.');
      return createCartState();
    }

    return createCartState(parsedValue.items, parsedValue.updatedAt ?? null);
  } catch {
    return createCartState();
  }
}

export async function saveCartState(state: CartState): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently ignore storage errors
  }
}
