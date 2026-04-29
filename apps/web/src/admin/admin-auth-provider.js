import { jsx as _jsx } from "react/jsx-runtime";
import { login as apiLogin, isAuthUser } from '@acme/api-client/admin';
import { createContext, useEffect, useMemo, useState } from 'react';
export const ADMIN_SESSION_TOKEN_KEY = 'admin_token';
export const ADMIN_SESSION_USER_KEY = 'admin_user';
export const AdminAuthContext = createContext(null);
export function AdminAuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const storedToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
        const storedUserRaw = sessionStorage.getItem(ADMIN_SESSION_USER_KEY);
        if (storedToken && storedUserRaw) {
            try {
                const parsed = JSON.parse(storedUserRaw);
                const storedUser = isAuthUser(parsed) ? parsed : null;
                if (storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                }
                else {
                    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
                    sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
                }
            }
            catch {
                sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
                sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
            }
        }
        setIsLoading(false);
    }, []);
    const value = useMemo(() => ({
        token,
        user,
        isLoading,
        login: async (username, password) => {
            const response = await apiLogin(username, password);
            const { token: newToken, user: newUser } = response.data;
            sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, newToken);
            sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        },
        logout: () => {
            sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
            sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
            setToken(null);
            setUser(null);
        },
        handleUnauthorized: () => {
            sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
            sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
            setToken(null);
            setUser(null);
        },
        updateUser: (updates) => {
            setUser((prevUser) => {
                if (prevUser === null)
                    return null;
                const updatedUser = { ...prevUser, ...updates };
                sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(updatedUser));
                return updatedUser;
            });
        }
    }), [token, user, isLoading]);
    return _jsx(AdminAuthContext.Provider, { value: value, children: children });
}
