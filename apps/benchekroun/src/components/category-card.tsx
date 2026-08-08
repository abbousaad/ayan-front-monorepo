import { createImageUrl } from '@acme/api-client';
import type { Store } from '@acme/api-client/stores';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useBrandCopy } from '../i18n/use-brand-copy';

type CategoryCardProps = {
  store: Store;
};

// A backend store rendered as a browsable category tile → its own products page.
export function CategoryCard({ store }: CategoryCardProps) {
  const copy = useBrandCopy();

  return (
    <Link
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl border border-brand-line transition hover:border-brand-gold-dim focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black"
      to={`/category/${store.id}`}
    >
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-60"
        src={createImageUrl(store.imageUrl)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />

      <div className="relative mt-auto p-3 text-center">
        <h3 className="font-display text-sm font-semibold leading-tight text-brand-ink">{store.name}</h3>
        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-gold">
          {copy.viewCategory}
          <FiArrowRight aria-hidden className="rtl:rotate-180" size={11} />
        </span>
      </div>
    </Link>
  );
}
