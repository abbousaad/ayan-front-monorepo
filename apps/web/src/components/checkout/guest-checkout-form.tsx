import { ApiClientError, createPublicOrder } from '@acme/api-client';
import type { PublicOrder } from '@acme/api-client';
import { brandColors } from '@acme/shared';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCart } from '../../cart/use-cart';

type FormValues = {
  name: string;
  phone: string;
  address: string;
  email: string;
  deliveryMode: 'instant' | 'scheduled';
  scheduledAt: string;
};

type GuestCheckoutFormProps = {
  onSuccess: (order: PublicOrder) => void;
};

const inputClass =
  'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1';

const labelClass = 'block text-sm font-medium text-stone-700';

const errorClass = 'mt-1 text-xs text-red-600';

export function GuestCheckoutForm({ onSuccess }: GuestCheckoutFormProps) {
  const { state } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    resetField,
    watch
  } = useForm<FormValues>({
    defaultValues: {
      deliveryMode: 'instant',
      email: '',
      scheduledAt: ''
    }
  });

  const deliveryMode = watch('deliveryMode');

  useEffect(() => {
    if (deliveryMode !== 'scheduled') {
      resetField('scheduledAt');
    }
  }, [deliveryMode, resetField]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      const order = await createPublicOrder({
        deliveryMode: values.deliveryMode,
        guest: {
          address: values.address,
          email: values.email || undefined,
          name: values.name,
          phone: values.phone
        },
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        ...(values.deliveryMode === 'scheduled' && values.scheduledAt
          ? { scheduledAt: new Date(values.scheduledAt).toISOString() }
          : {})
      });

      onSuccess(order);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Your details</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-950">Delivery information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="checkout-name">
            Full name <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            autoComplete="name"
            className={`mt-1 ${inputClass}`}
            id="checkout-name"
            placeholder="Jane Doe"
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="checkout-phone">
            Phone number <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            autoComplete="tel"
            className={`mt-1 ${inputClass}`}
            id="checkout-phone"
            placeholder="+1 555 000 0000"
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="checkout-address">
            Delivery address <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <textarea
            autoComplete="street-address"
            className={`mt-1 ${inputClass} resize-none`}
            id="checkout-address"
            placeholder="123 Main St, City, State"
            rows={3}
            {...register('address', { required: 'Delivery address is required' })}
          />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="checkout-email">
            Email address <span className="text-stone-400">(optional)</span>
          </label>
          <input
            autoComplete="email"
            className={`mt-1 ${inputClass}`}
            id="checkout-email"
            placeholder="jane@example.com"
            type="email"
            {...register('email')}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <fieldset>
          <legend className={labelClass}>
            Delivery mode <span aria-hidden="true" className="text-red-500">*</span>
          </legend>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                className="accent-emerald-600"
                type="radio"
                value="instant"
                {...register('deliveryMode', { required: true })}
              />
              Instant delivery
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                className="accent-emerald-600"
                type="radio"
                value="scheduled"
                {...register('deliveryMode', { required: true })}
              />
              Scheduled delivery
            </label>
          </div>
        </fieldset>

        {deliveryMode === 'scheduled' && (
          <div>
            <label className={labelClass} htmlFor="checkout-scheduled-at">
              Scheduled date & time <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              className={`mt-1 ${inputClass}`}
              id="checkout-scheduled-at"
              type="datetime-local"
              {...register('scheduledAt', {
                required: deliveryMode === 'scheduled' ? 'Scheduled date and time is required' : false
              })}
            />
            {errors.scheduledAt && <p className={errorClass}>{errors.scheduledAt.message}</p>}
          </div>
        )}
      </div>

      {submitError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:opacity-50"
        disabled={isSubmitting}
        style={{ backgroundColor: brandColors.logoGreen, color: brandColors.white }}
        type="submit"
      >
        {isSubmitting ? 'Placing order…' : 'Place order'}
      </button>
    </form>
  );
}
