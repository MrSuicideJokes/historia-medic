import { Link, NavLink } from 'react-router';
import { useLang, type Lang } from '../state/lang';
import { useTheme } from '../state/theme';
import { MoonIcon, SunIcon } from './icons';
import { Wordmark } from './Logo';

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

export function Header() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <span aria-hidden="true" className="block h-[3px] bg-brand-stripe" />
      <div className="wrap flex h-16 items-center gap-6">
        <Link to="/" className="flex min-h-11 items-center rounded-md">
          <Wordmark plate discSize={30} className="text-[0.95rem] md:text-base" />
        </Link>
        <nav aria-label={t.nav.menu} className="ms-auto hidden md:block">
          <ul className="flex items-center gap-5">
            <li><NavLink to="/" end className={navClass}>{t.nav.home}</NavLink></li>
            <li><NavLink to="/products" className={navClass}>{t.nav.products}</NavLink></li>
            <li><NavLink to="/contact" className={navClass}>{t.nav.contact}</NavLink></li>
          </ul>
        </nav>
        <div className="hidden items-center md:flex"><LangSwitch /><ThemeToggle /></div>
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
