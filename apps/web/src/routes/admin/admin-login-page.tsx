import { ApiClientError } from '@acme/api-client';
import { isAuthUser } from '@acme/api-client/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ADMIN_SESSION_USER_KEY } from '../../admin/admin-auth-provider';
import { useAdminAuth } from '../../admin/use-admin-auth';

type LoginFormValues = {
  username: string;
  password: string;
};

export function AdminLoginPage(): React.JSX.Element {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
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
        const parsedStoredUser = JSON.parse(storedUserRaw) as unknown;
        const storedUser = isAuthUser(parsedStoredUser) ? parsedStoredUser : null;

        if (storedUser?.mustChangePassword) {
          void navigate('/admin/change-password');
          return;
        }
      }

      void navigate('/admin');
    } catch (err) {
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
            Ayan Admin
          </h1>
          <p style={{ fontSize: '14px', color: '#78716c', margin: 0 }}>
            Sign in to your admin account
          </p>
        </div>

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
          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="username"
              style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              aria-invalid={errors.username !== undefined}
              {...register('username', { required: 'Username is required' })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.username ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.username && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="password"
              style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.password !== undefined}
              {...register('password', { required: 'Password is required' })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.password ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.password.message}
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
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
