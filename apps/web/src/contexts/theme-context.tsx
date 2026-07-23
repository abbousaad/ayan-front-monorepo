import { createContext, useContext, useEffect, useState } from 'react';
import { getThemeSetting, type ThemeSetting } from '@acme/api-client/admin';

type ThemeContextType = {
  theme: ThemeSetting | null;
  isLoading: boolean;
  error: string | null;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [theme, setTheme] = useState<ThemeSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheme = async (): Promise<void> => {
      try {
        const themeData = await getThemeSetting();
        setTheme(themeData);
        applyTheme(themeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load theme');
        applyDefaultTheme();
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isLoading, error }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function applyTheme(theme: ThemeSetting): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-subtitle-1', theme.subtitle1Color);
  root.style.setProperty('--color-subtitle-2', theme.subtitle2Color);
  root.style.setProperty('--color-logo-title', theme.logoTitleColor);
  root.style.setProperty('--color-logo-subtitle', theme.logoSubtitleColor);
  root.style.setProperty('--color-main-button-bg', theme.mainButtonBgColor);
  root.style.setProperty('--color-sec-button-bg', theme.secButtonBgColor);
  root.style.setProperty('--color-home-subtitle-text', theme.homeSubtitleTextColor);
  root.style.setProperty('--color-home-title', theme.homeTitleColor);
}

function applyDefaultTheme(): void {
  const defaultTheme: ThemeSetting = {
    primaryColor: '#1f2937',
    textColor: '#000000',
    secondaryColor: '#3b82f6',
    subtitle1Color: '#4b5563',
    subtitle2Color: '#9ca3af',
    logoTitleColor: '#0c0a09',
    logoSubtitleColor: '#1f6446',
    mainButtonBgColor: '#1f6446',
    secButtonBgColor: '#1f6446',
    homeSubtitleTextColor: '#b45309',
    homeTitleColor: '#0c0a09'
  };
  applyTheme(defaultTheme);
}
