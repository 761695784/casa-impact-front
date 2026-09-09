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

/**
 * Forme réelle de MediaResource (App\Http\Resources\MediaResource), utilisée
 * par les ressources déjà reconnectées à l'API réelle dans cette phase
 * (News, Talent, Testimonial). Distincte du type `Media` ci-dessus, qui
 * reste utilisé par Program/ApplicationCall/Partner tant que ces
 * ressources ne sont pas migrées (hors périmètre de cette phase).
 */
export interface PublicMedia {
  id: number
  collection: string
  url: string
  nom_original?: string
  mime?: string
  taille?: number
  legende?: string
  ordre?: number
}

export interface Role {
  id: number
  nom: string
  slug: string
  permissions: string[]
}

/**
 * Forme réelle de UserResource (App\Http\Resources\Admin\UserResource) :
 * un seul champ `name` (pas de nom/prenom séparés), `roles` en tableau
 * de slugs à plat (pas d'objet Role imbriqué). Les permissions ne sont
 * PAS portées par ce type : elles arrivent en clé racine `permissions`
 * dans la réponse de GET /api/admin/me (sibling de `data`, pas dedans),
 * donc gérées séparément dans AuthContext, pas ici.
 */
export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  created_at?: string
  updated_at?: string
}

/**
 * Forme réelle de DomainResource (App\Http\Resources\DomainResource) :
 * id/nom/slug/description/icone/ordre/statut, rien d'autre. Pas de
 * `resume` séparé (une seule zone de texte libre, `description`), pas
 * d'`image` (le visuel de chaque domaine est géré côté frontend par
 * `lib/domain-visuals.tsx`, jamais par l'API — les 6 domaines ont une
 * identité visuelle fixe, pas de champ image en base), pas de
 * `programmes_count` (non calculé par ce endpoint).
 *
 * `resume` reste ici en optionnel pour ne pas casser les composants
 * existants (domain-card.tsx/domain-detail.tsx) qui l'affichent comme
 * accroche courte — la couche service (content.service.ts) le
 * renseigne à partir de `description` quand les données viennent de la
 * vraie API, il n'existe pas de second champ dédié côté backend.
 */
