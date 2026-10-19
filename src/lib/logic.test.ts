import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';
import { normalizePhone, formatPhone } from './phone';
import { buildMessage, whatsappUrl } from './whatsapp';
import { orderPath, readOrder } from './order';
import algeria from '../data/algeria.json';
import { products } from '../data/products';

const NB = ' ';

describe('phone', () => {
  it.each([
    ['0770786471', '0770786471'],
    ['0770 78 64 71', '0770786471'],
    ['+213 770 78 64 71', '0770786471'],
    ['+2130770786471', '0770786471'],
    ['00213 5 55 12 34 56', '0555123456'],
    ['213661234567', '0661234567'],
    ['06.61.23.45.67', '0661234567'],
    ['٠٧٧٠٧٨٦٤٧١', '0770786471'],
  ])('accepts %s', (input, expected) => expect(normalizePhone(input)).toBe(expected));

  it.each(['', '0870786471', '021234567', '077078647', '07707864711', '770786471', '+33612345678', 'abc'])(
    'rejects %s', (input) => expect(normalizePhone(input)).toBeNull());

  it('formats', () => expect(formatPhone('0770786471')).toBe('0770 78 64 71'));
});

describe('price', () => {
  it('formats FR and AR with Western digits', () => {
    expect(formatPrice(12500, 'fr')).toBe(`12${NB}500${NB}DA`);
    expect(formatPrice(12500, 'ar')).toBe(`12${NB}500${NB}د.ج`);
    expect(formatPrice(950, 'fr')).toBe(`950${NB}DA`);
    expect(formatPrice(1234567, 'fr')).toBe(`1${NB}234${NB}567${NB}DA`);
  });
});

describe('whatsapp message', () => {
  const msg = buildMessage(
    { firstName: 'Amina', lastName: 'Benali', phone: '0770 78 64 71', wilaya: '25 - Constantine', commune: 'El Khroub' },
    { name: 'Tensiomètre Microlife BP B3 AFIB', qty: 2, price: 12000 },
  );

  it('matches the template exactly', () => {
    expect(msg.replaceAll(NB, ' ')).toBe(
      [
        'Bonjour Historia Medic, je souhaite passer la commande suivante :',
        '',
        '*Client*',
        'Prénom : Amina',
        'Nom : Benali',
        'Téléphone : 0770 78 64 71',
        'Wilaya : 25 - Constantine',
        'Commune : El Khroub',
        '',
        '*Commande*',
        'Produit : Tensiomètre Microlife BP B3 AFIB',
        'Quantité : 2',
        'Prix unitaire : 12 000 DA',
        '',
        '*Total : 24 000 DA*',
      ].join('\n'),
    );
  });

  it('builds an encoded wa.me URL', () => {
    const url = whatsappUrl(msg);
    expect(url.startsWith('https://wa.me/213770786471?text=Bonjour%20Historia%20Medic')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(msg);
  });
});

describe('whatsapp message without a price', () => {
  it('asks the store to confirm the price', () => {
    const msg = buildMessage(
      { firstName: 'A', lastName: 'B', phone: '0770 78 64 71', wilaya: '25 - Constantine', commune: 'El Khroub' },
      { name: 'Crocs LUOFU Noir', qty: 2 },
    );
    expect(msg.endsWith(
      ['Produit : Crocs LUOFU Noir', 'Quantité : 2', 'Prix unitaire : à confirmer', '', '*Total : à confirmer*'].join('\n'),
    )).toBe(true);
  });
});

describe('crocs catalogue', () => {
  it('has five colours, each with its photos and specs', () => {
    const crocs = products.filter((p) => p.category === 'crocs');
    expect(crocs.map((p) => p.name)).toEqual(['Crocs LUOFU Noir', 'Crocs LUOFU Beige', 'Crocs LUOFU Gris', 'Crocs LUOFU Vert pétrole', 'Crocs LUOFU Bleu nuit']);
    expect(crocs.every((p) => p.price === 1800 && p.details?.length === 8 && p.images.length > 0)).toBe(true);
    expect(crocs[0].images).toEqual(['crocs-noir-1', 'crocs-noir-2', 'crocs-noir-3', 'crocs-noir-4']);
  });
});

describe('order from URL', () => {
  const read = (q: string) => readOrder(new URLSearchParams(q));

  it('reads a known product and quantity', () => {
    const o = read('p=omron-m3-comfort-afib&q=3')!;
    expect(o.product.id).toBe('omron-m3-comfort-afib');
    expect(o.qty).toBe(3);
  });

  it('rejects unknown products and clamps quantities', () => {
    expect(read('p=nope&q=2')).toBeNull();
    expect(read('')).toBeNull();
    expect(read('p=coussin-vario&q=0')!.qty).toBe(1);
    expect(read('p=coussin-vario&q=500')!.qty).toBe(99);
    expect(read('p=coussin-vario&q=abc')!.qty).toBe(1);
    expect(read('p=coussin-vario')!.qty).toBe(1);
  });

  it('builds the checkout link the card uses', () => {
    expect(orderPath('coussin-vario', 2)).toBe('/checkout?p=coussin-vario&q=2');
    expect(read(orderPath('coussin-vario', 2).split('?')[1])!.qty).toBe(2);
  });
});

describe('location data', () => {
  it('has 58 wilayas with non-empty communes', () => {
    expect(algeria).toHaveLength(58);
    expect(algeria.reduce((n, w) => n + w.communes.length, 0)).toBe(1541);
    expect(algeria.every((w) => w.fr && w.ar && w.communes.every((c) => c.fr && c.ar))).toBe(true);
  });
});
