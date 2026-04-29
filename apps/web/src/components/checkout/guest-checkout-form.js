import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError, createPublicOrder } from '@acme/api-client';
import { brandColors } from '@acme/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCart } from '../../cart/use-cart';
const inputClass = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1';
const labelClass = 'block text-sm font-medium text-stone-700';
const errorClass = 'mt-1 text-xs text-red-600';
export function GuestCheckoutForm({ onSuccess }) {
    const { state } = useCart();
    const [submitError, setSubmitError] = useState(null);
    const { formState: { errors, isSubmitting }, handleSubmit, register } = useForm();
    const onSubmit = async (values) => {
        setSubmitError(null);
        try {
            const order = await createPublicOrder({
                deliveryMode: 'instant',
                guest: {
                    name: values.name,
                    phone: values.phone
                },
                items: state.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
            onSuccess(order);
        }
        catch (error) {
            if (error instanceof ApiClientError) {
                setSubmitError(error.message);
            }
            else {
                setSubmitError('An unexpected error occurred. Please try again.');
            }
        }
    };
    return (_jsxs("form", { className: "space-y-6", noValidate: true, onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.25em] text-amber-700", children: "Your details" }), _jsx("h2", { className: "mt-1 text-lg font-semibold text-stone-950", children: "Contact information" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: labelClass, htmlFor: "checkout-name", children: ["Full name ", _jsx("span", { "aria-hidden": "true", className: "text-red-500", children: "*" })] }), _jsx("input", { autoComplete: "name", className: `mt-1 ${inputClass}`, id: "checkout-name", placeholder: "Jane Doe", type: "text", ...register('name', { required: 'Name is required' }) }), errors.name && _jsx("p", { className: errorClass, children: errors.name.message })] }), _jsxs("div", { children: [_jsxs("label", { className: labelClass, htmlFor: "checkout-phone", children: ["Phone number ", _jsx("span", { "aria-hidden": "true", className: "text-red-500", children: "*" })] }), _jsx("input", { autoComplete: "tel", className: `mt-1 ${inputClass}`, id: "checkout-phone", placeholder: "+1 555 000 0000", type: "tel", ...register('phone', { required: 'Phone number is required' }) }), errors.phone && _jsx("p", { className: errorClass, children: errors.phone.message })] })] }), submitError && (_jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", role: "alert", children: submitError })), _jsx("button", { className: "inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:opacity-50", disabled: isSubmitting, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "submit", children: isSubmitting ? 'Placing order…' : 'Place order' })] }));
}
