"use client"

import { useQuery } from "@tanstack/react-query"
import { contentService } from "@/lib/services/content.service"

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
