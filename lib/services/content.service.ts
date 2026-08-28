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
} from "@/types/models"

/**
 * Content service — single access point for public content.
 * Today it resolves against in-memory demonstration data. Swap the
 * bodies for real fetch()/DB calls without touching the UI or hooks.
 */

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const contentService = {
  // Domains
  listDomains: () => delay<Domain[]>(mockDomains),
  getDomain: (slug: string) => delay<Domain | undefined>(mockDomains.find((d) => d.slug === slug)),

  // Programs
  listProgramTypes: () => delay<ProgramType[]>(mockProgramTypes),
  listPrograms: () => delay<Program[]>(mockPrograms),
  getProgram: (slug: string) => delay<Program | undefined>(mockPrograms.find((p) => p.slug === slug)),

  // Application calls / opportunities
  listApplicationCalls: () => delay<ApplicationCall[]>(mockApplicationCalls),
  getApplicationCall: (slug: string) =>
    delay<ApplicationCall | undefined>(mockApplicationCalls.find((c) => c.slug === slug)),

  // News
  listNews: () => delay<News[]>(mockNews),
  getNews: (slug: string) => delay<News | undefined>(mockNews.find((n) => n.slug === slug)),

  // Talents
  listTalents: () => delay<Talent[]>(mockTalents),

  // Testimonials
  listTestimonials: () => delay<Testimonial[]>(mockTestimonials),

  // Partners
  listPartners: () => delay<Partner[]>(mockPartners),

  // Impact (measured only — empty until real indicators exist)
  listImpactIndicators: () => delay<ImpactIndicator[]>(mockImpactIndicators),

  // Territorial coverage
  listMapPoints: () => delay<MapPoint[]>(mockMapPoints),
}
