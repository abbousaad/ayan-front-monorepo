import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError } from '@acme/api-client';
import { getCurrencySetting, updateCurrencySetting } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../admin/use-admin-auth';
export function AdminCurrencyPage() {
    const { token, handleUnauthorized } = useAdminAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            currencyCode: ''
        }
    });
    const fetchCurrencySetting = async () => {
        if (!token) {
            setErrorMessage('You must be signed in to view currency settings.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await getCurrencySetting(token);
            reset({ currencyCode: response.currencyCode });
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
        void fetchCurrencySetting();
    }, [token]);
    const onSubmit = async (values) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (!token) {
            setErrorMessage('You must be signed in to update currency settings.');
            return;
        }
        const input = {
            currencyCode: values.currencyCode.trim()
        };
        try {
            const updated = await updateCurrencySetting(input, token);
            reset({ currencyCode: updated.currencyCode });
            setSuccessMessage('Currency settings updated successfully.');
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
    return (_jsxs("div", { style: { padding: '24px' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 12px' }, children: "Currency Settings" }), (successMessage || errorMessage) && (_jsx("div", { role: "alert", style: {
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
                }, children: _jsxs("form", { onSubmit: (event) => { void handleSubmit(onSubmit)(event); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '360px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "currency-code", style: { fontSize: '14px', fontWeight: '600', color: '#1c1917' }, children: "Currency Code" }), _jsx("input", { id: "currency-code", type: "text", "aria-invalid": errors.currencyCode !== undefined, disabled: isLoading, placeholder: "e.g. DZD", ...register('currencyCode', { required: 'Currency code is required' }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.currencyCode ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.currencyCode && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.currencyCode.message }))] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("button", { type: "submit", disabled: isSubmitting || isLoading, style: {
                                        padding: '10px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: isSubmitting || isLoading ? '#a7c4b8' : '#1f6446',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
                                    }, children: isSubmitting ? 'Saving...' : 'Save' }), isLoading && (_jsx("span", { style: { fontSize: '13px', color: '#78716c' }, children: "Loading currency settings..." }))] })] }) })] }));
}
