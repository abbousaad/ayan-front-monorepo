export function getCartCount(state) {
    return state.items.reduce((total, item) => total + item.quantity, 0);
}
export function getCartSubtotal(state) {
    return state.items.reduce((total, item) => total + getCartLineTotal(item), 0);
}
export function getCartLineTotal(item) {
    return item.price * item.quantity;
}
export function getCartItem(state, productId) {
    return state.items.find((item) => item.productId === productId) ?? null;
}
export function getCartItemQuantity(state, productId) {
    return getCartItem(state, productId)?.quantity ?? 0;
}
export function isCartEmpty(state) {
    return state.items.length === 0;
}
