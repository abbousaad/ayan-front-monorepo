const MINIMUM_CART_QUANTITY = 1;
export function createCartState(items = [], updatedAt = null) {
    return {
        items,
        updatedAt
    };
}
export function cartReducer(state, action) {
    switch (action.type) {
        case 'hydrate-cart':
            return action.payload;
        case 'add-item':
            return addItem(state, action.payload.item, action.payload);
        case 'remove-item':
            return removeItem(state, action.payload.productId, action.payload);
        case 'set-quantity':
            return setItemQuantity(state, action.payload.productId, action.payload.quantity, action.payload);
        case 'increment-item':
            return incrementItem(state, action.payload.productId, action.payload);
        case 'decrement-item':
            return decrementItem(state, action.payload.productId, action.payload);
        case 'clear-cart':
            return clearCart(state, action.payload);
        default:
            return state;
    }
}
export function addItem(state, item, meta) {
    const quantityToAdd = normalizeQuantity(item.quantity ?? MINIMUM_CART_QUANTITY);
    const existingItemIndex = state.items.findIndex((cartItem) => cartItem.productId === item.productId);
    if (existingItemIndex === -1) {
        return withUpdatedItems(state, [
            ...state.items,
            {
                ...item,
                quantity: quantityToAdd
            }
        ], meta);
    }
    return withUpdatedItems(state, state.items.map((cartItem, index) => index === existingItemIndex
        ? {
            ...cartItem,
            quantity: cartItem.quantity + quantityToAdd
        }
        : cartItem), meta);
}
export function removeItem(state, productId, meta) {
    return withUpdatedItems(state, state.items.filter((item) => item.productId !== productId), meta);
}
export function setItemQuantity(state, productId, quantity, meta) {
    if (quantity <= 0) {
        return removeItem(state, productId, meta);
    }
    return withUpdatedItems(state, state.items.map((item) => item.productId === productId
        ? {
            ...item,
            quantity: normalizeQuantity(quantity)
        }
        : item), meta);
}
export function incrementItem(state, productId, meta) {
    const item = state.items.find((entry) => entry.productId === productId);
    if (!item) {
        return state;
    }
    return setItemQuantity(state, productId, item.quantity + 1, meta);
}
export function decrementItem(state, productId, meta) {
    const item = state.items.find((entry) => entry.productId === productId);
    if (!item) {
        return state;
    }
    return setItemQuantity(state, productId, item.quantity - 1, meta);
}
export function clearCart(state, meta) {
    return withUpdatedItems(state, [], meta);
}
function withUpdatedItems(state, items, meta) {
    const nextUpdatedAt = meta?.updatedAt === undefined ? state.updatedAt : meta.updatedAt;
    return {
        items,
        updatedAt: items.length === 0 ? nextUpdatedAt ?? null : nextUpdatedAt ?? state.updatedAt
    };
}
function normalizeQuantity(quantity) {
    const nextQuantity = Math.floor(quantity);
    if (!Number.isFinite(nextQuantity) || nextQuantity < MINIMUM_CART_QUANTITY) {
        return MINIMUM_CART_QUANTITY;
    }
    return nextQuantity;
}
