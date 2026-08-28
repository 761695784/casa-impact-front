import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockApplicationCalls } from "@/lib/mock/application-calls.mock"
import { mockPrograms } from "@/lib/mock/programs.mock"
import type { ApplicationCall, PaginatedResponse } from "@/types/models"
import type { ApplicationCallStatus, Region } from "@/types/enums"

export interface ListApplicationCallsParams {
  search?: string
  statut?: ApplicationCallStatus | "all" | string
  region?: Region | "all" | string
  programme_id?: number | "all" | string
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

export const applicationCallsService = {
  /**
   * Liste paginée des appels à candidatures avec filtres
   * Endpoint : GET /api/admin/application-calls
   */
  listApplicationCalls: async (
    params: ListApplicationCallsParams = {}
  ): Promise<PaginatedResponse<ApplicationCall>> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      programme_id = "all",
      page = 1,
      per_page = 10,
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockApplicationCalls]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (c) =>
            c.titre.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.resume?.toLowerCase().includes(q) ||
            c.localisation?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((c) => c.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((c) => c.region === region)
      }

      if (programme_id && programme_id !== "all") {
        filtered = filtered.filter((c) => c.programme_id === Number(programme_id))
      }

      const total = filtered.length
      const last_page = Math.ceil(total / per_page) || 1
      const start = (page - 1) * per_page
      const pagedData = filtered.slice(start, start + per_page)

      return delay<PaginatedResponse<ApplicationCall>>({
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
    if (region && region !== "all") queryParams.set("region", region)
    if (programme_id && programme_id !== "all") queryParams.set("programme_id", String(programme_id))
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const res = await fetch(`${API_URL}/api/admin/application-calls?${queryParams.toString()}`, {
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
        err?.message || `Erreur lors du chargement des appels à candidatures (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data ? json : { data: json.data || json, meta: json.meta }
  },

  /**
   * Détail d'un appel à candidatures par son ID
   * Endpoint : GET /api/admin/application-calls/{id}
   */
  getApplicationCall: async (id: number): Promise<ApplicationCall> => {
    if (DATA_SOURCE === "mock") {
      const found = mockApplicationCalls.find((c) => c.id === Number(id))
      if (!found) {
        throw new Error("Appel à candidatures introuvable")
      }
      return delay<ApplicationCall>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/application-calls/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger l'appel #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Création d'un nouvel appel à candidatures
   * Endpoint : POST /api/admin/application-calls
   */
  createApplicationCall: async (
    payload: Omit<ApplicationCall, "id">
  ): Promise<ApplicationCall> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockApplicationCalls.map((c) => c.id)) + 1
      const programObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme

      const newCall: ApplicationCall = {
        ...payload,
        id: newId,
        slug: payload.slug || generateSlug(payload.titre),
        programme: programObj,
        candidatures_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockApplicationCalls.unshift(newCall)
      return delay<ApplicationCall>(newCall)
    }

    const res = await fetch(`${API_URL}/api/admin/application-calls`, {
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
        err?.message || `Erreur lors de la création de l'appel (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour d'un appel à candidatures
   * Endpoint : PUT /api/admin/application-calls/{id}
   */
  updateApplicationCall: async (
    id: number,
    payload: Partial<ApplicationCall>
  ): Promise<ApplicationCall> => {
    if (DATA_SOURCE === "mock") {
      const index = mockApplicationCalls.findIndex((c) => c.id === Number(id))
      if (index === -1) throw new Error("Appel à candidatures introuvable")

      const existing = mockApplicationCalls[index]
      const programObj = payload.programme_id
        ? mockPrograms.find((p) => p.id === payload.programme_id)
        : payload.programme !== undefined
        ? payload.programme
        : existing.programme

      const updated: ApplicationCall = {
        ...existing,
        ...payload,
        slug: payload.titre ? generateSlug(payload.titre) : existing.slug,
        programme: programObj,
        updated_at: new Date().toISOString(),
      }

      mockApplicationCalls[index] = updated
      return delay<ApplicationCall>(updated)
    }

    const res = await fetch(`${API_URL}/api/admin/application-calls/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour de l'appel (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'un appel à candidatures
   * Endpoint : DELETE /api/admin/application-calls/{id}
   */
  deleteApplicationCall: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockApplicationCalls.findIndex((c) => c.id === Number(id))
      if (index !== -1) {
        mockApplicationCalls.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/application-calls/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression de l'appel (HTTP ${res.status})`
      )
    }

    return true
  },

  /**
   * Exportation des appels à candidatures en CSV
   * Endpoint : GET /api/admin/application-calls/export
   */
  exportApplicationCalls: async (
    params: Omit<ListApplicationCallsParams, "page" | "per_page"> = {}
  ): Promise<void> => {
    let blob: Blob
    const exportFilename = `appels_candidatures_casa_impact_${new Date().toISOString().split("T")[0]}.csv`

    if (DATA_SOURCE === "mock") {
      const headers = "ID;Titre;Slug;Statut;Region;Localisation;Date_Ouverture;Date_Limite;Places;Candidatures\n"
      const rows = mockApplicationCalls
        .map(
          (c) =>
            `${c.id};"${c.titre}";"${c.slug}";"${c.statut}";"${c.region || ""}";"${c.localisation || ""}";"${c.date_ouverture || ""}";"${c.date_limite || ""}";${c.nombre_places || 0};${c.candidatures_count || 0}`
        )
        .join("\n")

      blob = new Blob(["\uFEFF" + headers + rows], {
        type: "text/csv;charset=utf-8;",
      })
    } else {
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.set("search", params.search)
      if (params.statut && params.statut !== "all") queryParams.set("statut", params.statut)
      if (params.region && params.region !== "all") queryParams.set("region", params.region)
      if (params.programme_id && params.programme_id !== "all")
        queryParams.set("programme_id", String(params.programme_id))

      const res = await fetch(
        `${API_URL}/api/admin/application-calls/export?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!res.ok) {
        throw new Error(`Échec de l'exportation des appels (HTTP ${res.status})`)
      }

      blob = await res.blob()
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = exportFilename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}
