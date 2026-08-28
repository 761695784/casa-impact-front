import type {
  ApplicationCallStatus,
  ApplicationStatus,
  ContactCategory,
  ContactMessageStatus,
  ContributionDomain,
  ContributionType,
  DomainStatus,
  MembershipRegion,
  MembershipStatus,
  NewsStatus,
  NewsType,
  PageStatus,
  PartnerStatus,
  PartnerType,
  ProgramStatus,
  Region,
  TalentStatus,
  TestimonialStatus,
} from './enums'

export interface Media {
  id: number
  url: string
  type: string
  nom?: string
  nom_fichier?: string
  taille?: number
  mime_type?: string
  dimensions?: string
  alt?: string
  description?: string
  categorie?: 'banniere' | 'portrait' | 'logo' | 'document' | 'general'
  entite_liee?: {
    type: 'actualite' | 'partenaire' | 'talent' | 'programme' | 'appel' | 'page'
    id: number
    titre: string
  }
  statut?: 'actif' | 'archive'
  created_at?: string
  updated_at?: string
}

export interface Role {
  id: number
  nom: string
  slug: string
  permissions: string[]
}

export interface User {
  id: number
  nom: string
  prenom?: string
  email: string
  avatar?: string
  role: Role
  statut?: 'actif' | 'inactif' | 'suspendu'
  permissions?: string[]
  derniere_connexion?: string
  created_at?: string
  updated_at?: string
}

export interface Domain {
  id: number
  nom: string
  slug: string
  description?: string
  resume?: string
  icone?: string
  image?: string
  statut: DomainStatus
  ordre?: number
  programmes_count?: number
  created_at?: string
  updated_at?: string
}

export interface Page {
  id: number
  titre: string
  slug: string
  contenu: string
  resume?: string
  statut: PageStatus
  meta_description?: string
  ordre?: number
  created_at?: string
  updated_at?: string
}

export interface ProgramType {
  id: number
  nom: string
  slug: string
  description?: string
  statut?: DomainStatus
  ordre?: number
  programmes_count?: number
  created_at?: string
  updated_at?: string
}

export interface Program {
  id: number
  titre: string
  slug: string
  description?: string
  resume?: string
  domaine?: Domain
  domaine_id?: number
  type?: ProgramType
  type_id?: number
  region?: Region
  localisation?: string
  date_debut?: string
  date_fin?: string
  image?: string
  medias?: Media[]
  statut: ProgramStatus
  appels_count?: number
  beneficiaires_count?: number
  created_at?: string
  updated_at?: string
}

export interface ApplicationDocument {
  cle: string
  libelle: string
  requis: boolean
  formats?: string[]
  taille_max?: number
}

export interface ApplicationCall {
  id: number
  titre: string
  slug: string
  description?: string
  resume?: string
  region?: Region
  localisation?: string
  date_ouverture?: string
  date_limite?: string
  nombre_places?: number | null
  documents_requis: ApplicationDocument[]
  image?: string
  statut: ApplicationCallStatus
  programme?: Program
  programme_id?: number
  candidatures_count?: number
  created_at?: string
  updated_at?: string
}

export interface ApplicationDocumentFile {
  cle: string
  libelle: string
  nom_fichier: string
  url?: string
  taille?: number
  mime_type?: string
  date_upload?: string
}

export interface Application {
  id: number
  reference: string
  statut: ApplicationStatus
  appel_id: number
  candidat_nom?: string
  candidat_email?: string
  candidat_telephone?: string
  region?: Region
  ville?: string
  profession?: string
  motivation?: string
  projet_titre?: string
  projet_description?: string
  documents?: ApplicationDocumentFile[]
  appel?: ApplicationCall
  created_at?: string
  updated_at?: string
  promu?: boolean
  promoted_at?: string
  notes_internes?: string
}

export interface ApplicationConfirmation {
  reference: string
  statut: ApplicationStatus
  message?: string
}

export interface News {
  id: number
  titre: string
  slug: string
  extrait?: string
  contenu?: string
  type: NewsType
  image?: string
  medias?: Media[]
  date_publication?: string
  a_la_une?: boolean
  statut: NewsStatus
  auteur?: string
  vues_count?: number
  created_at?: string
  updated_at?: string
}

export interface Talent {
  id: number
  nom: string
  slug: string
  domaine_activite?: string
  region?: Region
  localisation?: string
  bio?: string
  parcours?: string
  photo?: string
  liens?: { label: string; url: string }[]
  domaine_id?: number
  domaine?: Domain
  programme_id?: number
  programme?: Program
  statut: TalentStatus
  ordre?: number
  created_at?: string
  updated_at?: string
}

export interface Testimonial {
  id: number
  auteur: string
  fonction?: string
  organisation?: string
  contenu: string
  photo?: string
  programme?: Program
  programme_id?: number
  statut: TestimonialStatus
  ordre?: number
  created_at?: string
  updated_at?: string
}

export interface Partner {
  id: number
  nom: string
  slug?: string
  description?: string
  lien?: string
  type: PartnerType
  logo?: string
  statut: PartnerStatus
  ordre?: number
  contact_email?: string
  contact_telephone?: string
  created_at?: string
  updated_at?: string
}

export interface Location {
  id: number
  nom: string
  region: Region
  latitude: number
  longitude: number
}

export interface MapPoint {
  id: number
  type: 'program' | 'application-call' | 'talent' | 'implantation'
  titre: string
  slug?: string
  region: Region
  departement?: string
  commune?: string
  latitude: number
  longitude: number
  statut?: string
  description?: string
  domaine_nom?: string
}

export interface ImpactValue {
  id: number
  periode: string
  region?: Region
  valeur: number
}

export interface ImpactIndicator {
  id: number
  libelle: string
  unite?: string
  description?: string
  valeurs: ImpactValue[]
  categorie?: string
  domaine_id?: number
  domaine?: Domain
  programme_id?: number
  programme?: Program
  cible?: number
  statut?: 'actif' | 'inactif'
  ordre?: number
  created_at?: string
  updated_at?: string
}

export interface ContactMessage {
  id: number
  nom: string
  prenom?: string
  email: string
  telephone?: string
  categorie: ContactCategory
  sujet?: string
  message: string
  statut: ContactMessageStatus
  notes_internes?: string
  lu?: boolean
  created_at?: string
  updated_at?: string
}

export interface Membership {
  id: number
  nom_complet: string
  email: string
  telephone: string
  profession?: string
  region: MembershipRegion
  departement?: string
  domaine_contribution: ContributionDomain
  type_contribution: ContributionType
  photo?: string
  statut: MembershipStatus
  reference?: string
  montant?: number
  paiement_statut?: 'en_attente' | 'paye' | 'echoue'
  created_at?: string
  updated_at?: string
}

export interface MembershipConfirmation {
  reference: string
  statut: MembershipStatus
  message?: string
}

export interface DashboardStats {
  programmes: number
  appels_a_candidatures: number
  candidatures: number
  actualites: number
  talents: number
  temoignages: number
  partenaires: number
  messages_contact: number
  indicateurs_impact: number
  utilisateurs: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface SingleResponse<T> {
  data: T
}
