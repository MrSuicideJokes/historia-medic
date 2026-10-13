import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLang } from '../state/lang';
import { Rings } from './Rings';

const MapView = lazy(() => import('./MapView'));

// Leaflet (JS + CSS + tiles) is only fetched when the map is about to scroll into view.
export function LazyMap({ className = '' }: { className?: string }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { rootMargin: '300px' });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="relative">
      <div ref={ref} role="region" aria-label={t.contact.mapLabel}
        className={`relative isolate overflow-hidden border border-line bg-blue-tint ${className}`}>
        {visible && <Suspense fallback={null}><MapView /></Suspense>}
        {/* Double ring centred on the corner: the frame shows a quarter of it. */}
        <Rings className="pointer-events-none absolute -end-14 -top-14 z-[450] size-28 text-red" gap={0} />
      </div>
      <figcaption className="mt-2 text-sm text-muted pointer-fine:hidden">{t.contact.mapHint}</figcaption>
    </figure>
  );
}
