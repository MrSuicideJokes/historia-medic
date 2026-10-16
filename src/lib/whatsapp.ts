import { store } from '../config/store';
import { formatPrice } from './format';

export type Customer = { firstName: string; lastName: string; phone: string; wilaya: string; commune: string };
export type OrderItem = { name: string; qty: number; price: number };

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
    `Prix unitaire : ${formatPrice(item.price, 'fr')}`,
    '',
    `*Total : ${formatPrice(item.qty * item.price, 'fr')}*`,
  ].join('\n');
}

export const whatsappUrl = (message: string) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
