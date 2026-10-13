import type { Lang } from '../state/lang';

const NBSP = ' ';

// "12500" → "12 500" with a no-break space. Western digits in both languages.
export const formatNumber = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

export const formatPrice = (n: number, lang: Lang) => `${formatNumber(n)}${NBSP}${lang === 'ar' ? 'د.ج' : 'DA'}`;
