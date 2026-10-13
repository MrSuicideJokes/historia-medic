import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { productById, type Product } from '../data/products';

export type Line = { id: string; qty: number };
type Action =
  | { type: 'add'; id: string; qty: number }
  | { type: 'set'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

// Bump the version if the stored shape ever changes; old carts are then ignored.
export const CART_KEY = 'hm-cart-v1';
export const MAX_QTY = 99;

export const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

// Whatever is in storage is untrusted: keep only known products with a sane quantity.
export function sanitize(raw: unknown, exists: (id: string) => boolean = (id) => productById.has(id)): Line[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, number>();
  for (const l of raw) {
    if (!l || typeof l.id !== 'string' || !exists(l.id) || !Number.isFinite(l.qty) || l.qty < 1) continue;
    merged.set(l.id, clampQty((merged.get(l.id) ?? 0) + l.qty));
  }
  return [...merged].map(([id, qty]) => ({ id, qty }));
}

export function reducer(lines: Line[], a: Action): Line[] {
  switch (a.type) {
    case 'add': {
      const found = lines.find((l) => l.id === a.id);
      return found
        ? lines.map((l) => (l.id === a.id ? { ...l, qty: clampQty(l.qty + a.qty) } : l))
        : [...lines, { id: a.id, qty: clampQty(a.qty) }];
    }
    case 'set':
      return lines.map((l) => (l.id === a.id ? { ...l, qty: clampQty(a.qty) } : l));
    case 'remove':
      return lines.filter((l) => l.id !== a.id);
    case 'clear':
      return [];
  }
}

function load(): Line[] {
  try {
    return sanitize(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'));
  } catch {
    return [];
  }
}

type CartValue = {
  lines: (Line & { product: Product })[];
  count: number;
  total: number;
  add: (id: string, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked: the cart still works for this visit */
    }
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const full = lines.map((l) => ({ ...l, product: productById.get(l.id)! }));
    return {
      lines: full,
      count: full.reduce((s, l) => s + l.qty, 0),
      total: full.reduce((s, l) => s + l.qty * l.product.price, 0),
      add: (id, qty) => dispatch({ type: 'add', id, qty }),
      setQty: (id, qty) => dispatch({ type: 'set', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines]);

  return <CartContext value={value}>{children}</CartContext>;
}

export const useCart = () => use(CartContext)!;
