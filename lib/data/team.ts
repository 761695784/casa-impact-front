import type { TeamCategoryMeta, TeamMember } from '@/types/team'

/**
 * Composition actuelle connue du bureau exécutif (source : brief officiel).
 * Cette liste est INCOMPLÈTE et extensible : de nouveaux membres pourront être ajoutés.
 * Ne pas inventer de membres supplémentaires.
 * Les photos absentes utilisent un placeholder neutre.
 */

const PLACEHOLDER = '/assets/team/placeholder.svg'

export const teamCategories: TeamCategoryMeta[] = [
  { key: 'presidence', titre: 'Présidence' },
  { key: 'administration', titre: 'Administration générale' },
  {
    key: 'pole_capital_humain',
    titre: 'Pôle Capital Humain',
    sousTitre: 'Jeunesse & Leadership · Sport & Développement',
  },
  {
    key: 'pole_economie',
    titre: 'Pôle Économie, Agriculture & Attractivité',
    sousTitre:
      'Entrepreneuriat & Innovation · Tourisme & Attractivité · Diaspora & Investissement',
  },
  {
    key: 'pole_culture',
    titre: 'Pôle Culture & Communication',
    sousTitre: 'Culture & Événementiel · Communication & Médias',
  },
  {
    key: 'pole_support',
    titre: 'Pôle Support',
    sousTitre: 'Partenariats · Logistique & Opérations',
  },
  { key: 'commission_scientifique', titre: 'Commission scientifique' },
  { key: 'coordination_regionale', titre: 'Coordination régionale' },
]

export const teamMembers: TeamMember[] = [
  // Présidence
  {
    id: 'toumany-badiane',
    nom: 'Toumany Badiane',
    fonction: 'Président Fondateur',
    categorie: 'presidence',
    region: 'Ziguinchor',
    image: '/assets/team/toumany-badiane.jpg',
    ordre: 1,
  },
  {
    id: 'nna-maimouna-djitte',
    nom: "N'NA Maïmouna Djitté",
    fonction: 'Vice-Présidente',
    categorie: 'presidence',
    image: '/assets/team/nna-maimouna-djitte.jpg',
    ordre: 2,
  },
  // Administration générale
  {
    id: 'maimouna-sambou',
    nom: 'Maïmouna Sambou',
    fonction: 'Secrétaire Générale',
    categorie: 'administration',
    image: PLACEHOLDER,
    ordre: 1,
  },
  {
    id: 'ibrahima-badiane',
    nom: 'Ibrahima Badiane',
    fonction: 'Trésorier Général',
    categorie: 'administration',
    image: '/assets/team/ibrahima-badiane.jpeg',
    ordre: 2,
  },
  {
    id: 'fatoumata-drame',
    nom: 'Fatoumata Dramé',
    fonction: 'Superviseuse administrative et financière',
    categorie: 'administration',
    image: '/assets/team/fatoumata-drame.jpg',
    ordre: 3,
  },
  // Pôle Capital Humain
  {
    id: 'felicite-binette-coly',
    nom: 'Félicité Binette Coly',
    fonction: 'Responsable Capital Humain',
    pole: 'Jeunesse & Leadership',
    categorie: 'pole_capital_humain',
    image: '/assets/team/felicite-binette-coly.jpg',
    ordre: 1,
  },
  {
    id: 'mamadou-sabane-diallo',
    nom: 'Mamadou Sabane Diallo',
    fonction: 'Responsable Jeunesse & Leadership',
    pole: 'Jeunesse & Leadership',
    categorie: 'pole_capital_humain',
    image: PLACEHOLDER,
    ordre: 2,
  },
  {
    id: 'cherif-aliou-sonko',
    nom: 'Chérif Aliou Sonko',
    fonction: 'Responsable Sport et Développement',
    pole: 'Sport & Développement',
    categorie: 'pole_capital_humain',
    image: '/assets/team/cherif-aliou-sonko.jpg',
    ordre: 3,
  },
  // Pôle Économie, Agriculture & Attractivité
  {
    id: 'mansa-signate',
    nom: 'Papa Mamadou Lamine Mansa Signaté',
    fonction: 'Responsable Pôle Économie',
    pole: 'Entrepreneuriat & Innovation',
    categorie: 'pole_economie',
    image: '/assets/team/mansa-signate.jpg',
    ordre: 1,
  },
  {
    id: 'samsidine-diatta',
    nom: 'Samsidine Diatta',
    fonction: 'Responsable Tourisme & Attractivité',
    pole: 'Tourisme & Attractivité',
    categorie: 'pole_economie',
    image: PLACEHOLDER,
    ordre: 2,
  },
  {
    id: 'seynabou-bodian',
    nom: 'Seynabou Bodian',
    fonction: 'Membre Pôle Économie',
    pole: 'Diaspora & Investissement',
    categorie: 'pole_economie',
    image: '/assets/team/seynabou-bodian.jpg',
    ordre: 3,
  },
  // Pôle Culture & Communication
  {
    id: 'maimouna-bodian-seye',
    nom: 'Maïmouna Bodian Seye',
    fonction: 'Responsable Culture & Événementiel',
    pole: 'Culture & Événementiel',
    categorie: 'pole_culture',
    image: '/assets/team/maimouna-bodian-seye.jpg',
    ordre: 1,
  },
  {
    id: 'serge-adama-mane',
    nom: 'Serge Adama Mané',
    fonction: 'Responsable Communication & Médias',
    pole: 'Communication & Médias',
    categorie: 'pole_culture',
    image: '/assets/team/serge-adama-mane.jpeg',
    ordre: 2,
  },
  // Pôle Support
  {
    id: 'safina-kante',
    nom: 'Safina Kanté',
    fonction: 'Responsable Partenariats',
    pole: 'Partenariats',
    categorie: 'pole_support',
    image: PLACEHOLDER,
    ordre: 1,
  },
  {
    id: 'abdoulaye-bodian',
    nom: 'Abdoulaye Bodian',
    fonction: 'Responsable Logistique & Opérations',
    pole: 'Logistique & Opérations',
    categorie: 'pole_support',
    image: '/assets/team/abdoulaye-bodiang.jpg',
    ordre: 2,
  },
  // Commission scientifique
  {
    id: 'kadialy-sane',
    nom: 'Kadialy Sané',
    fonction: 'Responsable Commission scientifique',
    categorie: 'commission_scientifique',
    image: '/assets/team/kadialy-sane.jpeg',
    ordre: 1,
  },
  // Coordination régionale
  {
    id: 'adama-sankhare',
    nom: 'Adama Sankharé',
    fonction: 'Coordonnateur régional',
    region: 'Ziguinchor',
    categorie: 'coordination_regionale',
    image: '/assets/team/adama-sankhare.jpg',
    ordre: 1,
  },
  {
    id: 'abdou-khadre-djitte',
    nom: 'Abdou Khadre Djitté',
    fonction: 'Coordonnateur régional',
    region: 'Sédhiou',
    categorie: 'coordination_regionale',
    image: '/assets/team/abdou-khadre-djitte.jpg',
    ordre: 2,
  },
  {
    id: 'pascaline-santos',
    nom: 'Pascaline Santos',
    fonction: 'Coordinatrice régionale',
    region: 'Kolda',
    categorie: 'coordination_regionale',
    image: '/assets/team/pascaline-santos.jpg',
    ordre: 3,
  },
]

export function getTeamByCategory(category: TeamMember['categorie']) {
  return teamMembers
    .filter((m) => m.categorie === category)
    .sort((a, b) => a.ordre - b.ordre)
}
