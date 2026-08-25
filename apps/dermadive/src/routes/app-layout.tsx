import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CartDrawer } from '../components/cart/cart-drawer';
import { SiteFooter } from '../components/landing/site-footer';
import { SiteHeader } from '../components/landing/site-header';
import { Spine } from '../components/landing/spine';

// Smooth-scroll to a #hash target (e.g. /#routine) after navigation, and reset to
// the top on plain route changes — React Router v7 doesn't do this on its own.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export const AppLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <ScrollManager />
      <SiteHeader />
      <Spine />
      {/* `.shell` reserves the fixed spine rail. Off the home page the content
          also needs to clear the fixed header, which the hero handles itself. */}
      <div className="shell" style={isHome ? undefined : { paddingTop: 'var(--rail-top, 76px)' }}>
        <Outlet />
        <SiteFooter />
      </div>
      <CartDrawer />
    </>
  );
};
