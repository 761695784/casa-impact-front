/** Valeurs exactes alignées sur l'API Laravel de Casa Impact. */

export type Region = 'ziguinchor' | 'kolda' | 'sedhiou'

export type MembershipRegion =
  | 'ziguinchor'
  | 'sedhiou'
  | 'kolda'
  | 'dakar'
  | 'diaspora'

export type DomainStatus = 'actif' | 'inactif'

export type PageStatus = 'brouillon' | 'publie' | 'archive'

export type ProgramStatus = 'brouillon' | 'publie' | 'archive'

export type ApplicationCallStatus = 'brouillon' | 'publie' | 'ferme'

export type ApplicationStatus =
  | 'nouvelle'
  | 'en_cours_etude'
  | 'preselectionnee'
  | 'retenue'
  | 'non_retenue'
  | 'en_liste_attente'

export type NewsStatus = 'brouillon' | 'previsualisation' | 'publie' | 'archive'

export type NewsType = 'article' | 'annonce' | 'communique' | 'compte-rendu'

export type TalentStatus = 'brouillon' | 'publie' | 'archive'

export type TestimonialStatus = 'brouillon' | 'publie' | 'archive'

export type PartnerStatus = 'actif' | 'inactif'

export type PartnerType = 'institutionnel' | 'financier' | 'technique' | 'media'

export type ContactCategory =
  | 'information_generale'
  | 'partenariat'
  | 'investissement'
  | 'diaspora'
  | 'projet'
  | 'autre'

export type ContactMessageStatus = 'nouveau' | 'en_cours' | 'traite' | 'archive'

export type ContributionDomain =
  | 'pole_capital_humain'
  | 'pole_economie_agriculture_attractivite'
  | 'pole_culture_communication'
  | 'pole_support'
  | 'commission_scientifique'
  | 'coordination_regionale'
  | 'comite_des_sages'

export type ContributionType =
  | 'membre_actif'
  | 'benevole_ponctuel'
  | 'expert_conseiller_technique'

export type MembershipStatus = 'en_attente_paiement' | 'validee' | 'refusee'

export const REGION_LABELS: Record<Region, string> = {
  ziguinchor: 'Ziguinchor',
  kolda: 'Kolda',
  sedhiou: 'Sédhiou',
}

export const MEMBERSHIP_REGION_LABELS: Record<MembershipRegion, string> = {
  ziguinchor: 'Ziguinchor',
  sedhiou: 'Sédhiou',
  kolda: 'Kolda',
  dakar: 'Dakar',
  diaspora: 'Diaspora',
}

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  article: 'Article',
  annonce: 'Annonce',
  communique: 'Communiqué',
  'compte-rendu': 'Compte-rendu',
}

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  institutionnel: 'Institutionnel',
  financier: 'Financier',
  technique: 'Technique',
  media: 'Média',
}

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  information_generale: 'Information générale',
  partenariat: 'Partenariat',
  investissement: 'Investissement',
  diaspora: 'Diaspora',
  projet: 'Projet',
  autre: 'Autre',
}

export const CONTRIBUTION_DOMAIN_LABELS: Record<ContributionDomain, string> = {
  pole_capital_humain: 'Pôle Capital Humain',
  pole_economie_agriculture_attractivite:
    'Pôle Économie, Agriculture & Attractivité',
  pole_culture_communication: 'Pôle Culture & Communication',
  pole_support: 'Pôle Support',
  commission_scientifique: 'Commission scientifique',
  coordination_regionale: 'Coordination régionale',
  comite_des_sages: 'Comité des sages',
}

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  membre_actif: 'Membre actif',
  benevole_ponctuel: 'Bénévole ponctuel',
  expert_conseiller_technique: 'Expert / Conseiller technique',
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  nouvelle: 'Nouvelle',
  en_cours_etude: "En cours d'étude",
  preselectionnee: 'Présélectionnée',
  retenue: 'Retenue',
  non_retenue: 'Non retenue',
  en_liste_attente: "En liste d'attente",
}

export const APPLICATION_CALL_STATUS_LABELS: Record<ApplicationCallStatus, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  ferme: 'Fermé',
}

export const DOMAIN_STATUS_LABELS: Record<DomainStatus, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
}

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  archive: 'Archivé',
}

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  brouillon: 'Brouillon',
  previsualisation: 'En relecture',
  publie: 'Publié',
  archive: 'Archivé',
}

export const PARTNER_STATUS_LABELS: Record<PartnerStatus, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
}

export const PAGE_STATUS_LABELS: Record<PageStatus, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  archive: 'Archivé',
}

export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  archive: 'Archivé',
}

export const TALENT_STATUS_LABELS: Record<TalentStatus, string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  archive: 'Archivé',
}

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  en_attente_paiement: 'En attente de paiement',
  validee: 'Validée',
  refusee: 'Refusée',
}

export const USER_STATUS_LABELS: Record<'actif' | 'inactif' | 'suspendu', string> = {
  actif: 'Actif',
  inactif: 'Inactif',
  suspendu: 'Suspendu',
}

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  'administrateur-principal': 'Administrateur Principal',
  communication: 'Responsable Communication',
  'gestionnaire-candidatures': 'Gestionnaire des Candidatures',
}

export const CONTACT_MESSAGE_STATUS_LABELS: Record<ContactMessageStatus, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  archive: 'Archivé',
}

export type MediaType = 'image' | 'document' | 'video' | 'autre'

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  image: 'Image / Visuel',
  document: 'Document / PDF',
  video: 'Vidéo',
  autre: 'Autre',
}

export const MEDIA_CATEGORY_LABELS: Record<string, string> = {
  all: 'Toutes catégories',
  banniere: 'Bannières & Héros',
  portrait: 'Portraits & Lauréats',
  logo: 'Logos & Partenaires',
  document: 'Rapports & Documents',
  general: 'Général',
}









