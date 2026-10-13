// Everything specific to the store lives here. Components never hardcode these values.
export const store = {
  name: 'Historia Medic',
  tagline: { fr: 'Votre Santé, Notre Priorité', ar: 'صحتكم، أولويتنا' },
  city: { fr: 'Constantine, Algérie', ar: 'قسنطينة، الجزائر' },
  phone: { display: '0770 78 64 71', tel: '+213770786471' },
  // International format without "+": used for wa.me links and the order message.
  whatsapp: '213770786471',
  instagram: 'historiamedic25',
  tiktok: 'HistoriaMedic',
  coords: [36.258018304462325, 6.5878510958306915] as [number, number],
  // Public URL of the deployed site, no trailing slash. Needed for absolute og:image / og:url.
  siteUrl: 'https://historia-medic.vercel.app',
};

export const links = {
  tel: `tel:${store.phone.tel}`,
  whatsapp: `https://wa.me/${store.whatsapp}`,
  instagram: `https://www.instagram.com/${store.instagram}/`,
  tiktok: `https://www.tiktok.com/@${store.tiktok}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${store.coords.join(',')}`,
};
