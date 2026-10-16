import { store } from '../config/store';

// Circular logo crop (see scripts/optimize-images.mjs).
export function LogoDisc({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <img src={size > 48 ? '/logo-192.webp' : '/logo-96.webp'} width={size} height={size} alt=""
      className={`shrink-0 rounded-full ${className}`} decoding="async" />
  );
}

// The shop sign as a lockup: "HISTORIA ◉ MEDIC", logo between the words, glowing white capitals
// with the H lit blue and the M lit red. `plate` adds the dark signboard so it reads on light headers.
export function Wordmark({ discSize, className = '', plate = false }: { discSize: number; className?: string; plate?: boolean }) {
  const [first, second] = store.name.split(' ');
  return (
    <span lang="fr" dir="ltr" className={`neon-sign inline-flex items-center gap-[0.4em] ${plate ? 'neon-plate' : ''} ${className}`}>
      <span><span className="neon-blue">{first[0]}</span>{first.slice(1)}</span>
      {' '/* spoken as two words; not rendered between flex items */}
      <LogoDisc size={discSize} className="neon-disc" />
      <span><span className="neon-red">{second[0]}</span>{second.slice(1)}</span>
    </span>
  );
}
