import { useEffect, useRef, useState } from 'react';
import type { Product } from '../data/products';
import { formatPrice } from '../lib/format';
import { useCart } from '../state/cart';
import { useLang } from '../state/lang';
import { CheckIcon } from './icons';
import { ProductImage } from './ProductImage';
import { Stepper } from './Stepper';

// Slight zoom on hover; opacity is listed too so the 2nd-view crossfade keeps its transition.
const zoom = 'transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.04]';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Touch: swipeable scroll-snap strip with dots. Mouse: photos stacked, 2nd view fades in on hover.
function Gallery({ images, alt, eager }: { images: string[]; alt: string; eager: boolean }) {
  const { t } = useLang();
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (images.length === 1) return <div className="overflow-hidden bg-tile"><ProductImage name={images[0]} alt={alt} eager={eager} className={`mix-blend-multiply ${zoom}`} /></div>;

  const onScroll = () => {
    const el = strip.current!;
    setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth)); // abs(): scrollLeft is negative in RTL
  };
  const go = (i: number) =>
    (strip.current!.children[i] as HTMLElement).scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });

  return (
    <div className="relative overflow-hidden bg-tile">
      {/* The photo stack blends into the tile gradient as one layer (white × gradient = gradient).
          Blending each photo separately would multiply the hovered view into the one below it. */}
      <div ref={strip} onScroll={onScroll} role="group" aria-label={t.product.photos}
        className="flex snap-x snap-mandatory overflow-x-auto mix-blend-multiply overscroll-x-contain [scrollbar-width:none] pointer-fine:grid pointer-fine:overflow-hidden">
        {images.map((name, i) => (
          <ProductImage key={name} name={name} alt={i === 0 ? alt : ''} eager={eager && i === 0} secondary={i > 0}
            className={`${zoom} shrink-0 snap-start pointer-fine:[grid-area:1/1] ${
              i === 1 ? 'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100' : i > 1 ? 'pointer-fine:hidden' : ''
            }`} />
        ))}
      </div>
      <div className="absolute bottom-0 start-0 flex pointer-fine:hidden">
        {images.map((name, i) => (
          <button key={name} type="button" onClick={() => go(i)} aria-label={t.product.view(i + 1, images.length)} aria-current={i === active}
            className="grid size-11 place-items-center">
            <span className={`block size-2 rounded-full border border-blue transition-colors ${i === active ? 'bg-blue' : 'bg-paper'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// eager: the card is above the fold, so its main photo must not wait for lazy-loading.
export function ProductCard({ product, eager = false, heading: H = 'h3' }: { product: Product; eager?: boolean; heading?: 'h2' | 'h3' }) {
  const { t, lang } = useLang();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onAdd = () => {
    add(product.id, qty);
    setQty(1);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col bg-paper transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:shadow-float">
      <Gallery images={product.images} alt={product.name} eager={eager} />
      <div className="flex flex-1 flex-col gap-3 p-3 md:p-4">
        <H dir="ltr" className="line-clamp-3 text-[0.95rem] leading-snug rtl:text-right" title={product.name}>{product.name}</H>
        <p className="tnum mt-auto text-lg font-semibold text-red-text">{formatPrice(product.price, lang)}</p>
        <Stepper value={qty} onChange={setQty} />
        <button type="button" onClick={onAdd}
          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium ${
            added ? 'bg-ink text-paper' : 'btn-primary'
          }`}>
          {added && <CheckIcon className="shrink-0" />}
          {added ? t.product.added : t.product.add}
        </button>
        <span className="sr-only" aria-live="polite">{added ? t.product.addedSr : ''}</span>
      </div>
    </article>
  );
}
