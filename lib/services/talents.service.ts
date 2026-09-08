import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockTalents } from "@/lib/mock/talents.mock"
import { mockDomains } from "@/lib/mock/domains.mock"
import type { Talent } from "@/types/models"
import type { TalentStatus, Region } from "@/types/enums"

export interface ListTalentsParams {
  search?: string
  statut?: TalentStatus | "all" | string
  region?: Region | "all" | string
  domain_id?: number | "all" | string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function generateSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

/** Déballe une réponse Laravel qui peut être `{ data: T }` ou `T` directement. */
function unwrap<T>(payload: T | { data: T }): T {
  if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const talentsService = {
  /**
   * Liste des profils de talents
   * Endpoint : GET /api/admin/talents
   */
  listTalents: async (params: ListTalentsParams = {}): Promise<Talent[]> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      domain_id = "all",
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockTalents]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.nom.toLowerCase().includes(q) ||
            t.presentation?.toLowerCase().includes(q) ||
            t.parcours?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((t) => t.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((t) => t.region === region)
      }

      if (domain_id && domain_id !== "all") {
        filtered = filtered.filter(
          (t) =>
            t.domain_id === Number(domain_id) ||
            t.domain?.id === Number(domain_id)
        )
      }

      filtered.sort((a, b) => a.id - b.id)
      return delay<Talent[]>(filtered)
    }

    // MODE API RÉEL : Aucun fallback silencieux
    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (region && region !== "all") queryParams.set("region", region)
    if (domain_id && domain_id !== "all")
      queryParams.set("domain_id", String(domain_id))

    const path = `/api/admin/talents${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

    const result = await apiFetch<Talent[] | { data: Talent[] }>(path)
    return unwrap(result)
  },

  /**
   * Détail d'un profil de talent
   * Endpoint : GET /api/admin/talents/{id}
   */
  getTalent: async (id: number | string): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const found = mockTalents.find(
        (t) => t.id === Number(id) || t.slug === String(id)
      )
      if (!found) {
        throw new Error("Profil de talent introuvable")
      }
      return delay<Talent>(found)
    }

    const result = await apiFetch<Talent | { data: Talent }>(
      `/api/admin/talents/${id}`
    )
    return unwrap(result)
  },

  /**
   * Création d'un profil de talent
   * Endpoint : POST /api/admin/talents
   */
  createTalent: async (payload: Omit<Talent, "id">): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockTalents.map((t) => t.id)) + 1
      const domObj = payload.domain_id
        ? mockDomains.find((d) => d.id === payload.domain_id)
        : payload.domain

      const newTalent: Talent = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.nom),
        domain: domObj,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockTalents.push(newTalent)
      return delay<Talent>(newTalent)
    }

    const result = await apiFetch<Talent | { data: Talent }>(
      "/api/admin/talents",
      { method: "POST", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Mise à jour d'un profil de talent
   * Endpoint : PUT /api/admin/talents/{id}
   */
  updateTalent: async (
    id: number,
    payload: Partial<Talent>
  ): Promise<Talent> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTalents.findIndex((t) => t.id === Number(id))
      if (index === -1) throw new Error("Talent introuvable")

      const existing = mockTalents[index]
      const domObj = payload.domain_id
        ? mockDomains.find((d) => d.id === payload.domain_id)
        : payload.domain !== undefined
        ? payload.domain
        : existing.domain

      const updated: Talent = {
        ...existing,
        ...payload,
        slug: payload.nom ? generateSlug(payload.nom) : existing.slug,
        domain: domObj,
        updated_at: new Date().toISOString(),
      }

      mockTalents[index] = updated
      return delay<Talent>(updated)
    }

    const result = await apiFetch<Talent | { data: Talent }>(
      `/api/admin/talents/${id}`,
      { method: "PUT", body: payload }
    )
    return unwrap(result)
  },

  /**
   * Suppression d'un profil de talent
   * Endpoint : DELETE /api/admin/talents/{id}
   */
  deleteTalent: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockTalents.findIndex((t) => t.id === Number(id))
      if (index !== -1) {
        mockTalents.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/talents/${id}`, { method: "DELETE" })
    return true
  },
}
