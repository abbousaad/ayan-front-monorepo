import { Outlet } from 'react-router-dom';

import { CartDrawer } from '../components/cart/cart-drawer';
import { Navbar } from '../components/navbar';

export const AppLayout = () => (
  <>
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
