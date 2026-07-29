import { brandColors } from '@acme/shared';
import type { TranslationKey } from '@acme/shared';
import { getBrandingSetting } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';

import { useI18n } from '../contexts/i18n-context';
import logo from '../assets/ayan.png';
import { CartButton } from './cart/cart-button';
import { LanguageSwitcher } from './language-switcher';

const navItems: { href: string; labelKey: TranslationKey }[] = [{ href: '#about', labelKey: 'nav.about' }];

const actionItems = [
  { href: '#register', labelKey: 'button.register', variant: 'primary' },
  { href: '#login', labelKey: 'button.login', variant: 'secondary' }
] as const satisfies readonly { href: string; labelKey: TranslationKey; variant: 'primary' | 'secondary' }[];

const getActionClassName = (variant: (typeof actionItems)[number]['variant']) =>
  variant === 'primary'
    ? 'text-white'
    : 'border border-stone-300 bg-white !text-stone-950 hover:bg-stone-50';

const DEFAULT_BRANDING = {
  logoUrl: logo,
  title: 'Ayan Market',
  subtitle: 'Fresh essentials'
};

export const Navbar = () => {
  const { t } = useI18n();
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranding = async (): Promise<void> => {
      try {
        const response = await getBrandingSetting();
        setBranding(response);
      } catch {
        setBranding(DEFAULT_BRANDING);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBranding();
  }, []);

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-stone-200/80 backdrop-blur" style={{ backgroundColor: 'var(--color-nav-bg)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-stone-200 animate-pulse" />
            <div className="space-y-1">
              <div className="h-5 w-32 bg-stone-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-stone-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 backdrop-blur" style={{ backgroundColor: 'var(--color-nav-bg)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
        <a className="flex items-center gap-3" href="/">
          <img alt={branding.title} className="h-11 w-11 rounded-2xl object-cover shadow-[0_10px_24px_rgba(36,76,57,0.18)]" src={branding.logoUrl} />
          <div className="space-y-1">
            <p className="text-lg font-semibold tracking-tight" style={{ color: 'var(--color-logo-title)' }}>{branding.title}</p>
            <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: 'var(--color-logo-subtitle)' }}>
              {branding.subtitle}
            </p>
          </div>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.labelKey}
              className="text-sm font-medium !text-stone-700 transition hover:!text-emerald-700"
              href={item.href}
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CartButton />
          {actionItems.map((item) => (
            <a
              key={item.labelKey}
              className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${getActionClassName(item.variant)}`}
              href={item.href}
              style={
                item.variant === 'primary'
                  ? { backgroundColor: 'var(--color-main-button-bg)', color: '#ffffff' }
                  : { backgroundColor: brandColors.white, color: brandColors.black }
              }
            >
              {t(item.labelKey)}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};
