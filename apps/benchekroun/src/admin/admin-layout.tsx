import { FiGrid, FiLogOut, FiPackage, FiShoppingBag } from 'react-icons/fi';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';

import { useAdminAuth } from './admin-auth';

const navItems = [
  { to: '/admin/categories', label: 'Categories', icon: FiGrid },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag }
];

export function AdminLayout() {
  const { token, user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate replace to="/admin/login" />;
  }

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800" dir="ltr">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="font-display text-lg font-semibold text-slate-900">Dar Benchekroun</p>
          <p className="text-xs text-slate-500">Admin</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
              key={to}
              to={to}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <p className="px-3 pb-2 text-xs text-slate-400">
            {user?.username}
            {user?.role ? ` · ${user.role}` : ''}
          </p>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            onClick={handleSignOut}
            type="button"
          >
            <FiLogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
