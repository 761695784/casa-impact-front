/**
 * Données officielles des collections & boutique Casa Impact
 * WhatsApp de commande dédié : +221 78 326 73 78
 */

export interface Product {
  id: string
  slug: string
  title: string
  subtitle: string
  price: number // en FCFA
  category: 'polos-tshirts' | 'casquettes' | 'accessoires'
  categoryLabel: string
  image: string
  badge?: string
  sizes?: string[]
  colors?: string[]
  description: string
  features: string[]
  inStock: boolean
  featuredOnHome?: boolean
}

export const SHOP_WHATSAPP_NUMBER = '221783267378'
export const SHOP_PHONE_DISPLAY = '78 326 73 78'

export const productCategories = [
  { id: 'all', label: 'Toutes les collections' },
  { id: 'polos-tshirts', label: 'Polos & T-shirts' },
  { id: 'casquettes', label: 'Casquettes' },
  { id: 'accessoires', label: 'Goodies & Accessoires' },
] as const

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'polo-officiel-vert-homme',
    title: 'Polo Officiel Vert (Homme)',
    subtitle: 'Coupe Homme • Coton Piqué Premium • Logo Brodé',
    price: 10000,
    category: 'polos-tshirts',
    categoryLabel: 'Polos & T-shirts',
    image: '/assets/collections/polo-vert-homme.png',
    badge: 'Bestseller',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vert Forêt'],
    description:
      'Le polo officiel emblématique de Casa Impact en vert forêt profond. Doté de la broderie du Baobab et de la carte des 3 régions (Ziguinchor, Sédhiou, Kolda), il allie prestance institutionnelle, confort exceptionnel et engagement territorial.',
    features: [
      '100% coton piqué haute densité respirant',
      'Broderie haute définition sur le cœur & motif Baobab sérigraphié',
      'Liserés bicolores or & vert sur les manches',
      'Col classique renforcé à 2 boutons assortis',
    ],
    inStock: true,
    featuredOnHome: true,
  },
  {
    id: 'prod-2',
    slug: 'polo-officiel-vert-femme',
    title: 'Polo Officiel Vert (Femme)',
    subtitle: 'Coupe Cintrée Femme • Confort & Élégance • Logo Brodé',
    price: 10000,
    category: 'polos-tshirts',
    categoryLabel: 'Polos & T-shirts',
    image: '/assets/collections/polo-vert-femme.png',
    badge: 'Édition Officielle',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vert Forêt'],
    description:
      'Polo officiel coupe cintrée femme, confectionné avec soin pour sublimer l’élégance et porter fièrement les valeurs de transformation et de solidarité de la Casamance.',
    features: [
      'Coupe féminine ajustée et élégante',
      'Coton peigné souple et doux au toucher',
      'Finitions premium col et bas de manches',
      'Résistant aux lavages fréquents',
    ],
    inStock: true,
    featuredOnHome: false,
  },
  {
    id: 'prod-3',
    slug: 'polo-prestige-blanc',
    title: 'Polo Prestige Blanc & Or',
    subtitle: 'Édition Cérémonie • Col Vert • Sérigraphie Mangues d’Or',
    price: 10000,
    category: 'polos-tshirts',
    categoryLabel: 'Polos & T-shirts',
    image: '/assets/collections/polo-blanc-homme.png',
    badge: 'Prestige',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc Pur & Vert'],
    description:
      'Polo blanc immaculé avec finitions vert forêt et or. Rehaussé par la silhouette du grand Baobab aux mangues dorées, ce modèle incarne la clarté, la vision et l’excellence de notre organisation.',
    features: [
      'Tissu piqué blanc éclatant anti-transpirant',
      'Contraste raffiné vert & or au col et aux manches',
      'Logotype Casa Impact quadri sur la poitrine',
      'Idéal pour événements officiels, forums et conférences',
    ],
    inStock: true,
    featuredOnHome: true,
  },
  {
    id: 'prod-4',
    slug: 'tshirt-collector-femme',
    title: 'T-Shirt Collector Blanc (Femme)',
    subtitle: 'Col Bicolore Vert & Or • Devise Officielle',
    price: 6000,
    category: 'polos-tshirts',
    categoryLabel: 'Polos & T-shirts',
    image: '/assets/collections/tshirt-blanc-femme.png',
    badge: 'Collector',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc / Col Vert / Manches Or'],
    description:
      'T-shirt lifestyle moderne et dynamique. Col rond contrasté vert forêt, manches bordées d’or chaleureux et grand visuel signature Casa Impact.',
    features: [
      'Jersey 100% coton peigné doux et léger',
      'Col rond côtelé bicolore',
      'Impression écologique haute tenue',
      'Coupe décontractée et stylée',
    ],
    inStock: true,
    featuredOnHome: false,
  },
  {
    id: 'prod-5',
    slug: 'tshirt-collector-homme',
    title: 'T-Shirt Collector Blanc (Homme)',
    subtitle: 'Jersey Coton Supérieur • Finition Manches Or • Unisexe',
    price: 6000,
    category: 'polos-tshirts',
    categoryLabel: 'Polos & T-shirts',
    image: '/assets/collections/tshirt-blanc-homme.png',
    badge: 'Collector',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc / Col Vert / Manches Or'],
    description:
      'Le t-shirt signature de Casa Impact pour les rassemblements jeunesse, caravanes citoyennes et usage quotidien. Affichez votre soutien à l’essor des trois régions.',
    features: [
      'Coton peigné de qualité supérieure 180g/m²',
      'Manches rehaussées de bord-côtes jaune safran',
      'Motif territorial Casamance imprimé en bas de corps',
      'Confort optimal par tout temps',
    ],
    inStock: true,
    featuredOnHome: true,
  },
  {
    id: 'prod-6',
    slug: 'casquette-officielle-verte',
    title: 'Casquette Officielle Verte',
    subtitle: 'Sergé Coton Lourd • Broderie 3D Blanche • Œillets Or',
    price: 5000,
    category: 'casquettes',
    categoryLabel: 'Casquettes',
    image: '/assets/collections/casquette-verte.png',
    badge: 'Essentiel',
    sizes: ['Taille Unique Réglable'],
    colors: ['Vert Forêt'],
    description:
      'Casquette 6 panneaux de haute facture en sergé vert forêt. Broderie en relief 3D du logo Casa Impact et œillets d’aération brodés en fil d’or.',
    features: [
      '100% sergé de coton renforcé',
      'Visière courbée avec surpiqûres de maintien',
      'Bandeau intérieur absorbant',
      'Attache arrière réglable en métal gravé',
    ],
    inStock: true,
    featuredOnHome: false,
  },
  {
    id: 'prod-7',
    slug: 'casquette-bicolore-blanche-verte',
    title: 'Casquette Bicolore Blanche & Verte',
    subtitle: 'Calotte Blanche • Visière Verte • Logo Quadri',
    price: 5000,
    category: 'casquettes',
    categoryLabel: 'Casquettes',
    image: '/assets/collections/casquette-bicolore.png',
    badge: 'Nouveauté',
    sizes: ['Taille Unique Réglable'],
    colors: ['Blanc & Visière Verte'],
    description:
      'Un modèle ultra-frais et branché qui associe une calotte blanche lumineuse à une visière vert forêt. Parfait pour se protéger du soleil tout en arborant les couleurs de l’organisation.',
    features: [
      'Design bicolore moderne',
      'Grand logo officiel brodé en couleurs',
      'Fermeture arrière ajustable',
      'Matière respirante et durable',
    ],
    inStock: true,
    featuredOnHome: true,
  },
  {
    id: 'prod-8',
    slug: 'pack-bracelets-officiels',
    title: 'Pack 3 Bracelets Officiels',
    subtitle: 'Lot de 3 Bracelets Silicone : Or, Vert et Blanc',
    price: 3000,
    category: 'accessoires',
    categoryLabel: 'Goodies & Accessoires',
    image: '/assets/collections/bracelets-officiels.png',
    badge: 'Pack 3 en 1',
    sizes: ['Taille Standard (202 mm)'],
    colors: ['Lot 3 Couleurs (Or, Vert, Blanc)'],
    description:
      'Pack complet de 3 bracelets en silicone résistant gravés et sérigraphiés avec le logo et la devise officielle : « Trois Régions • Une vision • Un impact ».',
    features: [
      'Silicone 100% hypoallergénique et waterproof',
      '3 coloris assortis dans chaque pack',
      'Gravure en creux avec encrage résistant',
      'Symbole quotidien d’appartenance et de fierté',
    ],
    inStock: true,
    featuredOnHome: true,
  },
  {
    id: 'prod-9',
    slug: 'mug-collector-ceramique',
    title: 'Mug Collector Céramique',
    subtitle: 'Céramique 330 ml • Anse & Intérieur Verts • Finition Brillante',
    price: 4000,
    category: 'accessoires',
    categoryLabel: 'Goodies & Accessoires',
    image: '/assets/collections/mug-collector.png',
    badge: 'Goodies',
    sizes: ['Contenance 330 ml'],
    colors: ['Blanc & Anse Verte'],
    description:
      'Mug de haute qualité en céramique blanche avec anse et bordure intérieure vert forêt. Arbore la carte stylisée et le Baobab officiel de Casa Impact.',
    features: [
      'Céramique haute résistance thermique',
      'Compatible micro-ondes et lave-vaisselle',
      'Impression par sublimation inaltérable',
      'Idéal pour le bureau, la maison ou comme cadeau',
    ],
    inStock: true,
    featuredOnHome: true,
  },
]

/**
 * Génère le lien WhatsApp pré-rempli pour commander un produit
 */
export function buildWhatsAppOrderLink(params: {
  product: Product
  size?: string
  quantity?: number
  city?: string
  notes?: string
}): string {
  const { product, size, quantity = 1, city, notes } = params
  const totalPrice = product.price * quantity

  let message = `Bonjour Casa Impact Boutique,\n\nJe souhaite commander l'article suivant :\n`
  message += `• *Produit :* ${product.title}\n`
  message += `• *Prix unitaire :* ${product.price.toLocaleString('fr-FR')} FCFA\n`
  message += `• *Quantité :* ${quantity}\n`
  message += `• *Total estimé :* ${totalPrice.toLocaleString('fr-FR')} FCFA\n`

  if (size && size !== 'Taille Unique Réglable' && size !== 'Taille Standard (202 mm)' && size !== 'Contenance 330 ml') {
    message += `• *Taille choisie :* ${size}\n`
  }

  if (city) {
    message += `• *Lieu de livraison souhaité :* ${city}\n`
  }

  if (notes) {
    message += `• *Précisions / Informations :* ${notes}\n`
  }

  message += `\nMerci de m'indiquer la disponibilité et les modalités de livraison / paiement.`

  return `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
