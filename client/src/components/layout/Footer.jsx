import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from './Logo';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-line bg-forest text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm text-white/70">
            Civora is a politically neutral information assistant. It does not recommend candidates or parties.
            Official instructions always take precedence over explanations.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-2">Navigate</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link to="/about">About</Link>
            <a href="/#features">Features</a>
            <Link to="/faqs">{t.faqs}</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-2">Legal</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/sources">{t.sources}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        Official information disclaimer: For forms, status and legally binding instructions, use Election Commission of
        India channels at eci.gov.in and voters.eci.gov.in.
      </div>
    </footer>
  );
}
