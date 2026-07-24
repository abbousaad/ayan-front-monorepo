import { ApiClientError } from '@acme/api-client';
import { getTranslationSetting, updateTranslationSetting } from '@acme/api-client/admin';
import type { Locale, TranslationSettingInput } from '@acme/api-client/admin';
import { LOCALES, LOCALE_CODES, enBaseline, getLocaleMeta, isLocale } from '@acme/shared';
import { useEffect, useMemo, useState } from 'react';

import { useAdminAuth } from '../../admin/use-admin-auth';

type TranslationsState = Record<Locale, Record<string, string>>;

const emptyTranslations = (): TranslationsState => ({ en: {}, fr: {}, ar: {} });

export function AdminTranslationsPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [defaultLocale, setDefaultLocale] = useState<Locale>('en');
  const [activeLocales, setActiveLocales] = useState<Locale[]>([...LOCALE_CODES]);
  const [translations, setTranslations] = useState<TranslationsState>(emptyTranslations);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTranslations = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const setting = await getTranslationSetting();
        if (!isSubscribed) {
          return;
        }

        const next = emptyTranslations();
        for (const locale of LOCALE_CODES) {
          next[locale] = { ...(setting.translations[locale] ?? {}) };
        }
        setTranslations(next);
        setActiveLocales(setting.activeLocales.filter(isLocale));
        setDefaultLocale(isLocale(setting.defaultLocale) ? setting.defaultLocale : 'en');
      } catch (error) {
        if (!isSubscribed) {
          return;
        }
        setErrorMessage(
          error instanceof ApiClientError ? error.message : 'Failed to load translations.'
        );
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

  // Rows: the keys the apps actually use (enBaseline) plus any extra keys the
  // server already holds, so nothing is hidden from the editor.
  const rowKeys = useMemo(() => {
    const keys = new Set<string>(Object.keys(enBaseline));
    for (const locale of LOCALE_CODES) {
      Object.keys(translations[locale]).forEach((key) => keys.add(key));
    }
    return [...keys].sort();
  }, [translations]);

  const updateCell = (locale: Locale, key: string, value: string): void => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
  };

  const toggleActive = (locale: Locale): void => {
    setActiveLocales((prev) => {
      if (prev.includes(locale)) {
        if (prev.length === 1) {
          return prev; // keep at least one active locale
        }
        const next = prev.filter((code) => code !== locale);
        if (locale === defaultLocale) {
          setDefaultLocale(next[0]);
        }
        return next;
      }
      return [...LOCALE_CODES].filter((code) => prev.includes(code) || code === locale);
    });
  };

  const onSave = async (): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('You must be signed in to update translations.');
      return;
    }

    const input: TranslationSettingInput = {
      defaultLocale,
      activeLocales,
      translations: LOCALE_CODES.reduce<Record<Locale, Record<string, string>>>(
        (acc, locale) => {
          acc[locale] = translations[locale];
          return acc;
        },
        emptyTranslations()
      )
    };

    setIsSaving(true);
    try {
      const updated = await updateTranslationSetting(input, token);
      const next = emptyTranslations();
      for (const locale of LOCALE_CODES) {
        next[locale] = { ...(updated.translations[locale] ?? {}) };
      }
      setTranslations(next);
      setActiveLocales(updated.activeLocales.filter(isLocale));
      setDefaultLocale(isLocale(updated.defaultLocale) ? updated.defaultLocale : 'en');
      setSuccessMessage('Translations updated successfully.');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      setErrorMessage(
        error instanceof ApiClientError ? error.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const busy = isLoading || isSaving;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1c1917', margin: '0 0 12px' }}>
        Translations
      </h1>

      {(successMessage || errorMessage) && (
        <div
          role="alert"
          style={{
            backgroundColor: successMessage ? '#ecfdf3' : '#fef2f2',
            border: successMessage ? '1px solid #bbf7d0' : '1px solid #fecaca',
            color: successMessage ? '#166534' : '#b91c1c',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          {successMessage ?? errorMessage}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Locale settings */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="default-locale" style={{ fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>
              Default language
            </label>
            <select
              id="default-locale"
              disabled={busy}
              value={defaultLocale}
              onChange={(event) => {
                if (isLocale(event.target.value)) {
                  setDefaultLocale(event.target.value);
                }
              }}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #d6d3d1',
                fontSize: '14px',
                color: '#1c1917'
              }}
            >
              {activeLocales.map((locale) => (
                <option key={locale} value={locale}>
                  {getLocaleMeta(locale).nativeName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>Active languages</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              {LOCALES.map((meta) => (
                <label key={meta.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1c1917' }}>
                  <input
                    type="checkbox"
                    disabled={busy}
                    checked={activeLocales.includes(meta.code)}
                    onChange={() => toggleActive(meta.code)}
                  />
                  {meta.nativeName}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Translation grid */}
        {isLoading ? (
          <span style={{ fontSize: '13px', color: '#78716c' }}>Loading translations…</span>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Key</th>
                  <th style={thStyle}>English (reference)</th>
                  {activeLocales.map((locale) => (
                    <th key={locale} style={thStyle}>
                      {getLocaleMeta(locale).nativeName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowKeys.map((key) => (
                  <tr key={key}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#57534e', whiteSpace: 'nowrap' }}>{key}</td>
                    <td style={{ ...tdStyle, color: '#78716c' }}>{(enBaseline as Record<string, string>)[key] ?? '—'}</td>
                    {activeLocales.map((locale) => (
                      <td key={locale} style={tdStyle}>
                        <input
                          type="text"
                          dir={getLocaleMeta(locale).dir}
                          disabled={busy}
                          value={translations[locale][key] ?? ''}
                          placeholder={(enBaseline as Record<string, string>)[key] ?? ''}
                          onChange={(event) => updateCell(locale, key, event.target.value)}
                          style={{
                            width: '100%',
                            minWidth: '160px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #d6d3d1',
                            fontSize: '13px',
                            color: '#1c1917',
                            boxSizing: 'border-box'
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <button
            type="button"
            disabled={busy}
            onClick={() => { void onSave(); }}
            style={{
              padding: '10px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: busy ? '#a7c4b8' : '#1f6446',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: '2px solid #e7e5e4',
  color: '#1c1917',
  fontWeight: 600,
  whiteSpace: 'nowrap'
};

const tdStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderBottom: '1px solid #f5f5f4',
  verticalAlign: 'top'
};
