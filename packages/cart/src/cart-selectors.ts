import type { CartItem, CartState } from './types';

export function getCartCount(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(state: CartState): number {
  return state.items.reduce((total, item) => total + getCartLineTotal(item), 0);
}

export function getCartLineTotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function getCartStoreId(state: CartState): string | null {
  return state.items[0]?.storeId ?? null;
}

export function getCartItem(state: CartState, productId: string): CartItem | null {
  return state.items.find((item) => item.productId === productId) ?? null;
}

export function getCartItemQuantity(state: CartState, productId: string): number {
  return getCartItem(state, productId)?.quantity ?? 0;
}

export function isCartEmpty(state: CartState): boolean {
  return state.items.length === 0;
}
