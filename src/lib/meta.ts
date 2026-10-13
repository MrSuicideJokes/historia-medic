import { useEffect } from 'react';
import { useLang } from '../state/lang';
import type { Dict } from '../i18n/fr';

const setMeta = (attr: 'name' | 'property', key: string, value: string) =>
  document.head.querySelector(`meta[${attr}="${key}"]`)?.setAttribute('content', value);

// Per-page title/description/OG in the current language. Crawlers get the static
// per-route versions written by scripts/prerender-meta.mjs.
export function usePageMeta(page: keyof Dict['meta']) {
  const { t } = useLang();
  const { title, description } = t.meta[page];
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
  }, [title, description]);
}
