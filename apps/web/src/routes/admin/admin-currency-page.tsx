import { ApiClientError } from '@acme/api-client';
import { getCurrencySetting, updateCurrencySetting } from '@acme/api-client/admin';
import type { CurrencySettingInput } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAdminAuth } from '../../admin/use-admin-auth';

type CurrencyFormValues = {
  currencyCode: string;
};

export function AdminCurrencyPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CurrencyFormValues>({
    defaultValues: {
      currencyCode: ''
    }
  });

  const fetchCurrencySetting = async (): Promise<void> => {
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
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCurrencySetting();
  }, [token]);

  const onSubmit = async (values: CurrencyFormValues): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('You must be signed in to update currency settings.');
      return;
    }

    const input: CurrencySettingInput = {
      currencyCode: values.currencyCode.trim()
    };

    try {
      const updated = await updateCurrencySetting(input, token);
      reset({ currencyCode: updated.currencyCode });
      setSuccessMessage('Currency settings updated successfully.');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 12px' }}>
        Currency Settings
      </h1>

      {(successMessage || errorMessage) && (
        <div
          role="alert"
          style={{
            backgroundColor: successMessage ? '#ecfdf3' : '#fef2f2',
            border: successMessage ? '1px solid #bbf7d0' : '1px solid #fecaca',
            color: successMessage ? '#166534' : '#b91c1c',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          {successMessage ?? errorMessage}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <form
          onSubmit={(event) => { void handleSubmit(onSubmit)(event); }}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '360px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="currency-code" style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}>
              Currency Code
            </label>
            <input
              id="currency-code"
              type="text"
              aria-invalid={errors.currencyCode !== undefined}
              disabled={isLoading}
              placeholder="e.g. DZD"
              {...register('currencyCode', { required: 'Currency code is required' })}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: errors.currencyCode ? '1px solid #f87171' : '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
            {errors.currencyCode && (
              <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                {errors.currencyCode.message}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{
                padding: '10px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isSubmitting || isLoading ? '#a7c4b8' : '#1f6446',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            {isLoading && (
              <span style={{ fontSize: '13px', color: '#78716c' }}>
                Loading currency settings...
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
