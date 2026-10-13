import { Link, NavLink } from 'react-router';
import { useLang, type Lang } from '../state/lang';
import { useCart, useHydrated } from '../state/cart';
import { useTheme } from '../state/theme';
import { BagIcon, MoonIcon, SunIcon } from './icons';
import { LogoDisc, Wordmark } from './Logo';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex min-h-11 items-center px-1 text-[0.95rem] transition-colors hover:text-blue ${
    isActive ? 'font-medium text-ink after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:bg-red' : 'text-muted'
  }`;

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const opt = (value: Lang, label: string) => (
    <button
      type="button"
      lang={value}
      aria-pressed={lang === value}
      onClick={() => setLang(value)}
      className={`min-h-11 min-w-11 px-2 text-sm transition-colors ${lang === value ? 'font-semibold text-ink' : 'text-muted hover:text-blue'} ${
        // On French pages, a system Arabic face for this one label avoids downloading the Arabic webfont.
        value === 'ar' && lang === 'fr' ? 'font-system-ar' : ''
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t.langLabel} className="flex items-center">
      {opt('fr', 'FR')}
      <span aria-hidden="true" className="h-4 w-px bg-line" />
      {opt('ar', 'العربية')}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useLang();
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} aria-pressed={theme === 'dark'} aria-label={t.darkMode} title={t.darkMode}
      className="grid size-11 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-blue-tint hover:text-blue">
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function CartLink() {
  const cart = useCart();
  const count = useHydrated() ? cart.count : 0;
  const { t } = useLang();
  return (
    <Link to="/cart" aria-label={t.cartLink(count)}
      className="relative inline-flex size-11 items-center justify-center gap-2 rounded-md text-ink transition-colors hover:bg-blue-tint md:w-auto md:border md:border-line-strong md:px-3 md:hover:border-blue">
      <BagIcon width={24} height={24} />
      <span aria-hidden="true" className="hidden text-sm font-medium md:inline">{t.nav.cart}</span>
      {count > 0 && (
        // Re-keyed on count so the bump replays on every change.
        <span key={count} aria-hidden="true"
          className="tnum absolute end-0.5 top-0.5 grid h-5 min-w-5 md:-end-2 md:-top-2 animate-bump place-items-center rounded-full bg-alert px-1 text-[0.7rem] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <span aria-hidden="true" className="block h-[3px] bg-brand-stripe" />
      <div className="wrap flex h-16 items-center gap-6">
        <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded" aria-label={`${t.nav.home} · Historia Medic`}>
          <LogoDisc size={40} />
          <Wordmark className="text-[1.05rem] text-ink" />
        </Link>
        <nav aria-label={t.nav.menu} className="ms-auto hidden md:block">
          <ul className="flex items-center gap-5">
            <li><NavLink to="/" end className={navClass}>{t.nav.home}</NavLink></li>
            <li><NavLink to="/products" className={navClass}>{t.nav.products}</NavLink></li>
            <li><NavLink to="/contact" className={navClass}>{t.nav.contact}</NavLink></li>
          </ul>
        </nav>
        <div className="ms-auto hidden items-center md:ms-0 md:flex"><LangSwitch /><ThemeToggle /></div>
        <div className="ms-auto md:ms-0"><CartLink /></div>
      </div>
      {/* Mobile: nav stays visible as a second row instead of hiding behind a menu button. */}
      <div className="wrap flex items-center justify-between border-t border-line md:hidden">
        <nav aria-label={t.nav.menu}>
          <ul className="flex items-center gap-1.5 min-[400px]:gap-3">
            <li><NavLink to="/" end className={navClass}>{t.nav.home}</NavLink></li>
            <li><NavLink to="/products" className={navClass}>{t.nav.products}</NavLink></li>
            <li><NavLink to="/contact" className={navClass}>{t.nav.contact}</NavLink></li>
          </ul>
        </nav>
        <div className="flex items-center"><LangSwitch /><ThemeToggle /></div>
      </div>
    </header>
  );
}
