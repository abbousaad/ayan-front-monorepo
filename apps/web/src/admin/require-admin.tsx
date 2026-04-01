import { Navigate, Outlet } from 'react-router-dom';

import { useAdminAuth } from './use-admin-auth';

export function RequireAdmin(): React.JSX.Element | null {
  const { token, isLoading } = useAdminAuth();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
