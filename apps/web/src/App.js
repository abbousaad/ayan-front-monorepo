import { jsx as _jsx } from "react/jsx-runtime";
import { brandColors } from '@acme/shared';
import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './cart/cart-provider';
import { router } from './router';
export const App = () => (_jsx(CartProvider, { children: _jsx("div", { style: { backgroundColor: brandColors.white, color: brandColors.black, minHeight: '100vh' }, children: _jsx(RouterProvider, { router: router }) }) }));
