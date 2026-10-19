import { store } from '../config/store';
import { formatPrice } from './format';

export type Customer = { firstName: string; lastName: string; phone: string; wilaya: string; commune: string };
// price is undefined while the store hasn't set one: the message then asks for confirmation.
export type OrderItem = { name: string; qty: number; price?: number };

const TBC = 'à confirmer';

// The order message is always in French, whatever the UI language. One product per order.
export function buildMessage(c: Customer, item: OrderItem): string {
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
    `Produit : ${item.name}`,
    `Quantité : ${item.qty}`,
    `Prix unitaire : ${item.price === undefined ? TBC : formatPrice(item.price, 'fr')}`,
    '',
    `*Total : ${item.price === undefined ? TBC : formatPrice(item.qty * item.price, 'fr')}*`,
  ].join('\n');
}

export const whatsappUrl = (message: string) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
