import { createImageUrl } from '@acme/api-client';
import { type Product } from '@acme/api-client/products';
import { brandColors } from '@acme/shared';
import { FiShoppingCart } from 'react-icons/fi';

import { useCart } from '../cart/use-cart';

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

const getProductDescription = (description: Product['description']) =>
  description ?? 'A reliable everyday staple with clean ingredients and easy prep.';

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addCartItem, clearCartItems, openCart } = useCart();

  const handleAddToCart = () => {
    const result = addCartItem({
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 1,
      storeId: product.storeId,
      unit: product.unit
    });

    if (!result.ok) {
      const shouldReplaceCart = window.confirm('Your cart already contains items from another store. Clear it and add this item instead?');

      if (!shouldReplaceCart) {
        return;
      }

      clearCartItems();
      addCartItem({
        imageUrl: product.imageUrl,
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        storeId: product.storeId,
        unit: product.unit
      });
    }

    openCart();
  };

  return (
    <article className="flex h-full max-w-[220px] flex-col rounded-[1.25rem] border border-stone-200 bg-white p-3 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-[1rem] bg-stone-50">
        <img alt={product.name} className="max-h-full w-full object-contain" src={createImageUrl(product.imageUrl)} />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold leading-5 text-stone-900">{product.name}</h2>
          <p className="line-clamp-2 text-xs leading-5 text-stone-600">{getProductDescription(product.description)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-stone-900">
            {formatPrice(product.price)}
            <span className="ml-1 text-xs font-medium text-stone-500">/ {product.unit}</span>
          </p>

          <button
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full p-2.5 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={handleAddToCart}
            style={{ backgroundColor: brandColors.logoGreen, color: brandColors.white }}
            type="button"
          >
            <FiShoppingCart aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};
