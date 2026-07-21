import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './admin/admin-auth-provider';
import { AdminLayout } from './admin/admin-layout';
import { RequireAdmin } from './admin/require-admin';
import { AppLayout } from './routes/app-layout';
import { AdminChangePasswordPage } from './routes/admin/admin-change-password-page';
import { AdminCouponsPage } from './routes/admin/admin-coupons-page';
import { AdminCurrencyPage } from './routes/admin/admin-currency-page';
import { AdminDashboardPage } from './routes/admin/admin-dashboard-page';
import { AdminThemePage } from './routes/admin/admin-theme-page';
import { AdminLoginPage } from './routes/admin/admin-login-page';
import { AdminOrdersPage } from './routes/admin/admin-orders-page';
import { AdminPublicOrdersPage } from './routes/admin/admin-public-orders-page';
import { AdminPricingPage } from './routes/admin/admin-pricing-page';
import { AdminProductsPage } from './routes/admin/admin-products-page';
import { AdminStoresPage } from './routes/admin/admin-stores-page';
import { CheckoutPage } from './routes/checkout-page';
import { HomePage } from './routes/home-page';
import { ProductPage } from './routes/product-page';
import { ProductsPage } from './routes/products-page';
import { StoreProductsPage } from './routes/store-products-page';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(HomePage, {})
            },
            {
                path: 'products',
                element: _jsx(ProductsPage, {})
            },
            {
                path: 'products/:productId',
                element: _jsx(ProductPage, {})
            },
            {
                path: 'stores/:storeId/products',
                element: _jsx(StoreProductsPage, {})
            },
            {
                path: 'checkout',
                element: _jsx(CheckoutPage, {})
            }
        ]
    },
    {
        path: '/admin/login',
        element: (_jsx(AdminAuthProvider, { children: _jsx(AdminLoginPage, {}) }))
    },
    {
        path: '/admin',
        element: (_jsx(AdminAuthProvider, { children: _jsx(RequireAdmin, {}) })),
        children: [
            {
                element: _jsx(AdminLayout, {}),
                children: [
                    {
                        index: true,
                        element: _jsx(AdminDashboardPage, {})
                    },
                    {
                        path: 'stores',
                        element: _jsx(AdminStoresPage, {})
                    },
                    {
                        path: 'products',
                        element: _jsx(AdminProductsPage, {})
                    },
                    {
                        path: 'coupons',
                        element: _jsx(AdminCouponsPage, {})
                    },
                    {
                        path: 'pricing',
                        element: _jsx(AdminPricingPage, {})
                    },
                    {
                        path: 'currency',
                        element: _jsx(AdminCurrencyPage, {})
                    },
                    {
                        path: 'theme',
                        element: _jsx(AdminThemePage, {})
                    },
                    {
                        path: 'orders',
                        element: _jsx(AdminOrdersPage, {})
                    },
                    {
                        path: 'public-orders',
                        element: _jsx(AdminPublicOrdersPage, {})
                    },
                    {
                        path: 'change-password',
                        element: _jsx(AdminChangePasswordPage, {})
                    }
                ]
            }
        ]
    }
]);
