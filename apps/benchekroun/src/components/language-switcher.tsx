import { isLocale } from '@acme/shared';

import { useI18n } from '../contexts/i18n-context';

export const LanguageSwitcher = () => {
  const { locale, setLocale, availableLocales } = useI18n();

  if (availableLocales.length < 2) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-brand-line bg-brand-charcoal p-1">
      {availableLocales.map((option) => {
        const isActive = option.code === locale;
        return (
          <button
            key={option.code}
            aria-pressed={isActive}
            className={`min-h-9 rounded-full px-3 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-gold text-brand-black'
                : 'text-brand-muted hover:text-brand-ink'
            }`}
            onClick={() => {
              if (isLocale(option.code)) {
                setLocale(option.code);
              }
            }}
            type="button"
          >
            {option.nativeName}
          </button>
        );
      })}
    </div>
  );
};
