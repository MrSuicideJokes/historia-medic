// Validates the vendored wilaya/commune list and writes the compact file used at checkout.
// Exits non-zero (and so fails `npm run build`) if the data looks wrong. Run: npm run algeria
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'data-src/algeria_cities.json');
const OUT = path.join(ROOT, 'src/data/algeria.json');
const EXPECTED_WILAYAS = 58;

const rows = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const problems = [];

const wilayas = new Map();
for (const r of rows) {
  const code = clean(r.wilaya_code);
  const w = { fr: clean(r.wilaya_name_ascii), ar: clean(r.wilaya_name) };
  const c = { fr: clean(r.commune_name_ascii), ar: clean(r.commune_name) };
  if (!/^\d{2}$/.test(code)) problems.push(`bad wilaya code "${code}" (row ${r.id})`);
  if (!w.fr || !w.ar) problems.push(`empty wilaya name (row ${r.id})`);
  if (!c.fr || !c.ar) problems.push(`empty commune name (row ${r.id})`);
  if (!wilayas.has(code)) wilayas.set(code, { code, ...w, communes: [] });
  const known = wilayas.get(code);
  // Every row of a wilaya must agree on its name, or communes are attached to the wrong wilaya.
  if (known.fr !== w.fr || known.ar !== w.ar) problems.push(`wilaya ${code} named "${w.fr}" in row ${r.id}, "${known.fr}" elsewhere`);
  if (known.communes.some((k) => k.fr === c.fr)) problems.push(`duplicate commune "${c.fr}" in wilaya ${code}`);
  known.communes.push(c);
}

const codes = [...wilayas.keys()].sort();
if (wilayas.size !== EXPECTED_WILAYAS) problems.push(`expected ${EXPECTED_WILAYAS} wilayas, got ${wilayas.size}`);
codes.forEach((code, i) => {
  if (Number(code) !== i + 1) problems.push(`wilaya codes not contiguous at ${code}`);
});
for (const w of wilayas.values()) if (!w.communes.length) problems.push(`wilaya ${w.code} has no communes`);

if (problems.length) {
  console.error(`algeria.json NOT written, ${problems.length} problem(s):\n- ${problems.slice(0, 20).join('\n- ')}`);
  process.exit(1);
}

const out = codes.map((code) => {
  const w = wilayas.get(code);
  return { ...w, communes: w.communes.sort((a, b) => a.fr.localeCompare(b.fr, 'fr')) };
});
fs.writeFileSync(OUT, JSON.stringify(out));
const communes = out.reduce((n, w) => n + w.communes.length, 0);
console.log(`ok: ${out.length} wilayas, ${communes} communes → ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
