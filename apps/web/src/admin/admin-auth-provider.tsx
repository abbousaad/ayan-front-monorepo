import { login as apiLogin, isAuthUser } from '@acme/api-client/admin';
import type { AuthUser } from '@acme/api-client/admin';
import { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';

export const ADMIN_SESSION_TOKEN_KEY = 'admin_token';
export const ADMIN_SESSION_USER_KEY = 'admin_user';

export type AdminAuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

type AdminAuthProviderProps = {
  children: ReactNode;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: AdminAuthProviderProps): React.JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
    const storedUserRaw = sessionStorage.getItem(ADMIN_SESSION_USER_KEY);

    if (storedToken && storedUserRaw) {
      try {
        const parsed = JSON.parse(storedUserRaw) as unknown;
        const storedUser = isAuthUser(parsed) ? parsed : null;
        if (storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
          sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
        }
      } catch {
        sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      login: async (username: string, password: string): Promise<void> => {
        const response = await apiLogin(username, password);
        const { token: newToken, user: newUser } = response.data;

        sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, newToken);
        sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);
      },
      logout: (): void => {
        sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
        setToken(null);
        setUser(null);
      }
    }),
    [token, user, isLoading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
