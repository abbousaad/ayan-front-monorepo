import { Outlet } from 'react-router-dom';

import { CartSidebar } from '../components/cart/cart-sidebar';
import { Navbar } from '../components/navbar';

export const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <CartSidebar />
  </>
);
