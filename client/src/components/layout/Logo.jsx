import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Logo({ compact = false }) {
  const { t } = useLanguage();
  return (
    <NavLink to="/" className="flex items-center gap-2.5 text-forest">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-gold-2 shadow-soft">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M8 21.5V10.5L16 7l8 3.5v11L16 25l-8-3.5z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      {!compact && (
        <span>
          <span className="block font-display text-lg leading-none">{t.product}</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Electoral assistance</span>
        </span>
      )}
    </NavLink>
  );
}
