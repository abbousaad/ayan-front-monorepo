import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { SOCIAL_LINKS } from '../config';
import { useBrandCopy } from '../i18n/use-brand-copy';

const socialClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-line text-brand-muted transition hover:border-brand-gold-dim hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold';

const infoClass = 'inline-flex items-center gap-2 text-sm text-brand-muted transition hover:text-brand-gold';

export function Footer() {
  const copy = useBrandCopy();
  const year = new Date().getFullYear();
  const tel = copy.contactPhoneValue.replace(/\s+/g, '');

  return (
    <footer className="mt-24 border-t border-brand-line">
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
        {/* Brand + slogan */}
        <Link className="font-display text-3xl font-semibold text-brand-gold" to="/">
          {copy.brandName}
        </Link>
        <p className="mt-2 text-sm text-brand-muted">{copy.brandTagline}</p>

        <div className="gold-rule mx-auto mt-7 w-20" />

        {/* Social */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <a aria-label="Instagram" className={socialClass} href={SOCIAL_LINKS.instagram} rel="noreferrer noopener" target="_blank">
            <FaInstagram aria-hidden size={17} />
          </a>
          <a aria-label="TikTok" className={socialClass} href={SOCIAL_LINKS.tiktok} rel="noreferrer noopener" target="_blank">
            <FaTiktok aria-hidden size={16} />
          </a>
          <a aria-label="Facebook" className={socialClass} href={SOCIAL_LINKS.facebook} rel="noreferrer noopener" target="_blank">
            <FaFacebookF aria-hidden size={16} />
          </a>
        </div>

        {/* Contact */}
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
          <a className={infoClass} href={`tel:${tel}`}>
            <FiPhone aria-hidden className="text-brand-gold" size={14} />
            <span dir="ltr">{copy.contactPhoneValue}</span>
          </a>
          <a className={infoClass} href={`mailto:${copy.contactEmailValue}`}>
            <FiMail aria-hidden className="text-brand-gold" size={14} />
            <span dir="ltr">{copy.contactEmailValue}</span>
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-brand-muted">
            <FiMapPin aria-hidden className="text-brand-gold" size={14} />
            {copy.contactAddressValue}
          </span>
        </div>

        <p className="mt-9 text-xs text-brand-muted">
          © {year} {copy.brandName} · {copy.footerRights}
        </p>
      </div>
    </footer>
  );
}
