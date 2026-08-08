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
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-line bg-brand-charcoal transition hover:border-brand-gold-dim focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black"
      to={`/category/${store.id}`}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-brand-panel">
        <img
          alt=""
          aria-hidden
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={createImageUrl(store.imageUrl)}
        />
      </div>

      {/* Divided text panel: title + discover button */}
      <div className="flex flex-col items-center gap-2 border-t border-brand-line p-3 text-center">
        <h3 className="font-display text-sm font-semibold leading-tight text-brand-ink">{store.name}</h3>
        <span className="gold-rule h-px w-8" />
        <span className="inline-flex items-center gap-1 rounded-full border border-brand-gold-dim/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-gold transition group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black">
          {copy.viewCategory}
          <FiArrowRight aria-hidden className="rtl:rotate-180" size={11} />
        </span>
      </div>
    </Link>
  );
}