export interface Domain {
  id: number
  nom: string
  slug: string
  description?: string
  resume?: string
  icone?: string
  statut: DomainStatus
  ordre?: number
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

/**
 * Forme réelle de NewsResource — délibérément courte. Pas d'`extrait`,
 * pas de `date_publication`, pas d'`a_la_une`, pas d'`auteur`, pas de
 * `vues_count`, pas d'`image` directe côté API (visuels via `media`).
 * Le corps de l'article est `corps` (pas `contenu`).
 */
export interface News {
  id: number
  titre: string
  slug: string
  type: NewsType
  corps?: string
  statut: NewsStatus
  media?: PublicMedia[]
  created_at?: string
  updated_at?: string
}

/**
 * Forme réelle de TalentResource. Relation réelle : `domain`/`domain_id`
 * (pas `domaine`). Pas de `domaine_activite`, pas de `bio` (le champ
 * réel est `presentation`), pas de photo directe (via `media`), pas de
 * relation `programme` (Talent n'a aucune relation programme côté
 * backend), pas d'`ordre`. `liens_externes` est un simple tableau
 * d'URLs (string[]), pas des objets {label, url}.
 *
 * NB : `domain`/`domain_id` référencent le type `Domain` existant tel
 * quel — Domaines reste hors périmètre de cette phase (toujours
 * alimenté par les mocks), donc ce champ restera `undefined` avec les
 * données réelles pour l'instant.
 */
export interface Talent {
  id: number
  nom: string
  slug: string
  domain_id?: number
  domain?: Domain | null
  region?: Region
  presentation?: string
  parcours?: string
  projet?: string
  realisations?: string
  temoignage?: string
  recit_titre?: string
  recit_corps?: string
  liens_externes?: string[]
  statut: TalentStatus
  media?: PublicMedia[]
  created_at?: string
  updated_at?: string
}

/**
 * Forme réelle de TestimonialResource. `citation` (pas `contenu`),
 * `role_organisation` combiné (pas de `fonction`+`organisation`
 * séparés), relation réelle `application_call`/`application_call_id`
 * en plus de `program`/`program_id` (pas `programme`) — et sur l'index
 * PUBLIC ces deux relations ne sont jamais eager-loadées (toujours
 * `null`/absentes). Pas de photo directe (via `media`), pas d'`ordre`.
 */
export interface Testimonial {
  id: number
  auteur: string
  role_organisation?: string
  citation: string
  contexte?: string
  program_id?: number
  application_call_id?: number
  program?: Program | null
  application_call?: ApplicationCall | null
  statut: TestimonialStatus
  media?: PublicMedia[]
  created_at?: string
  updated_at?: string
}

/**
 * Forme réelle de PartnerResource (App\Http\Resources\PartnerResource,
 * partagée admin/public). Pas de `slug` (pas de page de détail
 * individuelle sur ce modèle), pas de `logo` direct ni de
 * `contact_email`/`contact_telephone` (aucune colonne de ce type en base —
 * voir Partner::$fillable côté backend). Le logo passe exclusivement par
 * la Médiathèque polymorphique, collection `'logo'`, exposée ici via
 * `media` (même forme que PublicMedia — MediaResource est déjà partagée).
 */
export interface Partner {
  id: number
  nom: string
  description?: string
  lien?: string
  type: PartnerType
  statut: PartnerStatus
  ordre?: number
  media?: PublicMedia[]
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

/**
 * Forme réelle de MapPointResource (GET /api/public/map). `type` ne
 * prend que 3 valeurs réelles — pas de "implantation" (aucun mapping de
 * ce type côté backend, voir MapController::LOCATABLE_MAP). Pas de
 * `departement`, `commune`, `statut`, `description` ni `domaine_nom`.
 */
export interface MapPoint {
  id: number
  type: 'program' | 'application-call' | 'talent'
  latitude: number
  longitude: number
  libelle?: string
  region?: Region
  titre?: string
  slug?: string
}

/** Forme réelle d'ImpactValueResource. */
export interface ImpactValue {
  id: number
  valeur: number
  periode?: string
  region?: Region
  created_at?: string
  updated_at?: string
}

/**
 * Forme réelle d'ImpactIndicatorResource. Le tableau de valeurs est
 * `values` (pas `valeurs`). Pas de `categorie`, `domaine`/`domaine_id`,
 * `programme`/`programme_id`, `cible`, `statut` ni `ordre` — aucun de
 * ces champs n'existe côté backend pour cette ressource.
 */
export interface ImpactIndicator {
  id: number
  libelle: string
  unite?: string
  description?: string
  values?: ImpactValue[]
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

/**
 * Forme réelle de la réponse `data` de GET /api/admin/dashboard
 * (App\Services\DashboardStatsService::stats()) : uniquement des
 * compteurs simples par ressource, chacun avec un `total` et parfois un
 * sous-compteur (publiés/actifs/nouveaux). Pas de wrapper "stats", pas
 * d'actions requises, de listes récentes ni de flux d'activité — le
 * backend ne calcule rien de tel aujourd'hui.
 */
export interface DashboardStats {
  programmes: { total: number; publies: number }
  appels_a_candidatures: { total: number; publies: number }
  candidatures: {
    total: number
    par_statut: Record<string, number>
    en_liste_attente: number
  }
  actualites: { total: number; publiees: number }
  talents: { total: number; publies: number }
  temoignages: { total: number; publies: number }
  partenaires: { total: number; actifs: number }
  messages_contact: { total: number; nouveaux: number }
  indicateurs_impact: { total: number }
  utilisateurs: { total: number }
}

/**
 * Enveloppe réelle d'un endpoint public PAGINÉ (Laravel `paginate()`) :
 * `news`, `talents`, `testimonials` dans cette phase. `links`/`from`/`to`
 * ajoutés en optionnel — la forme d'origine (utilisée par Programmes/
 * Appels/Partenaires, hors périmètre de cette phase) reste valide.
 */
export interface PaginatedResponse<T> {
  data: T[]
  links?: {
    first?: string | null
    last?: string | null
    prev?: string | null
    next?: string | null
  }
  meta: {
    current_page: number
    from?: number | null
    last_page: number
    per_page: number
    to?: number | null
    total: number
  }
}

/**
 * Enveloppe réelle d'un endpoint public NON paginé (Laravel `get()`,
 * pas de `paginate()`) : `impact-indicators`, `map` dans cette phase.
 * Pas de clé `meta`/`links`.
 */
export interface CollectionResponse<T> {
  data: T[]
}

export interface SingleResponse<T> {
  data: T
}
