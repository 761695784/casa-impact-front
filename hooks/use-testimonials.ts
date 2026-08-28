"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  testimonialsService,
  type ListTestimonialsParams,
} from "@/lib/services/testimonials.service"
import type { Testimonial } from "@/types/models"

export const TESTIMONIALS_QUERY_KEY = ["admin", "testimonials"]

export function useTestimonials(params: ListTestimonialsParams = {}) {
  return useQuery({
    queryKey: [...TESTIMONIALS_QUERY_KEY, params],
    queryFn: () => testimonialsService.listTestimonials(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useTestimonial(id: number | string) {
  return useQuery({
    queryKey: ["admin", "testimonial", id],
    queryFn: () => testimonialsService.getTestimonial(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<Testimonial, "id">) =>
      testimonialsService.createTestimonial(payload),
    onSuccess: (created) => {
      toast.success("Témoignage ajouté avec succès", {
        description: created.auteur,
      })
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de l'ajout du témoignage", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<Testimonial>
    }) => testimonialsService.updateTestimonial(id, payload),
    onSuccess: (updated) => {
      toast.success("Témoignage mis à jour", {
        description: `${updated.auteur} (${updated.statut})`,
      })
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonial", updated.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la mise à jour du témoignage", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => testimonialsService.deleteTestimonial(id),
    onSuccess: () => {
      toast.success("Témoignage supprimé")
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
    onError: (err: unknown) => {
      toast.error("Erreur lors de la suppression du témoignage", {
        description: err instanceof Error ? err.message : "Une erreur est survenue.",
      })
    },
  })
}
