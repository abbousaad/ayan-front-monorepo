import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../cart/use-cart';
const formatPrice = (price) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format(price);
export function OrderConfirmation({ order }) {
    const { clearCartItems } = useCart();
    useEffect(() => {
        clearCartItems();
    }, [clearCartItems]);
    const total = order.grandTotal ?? order.totalAmount;
    const deliveryLabel = order.deliveryMode === 'instant' ? 'Instant delivery' : 'Scheduled delivery';
    return (_jsxs("div", { className: "mx-auto max-w-md space-y-6 py-12 text-center", children: [_jsx("div", { className: "inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600", children: _jsx(FiCheckCircle, { "aria-hidden": "true", size: 40 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.25em] text-amber-700", children: "Order confirmed" }), _jsxs("h1", { className: "text-2xl font-semibold text-stone-950", children: ["Thank you, ", order.guestName, "!"] }), _jsx("p", { className: "text-sm text-stone-500", children: "Your order has been received and is being processed." })] }), _jsx("div", { className: "rounded-[2rem] border border-stone-200 bg-[#fbf7f1] p-6 text-left space-y-3", children: _jsxs("dl", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-stone-500", children: "Order ID" }), _jsx("dd", { className: "font-mono font-medium text-stone-950 break-all text-right", children: order.id })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-stone-500", children: "Status" }), _jsx("dd", { className: "font-semibold text-stone-950 capitalize", children: order.status })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-stone-500", children: "Delivery" }), _jsx("dd", { className: "font-semibold text-stone-950", children: deliveryLabel })] }), _jsxs("div", { className: "flex justify-between gap-4", children: [_jsx("dt", { className: "text-stone-500", children: "Address" }), _jsx("dd", { className: "font-semibold text-stone-950 text-right", children: order.guestAddress })] }), total !== undefined && (_jsxs("div", { className: "flex justify-between gap-4 border-t border-stone-200 pt-3", children: [_jsx("dt", { className: "text-stone-500", children: "Total" }), _jsx("dd", { className: "text-lg font-semibold text-stone-950", children: formatPrice(total) })] }))] }) }), _jsx(Link, { className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", to: "/", children: "Back to shopping" })] }));
}
