import { getStores } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';
import { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { LanguageSwitcher } from './language-switcher';

const CATEGORY_LIMIT = 5;

const linkClass = 'text-sm text-brand-muted transition hover:text-brand-gold';

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">{children}</h3>
  );
}

export function Footer() {
  const copy = useBrandCopy();
  const year = new Date().getFullYear();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    let isMounted = true;
    getStores()
      .then((response) => {
        if (isMounted) setStores(response.data.slice(0, CATEGORY_LIMIT));
      })
      .catch(() => {
        /* categories are optional in the footer */
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="mt-24 border-t border-brand-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link className="inline-flex flex-col leading-tight" to="/">
              <span className="font-display text-2xl font-semibold tracking-wide text-brand-gold">
                {copy.brandName}
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-[0.35em] text-brand-muted">
                {copy.brandTagline}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-brand-muted">{copy.footerBlurb}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-gold-dim/40 px-4 py-2 text-xs text-brand-gold-soft/90">
              <FiTruck aria-hidden className="text-brand-gold" size={15} />
              {copy.cashOnDelivery}
            </div>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label={copy.footerExploreTitle}>
            <ColumnTitle>{copy.footerExploreTitle}</ColumnTitle>
            <ul className="space-y-3">
              <li><Link className={linkClass} to="/">{copy.navHome}</Link></li>
              <li><Link className={linkClass} to="/shop">{copy.navShop}</Link></li>
              <li><Link className={linkClass} to="/about">{copy.navAbout}</Link></li>
              <li><Link className={linkClass} to="/contact">{copy.navContact}</Link></li>
            </ul>
          </nav>

          {/* Categories */}
          {stores.length > 0 && (
            <nav className="lg:col-span-3" aria-label={copy.navCategories}>
              <ColumnTitle>{copy.navCategories}</ColumnTitle>
              <ul className="space-y-3">
                {stores.map((store) => (
                  <li key={store.id}>
                    <Link className={linkClass} to={`/category/${store.id}`}>
                      {store.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColumnTitle>{copy.contactInfoTitle}</ColumnTitle>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li className="flex items-center gap-3">
                <FiPhone aria-hidden className="shrink-0 text-brand-gold" size={15} />
                <span dir="ltr">{copy.contactPhoneValue}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail aria-hidden className="shrink-0 text-brand-gold" size={15} />
                <span dir="ltr">{copy.contactEmailValue}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin aria-hidden className="shrink-0 text-brand-gold" size={15} />
                <span>{copy.contactAddressValue}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-rule mt-12" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-brand-muted">
            © {year} {copy.brandName} · {copy.footerRights}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
