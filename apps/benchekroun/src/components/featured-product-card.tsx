import { createImageUrl } from '@acme/api-client';
import type { Product } from '@acme/api-client/products';
import { Link } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { useI18n } from '../contexts/i18n-context';
import { useBrandCopy } from '../i18n/use-brand-copy';
import { formatPrice } from '../lib/format';

type FeaturedProductCardProps = {
  product: Product;
  categoryLabel?: string;
};

export function FeaturedProductCard({ product, categoryLabel }: FeaturedProductCardProps) {
  const { addCartItem, openCart } = useCart();
  const { locale } = useI18n();
  const copy = useBrandCopy();
  const soldOut = product.stock === 0;

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addCartItem({
      currencyCode: product.currencyCode,
      productId: product.id,
      name: product.name,
      price: product.price,
      storeId: product.storeId,
      imageUrl: product.imageUrl,
      unit: product.unit
    });
    openCart();
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-brand-charcoal transition hover:border-brand-gold-dim">
      <Link className="hero-hatch relative block" to={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            alt={product.name}
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
            src={createImageUrl(product.imageUrl)}
          />
          {categoryLabel && (
            <span className="absolute end-3 top-3 rounded border border-brand-gold-dim/70 bg-brand-black/50 px-2 py-1 text-[11px] font-medium text-brand-gold">
              {categoryLabel}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 border-t border-brand-line p-4 text-start">
        <div>
          <h3 className="font-display text-lg font-semibold text-brand-ink">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          {product.description && (
            <p className="mt-1 text-xs italic text-brand-muted">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-brand-gold">
            {formatPrice(product.price, locale, product.currencyCode)}
          </span>
          <button
            className="inline-flex min-h-10 items-center justify-center border border-brand-gold-dim px-4 text-xs font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal disabled:opacity-40"
            disabled={soldOut}
            onClick={handleAdd}
            type="button"
          >
            {soldOut ? copy.outOfStock : copy.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
