import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { formatPrice } from '../lib/format';
import { usePageMeta } from '../lib/meta';
import { useCart } from '../state/cart';
import { useLang } from '../state/lang';
import { ArrowIcon, CloseIcon } from '../components/icons';
import { ProductImage } from '../components/ProductImage';
import { Stepper } from '../components/Stepper';
import { PageHeader } from '../components/PageHeader';

export function EmptyCart({ message }: { message: string }) {
  const { t } = useLang();
  return (
    <div className="grid items-center gap-8 border-b border-line py-14 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="display text-2xl font-medium md:text-3xl">{message}</p>
        <p className="mt-3 text-muted">{t.cart.emptyText}</p>
        <Link to="/products" className="btn-primary mt-8 inline-flex min-h-12 items-center gap-3 rounded-md px-6 font-medium">
          {t.cart.emptyCta}
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

export default function Cart() {
  usePageMeta('cart');
  const { t, lang } = useLang();
  const { lines, count, total, setQty, remove, clear } = useCart();
  const [confirming, setConfirming] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  // After a line disappears, keep keyboard focus somewhere sensible.
  const refocus = () => heading.current?.focus();

  return (
    <>
      <PageHeader title={t.cart.title} headingRef={heading} aside={count > 0 ? t.cart.items(count) : undefined} />
      <div className="wrap">

      {lines.length === 0 ? (
        <EmptyCart message={t.cart.empty} />
      ) : (
        <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-8">
          <ul className="md:col-span-8">
            {lines.map(({ id, qty, product }) => (
              <li key={id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-line py-5 md:grid-cols-[6rem_minmax(0,1fr)_auto_7.5rem] md:items-center">
                <div className="row-span-2 self-start border border-line md:row-span-1">
                  <ProductImage name={product.images[0]} alt="" sizes="96px" />
                </div>
                <div>
                  <h2 dir="ltr" className="line-clamp-2 leading-snug rtl:text-right">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {t.cart.unitPrice} <span className="tnum">{formatPrice(product.price, lang)}</span>
                  </p>
                </div>
                <div className="col-start-2 flex items-center justify-between gap-3 md:col-start-auto">
                  <Stepper value={qty} onChange={(n) => setQty(id, n)} className="w-36" />
                  <button type="button" onClick={() => { remove(id); refocus(); }} aria-label={t.cart.removeItem(product.name)}
                    className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-muted transition-colors hover:text-red-text md:hidden">
                    <CloseIcon width={18} height={18} />
                    {t.cart.remove}
                  </button>
                </div>
                <div className="col-start-2 flex items-center justify-between md:col-start-auto md:flex-col md:items-end md:gap-1">
                  <span className="text-sm text-muted md:sr-only">{t.cart.lineTotal}</span>
                  <span className="tnum font-semibold">{formatPrice(qty * product.price, lang)}</span>
                  <button type="button" onClick={() => { remove(id); refocus(); }} aria-label={t.cart.removeItem(product.name)}
                    className="hidden min-h-11 items-center gap-1.5 text-sm text-muted transition-colors hover:text-red-text md:inline-flex">
                    <CloseIcon width={18} height={18} />
                    {t.cart.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="md:col-span-4" aria-label={t.cart.total}>
            <div className="rounded-md border border-line bg-band p-5 shadow-float md:sticky md:top-24 md:mt-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{t.cart.total}</span>
                <span className="tnum text-2xl font-semibold text-red-text">{formatPrice(total, lang)}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-5 flex min-h-12 items-center justify-center gap-3 rounded-md px-6 font-medium">
                {t.cart.checkout}
                <ArrowIcon />
              </Link>
              <Link to="/products" className="mt-2 flex min-h-11 items-center justify-center text-sm font-medium text-blue hover:text-blue-strong">
                {t.cart.continue}
              </Link>
            </div>

            <div className="mt-4" aria-live="polite">
              {confirming ? (
                <div className="flex flex-wrap items-center gap-2 border border-red-text p-3">
                  <span className="mb-1 w-full text-sm font-medium">{t.cart.clearConfirm}</span>
                  <button type="button" onClick={() => { clear(); setConfirming(false); refocus(); }}
                    className="min-h-11 rounded bg-red-text px-4 text-sm font-medium text-paper">
                    {t.cart.clearYes}
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="min-h-11 rounded px-3 text-sm text-muted hover:text-ink">
                    {t.cart.cancel}
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirming(true)}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted underline-offset-4 transition-colors hover:text-red-text hover:underline">
                  {t.cart.clear}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
      </div>
    </>
  );
}
