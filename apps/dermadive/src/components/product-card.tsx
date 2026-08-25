import { createImageUrl } from '@acme/api-client';
import type { Product } from '@acme/api-client/products';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { useI18n } from '../contexts/i18n-context';
import { useLocalized } from '../hooks/use-localized';
import { useBrandCopy } from '../i18n/use-brand-copy';
import { formatPrice } from '../lib/format';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addCartItem, openCart } = useCart();
  const { locale } = useI18n();
  const tr = useLocalized();
  const copy = useBrandCopy();
  const soldOut = product.stock === 0;
  const name = tr(product.nameLocalized, product.name);
  const description = tr(product.descriptionLocalized, product.description ?? '');

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addCartItem({
      currencyCode: product.currencyCode,
      productId: product.id,
      name,
      price: product.price,
      storeId: product.storeId,
      imageUrl: product.imageUrl,
      unit: product.unit
    });
    openCart();
  };

  return (
    <Link
      className="group flex h-full flex-col border border-brume bg-blanc p-3 transition duration-200 hover:-translate-y-1 hover:border-encre focus:outline-none focus:ring-2 focus:ring-encre focus:ring-offset-2 focus:ring-offset-papier"
      to={`/products/${product.id}`}
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-papier">
        <img
          alt={name}
          className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
          src={createImageUrl(product.imageUrl)}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <h2 className="font-display text-lg font-semibold leading-6 text-encre">{name}</h2>
        {description && <p className="line-clamp-2 text-xs leading-5 text-encre-70">{description}</p>}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-sm font-semibold text-encre">
            {formatPrice(product.price, locale, product.currencyCode)}
            <span className="ms-1 text-xs font-medium text-encre-45">/ {product.unit}</span>
          </p>

          <button
            aria-label={`${copy.addToCart}: ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center bg-encre p-2.5 text-blanc transition hover:bg-encre-70 focus:outline-none focus:ring-2 focus:ring-encre focus:ring-offset-2 focus:ring-offset-blanc disabled:opacity-40"
            disabled={soldOut}
            onClick={handleAddToCart}
            type="button"
          >
            <FiPlus aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};
