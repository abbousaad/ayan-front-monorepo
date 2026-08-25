import { Link } from 'react-router-dom';

import { CONTACT_EMAIL } from '../../config';
import { useBrandCopy } from '../../i18n/use-brand-copy';

export function SiteFooter() {
  const copy = useBrandCopy();
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot__grid">
          <div className="foot__logo">
            <img src="/images/logo-foot.webp" alt="Dermadive" />
            <p>{copy.footerBlurb}</p>
          </div>

          <div>
            <h4>{copy.navProducts}</h4>
            <ul>
              <li>
                <Link to="/#nettodive">NettoDive</Link>
              </li>
              <li>
                <Link to="/#sundive">SunDive</Link>
              </li>
              <li>
                <Link to="/#ecladive">EclaDive</Link>
              </li>
              <li>
                <Link to="/shop">{copy.navShop}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>La marque</h4>
            <ul>
              <li>
                <Link to="/#routine">{copy.navRoutine}</Link>
              </li>
              <li>
                <Link to="/#actifs">Les actifs</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>{copy.navContact}</h4>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <Link to="/contact">Nous contacter</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot__bas">
          <span>
            © {year} {copy.brandName}
          </span>
          <span>Mentions légales · Confidentialité</span>
        </div>
      </div>
    </footer>
  );
}
