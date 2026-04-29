import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../cart/use-cart';
import { CheckoutCartSummary } from '../components/checkout/checkout-cart-summary';
import { GuestCheckoutForm } from '../components/checkout/guest-checkout-form';
import { OrderConfirmation } from '../components/checkout/order-confirmation';
export function CheckoutPage() {
    const { isCartEmpty, isHydrated } = useCart();
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    if (isHydrated && isCartEmpty && confirmedOrder === null) {
        return _jsx(Navigate, { replace: true, to: "/" });
    }
    if (confirmedOrder !== null) {
        return (_jsx("main", { className: "px-4 py-8 sm:px-6 lg:px-8", children: _jsx(OrderConfirmation, { order: confirmedOrder }) }));
    }
    return (_jsxs("main", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8 space-y-1", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.25em] text-amber-700", children: "Checkout" }), _jsx("h1", { className: "text-2xl font-semibold text-stone-950", children: "Complete your order" })] }), _jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsx("div", { children: _jsx(CheckoutCartSummary, {}) }), _jsx("div", { className: "rounded-[2rem] border border-stone-200 bg-white p-6", children: _jsx(GuestCheckoutForm, { onSuccess: (order) => setConfirmedOrder(order) }) })] })] }));
}
