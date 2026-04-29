import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
const inputStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d6d3d1',
    fontSize: '14px',
    color: '#1c1917',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};
const errorInputStyle = {
    ...inputStyle,
    border: '1px solid #f87171'
};
const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1c1917'
};
export function CouponForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }) {
    const [apiError, setApiError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialValues ?? {
            code: '',
            discountType: 'fixed',
            discountValue: 0,
            startsAt: '',
            endsAt: '',
            isActive: true,
            maxUses: ''
        }
    });
    const handleFormSubmit = async (values) => {
        setApiError(null);
        try {
            await onSubmit(values);
        }
        catch (err) {
            setApiError(err instanceof Error ? err.message : 'An error occurred');
        }
    };
    return (_jsxs("form", { onSubmit: (e) => { void handleSubmit(handleFormSubmit)(e); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [apiError !== null && (_jsx("div", { role: "alert", style: {
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    color: '#b91c1c'
                }, children: apiError })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "coupon-code", style: labelStyle, children: "Code" }), _jsx("input", { id: "coupon-code", type: "text", ...register('code', { required: 'Code is required' }), style: errors.code ? errorInputStyle : inputStyle, placeholder: "e.g. SUMMER20" }), errors.code && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.code.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { style: labelStyle, children: "Discount Type" }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "fixed", ...register('discountType'), style: { margin: 0 } }), _jsx("span", { style: { fontSize: '14px', color: '#1c1917' }, children: "Fixed (MAD)" })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }, children: [_jsx("input", { type: "radio", value: "percentage", ...register('discountType'), style: { margin: 0 } }), _jsx("span", { style: { fontSize: '14px', color: '#1c1917' }, children: "Percentage (%)" })] })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "coupon-value", style: labelStyle, children: "Discount Value" }), _jsx("input", { id: "coupon-value", type: "number", step: "0.01", min: "0", ...register('discountValue', { required: 'Value is required', min: { value: 0.01, message: 'Value must be greater than 0' }, valueAsNumber: true }), style: errors.discountValue ? errorInputStyle : inputStyle }), errors.discountValue && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.discountValue.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "coupon-starts", style: labelStyle, children: "Starts At" }), _jsx("input", { id: "coupon-starts", type: "date", ...register('startsAt', { required: 'Start date is required' }), style: errors.startsAt ? errorInputStyle : inputStyle }), errors.startsAt && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.startsAt.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "coupon-ends", style: labelStyle, children: "Ends At" }), _jsx("input", { id: "coupon-ends", type: "date", ...register('endsAt', { required: 'End date is required' }), style: errors.endsAt ? errorInputStyle : inputStyle }), errors.endsAt && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.endsAt.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "coupon-max-uses", style: labelStyle, children: "Max Uses (leave empty for unlimited)" }), _jsx("input", { id: "coupon-max-uses", type: "number", min: "1", ...register('maxUses'), style: inputStyle, placeholder: "Unlimited" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("input", { id: "coupon-active", type: "checkbox", ...register('isActive'), style: { width: '16px', height: '16px', cursor: 'pointer' } }), _jsx("label", { htmlFor: "coupon-active", style: { ...labelStyle, cursor: 'pointer' }, children: "Active" })] }), _jsxs("div", { style: { display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }, children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isSubmitting, style: {
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '1px solid #d6d3d1',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            color: '#1c1917',
                            cursor: 'pointer'
                        }, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, style: {
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isSubmitting ? '#a7c4b8' : '#1f6446',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }, children: isSubmitting ? 'Saving...' : submitLabel })] })] }));
}
