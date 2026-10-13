import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router';
import { categories, products, type Category } from '../data/products';
import { usePageMeta } from '../lib/meta';
import { useLang } from '../state/lang';
import { ProductGrid } from '../components/ProductGrid';
import { PageHeader } from '../components/PageHeader';

const isCategory = (c: string | null): c is Category => categories.includes(c as Category);

function Chip({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded border px-4 text-sm transition-colors ${
        active ? 'border-transparent btn-primary' : 'border-line-strong bg-paper text-ink hover:border-blue hover:text-blue'
      }`}>
      {label}
      <span className={`tnum text-xs ${active ? 'text-white/80' : 'text-muted'}`}>{count}</span>
    </button>
  );
}

export default function Products() {
  usePageMeta('products');
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const raw = params.get('cat');
  const cat = isCategory(raw) ? raw : null;
  const items = cat ? products.filter((p) => p.category === cat) : products;

  // Cards glide to their new places where the View Transitions API exists; instant elsewhere.
  const select = (c: Category | null) => {
    const apply = () => flushSync(() => setParams(c ? { cat: c } : {}, { replace: true }));
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply);
    else apply();
  };

  return (
    <>
      <PageHeader title={t.products.title} aside={<span aria-live="polite">{t.productCount(items.length)}</span>} />
      <div className="wrap">

      <div role="group" aria-label={t.products.filterLabel}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        <Chip active={!cat} label={t.all} count={products.length} onClick={() => select(null)} />
        {categories.map((c) => (
          <Chip key={c} active={cat === c} label={t.categories[c]} count={products.filter((p) => p.category === c).length} onClick={() => select(c)} />
        ))}
      </div>

      <ProductGrid items={items} eagerCount={4} heading="h2" />
      </div>
    </>
  );
}
