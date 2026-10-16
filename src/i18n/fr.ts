import type { Category } from '../data/products';

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

export const fr = {
  skip: 'Aller au contenu',
  nav: { home: 'Accueil', products: 'Produits', contact: 'Contact', menu: 'Navigation principale' },
  langLabel: 'Langue',
  darkMode: 'Mode sombre',

  categories: { 'pese-personne': 'Pèse-personne', tensiometres: 'Tensiomètres', autres: 'Autres' } as Record<Category, string>,
  all: 'Tous',
  productCount: (n: number) => plural(n, 'produit', 'produits'),

  home: {
    eyebrow: 'Matériel médical · Constantine',
    lead: 'Matériel médical de qualité à Constantine. Choisissez en ligne, commandez sur WhatsApp.',
    cta: 'Voir les produits',
    storefront: 'Notre boutique à Constantine',
    storefrontAlt: 'Façade illuminée de la boutique Historia Medic à Constantine, le soir',
    categoriesTitle: 'Le catalogue',
    featuredTitle: 'Une sélection',
    seeAll: 'Tout le catalogue',
    locationTitle: 'Nous trouver',
    locationText: 'Passez nous voir à Constantine, ou écrivez-nous sur WhatsApp.',
  },

  product: {
    order: 'Commander',
    orderItem: (name: string) => `Commander ${name}`,
    qty: 'Quantité',
    decrease: 'Diminuer la quantité',
    increase: 'Augmenter la quantité',
    view: (i: number, n: number) => `Photo ${i} sur ${n}`,
    photos: 'Photos du produit',
  },

  products: {
    title: 'Nos produits',
    filterLabel: 'Filtrer par catégorie',
  },

  checkout: {
    title: 'Commande',
    intro: 'Indiquez vos coordonnées. Votre commande s’ouvrira dans WhatsApp, prête à être envoyée.',
    customer: 'Vos coordonnées',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Téléphone',
    phoneHint: '05, 06 ou 07 suivi de 8 chiffres',
    wilaya: 'Wilaya',
    wilayaPlaceholder: 'Rechercher une wilaya',
    noResults: 'Aucune wilaya trouvée',
    commune: 'Commune',
    communePlaceholder: 'Choisir une commune',
    communeDisabled: 'Choisissez d’abord une wilaya',
    errors: {
      required: 'Ce champ est obligatoire.',
      phone: 'Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres.',
      wilaya: 'Choisissez une wilaya dans la liste.',
      commune: 'Choisissez une commune.',
    },
    errorSummary: 'Certains champs sont à corriger.',
    summary: 'Votre commande',
    change: 'Changer de produit',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    submit: 'Commander sur WhatsApp',
    note: 'Rien n’est envoyé tant que vous n’appuyez pas sur Envoyer dans WhatsApp.',
    empty: 'Aucun produit choisi.',
    emptyText: 'Choisissez un produit dans le catalogue, puis appuyez sur « Commander ».',
    emptyCta: 'Voir les produits',
  },

  contact: {
    title: 'Contact',
    lead: 'Pour une question ou une commande, appelez-nous ou écrivez-nous sur WhatsApp.',
    address: 'Adresse',
    phone: 'Téléphone',
    social: 'Réseaux',
    directions: 'Itinéraire',
    mapLabel: 'Carte de l’emplacement de Historia Medic',
    mapHint: 'Déplacez la carte avec deux doigts.',
  },

  footer: { follow: 'Suivez-nous', contact: 'Contact' },

  notFound: {
    title: 'Page introuvable',
    text: 'Cette page n’existe pas ou a été déplacée.',
    cta: 'Retour à l’accueil',
  },

  meta: {
    home: { title: 'Historia Medic · Matériel médical à Constantine', description: 'Pèse-personnes, tensiomètres et matériel médical de qualité à Constantine. Choisissez en ligne, commandez sur WhatsApp.' },
    products: { title: 'Produits · Historia Medic', description: 'Pèse-personnes, tensiomètres et autre matériel médical, avec les prix en dinars.' },
    checkout: { title: 'Commande · Historia Medic', description: 'Finalisez votre commande et envoyez-la sur WhatsApp.' },
    contact: { title: 'Contact · Historia Medic', description: 'Historia Medic à Constantine : téléphone, WhatsApp, Instagram, TikTok et itinéraire.' },
    notFound: { title: 'Page introuvable · Historia Medic', description: 'Cette page n’existe pas.' },
  },
};

export type Dict = typeof fr;
