// Post-build: write dist/<route>/index.html for every page, with the page already rendered
// (French) and its own <title>, description and OG tags. First paint and product photos no longer
// wait for JavaScript, and link previews (WhatsApp, Facebook) see the right text.
// Also writes dist/404.html, which most static hosts serve for unknown URLs.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fr } from '../src/i18n/fr.ts';
import { store } from '../src/config/store.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href);

const routes = {
  '/': ['home', 'index.html'],
  '/products': ['products', 'products/index.html'],
  '/checkout': ['checkout', 'checkout/index.html'],
  '/contact': ['contact', 'contact/index.html'],
  '/404': ['notFound', '404.html'],
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Prerendered text paints immediately, so the Latin webfont must be there too, or the swap reflows the page.
const font = fs.readdirSync(path.join(DIST, 'assets')).find((f) => /^readex-pro-latin-full-normal-.*\.woff2$/.test(f));
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  .replace('</title>', `</title>\n    <link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`);

for (const [route, [key, file]] of Object.entries(routes)) {
  const { title, description } = fr.meta[key];
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace('<div id="root"></div>', `<div id="root">${await render(route)}</div>`);
  if (store.siteUrl && key !== 'notFound') {
    html = html
      .replace('content="/og-image.jpg"', `content="${store.siteUrl}/og-image.jpg"`)
      .replace('<meta property="og:type"', `<meta property="og:url" content="${store.siteUrl}${route}" />\n    <link rel="canonical" href="${store.siteUrl}${route}" />\n    <meta property="og:type"`);
  }
  fs.mkdirSync(path.dirname(path.join(DIST, file)), { recursive: true });
  fs.writeFileSync(path.join(DIST, file), html);
}
fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${Object.keys(routes).length} pages${store.siteUrl ? '' : ' (store.siteUrl empty: og:image stays relative)'}`);
