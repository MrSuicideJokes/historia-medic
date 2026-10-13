import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import algeria from '../data/algeria.json';
import type { Dict } from '../i18n/fr';
import { formatPrice } from '../lib/format';
import { usePageMeta } from '../lib/meta';
import { formatPhone, normalizePhone } from '../lib/phone';
import { buildMessage, whatsappUrl } from '../lib/whatsapp';
import { useCart } from '../state/cart';
import { useLang } from '../state/lang';
import { ChevronIcon, WhatsAppIcon } from '../components/icons';
import { ProductImage } from '../components/ProductImage';
import { WilayaCombobox, type Wilaya } from '../components/WilayaCombobox';
import { EmptyCart } from './Cart';
import { PageHeader } from '../components/PageHeader';

type Field = 'firstName' | 'lastName' | 'phone' | 'wilaya' | 'commune';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, keyof Dict['checkout']['errors']>>;

const FIELDS: Field[] = ['firstName', 'lastName', 'phone', 'wilaya', 'commune'];
const wilayas = algeria as Wilaya[];
const findWilaya = (code: string) => wilayas.find((w) => w.code === code);

// Kept for the tab's lifetime, so coming back from WhatsApp doesn't mean retyping everything.
const KEY = 'hm-checkout';
const EMPTY: Values = { firstName: '', lastName: '', phone: '', wilaya: '', commune: '' };
function load(): Values {
  try {
    const v = { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) ?? '{}') } as Values;
    const w = findWilaya(v.wilaya);
    if (!w) return { ...v, wilaya: '', commune: '' };
    return w.communes.some((c) => c.fr === v.commune) ? v : { ...v, commune: '' };
  } catch {
    return EMPTY;
  }
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = 'required';
  if (!v.lastName.trim()) e.lastName = 'required';
  if (!v.phone.trim()) e.phone = 'required';
  else if (!normalizePhone(v.phone)) e.phone = 'phone';
  if (!v.wilaya) e.wilaya = 'wilaya';
  if (!v.commune) e.commune = 'commune';
  return e;
}

