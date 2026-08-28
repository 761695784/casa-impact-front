import { DATA_SOURCE, API_URL } from "@/lib/config"
import { mockApplications } from "@/lib/mock/applications.mock"
import type { Application, PaginatedResponse } from "@/types/models"
import type { ApplicationStatus, Region } from "@/types/enums"

export interface ListApplicationsParams {
  search?: string
  statut?: ApplicationStatus | "all" | string
  region?: Region | "all" | string
  appel_id?: number | "all" | string
  page?: number
  per_page?: number
}

function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const applicationsService = {
  /**
   * Liste paginée des candidatures avec filtres
   * Endpoint : GET /api/admin/applications
   */
  listApplications: async (
    params: ListApplicationsParams = {}
  ): Promise<PaginatedResponse<Application>> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      appel_id = "all",
      page = 1,
      per_page = 10,
    } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockApplications]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (a) =>
            a.reference.toLowerCase().includes(q) ||
            a.candidat_nom?.toLowerCase().includes(q) ||
            a.candidat_email?.toLowerCase().includes(q) ||
            a.projet_titre?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((a) => a.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((a) => a.region === region)
      }

      if (appel_id && appel_id !== "all") {
        filtered = filtered.filter((a) => a.appel_id === Number(appel_id))
      }

      const total = filtered.length
      const last_page = Math.ceil(total / per_page) || 1
      const start = (page - 1) * per_page
      const pagedData = filtered.slice(start, start + per_page)

      return delay<PaginatedResponse<Application>>({
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
    if (appel_id && appel_id !== "all") queryParams.set("appel_id", String(appel_id))
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(per_page))

    const res = await fetch(`${API_URL}/api/admin/applications?${queryParams.toString()}`, {
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
        err?.message || `Erreur lors du chargement des candidatures (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data ? json : { data: json.data || json, meta: json.meta }
  },

  /**
   * Détail d'une candidature par son ID
   * Endpoint : GET /api/admin/applications/{id}
   */
  getApplication: async (id: number): Promise<Application> => {
    if (DATA_SOURCE === "mock") {
      const found = mockApplications.find((a) => a.id === Number(id))
      if (!found) {
        throw new Error("Candidature introuvable")
      }
      return delay<Application>(found)
    }

    const res = await fetch(`${API_URL}/api/admin/applications/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Impossible de charger la candidature #${id} (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Mise à jour du statut et des notes internes
   * Endpoint : PUT /api/admin/applications/{id}
   */
  updateApplicationStatus: async (
    id: number,
    payload: { statut: ApplicationStatus; notes_internes?: string }
  ): Promise<Application> => {
    if (DATA_SOURCE === "mock") {
      const index = mockApplications.findIndex((a) => a.id === Number(id))
      if (index === -1) throw new Error("Candidature introuvable")

      mockApplications[index] = {
        ...mockApplications[index],
        statut: payload.statut,
        notes_internes:
          payload.notes_internes !== undefined
            ? payload.notes_internes
            : mockApplications[index].notes_internes,
        updated_at: new Date().toISOString(),
      }

      return delay<Application>(mockApplications[index])
    }

    const res = await fetch(`${API_URL}/api/admin/applications/${id}`, {
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
        err?.message || `Erreur lors de la mise à jour du statut (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Promouvoir une candidature
   * Endpoint : POST /api/admin/applications/{id}/promote
   */
  promoteApplication: async (id: number): Promise<Application> => {
    if (DATA_SOURCE === "mock") {
      const index = mockApplications.findIndex((a) => a.id === Number(id))
      if (index === -1) throw new Error("Candidature introuvable")

      mockApplications[index] = {
        ...mockApplications[index],
        promu: true,
        promoted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return delay<Application>(mockApplications[index])
    }

    const res = await fetch(`${API_URL}/api/admin/applications/${id}/promote`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la promotion de la candidature (HTTP ${res.status})`
      )
    }

    const json = await res.json()
    return json.data || json
  },

  /**
   * Suppression d'une candidature
   * Endpoint : DELETE /api/admin/applications/{id}
   */
  deleteApplication: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockApplications.findIndex((a) => a.id === Number(id))
      if (index !== -1) {
        mockApplications.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    const res = await fetch(`${API_URL}/api/admin/applications/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(
        err?.message || `Erreur lors de la suppression (HTTP ${res.status})`
      )
    }

    return true
  },

  /**
   * Téléchargement sécurisé d'un document joint
   * Endpoint : GET /api/admin/applications/{id}/documents/{doc}/download
   */
  downloadDocument: async (
    applicationId: number,
    documentKey: string,
    fallbackFilename = "document.pdf"
  ): Promise<void> => {
    let blob: Blob
    let filename = fallbackFilename

    if (DATA_SOURCE === "mock") {
      // Mock File Generator for Demo
      const mockContent = `Document officiel Casa Impact\nCandidature #${applicationId} - Clé: ${documentKey}\nDate: ${new Date().toISOString()}`
      blob = new Blob([mockContent], { type: "application/pdf" })
      filename = `${documentKey}_candidature_${applicationId}.pdf`
    } else {
      const res = await fetch(
        `${API_URL}/api/admin/applications/${applicationId}/documents/${documentKey}/download`,
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!res.ok) {
        throw new Error(`Échec du téléchargement du document (HTTP ${res.status})`)
      }

      // Extract filename from Content-Disposition header if available
      const disposition = res.headers.get("content-disposition")
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) filename = match[1]
      }

      blob = await res.blob()
    }

    // Trigger synthetic browser download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  /**
   * Exportation des candidatures en CSV / Excel
   * Endpoint : GET /api/admin/applications/export
   */
  exportApplications: async (
    params: Omit<ListApplicationsParams, "page" | "per_page"> = {}
  ): Promise<void> => {
    let blob: Blob
    const exportFilename = `candidatures_casa_impact_${new Date().toISOString().split("T")[0]}.csv`

    if (DATA_SOURCE === "mock") {
      // Generate CSV content from mock data
      const headers = "ID;Reference;Candidat;Email;Telephone;Region;Appel;Statut;Date\n"
      const rows = mockApplications
        .map(
          (a) =>
            `${a.id};"${a.reference}";"${a.candidat_nom || ""}";"${a.candidat_email || ""}";"${a.candidat_telephone || ""}";"${a.region || ""}";"${a.appel?.titre || ""}";"${a.statut}";"${a.created_at || ""}"`
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
      if (params.appel_id && params.appel_id !== "all") queryParams.set("appel_id", String(params.appel_id))

      const res = await fetch(
        `${API_URL}/api/admin/applications/export?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      )

      if (!res.ok) {
        throw new Error(`Échec de l'exportation des candidatures (HTTP ${res.status})`)
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
