import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getTranslationSetting } from '@acme/api-client/admin';
import type { TranslationSetting } from '@acme/api-client/admin';
import { getDirection, getLocaleMeta, isLocale, translate } from '@acme/shared';
import type {
  Locale,
  LocaleMeta,
  TextDirection,
  TranslateParams,
  TranslationBundle,
  TranslationKey
} from '@acme/shared';

const LOCALE_STORAGE_KEY = 'benchekroun.locale';

// This bespoke brand site ships Arabic + French only, Arabic-first.
const BRAND_LOCALES: readonly Locale[] = ['ar', 'fr'];
const BRAND_DEFAULT_LOCALE: Locale = 'ar';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
  dir: TextDirection;
  availableLocales: LocaleMeta[];
  isLoading: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const readStoredLocale = (): Locale | null => {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) && BRAND_LOCALES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const readBrowserLocale = (): Locale | null => {
  const prefix = window.navigator.language.split('-')[0];
  return isLocale(prefix) && BRAND_LOCALES.includes(prefix) ? prefix : null;
};

const applyDocumentLocale = (locale: Locale): void => {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = getDirection(locale);
};

export function I18nProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  // Resolve an initial locale synchronously so the first paint is never wrong.
  const [locale, setLocaleState] = useState<Locale>(
    () => readStoredLocale() ?? readBrowserLocale() ?? BRAND_DEFAULT_LOCALE
  );
  const [setting, setSetting] = useState<TranslationSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch server translations. On any failure we keep `setting` null and fall
  // back to the bundled English baseline, so the UI always renders.
  useEffect(() => {
    let isSubscribed = true;

    const fetchTranslations = async (): Promise<void> => {
      try {
        const data = await getTranslationSetting();
        if (isSubscribed) {
          setSetting(data);
        }
      } catch {
        if (isSubscribed) {
          setSetting(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    void fetchTranslations();

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (!BRAND_LOCALES.includes(next)) {
      return;
    }
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (private mode, quota) — in-memory locale still applies.
    }
  }, []);

  const activeBundle: TranslationBundle | undefined = setting?.translations?.[locale];

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => translate(activeBundle, key, params),
    [activeBundle]
  );

  // Always the two brand locales, regardless of what the back-office activates.
  const availableLocales = useMemo<LocaleMeta[]>(
    () => BRAND_LOCALES.map(getLocaleMeta),
    []
  );

  const value = useMemo<I18nContextType>(
    () => ({ locale, setLocale, t, dir: getDirection(locale), availableLocales, isLoading }),
    [locale, setLocale, t, availableLocales, isLoading]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
