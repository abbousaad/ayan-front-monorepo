import {
  cartReducer,
  createCartState,
  getCartCount,
  getCartItemQuantity,
  getCartSubtotal,
  isCartEmpty,
  type CartItemInput,
  type CartState
} from '@acme/cart';
import { createContext, type ReactNode, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import { loadCartState, saveCartState } from './cart-storage-mobile';

type CartContextValue = {
  addCartItem: (item: CartItemInput) => void;
  cartCount: number;
  clearCartItems: () => void;
  decrementCartItem: (productId: string) => void;
  getItemQuantity: (productId: string) => number;
  incrementCartItem: (productId: string) => void;
  isCartEmpty: boolean;
  isHydrated: boolean;
  removeCartItem: (productId: string) => void;
  setCartItemQuantity: (productId: string, quantity: number) => void;
  state: CartState;
  subtotal: number;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, undefined, createCartState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from AsyncStorage on mount
  useEffect(() => {
    const hydrate = async () => {
      const savedState = await loadCartState();
      dispatch({
        type: 'hydrate-cart',
        payload: savedState
      });
      setIsHydrated(true);
    };

    void hydrate();
  }, []);

  // Persist cart to AsyncStorage on state change
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void saveCartState(state);
  }, [isHydrated, state]);

  const createMeta = useCallback(() => ({ updatedAt: new Date().toISOString() }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      addCartItem: (item) => {
        dispatch({
          type: 'add-item',
          payload: {
            item,
            ...createMeta()
          }
        });
      },
      cartCount: getCartCount(state),
      clearCartItems: () => {
        dispatch({
          type: 'clear-cart',
          payload: createMeta()
        });
      },
      decrementCartItem: (productId) => {
        dispatch({
          type: 'decrement-item',
          payload: {
            productId,
            ...createMeta()
          }
        });
      },
      getItemQuantity: (productId) => getCartItemQuantity(state, productId),
      incrementCartItem: (productId) => {
        dispatch({
          type: 'increment-item',
          payload: {
            productId,
            ...createMeta()
          }
        });
      },
      isCartEmpty: isCartEmpty(state),
      isHydrated,
      removeCartItem: (productId) => {
        dispatch({
          type: 'remove-item',
          payload: {
            productId,
            ...createMeta()
          }
        });
      },
      setCartItemQuantity: (productId, quantity) => {
        dispatch({
          type: 'set-quantity',
          payload: {
            productId,
            quantity,
            ...createMeta()
          }
        });
      },
      state,
      subtotal: getCartSubtotal(state)
    }),
    [createMeta, isHydrated, state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
