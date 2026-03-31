import {
  addItem,
  cartReducer,
  clearCart,
  createCartState,
  decrementItem,
  getCartCount,
  getCartItemQuantity,
  getCartSubtotal,
  incrementItem,
  isCartEmpty,
  removeItem,
  setItemQuantity,
  type CartItemInput,
  type CartState
} from '@acme/cart';
import { createContext, type ReactNode, useEffect, useMemo, useReducer, useState } from 'react';

import { loadCartState, saveCartState } from './cart-storage-web';

type CartContextValue = {
  addCartItem: (item: CartItemInput) => void;
  cartCount: number;
  clearCartItems: () => void;
  closeCart: () => void;
  decrementCartItem: (productId: string) => void;
  incrementCartItem: (productId: string) => void;
  isCartEmpty: boolean;
  isHydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  toggleCart: () => void;
  removeCartItem: (productId: string) => void;
  setCartItemQuantity: (productId: string, quantity: number) => void;
  state: CartState;
  subtotal: number;
  getItemQuantity: (productId: string) => number;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, undefined, createCartState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'hydrate-cart',
      payload: loadCartState()
    });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveCartState(state);
  }, [isHydrated, state]);

  const value = useMemo<CartContextValue>(() => {
    const createMeta = () => ({ updatedAt: new Date().toISOString() });

    return {
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
      closeCart: () => {
        setIsOpen(false);
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
      isOpen,
      openCart: () => {
        setIsOpen(true);
      },
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
      subtotal: getCartSubtotal(state),
      toggleCart: () => {
        setIsOpen((currentValue) => !currentValue);
      }
    };
  }, [isHydrated, isOpen, state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export {
  addItem,
  clearCart,
  decrementItem,
  incrementItem,
  removeItem,
  setItemQuantity
};
