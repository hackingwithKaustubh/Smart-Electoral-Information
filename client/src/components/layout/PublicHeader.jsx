import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from './Logo';

export default function PublicHeader() {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/#how', label: 'How it works' },
    { to: '/information', label: t.information },
    { to: '/faqs', label: t.faqs },
    { to: '/#security', label: 'Security' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary">
          {links.map((link) => (
            <a key={link.to} href={link.to} className="hover:text-forest">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 text-xs"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            aria-label="Switch language"
          >
            {language === 'en' ? 'हिंदी' : 'EN'}
          </button>
          {user ? (
            <Link to="/app" className="hidden rounded-full bg-forest px-4 py-2 text-sm text-white md:inline-flex">
              {t.dashboard}
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm text-forest md:inline">
                {t.login}
              </Link>
              <Link to="/register" className="rounded-full bg-forest px-4 py-2 text-sm text-white">
                {t.start}
              </Link>
            </>
          )}
          <button type="button" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          {links.map((link) => (
            <a key={link.to} href={link.to} className="block py-2 text-sm" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <NavLink to="/login" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            {t.login}
          </NavLink>
        </div>
      )}
    </header>
  );
}
