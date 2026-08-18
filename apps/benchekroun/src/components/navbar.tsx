import { getStores } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { CartButton } from './cart/cart-button';
import { LanguageSwitcher } from './language-switcher';

const linkClass = 'text-sm font-medium text-brand-muted transition hover:text-brand-gold';

export function Navbar() {
  const copy = useBrandCopy();
  const [stores, setStores] = useState<Store[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getStores()
      .then((response) => {
        if (isMounted) setStores(response.data);
      })
      .catch(() => {
        /* categories are optional in the nav */
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setCatOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-brand-line bg-brand-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center leading-tight" onClick={closeMenus} to="/">
          <span className="font-display text-2xl font-semibold tracking-wide text-brand-gold">{copy.brandName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link className={linkClass} to="/">
            {copy.navHome}
          </Link>
          <Link className={linkClass} to="/shop">
            {copy.navShop}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              aria-expanded={catOpen}
              className={`inline-flex items-center gap-1 ${linkClass}`}
              onClick={() => setCatOpen((open) => !open)}
              type="button"
            >
              {copy.navCategories}
              <FiChevronDown className={`transition ${catOpen ? 'rotate-180' : ''}`} size={14} />
            </button>
            {catOpen && stores.length > 0 && (
              // pt-2 is a hoverable bridge so moving from the button to the
              // menu doesn't cross an empty gap and close the dropdown.
              <div className="absolute end-0 top-full z-40 pt-2">
                <div className="min-w-52 rounded-xl border border-brand-line bg-brand-charcoal p-2 shadow-2xl">
                  {stores.map((store) => (
                    <Link
                      className="block rounded-lg px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-panel hover:text-brand-gold"
                      key={store.id}
                      onClick={closeMenus}
                      to={`/category/${store.id}`}
                    >
                      {store.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link className={linkClass} to="/about">
            {copy.navAbout}
          </Link>
          <Link className={linkClass} to="/contact">
            {copy.navContact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <CartButton />
          <button
            aria-label="Menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line text-brand-ink transition hover:text-brand-gold md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-brand-line bg-brand-charcoal px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link className="rounded-lg px-3 py-2 text-brand-ink" onClick={closeMenus} to="/">
              {copy.navHome}
            </Link>
            <Link className="rounded-lg px-3 py-2 text-brand-ink" onClick={closeMenus} to="/shop">
              {copy.navShop}
            </Link>
            <Link className="rounded-lg px-3 py-2 text-brand-ink" onClick={closeMenus} to="/about">
              {copy.navAbout}
            </Link>
            <Link className="rounded-lg px-3 py-2 text-brand-ink" onClick={closeMenus} to="/contact">
              {copy.navContact}
            </Link>

            {stores.length > 0 && (
              <div className="mt-2 border-t border-brand-line pt-2">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  {copy.navCategories}
                </p>
                {stores.map((store) => (
                  <Link
                    className="block rounded-lg px-3 py-2 text-sm text-brand-muted"
                    key={store.id}
                    onClick={closeMenus}
                    to={`/category/${store.id}`}
                  >
                    {store.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-3 px-3">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
