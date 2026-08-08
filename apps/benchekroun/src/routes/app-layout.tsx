import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CartDrawer } from '../components/cart/cart-drawer';
import { Navbar } from '../components/navbar';

// Smooth-scroll to a #hash target (e.g. #about) after navigation, and reset to
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

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-brand-line px-4 py-10 text-center sm:px-6 lg:px-8">
      <p className="font-display text-lg text-brand-gold">دار بنشقرون · Dar Benchekroun</p>
      <p className="mt-1 text-xs text-brand-muted">© {year}</p>
    </footer>
  );
}
