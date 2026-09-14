"use client"

import { useQuery } from "@tanstack/react-query"
import { contentService } from "@/lib/services/content.service"
import { publicMembershipService } from "@/lib/services/public-membership.service"

export const queryKeys = {
  domains: ["domains"] as const,
  domain: (slug: string) => ["domains", slug] as const,
  programTypes: ["program-types"] as const,
  programs: ["programs"] as const,
  program: (slug: string) => ["programs", slug] as const,
  applicationCalls: ["application-calls"] as const,
  applicationCall: (slug: string) => ["application-calls", slug] as const,
  news: ["news"] as const,
  newsArticle: (slug: string) => ["news", slug] as const,
  talents: ["talents"] as const,
  talent: (slug: string) => ["talents", slug] as const,
  testimonials: ["testimonials"] as const,
  partners: ["partners"] as const,
  impact: ["impact-indicators"] as const,
  mapPoints: ["map-points"] as const,
}

export function useDomains() {
  return useQuery({ queryKey: queryKeys.domains, queryFn: () => contentService.listDomains() })
}

export function useDomain(slug: string) {
  return useQuery({ queryKey: queryKeys.domain(slug), queryFn: () => contentService.getDomain(slug), enabled: !!slug })
}

export function usePrograms() {
  return useQuery({ queryKey: queryKeys.programs, queryFn: () => contentService.listPrograms() })
}

export function useProgram(slug: string) {
  return useQuery({
    queryKey: queryKeys.program(slug),
    queryFn: () => contentService.getProgram(slug),
    enabled: !!slug,
  })
}

export function useApplicationCalls() {
  return useQuery({ queryKey: queryKeys.applicationCalls, queryFn: () => contentService.listApplicationCalls() })
}

export function useApplicationCall(slug: string) {
  return useQuery({
    queryKey: queryKeys.applicationCall(slug),
    queryFn: () => contentService.getApplicationCall(slug),
    enabled: !!slug,
  })
}

export function useNews() {
  return useQuery({ queryKey: queryKeys.news, queryFn: () => contentService.listNews() })
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.newsArticle(slug),
    queryFn: () => contentService.getNews(slug),
    enabled: !!slug,
  })
}

export function useTalents() {
  return useQuery({ queryKey: queryKeys.talents, queryFn: () => contentService.listTalents() })
}

export function useTalent(slug: string) {
  return useQuery({
    queryKey: queryKeys.talent(slug),
    queryFn: () => contentService.getTalent(slug),
    enabled: !!slug,
  })
}

export function useTestimonials() {
  return useQuery({ queryKey: queryKeys.testimonials, queryFn: () => contentService.listTestimonials() })
}

export function usePartners() {
  return useQuery({ queryKey: queryKeys.partners, queryFn: () => contentService.listPartners() })
}

export function useImpactIndicators() {
  return useQuery({ queryKey: queryKeys.impact, queryFn: () => contentService.listImpactIndicators() })
}

export function useMapPoints() {
  return useQuery({ queryKey: queryKeys.mapPoints, queryFn: () => contentService.listMapPoints() })
}

/**
 * Nombre réel de membres actifs (accord du 2026-09-14, section "Chiffres
 * clés" du site public) — `data` vaut `null` en mode mock, et la requête
 * passe en `isError` si l'API réelle est injoignable ; dans les deux cas
 * le composant appelant doit afficher "?" plutôt qu'un chiffre par
 * défaut. Pas de `retry` : un "?" doit apparaître vite si le backend est
 * hors ligne, pas après plusieurs tentatives silencieuses.
 */
export function useMembersActifsCount() {
  return useQuery({
    queryKey: ["public", "memberships", "count"],
    queryFn: () => publicMembershipService.getMembersActifsCount(),
    staleTime: 1000 * 60,
    retry: false,
  })
}
