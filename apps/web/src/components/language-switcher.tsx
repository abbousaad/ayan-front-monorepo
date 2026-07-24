import { isLocale } from '@acme/shared';

import { useI18n } from '../contexts/i18n-context';

export const LanguageSwitcher = () => {
  const { locale, setLocale, availableLocales } = useI18n();

  if (availableLocales.length < 2) {
    return null;
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="min-h-11 cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        onChange={(event) => {
          const next = event.target.value;
          if (isLocale(next)) {
            setLocale(next);
          }
        }}
        value={locale}
      >
        {availableLocales.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
};
