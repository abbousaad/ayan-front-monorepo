import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createImageUrl } from '@acme/api-client';
import { getProducts } from '@acme/api-client/products';
import { getStores } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product-card';
const getErrorMessage = (error) => error instanceof Error ? error.message : 'We could not load this section right now.';
const initialProductsState = {
    data: [],
    errorMessage: null,
    isLoading: true
};
const initialStoresState = {
    data: [],
    errorMessage: null,
    isLoading: true
};
const HeroIllustration = () => (_jsx("div", { className: "rounded-[1.75rem] border border-stone-200 bg-gradient-to-br from-amber-50 via-white to-orange-100 p-4", children: _jsxs("svg", { "aria-hidden": "true", className: "h-auto w-full", viewBox: "0 0 520 300", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "hero-bg", x1: "0%", x2: "100%", y1: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#fef3c7" }), _jsx("stop", { offset: "50%", stopColor: "#fff7ed" }), _jsx("stop", { offset: "100%", stopColor: "#dcfce7" })] }) }), _jsx("rect", { fill: "url(#hero-bg)", height: "300", rx: "32", width: "520" }), _jsx("circle", { cx: "112", cy: "88", fill: "#f59e0b", opacity: "0.18", r: "72" }), _jsx("circle", { cx: "408", cy: "228", fill: "#22c55e", opacity: "0.16", r: "94" }), _jsx("rect", { fill: "#ffffff", height: "178", opacity: "0.92", rx: "26", width: "184", x: "42", y: "64" }), _jsx("rect", { fill: "#ffffff", height: "156", opacity: "0.9", rx: "26", width: "184", x: "292", y: "42" }), _jsx("rect", { fill: "#fef3c7", height: "28", rx: "14", width: "96", x: "64", y: "84" }), _jsx("rect", { fill: "#f5f5f4", height: "18", rx: "9", width: "118", x: "64", y: "126" }), _jsx("rect", { fill: "#f5f5f4", height: "18", rx: "9", width: "90", x: "64", y: "154" }), _jsx("rect", { fill: "#16a34a", height: "16", rx: "8", width: "74", x: "64", y: "194" }), _jsx("rect", { fill: "#fef3c7", height: "88", rx: "20", width: "136", x: "316", y: "68" }), _jsx("circle", { cx: "358", cy: "112", fill: "#fb923c", r: "24" }), _jsx("circle", { cx: "412", cy: "102", fill: "#4ade80", r: "20" }), _jsx("circle", { cx: "388", cy: "136", fill: "#facc15", r: "18" }), _jsx("rect", { fill: "#e7e5e4", height: "16", rx: "8", width: "104", x: "316", y: "174" }), _jsx("rect", { fill: "#e7e5e4", height: "16", rx: "8", width: "72", x: "316", y: "198" })] }) }));
const StoresLoadingState = () => (_jsx("div", { className: "space-y-3", role: "status", children: Array.from({ length: 4 }, (_, index) => (_jsx("div", { className: "h-24 animate-pulse rounded-[1.5rem] border border-stone-200 bg-stone-50" }, `store-loading-${index}`))) }));
const ProductsLoadingState = () => (_jsx("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", role: "status", children: Array.from({ length: 6 }, (_, index) => (_jsxs("div", { className: "h-72 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70 p-6 shadow-[0_18px_45px_rgba(120,98,70,0.08)]", children: [_jsx("div", { className: "h-32 rounded-[1.5rem] bg-stone-100" }), _jsx("div", { className: "mt-5 h-4 w-24 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-4 h-7 w-3/4 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-3 h-4 w-full rounded-full bg-stone-100" }), _jsx("div", { className: "mt-2 h-4 w-5/6 rounded-full bg-stone-100" }), _jsx("div", { className: "mt-8 h-12 rounded-full bg-stone-100" })] }, `product-loading-${index}`))) }));
const MessageState = ({ actionLabel, description, onAction, title }) => (_jsx("section", { className: "rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)] md:p-10", children: _jsxs("div", { className: "mx-auto max-w-lg space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-stone-900", children: title }), _jsx("p", { className: "text-base leading-7 text-stone-600", children: description }), actionLabel && onAction ? (_jsx("button", { className: "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2", onClick: onAction, style: { backgroundColor: brandColors.logoGreen, color: brandColors.white }, type: "button", children: actionLabel })) : null] }) }));
const StoreCard = ({ store }) => (_jsxs(Link, { className: "flex h-full flex-col items-start gap-3 rounded-[1.25rem] border border-stone-200 bg-[#fbf7f1] p-3 transition duration-200 hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2", to: `/stores/${store.id}/products`, children: [_jsx("img", { alt: store.name, className: "h-28 w-full rounded-[1rem] object-cover", src: createImageUrl(store.imageUrl) }), _jsx("h2", { className: "text-base font-semibold text-stone-950", children: store.name })] }));
export const HomePage = () => {
    const [productsState, setProductsState] = useState(initialProductsState);
    const [storesState, setStoresState] = useState(initialStoresState);
    const loadHomeContent = useCallback(async () => {
        setProductsState((currentState) => ({
            ...currentState,
            errorMessage: null,
            isLoading: true
        }));
        setStoresState((currentState) => ({
            ...currentState,
            errorMessage: null,
            isLoading: true
        }));
        const [storesResult, productsResult] = await Promise.allSettled([getStores(), getProducts()]);
        setStoresState(storesResult.status === 'fulfilled'
            ? {
                data: storesResult.value.data,
                errorMessage: null,
                isLoading: false
            }
            : {
                data: [],
                errorMessage: getErrorMessage(storesResult.reason),
                isLoading: false
            });
        setProductsState(productsResult.status === 'fulfilled'
            ? {
                data: productsResult.value.data,
                errorMessage: null,
                isLoading: false
            }
            : {
                data: [],
                errorMessage: getErrorMessage(productsResult.reason),
                isLoading: false
            });
    }, []);
    useEffect(() => {
        void loadHomeContent();
    }, [loadHomeContent]);
    const handleRetry = () => {
        void loadHomeContent();
    };
    return (_jsx("main", { className: "min-h-screen bg-white px-6 py-10 text-stone-900 md:px-8 md:py-14", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-10", children: [_jsx("section", { className: "flex min-h-[calc(100vh-9rem)] w-full items-center border border-stone-200 bg-white p-6 md:p-8 lg:p-10", children: _jsxs("div", { className: "grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:items-center", children: [_jsxs("div", { className: "flex h-full flex-col gap-5", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.35em] text-amber-700", children: "Fresh arrivals" }), _jsx("h1", { className: "max-w-xl text-2xl font-semibold tracking-tight text-stone-950 md:text-5xl", children: "Shop neighborhood stores and pantry favorites in one calm space." }), _jsx("p", { className: "max-w-2xl text-base leading-7 text-stone-600 md:text-lg", children: "Discover featured stores, browse their collections, and keep scrolling for a full product lineup in the same warm shopping experience." })] }), _jsx("div", { className: "xl:max-w-[560px]", children: _jsx(HeroIllustration, {}) })] }), _jsxs("aside", { className: "rounded-[1.75rem] border border-stone-200 bg-white p-5 md:p-6", children: [_jsx("div", { className: "mb-5 flex items-center justify-between gap-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.3em] text-amber-700", children: "Stores" }), _jsx("h2", { className: "text-2xl font-semibold text-stone-950", children: "Choose a store" })] }) }), storesState.isLoading ? _jsx(StoresLoadingState, {}) : null, !storesState.isLoading && storesState.errorMessage ? (_jsx(MessageState, { actionLabel: "Reload stores", description: storesState.errorMessage, onAction: handleRetry, title: "We couldn't load the stores" })) : null, !storesState.isLoading && !storesState.errorMessage && storesState.data.length === 0 ? (_jsx(MessageState, { description: "No stores are available yet.", title: "No stores to browse" })) : null, !storesState.isLoading && !storesState.errorMessage && storesState.data.length > 0 ? (_jsx("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: storesState.data.map((store) => (_jsx(StoreCard, { store: store }, store.id))) })) : null] })] }) }), _jsxs("section", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.35em] text-amber-700", children: "Product collection" }), _jsx("h2", { className: "text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl", children: "Explore everything currently available." }), _jsx("p", { className: "max-w-2xl text-base leading-7 text-stone-600", children: "Browse the full catalog below or jump straight into a store to view a focused assortment." })] }), _jsx(Link, { className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2", to: "/products", children: "Open products page" })] }), productsState.isLoading ? _jsx(ProductsLoadingState, {}) : null, !productsState.isLoading && productsState.errorMessage ? (_jsx(MessageState, { actionLabel: "Try again", description: productsState.errorMessage, onAction: handleRetry, title: "We couldn't load the product collection" })) : null, !productsState.isLoading && !productsState.errorMessage && productsState.data.length === 0 ? (_jsx(MessageState, { description: "No products are available yet. Check back after the catalog is populated.", title: "Nothing to browse just yet" })) : null, !productsState.isLoading && !productsState.errorMessage && productsState.data.length > 0 ? (_jsx("section", { className: "grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6", children: productsState.data.map((product) => (_jsx(ProductCard, { product: product }, product.id))) })) : null] }) }));
};
