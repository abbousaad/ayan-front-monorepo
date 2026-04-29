import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError } from '@acme/api-client';
import { confirmOrder } from '@acme/api-client/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../admin/use-admin-auth';
export function AdminOrdersPage() {
    const { token, handleUnauthorized } = useAdminAuth();
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            orderId: ''
        }
    });
    const onSubmit = async (values) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (!token) {
            setErrorMessage('You must be signed in to confirm orders.');
            return;
        }
        const orderId = values.orderId.trim();
        try {
            await confirmOrder(orderId, token);
            setSuccessMessage(`Order ${orderId} confirmed — moved to 'onpreparation'`);
            reset();
        }
        catch (err) {
            if (err instanceof ApiClientError && err.status === 401) {
                handleUnauthorized();
                return;
            }
            if (err instanceof ApiClientError) {
                setErrorMessage(err.message);
            }
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };
    return (_jsxs("div", { style: { padding: '24px' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 12px' }, children: "Orders" }), _jsx("div", { role: "status", style: {
                    backgroundColor: '#fefce8',
                    border: '1px solid #fef08a',
                    color: '#713f12',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    fontSize: '14px'
                }, children: "No order listing endpoint is available yet. Use the form below to confirm pending orders by ID." }), (successMessage !== null || errorMessage !== null) && (_jsx("div", { role: "alert", style: {
                    backgroundColor: successMessage ? '#ecfdf3' : '#fef2f2',
                    border: successMessage ? '1px solid #bbf7d0' : '1px solid #fecaca',
                    color: successMessage ? '#166534' : '#b91c1c',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    fontSize: '14px'
                }, children: successMessage ?? errorMessage })), _jsx("div", { style: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }, children: _jsxs("form", { onSubmit: (event) => { void handleSubmit(onSubmit)(event); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "order-id", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Order ID" }), _jsx("input", { id: "order-id", type: "text", "aria-invalid": errors.orderId !== undefined, placeholder: "Enter order ID", ...register('orderId', { required: 'Order ID is required' }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.orderId ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.orderId && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.orderId.message }))] }), _jsx("button", { type: "submit", disabled: isSubmitting, style: {
                                alignSelf: 'flex-start',
                                padding: '10px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: isSubmitting ? '#a7c4b8' : '#1f6446',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }, children: isSubmitting ? 'Confirming...' : 'Confirm Order' })] }) })] }));
}
