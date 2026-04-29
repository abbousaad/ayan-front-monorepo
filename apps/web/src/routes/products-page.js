import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getProducts } from '@acme/api-client/products';
import { getStores } from '@acme/api-client/stores';
import { createImageUrl } from '@acme/api-client';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product-card';
const getErrorMessage = (error) => error instanceof Error ? error.message : 'Unable to load products right now.';
const initialProductsState = {
    products: [],
    errorMessage: null,
    isLoading: true
};
const initialStoresState = {
    stores: [],
    isLoadingStores: true
};
const LoadingState = () => (_jsx("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", role: "status", children: Array.from({ length: 6 }, (_, index) => (_jsxs("div", { className: "h-72 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70 p-6 shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: [_jsx("div", { className: "h-32 rounded-[1.5rem] bg-stone-100" }), _jsx("div", { className: "mt-5 h-4 w-24 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-4 h-7 w-3/4 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-3 h-4 w-full rounded-full bg-stone-100" }), _jsx("div", { className: "mt-2 h-4 w-5/6 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-8 h-12 rounded-full bg-stone-100" })] }, `loading-card-${index}`))) }));
const MessageState = ({ actionLabel, description, onAction, title }) => (_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: _jsxs("div", { className: "mx-auto max-w-lg space-y-4", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-amber-700", children: "Products" }), _jsx("h2", { className: "text-2xl font-semibold text-stone-900", children: title }), _jsx("p", { className: "text-base leading-7 text-stone-600", children: description }), actionLabel && onAction ? (_jsx("button", { className: "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: onAction, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: actionLabel })) : null] }) }));
const StoreFilterBar = ({ isLoading, onSelect, selectedStoreId, stores }) => (_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-stone-50 p-6 shadow-[0_18px_45px_rgba(120,98,70,0.05)]", children: _jsxs("div", { className: "grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8", children: [_jsxs("button", { className: `group flex flex-col items-center gap-2 transition-all duration-200 ${selectedStoreId === null ? 'scale-105' : 'hover:scale-105'}`, onClick: () => {
                    onSelect(null);
                }, type: "button", children: [_jsx("div", { className: `flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 transition-all duration-200 ${selectedStoreId === null
                            ? 'ring-4 ring-amber-500 ring-offset-2 shadow-lg shadow-amber-200/50'
                            : 'grayscale opacity-60 group-hover:opacity-80'}`, children: _jsx("svg", { className: "h-10 w-10 text-amber-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5 }) }) }), _jsx("span", { className: `text-sm font-medium transition-all duration-200 ${selectedStoreId === null ? 'text-amber-700' : 'text-stone-500 group-hover:text-stone-700'}`, children: "All Products" })] }), isLoading
                ? Array.from({ length: 4 }, (_, i) => (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "h-24 w-24 animate-pulse rounded-full bg-stone-200" }), _jsx("div", { className: "h-4 w-20 animate-pulse rounded-full bg-stone-200" })] }, i)))
                : stores.map((store) => (_jsxs("button", { className: `group flex flex-col items-center gap-2 transition-all duration-200 ${selectedStoreId === store.id ? 'scale-105' : 'hover:scale-105'}`, onClick: () => {
                        onSelect(store.id);
                    }, type: "button", children: [_jsx("img", { alt: store.name, className: `h-24 w-24 rounded-full object-cover transition-all duration-200 ${selectedStoreId === store.id
                                ? 'ring-4 ring-amber-500 ring-offset-2 shadow-lg shadow-amber-200/50'
                                : 'grayscale opacity-60 group-hover:opacity-80'}`, src: createImageUrl(store.imageUrl) }), _jsx("span", { className: `max-w-[96px] truncate text-center text-sm font-medium transition-all duration-200 ${selectedStoreId === store.id
                                ? 'text-amber-700'
                                : 'text-stone-500 group-hover:text-stone-700'}`, children: store.name })] }, store.id)))] }) }));
export const ProductsPage = () => {
    const [{ errorMessage, isLoading, products }, setProductsState] = useState(initialProductsState);
    const [{ isLoadingStores, stores }, setStoresState] = useState(initialStoresState);
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const syncProducts = useCallback(async (storeId) => {
        setProductsState((currentState) => ({
            ...currentState,
            errorMessage: null,
            isLoading: true
        }));
        try {
            const response = await getProducts(storeId ? { storeId } : undefined);
            setProductsState({
                products: response.data,
                errorMessage: null,
                isLoading: false
            });
        }
        catch (error) {
            setProductsState({
                products: [],
                errorMessage: getErrorMessage(error),
                isLoading: false
            });
        }
    }, []);
    const syncStores = useCallback(async () => {
        setStoresState((currentState) => ({
            ...currentState,
            isLoadingStores: true
        }));
        try {
            const response = await getStores();
            setStoresState({
                stores: response.data,
                isLoadingStores: false
            });
        }
        catch {
            setStoresState({
                stores: [],
                isLoadingStores: false
            });
        }
    }, []);
    const handleStoreSelect = useCallback(async (storeId) => {
        setSelectedStoreId(storeId);
        await syncProducts(storeId);
    }, [syncProducts]);
    useEffect(() => {
        let isSubscribed = true;
        const syncAll = async () => {
            await Promise.all([syncProducts(null), syncStores()]);
        };
        void syncAll();
        return () => {
            isSubscribed = false;
        };
    }, [syncProducts, syncStores]);
    return (_jsx("main", { className: "min-h-screen bg-white px-6 py-10 text-stone-900 md:px-8 md:py-14", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-10", children: [_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_18px_45px_rgba(120,98,70,0.08)] md:p-10", children: _jsx("div", { className: "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: _jsxs("div", { className: "max-w-3xl space-y-4", children: [_jsx(Link, { className: "inline-flex text-sm font-medium text-amber-800 transition hover:text-amber-700", to: "/", children: "\u2190 Back home" }), _jsx("h1", { className: "text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl", children: "All Products" })] }) }) }), _jsx(StoreFilterBar, { isLoading: isLoadingStores, onSelect: handleStoreSelect, selectedStoreId: selectedStoreId, stores: stores }), isLoading ? _jsx(LoadingState, {}) : null, !isLoading && errorMessage ? (_jsx(MessageState, { actionLabel: "Try again", description: errorMessage, onAction: () => {
                        void syncProducts(selectedStoreId);
                    }, title: "We couldn't load the product collection" })) : null, !isLoading && !errorMessage && products.length === 0 ? (_jsx(MessageState, { description: "No products are available yet. Check back after the catalog is populated.", title: "Nothing to browse just yet" })) : null, !isLoading && !errorMessage && products.length > 0 ? (_jsx("section", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6", children: products.map((product) => (_jsx(ProductCard, { product: product }, product.id))) })) : null] }) }));
};
