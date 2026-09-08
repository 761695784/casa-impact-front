import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockTestimonials } from "@/lib/mock/testimonials.mock"
import { mockPrograms } from "@/lib/mock/programs.mock"
import type { Testimonial } from "@/types/models"
import type { TestimonialStatus } from "@/types/enums"

export interface ListTestimonialsParams {
  search?: string
  statut?: TestimonialStatus | "all" | string
  program_id?: number | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/** Déballe une réponse Laravel qui peut être `{ data: T }` ou `T` directement. */
function unwrap<T>(payload: T | { data: T }): T {
  if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const testimonialsService = {
  /**
   * Liste des témoignages
   * Endpoint : GET /api/admin/testimonials
   */
  listTestimonials: async (
    params: ListTestimonialsParams = {}
  ): Promise<Testimonial[]> => {
    const { search = "", statut = "all", program_id = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockTestimonials]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.auteur.toLowerCase().includes(q) ||
            t.role_organisation?.toLowerCase().includes(q) ||
            t.citation.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((t) => t.statut === statut)
      }

      if (program_id && program_id !== "all") {
        filtered = filtered.filter(
          (t) => t.program_id === Number(program_id) || t.program?.id === Number(program_id)
        )
      }

      filtered.sort((a, b) => a.id - b.id)
      return delay<Testimonial[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (program_id && program_id !== "all") queryParams.set("program_id", String(program_id))

    const path = `/api/admin/testimonials${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const result = await apiFetch<Testimonial[] | { data: Testimonial[] }>(path)
    return unwrap(result)
  },

  /**
   * Détail d'un témoignage
   * Endpoint : GET /api/admin/testimonials/{id}
   */
  getTestimonial: async (id: number | string): Promise<Testimonial> => {
    if (DATA_SOURCE === "mock") {
      const found = mockTestimonials.find((t) => t.id === Number(id))
      if (!found) {
        throw new Error("Témoignage introuvable")
      }
      return delay<Testimonial>(found)
    }

    const result = await apiFetch<Testimonial | { data: Testimonial }>(
      `/api/admin/testimonials/${id}`
    )
    return unwrap(result)
  },

  /**
   * Création d'un témoignage
   * Endpoint : POST /api/admin/testimonials
   */
  createTestimonial: async (
    payload: Omit<Testimonial, "id">
  ): Promise<Testimonial> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockTestimonials.map((t) => t.id)) + 1
      const progObj = payload.program_id
        ? mockPrograms.find((p) => p.id === payload.program_id)
        : payload.program

      const newTestimonial: Testimonial = {
        ...payload,
        id: newId,
        program: progObj,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockTestimonials.push(newTestimonial)
      return delay<Testimonial>(newTestimonial)
    }

    const result = await apiFetch<Testimonial | { data: Testimonial }>(
      "/api/admin/testimonials",
      { method: "POST", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Mise à jour d'un témoignage
   * Endpoint : PUT /api/admin/testimonials/{id}
   */
  updateTestimonial: async (
    id: number,
    payload: Partial<Testimonial>
  ): Promise<Testimonial> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTestimonials.findIndex((t) => t.id === Number(id))
      if (index === -1) throw new Error("Témoignage introuvable")

      const existing = mockTestimonials[index]
      const progObj = payload.program_id
        ? mockPrograms.find((p) => p.id === payload.program_id)
        : payload.program !== undefined
        ? payload.program
        : existing.program

      const updated: Testimonial = {
        ...existing,
        ...payload,
        program: progObj,
        updated_at: new Date().toISOString(),
      }

      mockTestimonials[index] = updated
      return delay<Testimonial>(updated)
    }

    const result = await apiFetch<Testimonial | { data: Testimonial }>(
      `/api/admin/testimonials/${id}`,
      { method: "PUT", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Suppression d'un témoignage
   * Endpoint : DELETE /api/admin/testimonials/{id}
   */
  deleteTestimonial: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTestimonials.findIndex((t) => t.id === Number(id))
      if (index !== -1) {
        mockTestimonials.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/testimonials/${id}`, { method: "DELETE" })
    return true
  },
}
