import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockTestimonials } from "@/lib/mock/testimonials.mock"
import { mockPrograms } from "@/lib/mock/programs.mock"
import type { Testimonial } from "@/types/models"
import type { TestimonialStatus } from "@/types/enums"

export interface ListTestimonialsParams {
  search?: string
  statut?: TestimonialStatus | "all" | string
  programme_id?: number | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const testimonialsService = {
  /**
   * Liste des témoignages
   * Endpoint : GET /api/admin/testimonials
   */
  listTestimonials: async (
    params: ListTestimonialsParams = {}
  ): Promise<Testimonial[]> => {
    const { search = "", statut = "all", programme_id = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockTestimonials]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.auteur.toLowerCase().includes(q) ||
            t.fonction?.toLowerCase().includes(q) ||
            t.organisation?.toLowerCase().includes(q) ||
            t.contenu.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((t) => t.statut === statut)
      }

      if (programme_id && programme_id !== "all") {
        filtered = filtered.filter(
          (t) => t.programme_id === Number(programme_id) || t.programme?.id === Number(programme_id)
        )
      }

      filtered.sort((a, b) => (a.ordre || a.id) - (b.ordre || b.id))
      return delay<Testimonial[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (programme_id && programme_id !== "all") queryParams.set("programme_id", String(programme_id))

    const url = `${API_URL}/api/admin/testimonials${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include", // Laravel Sanctum SPA
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors du chargement des témoignages (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger le témoignage #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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
      const progObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme

      const newTestimonial: Testimonial = {
        ...payload,
        id: newId,
        programme: progObj,
        ordre: payload.ordre || newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockTestimonials.push(newTestimonial)
      return delay<Testimonial>(newTestimonial)
    }

    const res = await fetch(`${API_URL}/api/admin/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la création du témoignage (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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
      const progObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme !== undefined
        ? payload.programme
        : existing.programme

      const updated: Testimonial = {
        ...existing,
        ...payload,
        programme: progObj,
        updated_at: new Date().toISOString(),
      }

      mockTestimonials[index] = updated
      return delay<Testimonial>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la mise à jour du témoignage (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression du témoignage (HTTP ${res.status})`
      )
    }

    return true
  },
}
