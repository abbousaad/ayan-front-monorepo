import { createCartState, type CartState } from '@acme/cart';

const CART_STORAGE_KEY = 'ayan-market-cart';

export function loadCartState(): CartState {
  if (!isStorageAvailable()) {
    return createCartState();
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return createCartState();
    }

    const parsedValue = JSON.parse(rawValue) as Partial<CartState>;

    if (!Array.isArray(parsedValue.items)) {
      return createCartState();
    }

    return createCartState(parsedValue.items, parsedValue.updatedAt ?? null);
  } catch {
    return createCartState();
  }
}

export function saveCartState(state: CartState): void {
  if (!isStorageAvailable()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
}

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}
