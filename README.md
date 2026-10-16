# Historia Medic — boutique en ligne

Vite + React + TypeScript storefront. No backend: each order is one product (any quantity), sent on WhatsApp from the checkout page.

## Run and build

```bash
npm install
npm run dev        # http://localhost:5173 (dev server)
npm test           # logic checks: phone numbers, WhatsApp message, order links, prices, location data
npm run build      # production build in dist/
npm run preview    # serve dist/ locally
```

`npm run build` also validates the location data and prerenders every page to static HTML
(`dist/index.html`, `dist/products/index.html`, …, `dist/404.html`), so the first paint doesn't wait for JavaScript.
Upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, nginx).
Configure the host to serve `404.html` for unknown URLs (Netlify and Cloudflare Pages do this by default).

Before going live, set `siteUrl` in `src/config/store.ts` (e.g. `https://historiamedic.dz`) so link previews get absolute image URLs.

## Change the phone or WhatsApp number, socials, address

Everything store-specific is in **`src/config/store.ts`**:

- `whatsapp`: the number orders are sent to, international format without `+` (e.g. `213770786471`)
- `phone`: the displayed number and the `tel:` number
- `instagram`, `tiktok`, `city`, `tagline`, `coords` (map pin)

## Add a product

1. Put the photo in `assets/Products/`. **The file name is the product name** (e.g. `Tensiomètre Omron M2.jpg`).
   Extra views: same name plus ` 2` / ` (2)` (e.g. `Tensiomètre Omron M2 2.jpg`).
2. Run `npm run images`. It writes optimized WebP copies to `public/images/` and prints an `images: [...]` line.
3. Add one entry to **`src/data/products.ts`**:

```ts
{ id: 'omron-m2', name: 'Tensiomètre Omron M2', category: 'tensiometres', price: 9500, images: ['tensiometre-omron-m2', 'tensiometre-omron-m2-2'] },
```

`category` is `'pese-personne'`, `'tensiometres'` or `'autres'`. Add `featured: true` to show it on the home page.
No component changes are needed. Originals in `assets/` are never modified.

## Change a price

Edit `price` (in DZD) for that product in `src/data/products.ts`.

## Remove a product

Delete its entry in `src/data/products.ts`. Old checkout links to it show "Aucun produit choisi" with a link back to the catalogue.

## Location data (wilayas / communes)

`data-src/algeria_cities.json` is vendored from [othmanus/algeria-cities](https://github.com/othmanus/algeria-cities):
58 wilayas, 1541 communes, French and Arabic names. That repository has no license file; credit goes to its authors.
`npm run algeria` validates it (58 wilayas, codes 01–58, every commune in a known wilaya, no empty or duplicate names) and writes `src/data/algeria.json`.

Algeria moved to 69 wilayas by law 26-06 (April 2026). To switch, replace the source file, set `EXPECTED_WILAYAS`
in `scripts/build-algeria.mjs`, and run `npm run algeria`. See `data-src/README.md`.

## Where things are

| | |
|---|---|
| `src/config/store.ts` | store details |
| `src/data/products.ts` | catalogue |
| `src/i18n/fr.ts`, `ar.ts` | all interface text (French default, Arabic RTL) |
| `src/index.css` | design tokens (colors sampled from the logo), fonts |
| `src/lib/whatsapp.ts` | the order message (always in French) |
| `scripts/` | image optimizer, location data builder, prerender |
