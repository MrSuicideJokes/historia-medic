import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';
import { normalizePhone, formatPhone } from './phone';
import { buildMessage, whatsappUrl } from './whatsapp';
import { reducer, sanitize } from '../state/cart';
import algeria from '../data/algeria.json';

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
    [{ name: 'Tensiomètre Microlife BP B3 AFIB', qty: 2, price: 12000 }, { name: 'Flamingo Oreiller Cervical', qty: 1, price: 3200 }],
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
        '1. Tensiomètre Microlife BP B3 AFIB × 2 : 24 000 DA',
        '2. Flamingo Oreiller Cervical × 1 : 3 200 DA',
        '',
        '*Total : 27 200 DA*',
      ].join('\n'),
    );
  });

  it('builds an encoded wa.me URL', () => {
    const url = whatsappUrl(msg);
    expect(url.startsWith('https://wa.me/213770786471?text=Bonjour%20Historia%20Medic')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(msg);
  });
});

describe('cart', () => {
  const exists = (id: string) => ['a', 'b'].includes(id);

  it('sanitize drops unknown ids and bad quantities, merges and clamps', () => {
    expect(sanitize([{ id: 'a', qty: 2 }, { id: 'gone', qty: 1 }, { id: 'b', qty: 'x' }, { id: 'b', qty: 0 }, { id: 'a', qty: 150 }, null], exists))
      .toEqual([{ id: 'a', qty: 99 }]);
    expect(sanitize('nope', exists)).toEqual([]);
  });

  it('reducer adds, merges, sets (min 1), removes, clears', () => {
    let s = reducer([], { type: 'add', id: 'a', qty: 2 });
    s = reducer(s, { type: 'add', id: 'a', qty: 3 });
    expect(s).toEqual([{ id: 'a', qty: 5 }]);
    s = reducer(s, { type: 'set', id: 'a', qty: 0 });
    expect(s).toEqual([{ id: 'a', qty: 1 }]);
    expect(reducer(s, { type: 'remove', id: 'a' })).toEqual([]);
    expect(reducer(s, { type: 'clear' })).toEqual([]);
  });
});

describe('location data', () => {
  it('has 58 wilayas with non-empty communes', () => {
    expect(algeria).toHaveLength(58);
    expect(algeria.reduce((n, w) => n + w.communes.length, 0)).toBe(1541);
    expect(algeria.every((w) => w.fr && w.ar && w.communes.every((c) => c.fr && c.ar))).toBe(true);
  });
});
