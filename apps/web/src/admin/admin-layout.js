import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { brandColors } from '@acme/shared';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getThemeSetting } from '@acme/api-client/admin';
import { useAdminAuth } from './use-admin-auth';
const NAV_ITEMS = [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Stores', to: '/admin/stores' },
    { label: 'Products', to: '/admin/products' },
    { label: 'Coupons', to: '/admin/coupons' },
    { label: 'Pricing', to: '/admin/pricing' },
    { label: 'Currency', to: '/admin/currency' },
    { label: 'Theme', to: '/admin/theme' },
    { label: 'Orders', to: '/admin/orders' },
    { label: 'Public Orders', to: '/admin/public-orders' },
    { label: 'Change Password', to: '/admin/change-password' }
];
export function AdminLayout() {
    const { logout } = useAdminAuth();
    const [theme, setTheme] = useState(null);
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const themeData = await getThemeSetting();
                setTheme(themeData);
            } catch {
                setTheme(null);
            }
        };
        void fetchTheme();
    }, []);
    return (_jsxs("div", { style: { display: 'flex', minHeight: '100vh' }, children: [_jsxs("aside", { style: {
                    width: '220px',
                    flexShrink: 0,
                    backgroundColor: '#1c1917',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px 0'
                }, children: [_jsx("div", { style: { padding: '0 24px 32px' }, children: _jsx("span", { style: {
                                fontSize: '20px',
                                fontWeight: '700',
                                color: brandColors.logoGreen,
                                letterSpacing: '-0.5px'
                            }, children: "Ayan Admin" }) }), _jsx("nav", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }, children: NAV_ITEMS.map((item) => (_jsx(NavLink, { to: item.to, end: item.to === '/admin', style: ({ isActive }) => ({
                                display: 'block',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: isActive ? '600' : '400',
                                color: isActive ? brandColors.logoGreen : '#d6d3d1',
                                backgroundColor: isActive ? 'rgba(31,100,70,0.15)' : 'transparent',
                                textDecoration: 'none',
                                borderLeft: isActive ? `3px solid ${brandColors.logoGreen}` : '3px solid transparent',
                                transition: 'background-color 0.15s, color 0.15s'
                            }), children: item.label }, item.to))) }), theme && _jsxs("div", { style: { padding: '12px 12px 16px', borderTop: '1px solid #44403c' }, children: [_jsx("p", { style: { fontSize: '11px', fontWeight: '600', color: '#a8a29e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }, children: "Store Theme" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }, children: [_jsx("div", { title: "Primary", style: { width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', cursor: 'help', border: '1px solid #78716c' }, children: _jsx("div", { style: { position: 'absolute', inset: 0, backgroundColor: theme.primaryColor } }) }), _jsx("div", { title: "Text", style: { width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', cursor: 'help', border: '1px solid #78716c' }, children: _jsx("div", { style: { position: 'absolute', inset: 0, backgroundColor: theme.textColor } }) }), _jsx("div", { title: "Secondary", style: { width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden', cursor: 'help', border: '1px solid #78716c' }, children: _jsx("div", { style: { position: 'absolute', inset: 0, backgroundColor: theme.secondaryColor } }) })] })] }), _jsx("div", { style: { padding: '0 12px' }, children: _jsx("button", { onClick: logout, style: {
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '400',
                                color: '#a8a29e',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }, type: "button", children: "Logout" }) })] }), _jsx("main", { style: {
                    flex: 1,
                    backgroundColor: '#ffffff',
                    overflowY: 'auto',
                    padding: '32px'
                }, children: _jsx(Outlet, {}) })] }));
}
