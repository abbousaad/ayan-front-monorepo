import { brandColors } from '@acme/shared';
import { NavLink, Outlet } from 'react-router-dom';

import { useAdminAuth } from './use-admin-auth';

type NavItem = {
  label: string;
  to: string;
};

const NAV_ITEMS: NavItem[] = [
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

export function AdminLayout(): React.JSX.Element {
  const { logout } = useAdminAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          backgroundColor: '#1c1917', // stone-900
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0'
        }}
      >
        {/* Brand */}
        <div style={{ padding: '0 24px 32px' }}>
          <span
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: brandColors.logoGreen,
              letterSpacing: '-0.5px'
            }}
          >
            Ayan Admin
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? brandColors.logoGreen : '#d6d3d1', // stone-300
                backgroundColor: isActive ? 'rgba(31,100,70,0.15)' : 'transparent',
                textDecoration: 'none',
                borderLeft: isActive ? `3px solid ${brandColors.logoGreen}` : '3px solid transparent',
                transition: 'background-color 0.15s, color 0.15s'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '400',
              color: '#a8a29e', // stone-400
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
            type="button"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          padding: '32px'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
