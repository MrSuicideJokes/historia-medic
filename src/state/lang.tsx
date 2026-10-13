import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { fr, type Dict } from '../i18n/fr';
import { ar } from '../i18n/ar';

export type Lang = 'fr' | 'ar';
const KEY = 'hm-lang';
const dicts: Record<Lang, Dict> = { fr, ar };

const readLang = (): Lang => {
  try {
    return localStorage.getItem(KEY) === 'ar' ? 'ar' : 'fr';
  } catch {
    return 'fr';
  }
};

const LangContext = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void } | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(readLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  }, [lang]);

  return <LangContext value={{ lang, t: dicts[lang], setLang }}>{children}</LangContext>;
}

export const useLang = () => use(LangContext)!;
