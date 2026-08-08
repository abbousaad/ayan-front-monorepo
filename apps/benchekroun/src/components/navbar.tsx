import { Link } from 'react-router-dom';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { CartButton } from './cart/cart-button';
import { LanguageSwitcher } from './language-switcher';

export function Navbar() {
  const copy = useBrandCopy();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-line bg-brand-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex flex-col leading-tight" to="/">
          <span className="font-display text-2xl font-semibold tracking-wide text-brand-gold">
            {copy.brandName}
          </span>
          <span className="text-[11px] uppercase tracking-[0.35em] text-brand-muted">
            {copy.brandTagline}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
