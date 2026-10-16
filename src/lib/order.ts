import { productById, type Product } from '../data/products';

// One order = one product × a quantity. It travels in the checkout URL (?p=<id>&q=<qty>),
// so a reload or a shared link keeps it, and there is no cart to store.
export const MAX_QTY = 99;
export const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

export const orderPath = (id: string, qty: number) => `/checkout?p=${encodeURIComponent(id)}&q=${clampQty(qty)}`;

// The URL is user-editable: unknown products give no order, odd quantities are clamped.
export function readOrder(params: URLSearchParams): { product: Product; qty: number } | null {
  const product = productById.get(params.get('p') ?? '');
  if (!product) return null;
  const q = Number(params.get('q'));
  return { product, qty: Number.isFinite(q) ? clampQty(q) : 1 };
}
