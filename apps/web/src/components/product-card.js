import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createImageUrl } from '@acme/api-client';
import { brandColors } from '@acme/shared';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/use-cart';
const formatPrice = (price, currencyCode = 'USD') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
}).format(price);
const getProductDescription = (description) => description ?? 'A reliable everyday staple with clean ingredients and easy prep.';
export const ProductCard = ({ product }) => {
    const { addCartItem, openCart } = useCart();
    const handleAddToCart = (event) => {
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
    return (_jsxs(Link, { className: "flex h-full max-w-[220px] flex-col rounded-[1.25rem] border border-stone-200 bg-white p-3 transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", to: `/products/${product.id}`, children: [_jsx("div", { className: "flex h-32 items-center justify-center overflow-hidden rounded-[1rem] bg-stone-50", children: _jsx("img", { alt: product.name, className: "max-h-full w-full object-contain", src: createImageUrl(product.imageUrl) }) }), _jsxs("div", { className: "mt-3 flex flex-1 flex-col gap-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("h2", { className: "text-base font-semibold leading-5 text-stone-900", children: product.name }), _jsx("p", { className: "line-clamp-2 text-xs leading-5 text-stone-600", children: getProductDescription(product.description) })] }), _jsxs("div", { className: "mt-auto flex items-center justify-between gap-2", children: [_jsxs("p", { className: "text-sm font-semibold text-stone-900", children: [formatPrice(product.price, product.currencyCode ?? 'USD'), _jsxs("span", { className: "ml-1 text-xs font-medium text-stone-500", children: ["/ ", product.unit] })] }), _jsx("button", { "aria-label": `Add ${product.name} to cart`, className: "inline-flex min-h-9 min-w-9 items-center justify-center rounded-full p-2.5 transition focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: handleAddToCart, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: _jsx(FiShoppingCart, { "aria-hidden": "true", size: 16 }) })] })] })] }));
};
