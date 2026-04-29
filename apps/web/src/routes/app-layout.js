import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { CartSidebar } from '../components/cart/cart-sidebar';
import { Navbar } from '../components/navbar';
export const AppLayout = () => (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx(Outlet, {}), _jsx(CartSidebar, {})] }));
