import { ApiClientError, createPublicOrder } from '@acme/api-client';
import type { PublicOrder } from '@acme/api-client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiTruck } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useBrandCopy } from '../../i18n/use-brand-copy';

type FormValues = {
  name: string;
  phone: string;
  address: string;
};

type GuestCheckoutFormProps = {
  onSuccess: (order: PublicOrder) => void;
};

const inputClass =
  'w-full rounded-2xl border border-brand-line bg-brand-charcoal px-4 py-3 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-gold-dim focus:outline-none focus:ring-2 focus:ring-brand-gold';

const labelClass = 'block text-sm font-medium text-brand-muted';
const errorClass = 'mt-1 text-xs text-red-400';

export function GuestCheckoutForm({ onSuccess }: GuestCheckoutFormProps) {
  const { state } = useCart();
  const copy = useBrandCopy();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      const order = await createPublicOrder({
        // Cash-on-delivery: instant delivery, paid on receipt.
        deliveryMode: 'instant',
        guest: {
          name: values.name,
          phone: values.phone,
          address: values.address
        },
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      onSuccess(order);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(copy.submitError);
      }
    }
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{copy.checkoutEyebrow}</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-brand-ink">{copy.contactDetails}</h2>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-gold-dim/40 bg-brand-charcoal px-4 py-3">
        <FiTruck aria-hidden="true" className="mt-0.5 shrink-0 text-brand-gold" size={18} />
        <div>
          <p className="text-sm font-semibold text-brand-ink">{copy.cashOnDelivery}</p>
          <p className="text-xs text-brand-muted">{copy.cashOnDeliveryNote}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="checkout-name">
            {copy.fullName} <span aria-hidden="true" className="text-brand-gold">*</span>
          </label>
          <input
            autoComplete="name"
            className={`mt-1 ${inputClass}`}
            id="checkout-name"
            type="text"
            {...register('name', { required: copy.nameRequired })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="checkout-phone">
            {copy.phone} <span aria-hidden="true" className="text-brand-gold">*</span>
          </label>
          <input
            autoComplete="tel"
            className={`mt-1 ${inputClass}`}
            dir="ltr"
            id="checkout-phone"
            inputMode="tel"
            type="tel"
            {...register('phone', { required: copy.phoneRequired })}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="checkout-address">
            {copy.address} <span aria-hidden="true" className="text-brand-gold">*</span>
          </label>
          <textarea
            autoComplete="street-address"
            className={`mt-1 ${inputClass} min-h-24 resize-none`}
            id="checkout-address"
            {...register('address', { required: copy.addressRequired })}
          />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {submitError}
        </div>
      )}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? copy.placingOrder : copy.placeOrder}
      </button>
    </form>
  );
}
