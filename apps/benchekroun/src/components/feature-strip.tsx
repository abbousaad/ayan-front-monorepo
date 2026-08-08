import { Fragment } from 'react';

import { useI18n } from '../contexts/i18n-context';
import { useBrandCopy } from '../i18n/use-brand-copy';

// Thin gold-ruled band of brand promises, separated by small gold diamonds.
export function FeatureStrip() {
  const copy = useBrandCopy();
  const { locale } = useI18n();

  // Letter-spacing + uppercase suit Latin script; Arabic must stay plain so
  // its letters keep connecting.
  const labelClass =
    locale === 'ar'
      ? 'text-sm font-medium text-brand-gold-soft/80'
      : 'text-xs font-medium uppercase tracking-[0.28em] text-brand-gold-soft/80';

  return (
    <section className="border-y border-brand-gold-dim/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
        {copy.features.map((feature, index) => (
          <Fragment key={feature}>
            {index > 0 && (
              <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand-gold-dim" />
            )}
            <span className={labelClass}>{feature}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
