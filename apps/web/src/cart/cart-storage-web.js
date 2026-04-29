import { createCartState } from '@acme/cart';
const CART_STORAGE_KEY = 'ayan-market-cart';
export function loadCartState() {
    if (!isStorageAvailable()) {
        return createCartState();
    }
    try {
        const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!rawValue) {
            return createCartState();
        }
        const parsedValue = JSON.parse(rawValue);
        if (!Array.isArray(parsedValue.items)) {
            return createCartState();
        }
        return createCartState(parsedValue.items, parsedValue.updatedAt ?? null);
    }
    catch {
        return createCartState();
    }
}
export function saveCartState(state) {
    if (!isStorageAvailable()) {
        return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
}
function isStorageAvailable() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}
