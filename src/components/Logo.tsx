import { store } from '../config/store';

// Circular logo crop (see scripts/optimize-images.mjs). Decorative next to the wordmark.
export function LogoDisc({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <img src={size > 48 ? '/logo-192.webp' : '/logo-96.webp'} width={size} height={size} alt=""
      className={`shrink-0 rounded-full ${className}`} decoding="async" />
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight [font-variation-settings:'HEXP'_40] ${className}`} lang="fr" dir="ltr">
      {store.name}
    </span>
  );
}
