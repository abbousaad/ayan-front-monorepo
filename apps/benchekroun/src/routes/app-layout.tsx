import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CartDrawer } from '../components/cart/cart-drawer';
import { Footer } from '../components/footer';
import { Navbar } from '../components/navbar';

// Smooth-scroll to a #hash target (e.g. #collection) after navigation, and reset to
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

export const AppLayout = () => (
  <>
    <ScrollManager />
    <Navbar />
    <Outlet />
    <CartDrawer />
    <Footer />
  </>
);
