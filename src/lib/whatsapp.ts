import { store } from '../config/store';
import { formatPrice } from './format';

export type Customer = { firstName: string; lastName: string; phone: string; wilaya: string; commune: string };
export type OrderLine = { name: string; qty: number; price: number };

// The order message is always in French, whatever the UI language.
export function buildMessage(c: Customer, lines: OrderLine[]): string {
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  return [
    `Bonjour ${store.name}, je souhaite passer la commande suivante :`,
    '',
    '*Client*',
    `Prénom : ${c.firstName}`,
    `Nom : ${c.lastName}`,
    `Téléphone : ${c.phone}`,
    `Wilaya : ${c.wilaya}`,
    `Commune : ${c.commune}`,
    '',
    '*Commande*',
    ...lines.map((l, i) => `${i + 1}. ${l.name} × ${l.qty} : ${formatPrice(l.qty * l.price, 'fr')}`),
    '',
    `*Total : ${formatPrice(total, 'fr')}*`,
  ].join('\n');
}

export const whatsappUrl = (message: string) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
