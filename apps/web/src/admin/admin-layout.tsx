import { brandColors } from '@acme/shared';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getThemeSetting, type ThemeSetting } from '@acme/api-client/admin';

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
  { label: 'Translations', to: '/admin/translations' },
  { label: 'Branding', to: '/admin/branding' },
  { label: 'Theme', to: '/admin/theme' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Public Orders', to: '/admin/public-orders' },
  { label: 'Change Password', to: '/admin/change-password' }
];

export function AdminLayout(): React.JSX.Element {
  const { logout } = useAdminAuth();
  const [theme, setTheme] = useState<ThemeSetting | null>(null);

  useEffect(() => {
    const fetchTheme = async (): Promise<void> => {
      try {
        const themeData = await getThemeSetting();
        setTheme(themeData);
      } catch {
        setTheme(null);
      }
    };
    void fetchTheme();
  }, []);

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

        {/* Theme Preview */}
        {theme && (
          <div style={{ padding: '12px 12px 16px', borderTop: '1px solid #44403c' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#a8a29e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Store Theme
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <div
                title="Primary"
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'help',
                  border: '1px solid #78716c'
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.primaryColor }} />
              </div>
              <div
                title="Text"
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'help',
                  border: '1px solid #78716c'
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.textColor }} />
              </div>
              <div
                title="Secondary"
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'help',
                  border: '1px solid #78716c'
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.secondaryColor }} />
              </div>
            </div>
          </div>
        )}

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
