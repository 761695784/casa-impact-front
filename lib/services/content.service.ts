import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockDomains } from "@/lib/mock/domains.mock"
import { mockPrograms, mockProgramTypes } from "@/lib/mock/programs.mock"
import { mockApplicationCalls } from "@/lib/mock/application-calls.mock"
import { mockNews } from "@/lib/mock/news.mock"
import { mockTalents } from "@/lib/mock/talents.mock"
import { mockTestimonials } from "@/lib/mock/testimonials.mock"
import { mockPartners } from "@/lib/mock/partners.mock"
import { mockImpactIndicators } from "@/lib/mock/impact.mock"
import { mockMapPoints } from "@/lib/mock/map.mock"
import type {
  Domain,
  Program,
  ProgramType,
  ApplicationCall,
  News,
  Talent,
  Testimonial,
  Partner,
  ImpactIndicator,
  MapPoint,
  PaginatedResponse,
  CollectionResponse,
  SingleResponse,
} from "@/types/models"

/**
 * Content service — point d'accès unique pour le contenu public.
 *
 * Tout le contenu (Actualités, Talents, Témoignages, Impact, Cartographie,
 * Partenaires, Domaines, Programmes, Types de programme, Appels à
 * candidatures) est branché sur la vraie API en mode `DATA_SOURCE ===
 * 'api'`. Programmes/Types de programme/Appels à candidatures viennent
 * d'être rebranchés (2026-09-09) — jusque-là ils restaient volontairement
 * sur les mocks le temps que leur backend (CRUD Programmes/Domaines/Types,
 * puis Appels à candidatures) soit construit et aligné avec le frontend.
 */

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

const MAX_PER_PAGE = "per_page=100"

/**
 * Le backend expose ses propres noms canoniques (`domain`/`domain_id`,
 * `program_type`/`program_type_id`, voir ProgramResource) tandis que les
 * composants publics déjà en place (cartes, filtres, fiche détail) parlent
 * encore de `domaine`/`domaine_id`, `type`/`type_id` — même pont que côté
 * admin (`programsService.withLegacyNames`).
 */
function withLegacyProgramNames(p: Program): Program {
  return {
    ...p,
    domaine: p.domain ?? p.domaine,
    domaine_id: p.domain_id ?? p.domaine_id,
    type: p.program_type ?? p.type,
    type_id: p.program_type_id ?? p.type_id,
  }
}

/**
 * Idem pour les appels à candidatures : le backend renvoie `lieu`,
 * `date_debut`, `program`/`program_id` (voir ApplicationCallResource)
 * tandis que le frontend public (cartes, filtres, fiche détail) attend
 * `localisation`, `date_ouverture`, `programme`/`programme_id` — même pont
 * que côté admin (`applicationCallsService.withLegacyNames`).
 */
function withLegacyCallNames(
  c: ApplicationCall & {
    lieu?: string
    date_debut?: string
    program?: ApplicationCall["programme"]
    program_id?: number
  }
): ApplicationCall {
  return {
    ...c,
    localisation: c.lieu ?? c.localisation,
    date_ouverture: c.date_debut ?? c.date_ouverture,
    programme: c.program ?? c.programme,
    programme_id: c.program_id ?? c.programme_id,
  }
}

