import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockNews } from "@/lib/mock/news.mock"
import type { News, PaginatedResponse, SingleResponse } from "@/types/models"
import type { NewsStatus, NewsType } from "@/types/enums"

export interface ListNewsParams {
  search?: string
  statut?: NewsStatus | "all" | string
  type?: NewsType | "all" | string
  page?: number
  per_page?: number
}

function delay<T>(data: T, ms = 120): Promise<T> {
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

export const newsService = {
  /**
   * Liste paginée des actualités avec filtres
   * Endpoint : GET /api/admin/news
   */
  listNews: async (
    params: ListNewsParams = {}
  ): Promise<PaginatedResponse<News>> => {
    const {
      search = "",
      statut = "all",
      type = "all",
      page = 1,
      per_page = 10,
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockNews]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (n) =>
            n.titre.toLowerCase().includes(q) ||
            n.corps?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((n) => n.statut === statut)
      }

      if (type && type !== "all") {
        filtered = filtered.filter((n) => n.type === type)
      }

      const total = filtered.length
      const last_page = Math.ceil(total / per_page) || 1
      const start = (page - 1) * per_page
      const pagedData = filtered.slice(start, start + per_page)

      return delay<PaginatedResponse<News>>({
        data: pagedData,
        meta: {
          current_page: page,
          last_page,
          per_page,
          total,
        },
      })
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (type && type !== "all") queryParams.set("type", type)
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    return apiFetch<PaginatedResponse<News>>(`/api/admin/news?${queryParams.toString()}`)
  },

  /**
   * Détail d'une actualité par son ID ou son slug
   * Endpoint : GET /api/admin/news/{id}
   */
  getNewsItem: async (id: number | string): Promise<News> => {
    if (DATA_SOURCE === "mock") {
      const found = mockNews.find(
        (n) => n.id === Number(id) || n.slug === String(id)
      )
      if (!found) {
        throw new Error("Actualité introuvable")
      }
      return delay<News>(found)
    }

    const res = await apiFetch<SingleResponse<News>>(`/api/admin/news/${id}`)
    return res.data
  },

  /**
   * Création d'une actualité
   * Endpoint : POST /api/admin/news
   */
  createNews: async (payload: Omit<News, "id">): Promise<News> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockNews.map((n) => n.id)) + 1
      const newNews: News = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.titre),
        vues_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockNews.unshift(newNews)
      return delay<News>(newNews)
    }

    const res = await apiFetch<SingleResponse<News>>(`/api/admin/news`, {
      method: "POST",
      body: payload,
    })
    return res.data
  },

  /**
   * Mise à jour d'une actualité
   * Endpoint : PUT /api/admin/news/{id}
   */
  updateNews: async (
    id: number,
    payload: Partial<News>
  ): Promise<News> => {
    if (DATA_SOURCE === "mock") {
      const index = mockNews.findIndex((n) => n.id === Number(id))
      if (index === -1) throw new Error("Actualité introuvable")

      const existing = mockNews[index]
      const updated: News = {
        ...existing,
        ...payload,
        slug: payload.titre ? generateSlug(payload.titre) : existing.slug,
        updated_at: new Date().toISOString(),
      }

      mockNews[index] = updated
      return delay<News>(updated)
    }

    const res = await apiFetch<SingleResponse<News>>(`/api/admin/news/${id}`, {
      method: "PUT",
      body: payload,
    })
    return res.data
  },

  /**
   * Suppression d'une actualité
   * Endpoint : DELETE /api/admin/news/{id}
   */
  deleteNews: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockNews.findIndex((n) => n.id === Number(id))
      if (index !== -1) {
        mockNews.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/news/${id}`, { method: "DELETE" })
    return true
  },
}
