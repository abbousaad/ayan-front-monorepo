import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError } from '@acme/api-client';
import { getPricingConfig, updatePricingConfig } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../admin/use-admin-auth';
export function AdminPricingPage() {
    const { token, handleUnauthorized } = useAdminAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            deliveryFee: 0,
            serviceFeeRate: 0,
            taxRate: 0,
            discountRate: 0
        }
    });
    const fetchPricingConfig = async () => {
        if (!token) {
            setErrorMessage('You must be signed in to view pricing configuration.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const config = await getPricingConfig(token);
            reset(config);
        }
        catch (error) {
            if (error instanceof ApiClientError && error.status === 401) {
                handleUnauthorized();
                return;
            }
            if (error instanceof ApiClientError) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        void fetchPricingConfig();
    }, [token]);
    const onSubmit = async (values) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (!token) {
            setErrorMessage('You must be signed in to update pricing configuration.');
            return;
        }
        const input = {
            deliveryFee: values.deliveryFee,
            serviceFeeRate: values.serviceFeeRate,
            taxRate: values.taxRate,
            discountRate: values.discountRate
        };
        try {
            const updated = await updatePricingConfig(input, token);
            reset(updated);
            setSuccessMessage('Pricing configuration updated successfully.');
        }
        catch (error) {
            if (error instanceof ApiClientError && error.status === 401) {
                handleUnauthorized();
                return;
            }
            if (error instanceof ApiClientError) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };
    return (_jsxs("div", { style: { padding: '24px' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 12px' }, children: "Pricing Configuration" }), (successMessage || errorMessage) && (_jsx("div", { role: "alert", style: {
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
                }, children: _jsxs("form", { onSubmit: (event) => { void handleSubmit(onSubmit)(event); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "delivery-fee", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Delivery Fee" }), _jsx("input", { id: "delivery-fee", type: "number", step: "1", "aria-invalid": errors.deliveryFee !== undefined, disabled: isLoading, ...register('deliveryFee', { required: 'Delivery fee is required', valueAsNumber: true }), style: {
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: errors.deliveryFee ? '1px solid #f87171' : '1px solid #d6d3d1',
                                                fontSize: '14px',
                                                color: '#1c1917',
                                                outline: 'none',
                                                width: '100%',
                                                boxSizing: 'border-box'
                                            } }), errors.deliveryFee && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.deliveryFee.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "service-fee", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Service Fee Rate" }), _jsx("input", { id: "service-fee", type: "number", step: "0.01", "aria-invalid": errors.serviceFeeRate !== undefined, disabled: isLoading, ...register('serviceFeeRate', { required: 'Service fee rate is required', valueAsNumber: true }), style: {
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: errors.serviceFeeRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                                                fontSize: '14px',
                                                color: '#1c1917',
                                                outline: 'none',
                                                width: '100%',
                                                boxSizing: 'border-box'
                                            } }), errors.serviceFeeRate && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.serviceFeeRate.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "tax-rate", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Tax Rate" }), _jsx("input", { id: "tax-rate", type: "number", step: "0.01", "aria-invalid": errors.taxRate !== undefined, disabled: isLoading, ...register('taxRate', { required: 'Tax rate is required', valueAsNumber: true }), style: {
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: errors.taxRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                                                fontSize: '14px',
                                                color: '#1c1917',
                                                outline: 'none',
                                                width: '100%',
                                                boxSizing: 'border-box'
                                            } }), errors.taxRate && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.taxRate.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "discount-rate", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Discount Rate" }), _jsx("input", { id: "discount-rate", type: "number", step: "0.01", "aria-invalid": errors.discountRate !== undefined, disabled: isLoading, ...register('discountRate', { required: 'Discount rate is required', valueAsNumber: true }), style: {
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: errors.discountRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                                                fontSize: '14px',
                                                color: '#1c1917',
                                                outline: 'none',
                                                width: '100%',
                                                boxSizing: 'border-box'
                                            } }), errors.discountRate && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.discountRate.message }))] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("button", { type: "submit", disabled: isSubmitting || isLoading, style: {
                                        padding: '10px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: isSubmitting || isLoading ? '#a7c4b8' : '#1f6446',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
                                    }, children: isSubmitting ? 'Saving...' : 'Save' }), isLoading && (_jsx("span", { style: { fontSize: '13px', color: '#78716c' }, children: "Loading pricing configuration..." }))] })] }) })] }));
}
