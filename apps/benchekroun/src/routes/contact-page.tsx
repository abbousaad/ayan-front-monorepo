import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheckCircle, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

import { useBrandCopy } from '../i18n/use-brand-copy';

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const inputClass =
  'w-full rounded-2xl border border-brand-line bg-brand-charcoal px-4 py-3 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-gold-dim focus:outline-none focus:ring-2 focus:ring-brand-gold';
const labelClass = 'block text-sm font-medium text-brand-muted';
const errorClass = 'mt-1 text-xs text-red-600';

function InfoRow({ icon, value, ltr = false }: { icon: React.ReactNode; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-line text-gold-ink">
        {icon}
      </span>
      <span className="text-sm text-brand-ink" dir={ltr ? 'ltr' : undefined}>
        {value}
      </span>
    </div>
  );
}

export function ContactPage() {
  const copy = useBrandCopy();
  const [sent, setSent] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<FormValues>();

  const onSubmit = () => {
    // No backend endpoint for messages yet — acknowledge locally.
    setSent(true);
  };

  return (
    <main className="surface-light min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold-ink">{copy.contactEyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">{copy.contactTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-brand-muted">{copy.contactSubtitle}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Info */}
        <div className="space-y-5 rounded-2xl border border-brand-line bg-brand-charcoal p-6">
          <h2 className="font-display text-xl font-semibold text-brand-ink">{copy.contactInfoTitle}</h2>
          <InfoRow icon={<FiPhone size={16} />} ltr value={copy.contactPhoneValue} />
          <InfoRow icon={<FiMail size={16} />} ltr value={copy.contactEmailValue} />
          <InfoRow icon={<FiMapPin size={16} />} value={copy.contactAddressValue} />
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-brand-line bg-brand-charcoal p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold-dim text-gold-ink">
                <FiCheckCircle size={30} />
              </span>
              <p className="text-sm text-brand-ink">{copy.contactSuccess}</p>
            </div>
          ) : (
            <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className={labelClass} htmlFor="contact-name">
                  {copy.fullName}
                </label>
                <input
                  autoComplete="name"
                  className={`mt-1 ${inputClass}`}
                  id="contact-name"
                  type="text"
                  {...register('name', { required: copy.nameRequired })}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="contact-email">
                  {copy.contactEmailLabel}
                </label>
                <input
                  autoComplete="email"
                  className={`mt-1 ${inputClass}`}
                  dir="ltr"
                  id="contact-email"
                  type="email"
                  {...register('email', { required: copy.contactEmailLabel })}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="contact-message">
                  {copy.contactMessageLabel}
                </label>
                <textarea
                  className={`mt-1 ${inputClass} min-h-28 resize-none`}
                  id="contact-message"
                  {...register('message', { required: copy.contactMessageLabel })}
                />
                {errors.message && <p className={errorClass}>{errors.message.message}</p>}
              </div>

              <button
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
                type="submit"
              >
                {copy.contactSend}
              </button>
            </form>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}
