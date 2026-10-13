// Builds optimized WebP copies of the product photos + logo-derived icons.
// Originals in assets/ are never modified. Run: npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets/Products');
const LOGO = path.join(ROOT, 'assets/Logo/Historia Medic Logo.jpg');
const OUT = path.join(ROOT, 'public/images');
const PUB = path.join(ROOT, 'public');
const SIZES = [480, 960];
const CREAM = '#F2EEE6';

// "Name 2.jpg" / "Name (2).jpg" are extra views of "Name.jpg". Single digit 2-9 only,
// so model numbers like "Beurer MS 01" are left alone.
const VIEW = /\s(?:\(([2-9])\)|([2-9]))$/;

const slugify = (s) => {
  const slug = s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug.length <= 60 ? slug : slug.slice(0, 61).replace(/-[^-]*$/, ''); // cut on a word boundary
};

function groupProducts() {
  const groups = new Map();
  for (const file of fs.readdirSync(SRC)) {
    const stem = path.parse(file).name.normalize('NFC');
    const m = stem.match(VIEW);
    const base = m ? stem.slice(0, m.index) : stem;
    const view = m ? Number(m[1] ?? m[2]) : 1;
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push({ file, view });
  }
  for (const views of groups.values()) views.sort((a, b) => a.view - b.view);
  return groups;
}

// Studio backdrops range from #EAECEF to #FFFFFF. Measure the top corners and return a
// per-channel gain that lifts the backdrop to white (capped at +10%), so tiles look consistent.
async function backdropGain(file) {
  const { data, info } = await sharp(file).flatten({ background: '#ffffff' }).resize(64, 64, { fit: 'fill' })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const sum = [0, 0, 0];
  const pts = [[1, 1], [62, 1], [1, 3], [62, 3]];
  for (const [x, y] of pts) for (let c = 0; c < 3; c++) sum[c] += data[(y * info.width + x) * 3 + c];
  return sum.map((s) => Math.min(1.1, 255 / (s / pts.length)));
}

async function products() {
  fs.mkdirSync(OUT, { recursive: true });
  const groups = groupProducts();
  for (const [base, views] of groups) {
    const slug = slugify(base);
    const names = [];
    for (const [i, { file }] of views.entries()) {
      const name = i === 0 ? slug : `${slug}-${i + 1}`;
      names.push(name);
      const gain = await backdropGain(path.join(SRC, file));
      for (const w of SIZES) {
        await sharp(path.join(SRC, file))
          .flatten({ background: '#ffffff' })
          .linear(gain, [0, 0, 0])
          .resize(w, w, { fit: 'contain', background: '#ffffff' })
          .webp({ quality: 78, effort: 5 })
          .toFile(path.join(OUT, `${name}-${w}.webp`));
      }
    }
    console.log(`${base}\n  images: [${names.map((n) => `'${n}'`).join(', ')}]`);
  }
  console.log(`${groups.size} products`);
}

// Circular crop of the logo: find the red outer ring's bounds, mask a disc just outside it.
async function logo() {
  const { data, info } = await sharp(LOGO).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3, [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r > 170 && g < 90 && b < 90) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const r = Math.max(x1 - x0, y1 - y0) / 2 + 22;
  const size = Math.round(r * 2);
  const left = Math.round(cx - r), top = Math.round(cy - r);
  // The logo's off-white is a vignette (#F2EEE6 → #E6E2D7). Flatten near-neutral light pixels
  // to the exact cream so the disc sits seamlessly on --cream surfaces.
  const [cr, cg, cb] = [0xf2, 0xee, 0xe6];
  const flat = Buffer.from(data);
  for (let i = 0; i < flat.length; i += 3) {
    const mx = Math.max(flat[i], flat[i + 1], flat[i + 2]), mn = Math.min(flat[i], flat[i + 1], flat[i + 2]);
    if (mn > 200 && mx - mn < 28) { flat[i] = cr; flat[i + 1] = cg; flat[i + 2] = cb; }
  }
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  const disc = await sharp(flat, { raw: info })
    .extract({ left, top, width: size, height: size })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png().toBuffer();
  console.log(`logo ring bbox ${x0},${y0}–${x1},${y1} → disc ${size}px @ ${left},${top}`);

  const out = (f) => path.join(PUB, f);
  for (const w of [96, 192]) await sharp(disc).resize(w, w).webp({ quality: 90 }).toFile(out(`logo-${w}.webp`));
  await sharp(disc).resize(32, 32).png().toFile(out('favicon-32.png'));
  await sharp({ create: { width: 180, height: 180, channels: 4, background: CREAM } })
    .composite([{ input: await sharp(disc).resize(164, 164).toBuffer(), gravity: 'center' }])
    .png().toFile(out('apple-touch-icon.png'));
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
    .composite([{ input: await sharp(disc).resize(520, 520).toBuffer(), gravity: 'center' }])
    .jpeg({ quality: 85 }).toFile(out('og-image.jpg'));
}

// Hero photo of the shop: keep its proportions, three widths for phones up to high-DPI desktops.
async function storefront() {
  const src = path.join(ROOT, 'assets/Storefront/Historia Medic boutique.jpg');
  for (const w of [480, 800, 1200]) {
    await sharp(src).rotate().resize({ width: w }).webp({ quality: 68, effort: 6 }).toFile(path.join(OUT, `storefront-${w}.webp`));
  }
  const { width, height } = await sharp(path.join(OUT, 'storefront-1200.webp')).metadata();
  console.log(`storefront: ${width}x${height} (ratio ${(width / height).toFixed(3)})`);
}

await products();
await logo();
await storefront();
