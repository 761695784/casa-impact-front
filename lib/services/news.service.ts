import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockNews } from "@/lib/mock/news.mock"
import type { News, PaginatedResponse } from "@/types/models"
import type { NewsStatus, NewsType } from "@/types/enums"

export interface ListNewsParams {
  search?: string
  statut?: NewsStatus | "all" | string
  type?: NewsType | "all" | string
  a_la_une?: boolean | "all" | string
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
      a_la_une = "all",
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
            n.extrait?.toLowerCase().includes(q) ||
            n.contenu?.toLowerCase().includes(q) ||
            n.auteur?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((n) => n.statut === statut)
      }

      if (type && type !== "all") {
        filtered = filtered.filter((n) => n.type === type)
      }

      if (a_la_une !== "all") {
        const isFeatured = a_la_une === true || a_la_une === "true"
        filtered = filtered.filter((n) => n.a_la_une === isFeatured)
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
    if (a_la_une !== "all") queryParams.set("a_la_une", String(a_la_une))
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const res = await fetch(`${API_URL}/api/admin/news?${queryParams.toString()}`, {
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
        err?.message || `Erreur lors du chargement des actualités (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data ? json : { data: json.data || json, meta: json.meta }
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

    const res = await fetch(`${API_URL}/api/admin/news/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger l'actualité #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/news`, {
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
        err?.message || `Erreur lors de la création de l'article (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/news/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour de l'article (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
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

    const res = await fetch(`${API_URL}/api/admin/news/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression de l'article (HTTP ${res.status})`
      )
    }

    return true
  },
}
