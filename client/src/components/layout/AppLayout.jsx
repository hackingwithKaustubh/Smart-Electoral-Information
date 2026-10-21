import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  UserRound,
  BookOpen,
  HelpCircle,
  Link2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from './Logo';

const items = [
  { to: '/app', icon: LayoutDashboard, key: 'dashboard', end: true },
  { to: '/app/chat', icon: MessageSquare, key: 'assistant' },
  { to: '/app/information', icon: BookOpen, key: 'information' },
  { to: '/app/faqs', icon: HelpCircle, key: 'faqs' },
  { to: '/app/sources', icon: Link2, key: 'sources' },
  { to: '/app/saved', icon: Bookmark, key: 'saved' },
  { to: '/app/search', icon: Search, key: 'search' },
  { to: '/app/profile', icon: UserRound, key: 'profile' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="App">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  isActive ? 'bg-forest text-white' : 'text-muted hover:bg-paper hover:text-ink'
                }`
              }
            >
              <item.icon size={16} />
              {t[item.key]}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-paper"
            >
              <Shield size={16} /> {t.admin}
            </NavLink>
          )}
        </nav>
        <div className="border-t border-line p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
          <button
            type="button"
            className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-forest"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            <LogOut size={14} /> {t.logout}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-line bg-card/80 px-4 py-3 md:px-8">
          <div className="md:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm text-muted md:block">Neutral electoral information — not campaign advice.</p>
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 text-xs"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
        <nav className="sticky bottom-0 grid grid-cols-4 border-t border-line bg-card md:hidden">
          {items.slice(0, 4).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="flex flex-col items-center py-2 text-[11px] text-muted">
              <item.icon size={16} />
              {t[item.key]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