function FieldRow({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-text">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  usePageMeta('checkout');
  const { t, lang } = useLang();
  const { lines, total } = useCart();
  const [v, setV] = useState(load);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      /* not critical */
    }
  }, [v]);

  const errors = validate(v);
  const errorOf = (f: Field) => ((touched[f] || submitted) && errors[f] ? t.checkout.errors[errors[f]!] : undefined);
  const describedBy = (f: Field, hint = false) => (errorOf(f) ? `co-${f}-error` : hint ? `co-${f}-hint` : undefined);
  const set = (f: Field) => (value: string) => setV((p) => ({ ...p, [f]: value }));
  const touch = (f: Field) => () => setTouched((p) => ({ ...p, [f]: true }));
  const wilaya = findWilaya(v.wilaya);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = FIELDS.find((f) => errors[f]);
    if (first) {
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    const message = buildMessage(
      {
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        phone: formatPhone(normalizePhone(v.phone)!),
        wilaya: `${wilaya!.code} - ${wilaya!.fr}`,
        commune: v.commune,
      },
      lines.map((l) => ({ name: l.product.name, qty: l.qty, price: l.product.price })),
    );
    // The cart is deliberately kept: the customer may not send the message.
    window.location.href = whatsappUrl(message);
  };

  return (
    <>
      <PageHeader title={t.checkout.title} />
      <div className="wrap">

      {lines.length === 0 ? (
        <EmptyCart message={t.checkout.empty} />
      ) : (
        <form noValidate onSubmit={onSubmit}
          className="mt-8 grid gap-x-12 gap-y-8 [grid-template-areas:'f'_'s'_'b'] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:[grid-template-areas:'f_s'_'b_s']">
          <fieldset className="[grid-area:f]">
            <legend className="mb-1 font-medium">{t.checkout.customer}</legend>
            <p className="mb-6 max-w-lg text-muted">{t.checkout.intro}</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldRow id="co-firstName" label={t.checkout.firstName} error={errorOf('firstName')}>
                <input id="co-firstName" className="field" autoComplete="given-name" value={v.firstName}
                  onChange={(e) => set('firstName')(e.target.value)} onBlur={touch('firstName')}
                  aria-invalid={!!errorOf('firstName')} aria-describedby={describedBy('firstName')} />
              </FieldRow>
              <FieldRow id="co-lastName" label={t.checkout.lastName} error={errorOf('lastName')}>
                <input id="co-lastName" className="field" autoComplete="family-name" value={v.lastName}
                  onChange={(e) => set('lastName')(e.target.value)} onBlur={touch('lastName')}
                  aria-invalid={!!errorOf('lastName')} aria-describedby={describedBy('lastName')} />
              </FieldRow>
              <div className="sm:col-span-2">
                <FieldRow id="co-phone" label={t.checkout.phone} hint={t.checkout.phoneHint} error={errorOf('phone')}>
                  <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={v.phone}
                    className="field tnum rtl:text-right sm:max-w-xs"
                    onChange={(e) => set('phone')(e.target.value)} onBlur={touch('phone')}
                    aria-invalid={!!errorOf('phone')} aria-describedby={describedBy('phone', true)} />
                </FieldRow>
              </div>
              <FieldRow id="co-wilaya" label={t.checkout.wilaya} error={errorOf('wilaya')}>
                <WilayaCombobox id="co-wilaya" wilayas={wilayas} value={v.wilaya}
                  onChange={(code) => setV((p) => ({ ...p, wilaya: code, commune: '' }))}
                  onBlur={touch('wilaya')} invalid={!!errorOf('wilaya')} describedBy={describedBy('wilaya')} />
              </FieldRow>
              <FieldRow id="co-commune" label={t.checkout.commune} error={errorOf('commune')}>
                <div className="relative">
                  <select id="co-commune" className="field appearance-none pe-11" disabled={!wilaya} value={v.commune}
                    onChange={(e) => set('commune')(e.target.value)} onBlur={touch('commune')}
                    aria-invalid={!!errorOf('commune')} aria-describedby={describedBy('commune')}>
                    <option value="">{wilaya ? t.checkout.communePlaceholder : t.checkout.communeDisabled}</option>
                    {wilaya?.communes.map((c) => <option key={c.fr} value={c.fr}>{c[lang]}</option>)}
                  </select>
                  <ChevronIcon className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </FieldRow>
            </div>
          </fieldset>

          <aside aria-labelledby="summary-title" className="rounded-md border border-line bg-band p-5 shadow-float [grid-area:s] md:sticky md:top-24 md:self-start">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="summary-title" className="font-medium">{t.checkout.summary}</h2>
              <Link to="/cart" className="inline-flex min-h-11 items-center text-sm font-medium text-blue hover:text-blue-strong">{t.checkout.edit}</Link>
            </div>
            <ul className="mt-2">
              {lines.map(({ id, qty, product }) => (
                <li key={id} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-line py-3">
                  <span className="border border-line"><ProductImage name={product.images[0]} alt="" sizes="48px" /></span>
                  <span className="text-sm leading-snug">
                    <span dir="ltr" className="line-clamp-2 rtl:text-right">{product.name}</span>
                    <span className="tnum text-muted">× {qty}</span>
                  </span>
                  <span className="tnum text-sm font-medium">{formatPrice(qty * product.price, lang)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink pt-3">
              <span className="font-medium">{t.cart.total}</span>
              <span className="tnum text-2xl font-semibold text-red-text">{formatPrice(total, lang)}</span>
            </div>
          </aside>

          <div className="[grid-area:b]">
            {submitted && Object.keys(errors).length > 0 && (
              <p role="alert" className="mb-4 border-s-2 border-red-text ps-3 text-sm font-medium text-red-text">{t.checkout.errorSummary}</p>
            )}
            <button type="submit"
              className="btn-whatsapp flex min-h-13 w-full items-center justify-center gap-3 rounded-md px-7 text-lg font-medium sm:w-auto">
              <WhatsAppIcon width={22} height={22} />
              {t.checkout.submit}
            </button>
            <p className="mt-3 text-sm text-muted">{t.checkout.note}</p>
          </div>
        </form>
      )}
      </div>
    </>
  );
}
