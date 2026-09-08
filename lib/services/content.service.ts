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
 * Portée volontairement partielle pour cette phase : Actualités, Talents,
 * Témoignages, Impact, Cartographie et Partenaires sont branchés sur la
 * vraie API (`DATA_SOURCE === 'api'`). Domaines, Programmes/Types de
 * programme et Appels à candidatures restent sur les mocks pour
 * l'instant — ne pas les rebrancher sans instruction explicite.
 */

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

const MAX_PER_PAGE = "per_page=100"

export const contentService = {
  // Domaines — hors périmètre de cette phase, reste sur les mocks.
  listDomains: () => delay<Domain[]>(mockDomains),
  getDomain: (slug: string) => delay<Domain | undefined>(mockDomains.find((d) => d.slug === slug)),

  // Programmes / Types de programme — hors périmètre de cette phase, restent sur les mocks.
  listProgramTypes: () => delay<ProgramType[]>(mockProgramTypes),
  listPrograms: () => delay<Program[]>(mockPrograms),
  getProgram: (slug: string) => delay<Program | undefined>(mockPrograms.find((p) => p.slug === slug)),

  // Appels à candidatures — hors périmètre de cette phase, reste sur les mocks.
  listApplicationCalls: () => delay<ApplicationCall[]>(mockApplicationCalls),
  getApplicationCall: (slug: string) =>
    delay<ApplicationCall | undefined>(mockApplicationCalls.find((c) => c.slug === slug)),

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
