import { useSyncExternalStore } from 'react';

// The theme lives on <html data-theme>, set before first paint by index.html (saved choice,
// else the system setting). This hook just reads and changes it.
export type Theme = 'light' | 'dark';
const KEY = 'hm-theme';
const EVENT = 'hm-theme-change';

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
const saved = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

function apply(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c1724' : '#ffffff');
  if (persist) {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* private mode: the choice lasts for this visit */
    }
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const system = matchMedia('(prefers-color-scheme: dark)');
  // Until the visitor picks a theme, follow the system setting live.
  const onSystem = () => !saved() && apply(system.matches ? 'dark' : 'light', false);
  window.addEventListener(EVENT, onChange);
  system.addEventListener('change', onSystem);
  return () => {
    window.removeEventListener(EVENT, onChange);
    system.removeEventListener('change', onSystem);
  };
}

export function useTheme() {
  // Server/prerender snapshot is "light"; React re-renders with the real value right after hydration.
  const theme = useSyncExternalStore(subscribe, current, (): Theme => 'light');
  return { theme, toggle: () => apply(theme === 'dark' ? 'light' : 'dark', true) };
}
