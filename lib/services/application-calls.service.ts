import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
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

/**
 * App\Http\Resources\ApplicationCallResource (backend) renvoie `lieu`,
 * `date_debut`, `program`/`program_id` — le frontend est typé sur
 * `localisation`, `date_ouverture`, `programme`/`programme_id` (mêmes
 * noms hérités que pour Program/Domain). `toApiPayload` traduit vers le
 * backend à l'envoi, `withLegacyNames` traduit la réponse au retour —
 * aucun renommage côté serveur, cf. App\Http\Requests\Admin\
 * Store/UpdateApplicationCallRequest (`program_id` requis, pas
 * `programme_id`).
 */
function toApiPayload(payload: Partial<ApplicationCall>): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (payload.titre !== undefined) body.titre = payload.titre
  if (payload.slug !== undefined) body.slug = payload.slug
  if (payload.description !== undefined) body.description = payload.description
  if (payload.resume !== undefined) body.resume = payload.resume
  if (payload.region !== undefined) body.region = payload.region
  if (payload.localisation !== undefined) body.lieu = payload.localisation
  if (payload.date_ouverture !== undefined) body.date_debut = payload.date_ouverture
  if (payload.date_limite !== undefined) body.date_limite = payload.date_limite
  if (payload.nombre_places !== undefined) body.nombre_places = payload.nombre_places
  if (payload.statut !== undefined) body.statut = payload.statut
  if (payload.documents_requis !== undefined) body.documents_requis = payload.documents_requis

  const programId = payload.programme_id ?? payload.programme?.id
  if (programId !== undefined) body.program_id = programId

  return body
}

function withLegacyNames(
  c: ApplicationCall & {
    lieu?: string
    date_debut?: string
    program?: ApplicationCall["programme"]
    program_id?: number
  }
): ApplicationCall {
  return {
    ...c,
    localisation: c.lieu ?? c.localisation,
    date_ouverture: c.date_debut ?? c.date_ouverture,
    programme: c.program ?? c.programme,
    programme_id: c.program_id ?? c.programme_id,
  }
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
    if (programme_id && programme_id !== "all") queryParams.set("program_id", String(programme_id))
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const json = await apiFetch<PaginatedResponse<ApplicationCall>>(
      `/api/admin/application-calls?${queryParams.toString()}`,
      { method: "GET" }
    )

    return { ...json, data: json.data.map(withLegacyNames) }
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

    const json = await apiFetch<{ data?: ApplicationCall } | ApplicationCall>(
      `/api/admin/application-calls/${id}`,
      { method: "GET" }
    )

    const raw = (json as { data?: ApplicationCall }).data ?? (json as ApplicationCall)
    return withLegacyNames(raw)
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

    const json = await apiFetch<{ data?: ApplicationCall } | ApplicationCall>(
      `/api/admin/application-calls`,
      { method: "POST", body: toApiPayload(payload) }
    )

    const raw = (json as { data?: ApplicationCall }).data ?? (json as ApplicationCall)
    return withLegacyNames(raw)
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

    const json = await apiFetch<{ data?: ApplicationCall } | ApplicationCall>(
      `/api/admin/application-calls/${id}`,
      { method: "PUT", body: toApiPayload(payload) }
    )

    const raw = (json as { data?: ApplicationCall }).data ?? (json as ApplicationCall)
    return withLegacyNames(raw)
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

    await apiFetch<void>(`/api/admin/application-calls/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Exportation des appels à candidatures en CSV
   * Endpoint : GET /api/admin/application-calls/export
   * (Réponse binaire — passe par `fetch` directement, `apiFetch` est
   * taillé pour du JSON. GET n'a pas besoin du header CSRF.)
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
      const { API_URL } = await import("@/lib/config")
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.set("search", params.search)
      if (params.statut && params.statut !== "all") queryParams.set("statut", params.statut)
      if (params.region && params.region !== "all") queryParams.set("region", params.region)
      if (params.programme_id && params.programme_id !== "all")
        queryParams.set("program_id", String(params.programme_id))

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
