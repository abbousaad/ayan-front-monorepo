import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './use-admin-auth';
export function RequireAdmin() {
    const { token, isLoading } = useAdminAuth();
    if (isLoading) {
        return null;
    }
    if (!token) {
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    }
    return _jsx(Outlet, {});
}
