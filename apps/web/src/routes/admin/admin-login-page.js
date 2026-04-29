import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError } from '@acme/api-client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ADMIN_SESSION_USER_KEY } from '../../admin/admin-auth-provider';
import { useAdminAuth } from '../../admin/use-admin-auth';
export function AdminLoginPage() {
    const { login } = useAdminAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const onSubmit = async (values) => {
        setErrorMessage(null);
        try {
            await login(values.username, values.password);
            // After login, user state is updated — read from context re-render cycle
            // We need to check mustChangePassword from the updated user
            // Because login() sets state asynchronously, we read it on the next tick
            // via navigate after the state is flushed — use a callback form via effect.
            // Simpler: re-read from sessionStorage since login() writes it there synchronously.
            const storedUserRaw = sessionStorage.getItem(ADMIN_SESSION_USER_KEY);
            if (storedUserRaw) {
                const storedUser = JSON.parse(storedUserRaw);
                if (storedUser.mustChangePassword) {
                    void navigate('/admin/change-password');
                    return;
                }
            }
            void navigate('/admin');
        }
        catch (err) {
            if (err instanceof ApiClientError) {
                setErrorMessage(err.message);
            }
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f4' // stone-100
        }, children: _jsxs("div", { style: {
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                padding: '40px'
            }, children: [_jsxs("div", { style: { marginBottom: '32px', textAlign: 'center' }, children: [_jsx("h1", { style: {
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#1c1917', // stone-900
                                margin: '0 0 8px'
                            }, children: "Ayan Admin" }), _jsx("p", { style: { fontSize: '14px', color: '#78716c', margin: 0 }, children: "Sign in to your admin account" })] }), errorMessage !== null && (_jsx("div", { role: "alert", style: {
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#b91c1c'
                    }, children: errorMessage })), _jsxs("form", { onSubmit: (e) => { void handleSubmit(onSubmit)(e); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '20px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "username", style: { fontSize: '14px', fontWeight: '500', color: '#1c1917' }, children: "Username" }), _jsx("input", { id: "username", type: "text", autoComplete: "username", "aria-invalid": errors.username !== undefined, ...register('username', { required: 'Username is required' }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.username ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.username && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.username.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "password", style: { fontSize: '14px', fontWeight: '500', color: '#1c1917' }, children: "Password" }), _jsx("input", { id: "password", type: "password", autoComplete: "current-password", "aria-invalid": errors.password !== undefined, ...register('password', { required: 'Password is required' }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.password ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.password && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.password.message }))] }), _jsx("button", { type: "submit", disabled: isSubmitting, style: {
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: isSubmitting ? '#a7c4b8' : '#1f6446',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.15s'
                            }, children: isSubmitting ? 'Signing in...' : 'Sign in' })] })] }) }));
}
