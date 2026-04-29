import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createImageUrl } from '@acme/api-client';
import { getDiscountAmount, getTotalWithPricing } from '@acme/cart';
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../cart/use-cart';
import { usePricingConfig } from '../../hooks/use-pricing-config';
import { QuantityControl } from '../cart/quantity-control';
const formatPrice = (price, currencyCode = 'USD') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
}).format(price);
export function CheckoutCartSummary() {
    const { decrementCartItem, incrementCartItem, isCartEmpty, removeCartItem, setCartItemQuantity, state, subtotal } = useCart();
    const currencyCode = state.items[0]?.currencyCode ?? 'USD';
    const { pricingConfig } = usePricingConfig();
    const discountAmount = getDiscountAmount(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
    const total = getTotalWithPricing(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
    const formattedDiscount = discountAmount > 0
        ? `-${formatPrice(discountAmount, currencyCode)}`
        : formatPrice(0, currencyCode);
    if (isCartEmpty) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-stone-200 bg-[#fbf7f1] px-6 py-12 text-center", children: [_jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-700", children: _jsx(FiShoppingBag, { "aria-hidden": "true", size: 24 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-semibold text-stone-950", children: "Your cart is empty" }), _jsxs("p", { className: "text-sm leading-6 text-stone-600", children: ["Head back to", ' ', _jsx(Link, { className: "font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800", to: "/products", children: "browse products" }), ' ', "and add some items."] })] })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold text-stone-950", children: "Your order" }), _jsx("div", { className: "space-y-3", children: state.items.map((item) => {
                    const lineTotal = item.price * item.quantity;
                    return (_jsxs("article", { className: "flex gap-3 rounded-[1.5rem] border border-stone-200 bg-[#fbf7f1] p-3", children: [_jsx("img", { alt: item.name, className: "h-20 w-20 rounded-[1rem] object-cover", src: createImageUrl(item.imageUrl ?? '') }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "truncate text-sm font-semibold text-stone-950", children: item.name }), _jsxs("p", { className: "mt-1 text-xs text-stone-500", children: [formatPrice(item.price, item.currencyCode ?? currencyCode), item.unit ? _jsxs("span", { children: [" / ", item.unit] }) : null] })] }), _jsx("button", { "aria-label": `Remove ${item.name} from cart`, className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1", onClick: () => removeCartItem(item.productId), type: "button", children: _jsx(FiTrash2, { "aria-hidden": "true", size: 15 }) })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx(QuantityControl, { onDecrement: () => decrementCartItem(item.productId), onIncrement: () => incrementCartItem(item.productId), onQuantityChange: (quantity) => setCartItemQuantity(item.productId, quantity), quantity: item.quantity }), _jsx("p", { className: "text-sm font-semibold text-stone-950", children: formatPrice(lineTotal, item.currencyCode ?? currencyCode) })] })] })] }, item.productId));
                }) }), _jsxs("div", { className: "rounded-[1.75rem] bg-[#fbf7f1] p-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 text-sm text-stone-600", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { className: "text-lg font-semibold text-stone-950", children: formatPrice(subtotal, currencyCode) })] }), _jsxs("div", { className: "mt-3 space-y-2 text-sm text-stone-600", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { children: "Discount" }), _jsx("span", { className: "text-sm font-semibold text-stone-950", children: formattedDiscount })] }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { children: "Delivery Fee" }), _jsx("span", { className: "text-sm font-semibold text-stone-950", children: formatPrice(pricingConfig.deliveryFee, currencyCode) })] }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { children: "Total" }), _jsx("span", { className: "text-lg font-semibold text-stone-950", children: formatPrice(total, currencyCode) })] })] })] })] }));
}
