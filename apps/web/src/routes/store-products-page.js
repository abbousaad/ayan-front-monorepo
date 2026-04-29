import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getStoreById, getStoreProducts } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { createImageUrl } from '@acme/api-client';
import { ProductCard } from '../components/product-card';
const initialState = {
    errorMessage: null,
    isLoading: true,
    products: [],
    store: null
};
const getErrorMessage = (error) => error instanceof Error ? error.message : 'Unable to load this store right now.';
const LoadingState = () => (_jsx("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", role: "status", children: Array.from({ length: 6 }, (_, index) => (_jsxs("div", { className: "h-72 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70 p-6 shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: [_jsx("div", { className: "h-32 rounded-[1.5rem] bg-stone-100" }), _jsx("div", { className: "mt-5 h-4 w-24 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-4 h-7 w-3/4 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-3 h-4 w-full rounded-full bg-stone-100" }), _jsx("div", { className: "mt-2 h-4 w-5/6 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-8 h-12 rounded-full bg-stone-100" })] }, `loading-card-${index}`))) }));
const MessageState = ({ actionLabel, description, onAction, title }) => (_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: _jsxs("div", { className: "mx-auto max-w-lg space-y-4", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-amber-700", children: "Store products" }), _jsx("h2", { className: "text-2xl font-semibold text-stone-900", children: title }), _jsx("p", { className: "text-base leading-7 text-stone-600", children: description }), actionLabel && onAction ? (_jsx("button", { className: "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: onAction, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: actionLabel })) : null] }) }));
export const StoreProductsPage = () => {
    const { storeId } = useParams();
    const [{ errorMessage, isLoading, products, store }, setState] = useState(initialState);
    const loadStoreProducts = useCallback(async () => {
        if (!storeId) {
            setState({
                errorMessage: 'A store id is required to load this page.',
                isLoading: false,
                products: [],
                store: null
            });
            return;
        }
        setState((currentState) => ({
            ...currentState,
            errorMessage: null,
            isLoading: true
        }));
        try {
            const [storeResponse, productsResponse] = await Promise.all([
                getStoreById(storeId),
                getStoreProducts(storeId)
            ]);
            setState({
                errorMessage: null,
                isLoading: false,
                products: productsResponse.data,
                store: storeResponse.data
            });
        }
        catch (error) {
            setState({
                errorMessage: getErrorMessage(error),
                isLoading: false,
                products: [],
                store: null
            });
        }
    }, [storeId]);
    useEffect(() => {
        void loadStoreProducts();
    }, [loadStoreProducts]);
    return (_jsx("main", { className: "min-h-screen bg-white px-6 py-10 text-stone-900 md:px-8 md:py-14", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-10", children: [_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-white p-8 md:p-10", children: _jsxs("div", { className: "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-3xl space-y-4", children: [_jsx(Link, { "aria-label": "Back home", className: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-900 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", to: "/", children: _jsx(FiChevronLeft, { "aria-hidden": "true", size: 20 }) }), _jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.35em] text-amber-700", children: "Store collection" }), _jsx("h1", { className: "text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl", children: store ? `${store.name} products` : 'Curated store products' }), _jsx("p", { className: "max-w-2xl text-base leading-7 text-stone-600 md:text-lg", children: store
                                            ? `Browse the latest items from ${store.name} in the same warm, calm shopping experience used across the catalog.`
                                            : 'Browse a focused store assortment with a calm layout, quick actions, and clear availability.' })] }), _jsx("div", { className: "flex w-full max-w-md flex-col gap-4 rounded-[1.75rem] bg-white p-4", children: store ? (_jsx("img", { alt: store.name, className: "h-72 w-full object-contain", src: createImageUrl(store.imageUrl) })) : null })] }) }), isLoading ? _jsx(LoadingState, {}) : null, !isLoading && errorMessage ? (_jsx(MessageState, { actionLabel: "Try again", description: errorMessage, onAction: () => {
                        void loadStoreProducts();
                    }, title: "We couldn't load this store collection" })) : null, !isLoading && !errorMessage && products.length === 0 ? (_jsx(MessageState, { description: "This store does not have products available yet. Check back again soon.", title: "Nothing to browse just yet" })) : null, !isLoading && !errorMessage && store && products.length > 0 ? (_jsx("section", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6", children: products.map((product) => (_jsx(ProductCard, { product: product }, product.id))) })) : null] }) }));
};
