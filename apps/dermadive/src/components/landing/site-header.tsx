import { Link } from 'react-router-dom';

import { useBrandCopy } from '../../i18n/use-brand-copy';
import { CartButton } from '../cart/cart-button';

// Fixed brand header. Anchor links point at the home-page sections (`/#…`), so
// they also work from the storefront pages — React Router + the layout's
// ScrollManager navigate home and smooth-scroll to the target.
export function SiteHeader() {
  const copy = useBrandCopy();

  return (
    <header className="site-head">
      <Link className="site-head__logo" to="/" aria-label="Dermadive, accueil">
        <img src="/images/logo.webp" alt="Dermadive" />
      </Link>

      <nav className="site-nav" aria-label="Principale">
        <Link to="/#routine">{copy.navRoutine}</Link>
        <Link to="/#produits">{copy.navProducts}</Link>
        <Link to="/#actifs">{copy.navActives}</Link>
        <Link to="/shop">{copy.navShop}</Link>
        <CartButton />
      </nav>
    </header>
  );
}
