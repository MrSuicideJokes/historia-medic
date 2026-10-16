import { MAX_QTY } from '../lib/order';
import { useLang } from '../state/lang';
import { MinusIcon, PlusIcon } from './icons';

const btn =
  'grid size-11 shrink-0 place-items-center text-ink transition-[transform,background-color] hover:bg-blue-tint active:scale-90 disabled:text-line-strong disabled:hover:bg-transparent disabled:active:scale-100';

// − on the inline-start side, + on the inline-end side, in both directions.
export function Stepper({ value, onChange, label, className = '' }: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <div role="group" aria-label={label ?? t.product.qty}
      className={`flex items-center justify-between rounded-md border border-line-strong bg-paper ${className}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t.product.decrease}>
        <MinusIcon />
      </button>
      <output aria-live="polite" className="tnum min-w-8 text-center font-medium">{value}</output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={t.product.increase}>
        <PlusIcon />
      </button>
    </div>
  );
}
