import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { brandColors } from '@acme/shared';
import logo from '../assets/ayan.png';
import { CartButton } from './cart/cart-button';
const navItems = [
    {
        href: '#about',
        label: 'À propos'
    }
];
const actionItems = [
    {
        href: '#register',
        label: "S'enregistrer",
        variant: 'primary'
    },
    {
        href: '#login',
        label: 'Connexion',
        variant: 'secondary'
    }
];
const getActionClassName = (variant) => variant === 'primary'
    ? 'text-white'
    : 'border border-stone-300 bg-white !text-stone-950 hover:bg-stone-50';
export const Navbar = () => (_jsx("header", { className: "sticky top-0 z-50 border-b border-stone-200/80 bg-white backdrop-blur", children: _jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8", children: [_jsxs("a", { className: "flex items-center gap-3", href: "/", children: [_jsx("img", { alt: "Ayan logo", className: "h-11 w-11 rounded-2xl object-cover shadow-[0_10px_24px_rgba(36,76,57,0.18)]", src: logo }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-lg font-semibold tracking-tight", style: { color: brandColors.black }, children: "Ayan Market" }), _jsx("p", { className: "text-xs font-medium uppercase tracking-[0.25em]", style: { color: brandColors.logoGreen }, children: "Fresh essentials" })] })] }), _jsx("nav", { "aria-label": "Primary navigation", className: "hidden items-center gap-8 md:flex", children: navItems.map((item) => (_jsx("a", { className: "text-sm font-medium !text-stone-700 transition hover:!text-emerald-700", href: item.href, children: item.label }, item.label))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CartButton, {}), actionItems.map((item) => (_jsx("a", { className: `inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${getActionClassName(item.variant)}`, href: item.href, style: item.variant === 'primary'
                            ? {
                                backgroundColor: brandColors.logoGreen,
                                color: brandColors.white
                            }
                            : {
                                backgroundColor: brandColors.white,
                                color: brandColors.black
                            }, children: item.label }, item.label)))] })] }) }));
