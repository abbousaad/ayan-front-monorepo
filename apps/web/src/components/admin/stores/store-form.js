import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STORE_CATEGORIES } from '@acme/api-client/stores';
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
export function StoreForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }) {
    const [imageFile, setImageFile] = useState(undefined);
    const [apiError, setApiError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialValues ?? { name: '', category: 'fruits', slug: '' }
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
                }, children: apiError })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "store-name", style: labelStyle, children: "Name" }), _jsx("input", { id: "store-name", type: "text", ...register('name', { required: 'Name is required' }), style: errors.name ? errorInputStyle : inputStyle }), errors.name && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.name.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "store-category", style: labelStyle, children: "Category" }), _jsx("select", { id: "store-category", ...register('category', { required: 'Category is required' }), style: inputStyle, children: STORE_CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat.charAt(0).toUpperCase() + cat.slice(1) }, cat))) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "store-slug", style: labelStyle, children: "Slug" }), _jsx("input", { id: "store-slug", type: "text", ...register('slug', { required: 'Slug is required' }), style: errors.slug ? errorInputStyle : inputStyle }), errors.slug && (_jsx("span", { style: { fontSize: '12px', color: '#b91c1c' }, children: errors.slug.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsxs("label", { htmlFor: "store-image", style: labelStyle, children: ["Image ", initialValues ? '(optional — leave empty to keep current)' : '(optional)'] }), _jsx("input", { id: "store-image", type: "file", accept: "image/*", onChange: (e) => setImageFile(e.target.files?.[0]), style: inputStyle })] }), _jsxs("div", { style: { display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }, children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isSubmitting, style: {
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
