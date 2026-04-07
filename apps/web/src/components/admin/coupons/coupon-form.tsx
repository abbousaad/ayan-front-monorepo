import type { DiscountType } from '@acme/api-client/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type CouponFormValues = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  maxUses: string;
};

type CouponFormProps = {
  initialValues?: CouponFormValues;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #d6d3d1',
  fontSize: '14px',
  color: '#1c1917',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const
};

const errorInputStyle = {
  ...inputStyle,
  border: '1px solid #f87171'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '500' as const,
  color: '#1c1917'
};

export function CouponForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}: CouponFormProps): React.JSX.Element {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CouponFormValues>({
    defaultValues: initialValues ?? {
      code: '',
      discountType: 'fixed',
      discountValue: 0,
      startsAt: '',
      endsAt: '',
      isActive: true,
      maxUses: ''
    }
  });

  const handleFormSubmit = async (values: CouponFormValues): Promise<void> => {
    setApiError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form
      onSubmit={(e) => { void handleSubmit(handleFormSubmit)(e); }}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {apiError !== null && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '14px',
            color: '#b91c1c'
          }}
        >
          {apiError}
        </div>
      )}

      {/* Code */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="coupon-code" style={labelStyle}>Code</label>
        <input
          id="coupon-code"
          type="text"
          {...register('code', { required: 'Code is required' })}
          style={errors.code ? errorInputStyle : inputStyle}
          placeholder="e.g. SUMMER20"
        />
        {errors.code && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.code.message}</span>
        )}
      </div>

      {/* Discount Type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={labelStyle}>Discount Type</label>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              value="fixed"
              {...register('discountType')}
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: '14px', color: '#1c1917' }}>Fixed (MAD)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              value="percentage"
              {...register('discountType')}
              style={{ margin: 0 }}
            />
            <span style={{ fontSize: '14px', color: '#1c1917' }}>Percentage (%)</span>
          </label>
        </div>
      </div>

      {/* Discount Value */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="coupon-value" style={labelStyle}>Discount Value</label>
        <input
          id="coupon-value"
          type="number"
          step="0.01"
          min="0"
          {...register('discountValue', { required: 'Value is required', min: { value: 0.01, message: 'Value must be greater than 0' }, valueAsNumber: true })}
          style={errors.discountValue ? errorInputStyle : inputStyle}
        />
        {errors.discountValue && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.discountValue.message}</span>
        )}
      </div>

      {/* Starts At */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="coupon-starts" style={labelStyle}>Starts At</label>
        <input
          id="coupon-starts"
          type="date"
          {...register('startsAt', { required: 'Start date is required' })}
          style={errors.startsAt ? errorInputStyle : inputStyle}
        />
        {errors.startsAt && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.startsAt.message}</span>
        )}
      </div>

      {/* Ends At */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="coupon-ends" style={labelStyle}>Ends At</label>
        <input
          id="coupon-ends"
          type="date"
          {...register('endsAt', { required: 'End date is required' })}
          style={errors.endsAt ? errorInputStyle : inputStyle}
        />
        {errors.endsAt && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.endsAt.message}</span>
        )}
      </div>

      {/* Max Uses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="coupon-max-uses" style={labelStyle}>Max Uses (leave empty for unlimited)</label>
        <input
          id="coupon-max-uses"
          type="number"
          min="1"
          {...register('maxUses')}
          style={inputStyle}
          placeholder="Unlimited"
        />
      </div>

      {/* Is Active */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id="coupon-active"
          type="checkbox"
          {...register('isActive')}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label htmlFor="coupon-active" style={{ ...labelStyle, cursor: 'pointer' }}>
          Active
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid #d6d3d1',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: '#1c1917',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isSubmitting ? '#a7c4b8' : '#1f6446',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}