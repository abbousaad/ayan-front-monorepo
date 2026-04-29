import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createImageUrl } from '@acme/api-client';
import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../cart/use-cart';
import { QuantityControl } from './quantity-control';
const formatPrice = (price, currencyCode = 'USD') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
}).format(price);
export function CartLineItem({ item }) {
    const { decrementCartItem, incrementCartItem, removeCartItem, setCartItemQuantity } = useCart();
    const lineTotal = item.price * item.quantity;
    return (_jsxs("article", { className: "flex gap-3 rounded-[1.5rem] border border-stone-200 bg-[#fbf7f1] p-3", children: [_jsx("img", { alt: item.name, className: "h-24 w-24 rounded-[1rem] object-cover", src: createImageUrl(item.imageUrl ?? '') }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "truncate text-sm font-semibold text-stone-950", children: item.name }), _jsxs("p", { className: "mt-1 text-xs text-stone-500", children: [formatPrice(item.price, item.currencyCode ?? 'USD'), item.unit ? _jsxs("span", { children: [" / ", item.unit] }) : null] })] }), _jsx("button", { "aria-label": `Remove ${item.name} from cart`, className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1", onClick: () => {
                                    removeCartItem(item.productId);
                                }, type: "button", children: _jsx(FiTrash2, { "aria-hidden": "true", size: 15 }) })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx(QuantityControl, { onDecrement: () => {
                                    decrementCartItem(item.productId);
                                }, onIncrement: () => {
                                    incrementCartItem(item.productId);
                                }, onQuantityChange: (quantity) => {
                                    setCartItemQuantity(item.productId, quantity);
                                }, quantity: item.quantity }), _jsx("p", { className: "text-sm font-semibold text-stone-950", children: formatPrice(lineTotal, item.currencyCode ?? 'USD') })] })] })] }));
}
