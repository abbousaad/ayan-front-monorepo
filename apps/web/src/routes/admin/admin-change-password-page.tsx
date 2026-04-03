import { ApiClientError } from '@acme/api-client';
import { changePassword } from '@acme/api-client/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAdminAuth } from '../../admin/use-admin-auth';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function AdminChangePasswordPage(): React.JSX.Element {
  const { token, user, updateUser, handleUnauthorized } = useAdminAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordFormValues>();

  const newPassword = watch('newPassword');

  const onSubmit = async (values: ChangePasswordFormValues): Promise<void> => {
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('You must be signed in to change password.');
      return;
    }

    try {
      await changePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        },
        token
      );

      // Clear mustChangePassword flag
      updateUser({ mustChangePassword: false });

      // Redirect to admin dashboard
      void navigate('/admin');
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f4' // stone-100
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          padding: '40px'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1c1917', // stone-900
              margin: '0 0 8px'
            }}
          >
            Change Password
          </h1>
          <p style={{ fontSize: '14px', color: '#78716c', margin: 0 }}>
            Enter your current password and choose a new one
          </p>
        </div>

        {/* Must Change Password Warning */}
        {user?.mustChangePassword === true && (
          <div
            role="alert"
            style={{
              backgroundColor: '#fefce8', // yellow-50
              border: '1px solid #fde047', // yellow-200
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#854d0e' // yellow-700
            }}
          >
            You must change your password before continuing.
          </div>
        )}

        {/* Error message */}
        {errorMessage !== null && (
          <div
            role="alert"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#b91c1c'
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Current Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="current-password"
              style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}
            >
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.currentPassword !== undefined}
              {...register('currentPassword', { required: 'Current password is required' })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.currentPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.currentPassword && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="new-password"
              style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={errors.newPassword !== undefined}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.newPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.newPassword && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="confirm-password"
              style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword !== undefined}
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (value) => value === newPassword || 'Passwords do not match'
              })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.confirmPassword ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.confirmPassword && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
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
            }}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
