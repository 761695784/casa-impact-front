/**
 * Configuration centrale de Casa Impact.
 * Les informations institutionnelles ci-dessous proviennent du brief officiel.
 */

export const siteConfig = {
  name: 'Casa Impact',
  tagline: 'Trois Régions • Une vision • Un impact',
  signature: 'Inspirer • Former • Entreprendre • Transformer',
  description:
    "Casa Impact est une organisation engagée pour le développement durable et inclusif de la Casamance.",
  regions: ['Ziguinchor', 'Sédhiou', 'Kolda'] as const,
  url: 'https://casaimpact.org',
} as const

export const contactInfo = {
  email: 'casaimpactF0rt@gmail.com',
  phone: '78 103 30 63',
  phoneHref: 'tel:+221781033063',
  whatsapp: '221781033063',
  shopPhone: '78 326 73 78',
  shopPhoneHref: 'tel:+221783267378',
  shopWhatsapp: '221783267378',
  address: {
    line1: 'Rue 26 Boukot Ouest',
    line2: 'Villa n°268',
    city: 'Ziguinchor, Sénégal',
  },
} as const

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/casa-impact-12438740a/',
  facebook: 'https://www.facebook.com/profile.php?id=61589979175372&locale=fr_FR',
  instagram: 'https://www.instagram.com/casa_impact/',
  tiktok: 'https://www.tiktok.com/@casaimpact',
} as const

/**
 * Source de données : 'mock' pendant le développement, 'api' une fois branché
 * au backend Laravel. Peut être piloté par une variable d'environnement.
 */
export const DATA_SOURCE: 'mock' | 'api' =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as 'mock' | 'api') || 'mock'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const branding = {
  logo: '/assets/branding/logo-casa-impact.png',
  logoWhite: '/assets/branding/logo-casa-impact-blanc.png',
  tree: '/assets/branding/arbre-couleur.png',
  treeWhite: '/assets/branding/arbre-blanc.png',
  watermark: '/assets/branding/filigrane-couleur.png',
  watermarkWhite: '/assets/branding/filigrane-blanc.png',
} as const

export const mainNav = [
  { label: 'Accueil', href: '/' },
  { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
  { label: 'Opportunités', href: '/opportunites' },
  { label: 'Talents', href: '/talents' },
  { label: 'Boutique', href: '/boutique' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerNav = {
  explorer: [
    { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
    { label: "Domaines d'intervention", href: '/domaines' },
    { label: 'Programmes', href: '/programmes' },
    { label: 'Impact', href: '/impact' },
    { label: 'Carte des actions', href: '/carte' },
  ],
  participer: [
    { label: 'Boutique officielle', href: '/boutique' },
    { label: 'Appels à candidatures', href: '/opportunites#appels' },
    { label: 'Nous rejoindre', href: '/adherer' },
    { label: 'Talents', href: '/talents' },
    { label: 'Témoignages', href: '/temoignages' },
    { label: 'Partenaires', href: '/partenaires' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
  ],
} as const
