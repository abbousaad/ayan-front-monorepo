import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiClientError } from '@acme/api-client';
import { changePassword } from '@acme/api-client/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../admin/use-admin-auth';
export function AdminChangePasswordPage() {
    const { token, user, updateUser, handleUnauthorized } = useAdminAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const newPassword = watch('newPassword');
    const onSubmit = async (values) => {
        setErrorMessage(null);
        if (!token) {
            setErrorMessage('You must be signed in to change password.');
            return;
        }
        try {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            }, token);
            // Clear mustChangePassword flag
            updateUser({ mustChangePassword: false });
            // Redirect to admin dashboard
            void navigate('/admin');
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
                            }, children: "Change Password" }), _jsx("p", { style: { fontSize: '14px', color: '#78716c', margin: 0 }, children: "Enter your current password and choose a new one" })] }), user?.mustChangePassword === true && (_jsx("div", { role: "alert", style: {
                        backgroundColor: '#fefce8', // yellow-50
                        border: '1px solid #fde047', // yellow-200
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#854d0e' // yellow-700
                    }, children: "You must change your password before continuing." })), errorMessage !== null && (_jsx("div", { role: "alert", style: {
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#b91c1c'
                    }, children: errorMessage })), _jsxs("form", { onSubmit: (e) => { void handleSubmit(onSubmit)(e); }, noValidate: true, style: { display: 'flex', flexDirection: 'column', gap: '20px' }, children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "current-password", style: { fontSize: '14px', fontWeight: '500', color: '#1c1917' }, children: "Current Password" }), _jsx("input", { id: "current-password", type: "password", autoComplete: "current-password", "aria-invalid": errors.currentPassword !== undefined, ...register('currentPassword', { required: 'Current password is required' }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.currentPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.currentPassword && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.currentPassword.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "new-password", style: { fontSize: '14px', fontWeight: '500', color: '#1c1917' }, children: "New Password" }), _jsx("input", { id: "new-password", type: "password", autoComplete: "new-password", "aria-invalid": errors.newPassword !== undefined, ...register('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.newPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.newPassword && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.newPassword.message }))] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [_jsx("label", { htmlFor: "confirm-password", style: { fontSize: '14px', fontWeight: '500', color: '#1c1917' }, children: "Confirm New Password" }), _jsx("input", { id: "confirm-password", type: "password", autoComplete: "new-password", "aria-invalid": errors.confirmPassword !== undefined, ...register('confirmPassword', {
                                        required: 'Please confirm your new password',
                                        validate: (value) => value === newPassword || 'Passwords do not match'
                                    }), style: {
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: errors.confirmPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                                        fontSize: '14px',
                                        color: '#1c1917',
                                        outline: 'none',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    } }), errors.confirmPassword && (_jsx("span", { role: "alert", style: { fontSize: '12px', color: '#b91c1c' }, children: errors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isSubmitting, style: {
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
                            }, children: isSubmitting ? 'Changing Password...' : 'Change Password' })] })] }) }));
}
