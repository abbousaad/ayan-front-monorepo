import { jsx as _jsx } from "react/jsx-runtime";
import { addItem, cartReducer, clearCart, createCartState, decrementItem, getCartCount, getCartItemQuantity, getCartSubtotal, incrementItem, isCartEmpty, removeItem, setItemQuantity } from '@acme/cart';
import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { loadCartState, saveCartState } from './cart-storage-web';
export const CartContext = createContext(null);
export function CartProvider({ children }) {
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
    const value = useMemo(() => {
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
    return _jsx(CartContext.Provider, { value: value, children: children });
}
export { addItem, clearCart, decrementItem, incrementItem, removeItem, setItemQuantity };
