// The catalogue. To add a product: put its photo(s) in assets/Products, run `npm run images`,
// then add one entry below using the image names the script prints. No component changes needed.
//   name     = the photo's file name (without extension)
//   price    = in DZD
//   images   = optimized image names in public/images (first one is the main photo)
//   featured = shown on the home page

export const categories = ['pese-personne', 'tensiometres', 'autres'] as const;
export type Category = (typeof categories)[number];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  images: string[];
  featured?: boolean;
};

export const products: Product[] = [
  // Pèse-personne
  { id: 'beurer-gs203-bois', name: 'Pèse-personne en verre Beurer GS 203 Bois', category: 'pese-personne', price: 5500, images: ['pese-personne-en-verre-beurer-gs-203-bois', 'pese-personne-en-verre-beurer-gs-203-bois-2'] },
  { id: 'beurer-gs203-london', name: 'Pèse-personne en verre Beurer GS 203 London', category: 'pese-personne', price: 5500, images: ['pese-personne-en-verre-beurer-gs-203-london', 'pese-personne-en-verre-beurer-gs-203-london-2'] },
  { id: 'beurer-gs203-new-york', name: 'Pèse-personne en verre Beurer GS 203 New York', category: 'pese-personne', price: 5500, images: ['pese-personne-en-verre-beurer-gs-203-new-york', 'pese-personne-en-verre-beurer-gs-203-new-york-2'], featured: true },
  { id: 'beurer-ms01', name: 'Pèse-personne mécanique Beurer MS 01', category: 'pese-personne', price: 5000, images: ['pese-personne-mecanique-beurer-ms-01', 'pese-personne-mecanique-beurer-ms-01-2'] },
  { id: 'camry-dt602', name: 'Pèse-personne mécanique Camry DT602', category: 'pese-personne', price: 6500, images: ['pese-personne-mecanique-camry-dt602', 'pese-personne-mecanique-camry-dt602-2'] },
  { id: 'camry-dt605', name: 'Pèse-personne mécanique Camry DT605', category: 'pese-personne', price: 4900, images: ['pese-personne-mecanique-camry-dt605', 'pese-personne-mecanique-camry-dt605-2'] },
  { id: 'medel-crystal', name: 'Pèse-personne numérique en verre Medel Crystal', category: 'pese-personne', price: 5500, images: ['pese-personne-numerique-en-verre-medel-crystal', 'pese-personne-numerique-en-verre-medel-crystal-2'] },
  { id: 'laica-ps1042', name: 'Pèse-personne numérique solaire Laica PS1042', category: 'pese-personne', price: 5500, images: ['pese-personne-numerique-solaire-laica-ps1042'] },

  // Tensiomètres
  { id: 'microlife-bp-b3-afib', name: 'Tensiomètre Microlife BP B3 AFIB', category: 'tensiometres', price: 12000, images: ['tensiometre-microlife-bp-b3-afib', 'tensiometre-microlife-bp-b3-afib-2'] },
  { id: 'omron-m3-comfort-afib', name: 'Tensiomètre électronique bras Omron M3 Comfort AFib', category: 'tensiometres', price: 14500, images: ['tensiometre-electronique-bras-omron-m3-comfort-afib', 'tensiometre-electronique-bras-omron-m3-comfort-afib-2'], featured: true },

  // Autres
  { id: 'fascia-gun', name: 'Appareil de massage électrique – Fascia Gun', category: 'autres', price: 6000, images: ['appareil-de-massage-electrique-fascia-gun', 'appareil-de-massage-electrique-fascia-gun-2', 'appareil-de-massage-electrique-fascia-gun-3'] },
  { id: 'fascia-gun-dh-780', name: 'Pistolet de massage Fascia Gun DH-780 (5 têtes)', category: 'autres', price: 3950, images: ['pistolet-de-massage-fascia-gun-dh-780-5-tetes', 'pistolet-de-massage-fascia-gun-dh-780-5-tetes-2'] },
  { id: 'beurer-ih24-kids', name: 'Beurer Inhalateur enfants IH 24 Kids', category: 'autres', price: 10500, images: ['beurer-inhalateur-enfants-ih-24-kids', 'beurer-inhalateur-enfants-ih-24-kids-2', 'beurer-inhalateur-enfants-ih-24-kids-3'], featured: true },
  { id: 'canne-siege', name: 'Canne avec siège, capacité de 120 kg, canne de marche avec siège pour adultes au repos, personnes âgées', category: 'autres', price: 3500, images: ['canne-avec-siege-capacite-de-120-kg-canne-de-marche-avec'] },
  { id: 'ondiwell-collecteur-urine', name: 'Collecteur d’urine Homme – Ondiwell', category: 'autres', price: 4000, images: ['collecteur-d-urine-homme-ondiwell', 'collecteur-d-urine-homme-ondiwell-2'] },
  { id: 'coussin-vario', name: 'Coussin Thérapeutique Alvéolé VARIO', category: 'autres', price: 3000, images: ['coussin-therapeutique-alveole-vario', 'coussin-therapeutique-alveole-vario-2'], featured: true },
  { id: 'flamingo-oreiller-cervical', name: 'Flamingo Oreiller Cervical', category: 'autres', price: 3200, images: ['flamingo-oreiller-cervical', 'flamingo-oreiller-cervical-2'] },
  { id: 'swingmed-sm-1006', name: 'Matelas anti-escarres à air Swingmed SM-1006', category: 'autres', price: 5500, images: ['matelas-anti-escarres-a-air-swingmed-sm-1006'] },
  { id: 'orpedox-oreiller-visco', name: 'Oreiller en visco à tissu Tencel – ORPEDOX', category: 'autres', price: 5400, images: ['oreiller-en-visco-a-tissu-tencel-orpedox', 'oreiller-en-visco-a-tissu-tencel-orpedox-2'] },
];

export const productById = new Map(products.map((p) => [p.id, p]));

export const imageSrc = (name: string, w: 480 | 960 = 480) => `/images/${name}-${w}.webp`;
export const imageSrcSet = (name: string) => `${imageSrc(name, 480)} 480w, ${imageSrc(name, 960)} 960w`;

// Photos composed in the home page hero: the first is shown large.
export const heroProductIds = ['omron-m3-comfort-afib', 'beurer-gs203-new-york', 'coussin-vario'];
