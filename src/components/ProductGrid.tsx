import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';

// Hairline lab-form grid: each cell draws its end/bottom rule, so a short last row leaves no grey gaps.
export function ProductGrid({ items, className = '', eagerCount = 0, heading }: {
  items: Product[];
  className?: string;
  eagerCount?: number;
  heading?: 'h2' | 'h3';
}) {
  return (
    <ul className={`grid grid-cols-2 border-s border-t border-line sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((p, i) => (
        <li key={p.id} className="reveal flex border-b border-e border-line [&>*]:w-full" style={{ viewTransitionName: `p-${p.id}` }}>
          <ProductCard product={p} eager={i < eagerCount} heading={heading} />
        </li>
      ))}
    </ul>
  );
}
