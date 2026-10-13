import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { productById } from '../data/products';
import { formatPrice } from '../lib/format';
import { useCart, useHydrated } from '../state/cart';
import { useLang } from '../state/lang';
import { ArrowIcon, BagIcon, CheckIcon } from './icons';
import { ProductImage } from './ProductImage';

const CONFIRM_MS = 3500;

// Always-visible way forward once the cart has something in it: a bottom bar on phones, a
// floating card on desktop. Each "add" is confirmed here, next to the button that leads on.
export function CartDock() {
  const { t, lang } = useLang();
  const { count, total, lastAdded } = useCart();
  const hydrated = useHydrated();
  const { pathname } = useLocation();
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    setConfirming(lastAdded.id);
    const timer = setTimeout(() => setConfirming(null), CONFIRM_MS);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  const hidden = !hydrated || count === 0 || /^\/(cart|checkout)/.test(pathname);
  if (hidden) return null;

  const product = confirming ? productById.get(confirming) : undefined;

  return (
    <>
      {/* Keeps the end of the page (footer) reachable above the bar. */}
      <div aria-hidden="true" className="h-24 bg-[#0a1828] dark:bg-[#050c15] md:h-28" />
      <aside aria-label={t.dock.label}
        className="fixed inset-x-0 bottom-0 z-30 animate-[rise_350ms_ease-out] border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_-16px_rgb(14_35_56/0.35)] md:inset-x-auto md:bottom-5 md:end-5 md:w-[24rem] md:rounded-lg md:border md:p-4 md:shadow-float">
        <div className="flex items-center gap-3">
          <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-tile">
            {product ? (
              <ProductImage name={product.images[0]} alt="" sizes="48px" className="mix-blend-multiply" />
            ) : (
              <BagIcon width={24} height={24} className="text-blue" />
            )}
            <span key={`${count}-${lastAdded?.at}`} aria-hidden="true"
              className="tnum absolute -end-0.5 -top-0.5 grid h-5 min-w-5 animate-bump place-items-center rounded-full bg-alert px-1 text-[0.7rem] font-semibold text-white">
              {count}
            </span>
          </span>

          <div className="min-w-0 flex-1">
            {product ? (
              <>
                <p className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-blue">
                  <CheckIcon width={16} height={16} className="shrink-0" />
                  {t.dock.added}
                </p>
                <p dir="ltr" className="truncate text-sm text-muted rtl:text-right">{product.name}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted">{t.cart.items(count)}</p>
                <p className="tnum font-semibold text-red-text">{formatPrice(total, lang)}</p>
              </>
            )}
          </div>

          <Link to="/cart" className="btn-primary inline-flex min-h-12 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-medium">
            {t.dock.view}
            <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </aside>
    </>
  );
}
