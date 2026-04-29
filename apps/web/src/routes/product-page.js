import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createImageUrl, ApiClientError } from '@acme/api-client';
import { getProductById } from '@acme/api-client/products';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useCart } from '../cart/use-cart';
const initialState = {
    product: null,
    errorMessage: null,
    isLoading: true
};
const getErrorMessage = (error) => error instanceof Error ? error.message : 'Unable to load this product right now.';
const formatPrice = (price, currencyCode = 'USD') => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
}).format(price);
const LoadingState = () => (_jsx("div", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsx("div", { className: "aspect-square animate-pulse rounded-[2rem] bg-stone-100" }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-4 w-24 animate-pulse rounded-full bg-stone-100" }), _jsx("div", { className: "h-10 w-3/4 animate-pulse rounded-full bg-stone-100" }), _jsx("div", { className: "h-6 w-32 animate-pulse rounded-full bg-stone-100" }), _jsxs("div", { className: "mt-8 space-y-3", children: [_jsx("div", { className: "h-4 w-full animate-pulse rounded-full bg-stone-100" }), _jsx("div", { className: "h-4 w-5/6 animate-pulse rounded-full bg-stone-100" }), _jsx("div", { className: "h-4 w-4/6 animate-pulse rounded-full bg-stone-100" })] })] })] }) }));
const ErrorState = ({ errorMessage, onRetry }) => (_jsx("div", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-amber-700", children: "Product" }), _jsx("h2", { className: "mt-2 text-2xl font-semibold text-stone-900", children: "We couldn't load this product" }), _jsx("p", { className: "mt-4 text-base leading-7 text-stone-600", children: errorMessage }), _jsx("button", { className: "mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: onRetry, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: "Try again" })] }) }));
const NotFoundState = () => (_jsx("div", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-amber-700", children: "Product" }), _jsx("h2", { className: "mt-2 text-2xl font-semibold text-stone-900", children: "Product not found" }), _jsx("p", { className: "mt-4 text-base leading-7 text-stone-600", children: "This product may have been removed or doesn't exist." }), _jsx(Link, { className: "mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2", to: "/products", children: "Browse all products" })] }) }));
export function ProductPage() {
    const { productId } = useParams();
    const { addCartItem, openCart } = useCart();
    const [state, setState] = useState(initialState);
    const [quantity, setQuantity] = useState(1);
    const loadProduct = useCallback(async () => {
        if (!productId) {
            setState({
                product: null,
                errorMessage: 'Product ID is required.',
                isLoading: false
            });
            return;
        }
        setState((currentState) => ({
            ...currentState,
            errorMessage: null,
            isLoading: true
        }));
        try {
            const response = await getProductById(productId);
            setState({
                product: response.data,
                errorMessage: null,
                isLoading: false
            });
        }
        catch (error) {
            if (error instanceof ApiClientError && error.status === 404) {
                setState({
                    product: null,
                    errorMessage: null,
                    isLoading: false
                });
                return;
            }
            setState({
                product: null,
                errorMessage: getErrorMessage(error),
                isLoading: false
            });
        }
    }, [productId]);
    useEffect(() => {
        void loadProduct();
    }, [loadProduct]);
    const handleAddToCart = () => {
        if (!state.product)
            return;
        addCartItem({
            productId: state.product.id,
            name: state.product.name,
            price: state.product.price,
            storeId: state.product.storeId,
            imageUrl: state.product.imageUrl,
            currencyCode: state.product.currencyCode,
            unit: state.product.unit,
            quantity
        });
        openCart();
    };
    const incrementQuantity = () => {
        setQuantity((current) => current + 1);
    };
    const decrementQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };
    if (!productId) {
        return _jsx(Navigate, { replace: true, to: "/products" });
    }
    if (state.isLoading) {
        return (_jsx("main", { className: "min-h-screen bg-white", children: _jsx(LoadingState, {}) }));
    }
    if (state.errorMessage) {
        return (_jsx("main", { className: "min-h-screen bg-white", children: _jsx(ErrorState, { errorMessage: state.errorMessage, onRetry: loadProduct }) }));
    }
    if (!state.product) {
        return (_jsx("main", { className: "min-h-screen bg-white", children: _jsx(NotFoundState, {}) }));
    }
    const product = state.product;
    const stockStatus = product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock';
    const stockColor = product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600';
    return (_jsx("main", { className: "min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(Link, { className: "mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-600 transition hover:text-stone-900", to: "/products", children: [_jsx(FiChevronLeft, { "aria-hidden": "true", size: 16 }), "Back to products"] }), _jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsx("div", { className: "aspect-square overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: _jsx("img", { alt: product.name, className: "h-full w-full object-contain", src: createImageUrl(product.imageUrl) }) }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx(Link, { className: "text-sm font-medium text-amber-700 hover:text-amber-800", to: `/stores/${product.storeId}/products`, children: "View store" }), _jsx("h1", { className: "mt-2 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl", children: product.name }), _jsxs("p", { className: "mt-4 text-2xl font-semibold text-stone-900", children: [formatPrice(product.price, product.currencyCode ?? 'USD'), _jsxs("span", { className: "ml-2 text-base font-normal text-stone-500", children: ["/ ", product.unit] })] })] }), product.description && (_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-stone-500", children: "Description" }), _jsx("p", { className: "text-base leading-7 text-stone-600", children: product.description })] })), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: `text-sm font-medium ${stockColor}`, children: stockStatus }) }), _jsxs("div", { className: "mt-auto space-y-4", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "flex items-center gap-2 rounded-full border border-stone-200 bg-white p-1", children: [_jsx("button", { "aria-label": "Decrease quantity", className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300", disabled: quantity <= 1, onClick: decrementQuantity, type: "button", children: _jsx(FiMinus, { "aria-hidden": "true", size: 16 }) }), _jsx("span", { className: "w-12 text-center text-base font-medium text-stone-900", children: quantity }), _jsx("button", { "aria-label": "Increase quantity", className: "inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300", onClick: incrementQuantity, type: "button", children: _jsx(FiPlus, { "aria-hidden": "true", size: 16 }) })] }) }), _jsx("button", { className: "inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50", disabled: product.stock === 0, onClick: handleAddToCart, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: product.stock === 0 ? 'Out of stock' : 'Add to cart' })] })] })] })] }) }));
}
