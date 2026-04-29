import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PRODUCT_UNITS } from '@acme/api-client/products';
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
export function ProductForm({ initialValues, stores, onSubmit, onCancel, submitLabel = 'Save' }) {
    const [imageFile, setImageFile] = useState(undefined);
    const [apiError, setApiError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialValues ?? {
            storeId: stores[0]?.id ?? '',
            name: '',
            price: 0,
            stock: 0,
            description: '',
            unit: 'unit'
        }
    });
    const handleFormSubmit = async (values) => {
        setApiError(null);
        try {
            await onSubmit(values, imageFile);
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
                }, children: apiError })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-store", style: labelStyle, children: "Store" }), _jsx("select", { id: "product-store", ...register('storeId', { required: 'Store is required' }), style: inputStyle, children: stores.map((store) => (_jsx("option", { value: store.id, children: store.name }, store.id))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-name", style: labelStyle, children: "Name" }), _jsx("input", { id: "product-name", type: "text", ...register('name', { required: 'Name is required' }), style: errors.name ? errorInputStyle : inputStyle }), errors.name && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.name.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-price", style: labelStyle, children: "Price (MAD)" }), _jsx("input", { id: "product-price", type: "number", step: "0.01", min: "0", ...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } }), style: errors.price ? errorInputStyle : inputStyle }), errors.price && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.price.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-stock", style: labelStyle, children: "Stock" }), _jsx("input", { id: "product-stock", type: "number", min: "0", ...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock must be non-negative' }, valueAsNumber: true }), style: errors.stock ? errorInputStyle : inputStyle }), errors.stock && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.stock.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-unit", style: labelStyle, children: "Unit" }), _jsx("select", { id: "product-unit", ...register('unit', { required: 'Unit is required' }), style: inputStyle, children: PRODUCT_UNITS.map((unit) => (_jsx("option", { value: unit, children: unit }, unit))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "product-description", style: labelStyle, children: "Description" }), _jsx("textarea", { id: "product-description", rows: 3, ...register('description'), style: inputStyle })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsxs("label", { htmlFor: "product-image", style: labelStyle, children: ["Image ", initialValues ? '(optional — leave empty to keep current)' : '(optional)'] }), _jsx("input", { id: "product-image", type: "file", accept: "image/*", onChange: (e) => setImageFile(e.target.files?.[0]), style: inputStyle })] }), _jsxs("div", { style: { display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }, children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isSubmitting, style: {
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
