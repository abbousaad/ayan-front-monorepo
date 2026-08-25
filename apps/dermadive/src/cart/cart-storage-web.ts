import { createCartState, type CartState } from '@acme/cart';

// Distinct key so it never collides with the other apps on the same dev origin.
const CART_STORAGE_KEY = 'dermadive.cart';

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
