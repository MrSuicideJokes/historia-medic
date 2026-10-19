import { useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/products';
import { formatPrice } from '../lib/format';
import { orderPath } from '../lib/order';
import { useLang } from '../state/lang';
import { ArrowIcon, ChevronIcon } from './icons';
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

// Spec sheet, folded by default so cards stay the same height until someone asks.
// Native <details>: keyboard and screen-reader support for free. Spec text is French, like product names.
function Details({ lines }: { lines: string[] }) {
  const { t } = useLang();
  return (
    <details className="group/details text-sm">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-line px-3 font-medium text-blue transition-colors hover:border-blue [&::-webkit-details-marker]:hidden">
        {t.product.details}
        <ChevronIcon width={18} height={18} className="shrink-0 transition-transform group-open/details:rotate-180" />
      </summary>
      <ul lang="fr" dir="ltr" className="mt-2 space-y-1 ps-1 text-start text-muted">
        {lines.map((line) => (
          <li key={line} className="flex items-baseline gap-2">
            <span aria-hidden="true" className="size-1 shrink-0 translate-y-[-0.2em] rounded-full bg-red" />
            {line}
          </li>
        ))}
      </ul>
    </details>
  );
}

// eager: the card is above the fold, so its main photo must not wait for lazy-loading.
// One product per order: the button goes straight to checkout with the chosen quantity.
export function ProductCard({ product, eager = false, heading: H = 'h3' }: { product: Product; eager?: boolean; heading?: 'h2' | 'h3' }) {
  const { t, lang } = useLang();
  const [qty, setQty] = useState(1);

  return (
    <article className="group relative flex flex-col bg-paper transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:shadow-float">
      <Gallery images={product.images} alt={product.name} eager={eager} />
      <div className="flex flex-1 flex-col gap-3 p-3 md:p-4">
        <H dir="ltr" className="line-clamp-3 text-[0.95rem] leading-snug rtl:text-right" title={product.name}>{product.name}</H>
        {product.details && <Details lines={product.details} />}
        {product.price === undefined ? (
          <p className="mt-auto text-sm font-medium text-muted">{t.product.priceTbc}</p>
        ) : (
          <p className="tnum mt-auto text-lg font-semibold text-red-text">{formatPrice(product.price, lang)}</p>
        )}
        <Stepper value={qty} onChange={setQty} />
        <Link to={orderPath(product.id, qty)} aria-label={t.product.orderItem(product.name)}
          className="btn-primary flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium">
          {t.product.order}
          <ArrowIcon width={18} height={18} />
        </Link>
      </div>
    </article>
  );
}
