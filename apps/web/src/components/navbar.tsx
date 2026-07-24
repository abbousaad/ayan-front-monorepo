import { brandColors } from '@acme/shared';

import logo from '../assets/ayan.png';
import { CartButton } from './cart/cart-button';

const navItems = [
  {
    href: '#about',
    label: 'À propos'
  }
];

const actionItems = [
  {
    href: '#register',
    label: "S'enregistrer",
    variant: 'primary'
  },
  {
    href: '#login',
    label: 'Connexion',
    variant: 'secondary'
  }
] as const;

const getActionClassName = (variant: (typeof actionItems)[number]['variant']) =>
  variant === 'primary'
    ? 'text-white'
    : 'border border-stone-300 bg-white !text-stone-950 hover:bg-stone-50';

export const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-stone-200/80 backdrop-blur" style={{ backgroundColor: 'var(--color-nav-bg)' }}>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
      <a className="flex items-center gap-3" href="/">
        <img alt="Ayan logo" className="h-11 w-11 rounded-2xl object-cover shadow-[0_10px_24px_rgba(36,76,57,0.18)]" src={logo} />
        <div className="space-y-1">
          <p className="text-lg font-semibold tracking-tight" style={{ color: 'var(--color-logo-title)' }}>Ayan Market</p>
          <p className="text-xs font-medium uppercase tracking-[0.25em]" style={{ color: 'var(--color-logo-subtitle)' }}>
            Fresh essentials
          </p>
        </div>
      </a>

      <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            className="text-sm font-medium !text-stone-700 transition hover:!text-emerald-700"
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <CartButton />
        {actionItems.map((item) => (
          <a
            key={item.label}
            className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${getActionClassName(item.variant)}`}
            href={item.href}
            style={
              item.variant === 'primary'
                ? { backgroundColor: 'var(--color-main-button-bg)', color: '#ffffff' }
                : { backgroundColor: brandColors.white, color: brandColors.black }
            }
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  </header>
);
