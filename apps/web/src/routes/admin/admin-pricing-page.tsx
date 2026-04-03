import { ApiClientError } from '@acme/api-client';
import { getPricingConfig, updatePricingConfig } from '@acme/api-client/admin';
import type { PricingConfig, UpdatePricingConfigInput } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAdminAuth } from '../../admin/use-admin-auth';

type PricingFormValues = PricingConfig;

export function AdminPricingPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PricingFormValues>({
    defaultValues: {
      deliveryFee: 0,
      serviceFeeRate: 0,
      taxRate: 0,
      discountRate: 0
    }
  });

  const fetchPricingConfig = async (): Promise<void> => {
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
    void fetchPricingConfig();
  }, [token]);

  const onSubmit = async (values: PricingFormValues): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('You must be signed in to update pricing configuration.');
      return;
    }

    const input: UpdatePricingConfigInput = {
      deliveryFee: values.deliveryFee,
      serviceFeeRate: values.serviceFeeRate,
      taxRate: values.taxRate,
      discountRate: values.discountRate
    };

    try {
      const updated = await updatePricingConfig(input, token);
      reset(updated);
      setSuccessMessage('Pricing configuration updated successfully.');
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
        Pricing Configuration
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
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="delivery-fee" style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}>
                Delivery Fee
              </label>
              <input
                id="delivery-fee"
                type="number"
                step="1"
                aria-invalid={errors.deliveryFee !== undefined}
                disabled={isLoading}
                {...register('deliveryFee', { required: 'Delivery fee is required', valueAsNumber: true })}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.deliveryFee ? '1px solid #f87171' : '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              {errors.deliveryFee && (
                <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                  {errors.deliveryFee.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="service-fee" style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}>
                Service Fee Rate
              </label>
              <input
                id="service-fee"
                type="number"
                step="0.01"
                aria-invalid={errors.serviceFeeRate !== undefined}
                disabled={isLoading}
                {...register('serviceFeeRate', { required: 'Service fee rate is required', valueAsNumber: true })}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.serviceFeeRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              {errors.serviceFeeRate && (
                <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                  {errors.serviceFeeRate.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="tax-rate" style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}>
                Tax Rate
              </label>
              <input
                id="tax-rate"
                type="number"
                step="0.01"
                aria-invalid={errors.taxRate !== undefined}
                disabled={isLoading}
                {...register('taxRate', { required: 'Tax rate is required', valueAsNumber: true })}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.taxRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              {errors.taxRate && (
                <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                  {errors.taxRate.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="discount-rate" style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}>
                Discount Rate
              </label>
              <input
                id="discount-rate"
                type="number"
                step="0.01"
                aria-invalid={errors.discountRate !== undefined}
                disabled={isLoading}
                {...register('discountRate', { required: 'Discount rate is required', valueAsNumber: true })}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: errors.discountRate ? '1px solid #f87171' : '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              {errors.discountRate && (
                <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                  {errors.discountRate.message}
                </span>
              )}
            </div>
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
                Loading pricing configuration...
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
