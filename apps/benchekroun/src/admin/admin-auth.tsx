import { login } from '@acme/api-client/admin';
import type { AuthUser } from '@acme/api-client/admin';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const TOKEN_KEY = 'benchekroun.admin.token';
const USER_KEY = 'benchekroun.admin.user';

type AdminAuthValue = {
  token: string | null;
  user: AuthUser | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const signIn = useCallback(async (username: string, password: string) => {
    const response = await login(username, password);
    const { token: nextToken, user: nextUser } = response.data;
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, signIn, signOut }), [token, user, signIn, signOut]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext);
  if (!value) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return value;
}
