import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { brandColors } from '@acme/shared';
import { getDiscountAmount, getTotalWithPricing } from '@acme/cart';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiX } from 'react-icons/fi';
import { useCart } from '../../cart/use-cart';
import { usePricingConfig } from '../../hooks/use-pricing-config';
import { AuthChoiceModal } from '../checkout/auth-choice-modal';
import { CartLineItem } from './cart-line-item';
const formatPrice = (price, currencyCode = 'USD') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
}).format(price);
export function CartSidebar() {
    const { clearCartItems, closeCart, isCartEmpty, isOpen, state, subtotal } = useCart();
    const { pricingConfig } = usePricingConfig();
    const currencyCode = state.items[0]?.currencyCode ?? 'USD';
    const [showAuthModal, setShowAuthModal] = useState(false);
    const discountAmount = getDiscountAmount(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
    const total = getTotalWithPricing(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
    const formattedDiscount = discountAmount > 0
        ? `-${formatPrice(discountAmount, currencyCode)}`
        : formatPrice(0, currencyCode);
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { "aria-hidden": !isOpen, className: `fixed inset-0 z-40 bg-stone-950/35 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`, onClick: closeCart }), _jsxs("aside", { "aria-hidden": !isOpen, className: `fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-[0_18px_45px_rgba(120,98,70,0.18)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`, children: [_jsxs("div", { className: "flex items-center justify-between border-b border-stone-200 px-5 py-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.25em] text-amber-700", children: "Cart" }), _jsx("h2", { className: "text-xl font-semibold text-stone-950", children: "Your selections" })] }), _jsx("button", { "aria-label": "Close cart", className: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", onClick: closeCart, type: "button", children: _jsx(FiX, { "aria-hidden": "true", size: 18 }) })] }), isCartEmpty ? (_jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center", children: [_jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-700", children: _jsx(FiShoppingBag, { "aria-hidden": "true", size: 24 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-semibold text-stone-950", children: "Your cart is empty" }), _jsx("p", { className: "text-sm leading-6 text-stone-600", children: "Add a few items and they will appear here with live totals." })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-1 space-y-3 overflow-y-auto px-5 py-5", children: state.items.map((item) => (_jsx(CartLineItem, { item: item }, item.productId))) }), _jsx("div", { className: "border-t border-stone-200 px-5 py-5", children: _jsxs("div", { className: "space-y-4 rounded-[1.75rem] bg-[#fbf7f1] p-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 text-sm text-stone-600", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { className: "text-lg font-semibold text-stone-950", children: formatPrice(subtotal, currencyCode) })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 text-sm text-stone-600", children: [_jsx("span", { children: "Discount" }), _jsx("span", { className: "text-sm font-semibold text-stone-950", children: formattedDiscount })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 text-sm text-stone-600", children: [_jsx("span", { children: "Delivery Fee" }), _jsx("span", { className: "text-sm font-semibold text-stone-950", children: formatPrice(pricingConfig.deliveryFee, currencyCode) })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 text-sm text-stone-600", children: [_jsx("span", { children: "Total" }), _jsx("span", { className: "text-lg font-semibold text-stone-950", children: formatPrice(total, currencyCode) })] }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [_jsx("button", { className: "inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", onClick: () => setShowAuthModal(true), style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: "Continue" }), _jsx("button", { className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", onClick: clearCartItems, type: "button", children: "Clear cart" })] })] }) })] }))] }), showAuthModal && (_jsx(AuthChoiceModal, { onClose: () => {
                    setShowAuthModal(false);
                    closeCart();
                } }))] }));
}