export const contentService = {
  // Domaines — non paginé côté backend (référentiel fixe de 6 entrées).
  // Pas de champ `resume` séparé côté API réelle (voir types/models.ts) —
  // on le renseigne ici à partir de `description` pour ne pas casser
  // domain-card.tsx/domain-detail.tsx, qui l'affichent comme accroche.
  listDomains: async (): Promise<Domain[]> => {
    if (DATA_SOURCE === "mock") return delay<Domain[]>(mockDomains)
    const res = await apiFetch<CollectionResponse<Domain>>("/api/public/domains")
    return res.data.map((d) => ({ ...d, resume: d.resume ?? d.description }))
  },
  getDomain: async (slug: string): Promise<Domain | undefined> => {
    if (DATA_SOURCE === "mock") return delay<Domain | undefined>(mockDomains.find((d) => d.slug === slug))
    try {
      const res = await apiFetch<SingleResponse<Domain>>(`/api/public/domains/${encodeURIComponent(slug)}`)
      return { ...res.data, resume: res.data.resume ?? res.data.description }
    } catch {
      return undefined
    }
  },

  // Programmes
  listProgramTypes: async (): Promise<ProgramType[]> => {
    if (DATA_SOURCE === "mock") return delay<ProgramType[]>(mockProgramTypes)
    const res = await apiFetch<CollectionResponse<ProgramType>>("/api/public/program-types")
    return res.data
  },
  listPrograms: async (): Promise<Program[]> => {
    if (DATA_SOURCE === "mock") return delay<Program[]>(mockPrograms)
    const res = await apiFetch<PaginatedResponse<Program>>(`/api/public/programs?${MAX_PER_PAGE}`)
    return res.data.map(withLegacyProgramNames)
  },
  getProgram: async (slug: string): Promise<Program | undefined> => {
    if (DATA_SOURCE === "mock") return delay<Program | undefined>(mockPrograms.find((p) => p.slug === slug))
    try {
      const res = await apiFetch<SingleResponse<Program>>(`/api/public/programs/${encodeURIComponent(slug)}`)
      return withLegacyProgramNames(res.data)
    } catch {
      return undefined
    }
  },

  // Appels à candidatures
  listApplicationCalls: async (): Promise<ApplicationCall[]> => {
    if (DATA_SOURCE === "mock") return delay<ApplicationCall[]>(mockApplicationCalls)
    const res = await apiFetch<PaginatedResponse<ApplicationCall>>(`/api/public/application-calls?${MAX_PER_PAGE}`)
    return res.data.map(withLegacyCallNames)
  },
  getApplicationCall: async (slug: string): Promise<ApplicationCall | undefined> => {
    if (DATA_SOURCE === "mock") {
      return delay<ApplicationCall | undefined>(mockApplicationCalls.find((c) => c.slug === slug))
    }
    try {
      const res = await apiFetch<SingleResponse<ApplicationCall>>(
        `/api/public/application-calls/${encodeURIComponent(slug)}`
      )
      return withLegacyCallNames(res.data)
    } catch {
      return undefined
    }
  },

  // Actualités
  listNews: async (): Promise<News[]> => {
    if (DATA_SOURCE === "mock") return delay<News[]>(mockNews)
    const res = await apiFetch<PaginatedResponse<News>>(`/api/public/news?${MAX_PER_PAGE}`)
    return res.data
  },
  getNews: async (slug: string): Promise<News | undefined> => {
    if (DATA_SOURCE === "mock") return delay<News | undefined>(mockNews.find((n) => n.slug === slug))
    try {
      const res = await apiFetch<SingleResponse<News>>(`/api/public/news/${encodeURIComponent(slug)}`)
      return res.data
    } catch {
      return undefined
    }
  },

  // Talents
  listTalents: async (): Promise<Talent[]> => {
    if (DATA_SOURCE === "mock") return delay<Talent[]>(mockTalents)
    const res = await apiFetch<PaginatedResponse<Talent>>(`/api/public/talents?${MAX_PER_PAGE}`)
    return res.data
  },
  // Pas encore utilisé par aucune page (aucune route /talents/[slug] n'existe
  // pour l'instant côté frontend) mais le vrai endpoint existe côté
  // backend — ajouté ici pour le jour où une fiche de détail sera créée.
  getTalent: async (slug: string): Promise<Talent | undefined> => {
    if (DATA_SOURCE === "mock") return delay<Talent | undefined>(mockTalents.find((t) => t.slug === slug))
    try {
      const res = await apiFetch<SingleResponse<Talent>>(`/api/public/talents/${encodeURIComponent(slug)}`)
      return res.data
    } catch {
      return undefined
    }
  },

  // Témoignages — pas de show() côté backend (pas de slug sur ce modèle)
  listTestimonials: async (): Promise<Testimonial[]> => {
    if (DATA_SOURCE === "mock") {
      return delay<Testimonial[]>(mockTestimonials.filter((t) => t.statut === "publie"))
    }
    // Le filtre "publié" est déjà appliqué côté backend (scope published()) —
    // pas besoin de refiltrer côté client.
    const res = await apiFetch<PaginatedResponse<Testimonial>>(`/api/public/testimonials?${MAX_PER_PAGE}`)
    return res.data
  },

  // Partenaires
  listPartners: async (): Promise<Partner[]> => {
    if (DATA_SOURCE === "mock") return delay<Partner[]>(mockPartners)
    // Le filtre "actif" est déjà appliqué côté backend (scope active()) —
    // pas besoin de refiltrer côté client.
    const res = await apiFetch<PaginatedResponse<Partner>>(`/api/public/partners?${MAX_PER_PAGE}`)
    return res.data
  },

  // Impact — non paginé côté backend, valeurs toujours chargées
  listImpactIndicators: async (): Promise<ImpactIndicator[]> => {
    if (DATA_SOURCE === "mock") return delay<ImpactIndicator[]>(mockImpactIndicators)
    const res = await apiFetch<CollectionResponse<ImpactIndicator>>("/api/public/impact-indicators")
    return res.data
  },

  // Cartographie — non paginé côté backend
  listMapPoints: async (): Promise<MapPoint[]> => {
    if (DATA_SOURCE === "mock") return delay<MapPoint[]>(mockMapPoints)
    const res = await apiFetch<CollectionResponse<MapPoint>>("/api/public/map")
    return res.data
  },
}
