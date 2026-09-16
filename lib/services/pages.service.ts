import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockPages } from "@/lib/mock/pages.mock"
import type { Page } from "@/types/models"
import type { PageStatus } from "@/types/enums"

export interface ListPagesParams {
  search?: string
  statut?: PageStatus | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export const pagesService = {
  /**
   * Liste des pages institutionnelles
   * Endpoint : GET /api/admin/pages
   */
  listPages: async (params: ListPagesParams = {}): Promise<Page[]> => {
    const { search = "", statut = "all" } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockPages]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.titre.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            p.resume?.toLowerCase().includes(q) ||
            p.contenu?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((p) => p.statut === statut)
      }

      filtered.sort((a, b) => (a.ordre || a.id) - (b.ordre || b.id))
      return delay<Page[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const json = await apiFetch<{ data?: Page[] } | Page[]>(
      `/api/admin/pages${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    )
    return (json as { data?: Page[] }).data ?? (json as Page[])
  },

  /**
   * Détail d'une page par son ID ou slug
   * Endpoint : GET /api/admin/pages/{id}
   */
  getPage: async (id: number | string): Promise<Page> => {
    if (DATA_SOURCE === "mock") {
      const found = mockPages.find(
        (p) => p.id === Number(id) || p.slug === String(id)
      )
      if (!found) {
        throw new Error("Page institutionnelle introuvable")
      }
      return delay<Page>(found)
    }

    const json = await apiFetch<{ data?: Page } | Page>(
      `/api/admin/pages/${id}`
    )
    return (json as { data?: Page }).data ?? (json as Page)
  },

  /**
   * Création d'une page
   * Endpoint : POST /api/admin/pages
   */
  createPage: async (payload: Omit<Page, "id">): Promise<Page> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockPages.map((p) => p.id)) + 1
      const newPage: Page = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.titre),
        ordre: payload.ordre || newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockPages.push(newPage)
      return delay<Page>(newPage)
    }

    const json = await apiFetch<{ data?: Page } | Page>(`/api/admin/pages`, {
      method: "POST",
      body: payload,
    })
    return (json as { data?: Page }).data ?? (json as Page)
  },

  /**
   * Mise à jour d'une page
   * Endpoint : PUT /api/admin/pages/{id}
   */
  updatePage: async (
    id: number,
    payload: Partial<Page>
  ): Promise<Page> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPages.findIndex((p) => p.id === Number(id))
      if (index === -1) throw new Error("Page institutionnelle introuvable")

      const existing = mockPages[index]
      const updated: Page = {
        ...existing,
        ...payload,
        slug: payload.titre ? generateSlug(payload.titre) : existing.slug,
        updated_at: new Date().toISOString(),
      }

      mockPages[index] = updated
      return delay<Page>(updated)
    }

    const json = await apiFetch<{ data?: Page } | Page>(
      `/api/admin/pages/${id}`,
      { method: "PUT", body: payload }
    )
    return (json as { data?: Page }).data ?? (json as Page)
  },

  /**
   * Suppression d'une page
   * Endpoint : DELETE /api/admin/pages/{id}
   */
  deletePage: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockPages.findIndex((p) => p.id === Number(id))
      if (index !== -1) {
        mockPages.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    // Corrigé le 2026-09-16 (même bug que contact-messages.service.ts et
    // users.service.ts : fetch() brut sans en-tête X-XSRF-TOKEN → 419 "CSRF
    // token mismatch" systématique sur toute mutation). Passe maintenant
    // par apiFetch.
    await apiFetch<void>(`/api/admin/pages/${id}`, { method: "DELETE" })
    return true
  },
}
