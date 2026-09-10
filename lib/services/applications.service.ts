import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockApplications } from "@/lib/mock/applications.mock"
import type { Application, ApplicationCall, ApplicationDocumentFile, PaginatedResponse } from "@/types/models"
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

/**
 * App\Http\Resources\Admin\ApplicationResource (backend) renvoie
 * `nom`/`prenom`/`email`/`telephone`/`lieu`/`situation_professionnelle`/
 * `application_call_id`/`application_call`/`projet`, alors que les
 * composants admin (candidatures-table, page de détail) sont écrits pour
 * `candidat_nom`/`candidat_email`/`candidat_telephone`/`ville`/`profession`/
 * `appel_id`/`appel`/`projet_description`. Ce pont fait la traduction sans
 * toucher au backend — même approche que `withLegacyNames` dans
 * application-calls.service.ts et content.service.ts.
 *
 * Deux limites connues côté backend, non résolues par ce mapping (le
 * champ n'existe simplement pas dans la réponse API) :
 * - `notes_internes` : aucune colonne/validation côté serveur
 *   (App\Http\Requests\Admin\UpdateApplicationRequest n'accepte que
 *   `statut`) — la note saisie dans la modale n'est donc jamais persistée.
 * - `promu` / `promoted_at` : App\Http\Resources\Admin\ApplicationResource
 *   ne les expose pas ; `promote()` se contente de faire repasser le
 *   statut de `en_liste_attente` à `nouvelle`, sans état "promu" dédié.
 */
function withLegacyCallNames(
  c:
    | (Partial<ApplicationCall> & {
        lieu?: string
        date_debut?: string
        program?: ApplicationCall["programme"]
        program_id?: number
      })
    | null
    | undefined
): ApplicationCall | undefined {
  if (!c || c.id === undefined) return undefined
  return {
    ...c,
    localisation: c.lieu ?? c.localisation,
    date_ouverture: c.date_debut ?? c.date_ouverture,
    programme: c.program ?? c.programme,
    programme_id: c.program_id ?? c.programme_id,
  } as ApplicationCall
}

interface RawApplicationDocument {
  id?: number
  cle?: string
  type?: string
  libelle?: string
  nom_original?: string
  nom_fichier?: string
  taille?: number
  mime?: string
  mime_type?: string
  created_at?: string
  date_upload?: string
  url?: string
}

function withLegacyDocuments(
  docs: RawApplicationDocument[] | undefined
): ApplicationDocumentFile[] | undefined {
  if (!docs) return undefined
  return docs.map((d) => ({
    // La route de téléchargement (GET .../documents/{document}/download)
    // attend l'ID réel du document — App\Http\Resources\Admin\
    // ApplicationDocumentResource n'expose pas de "clé" nommée comme
    // ApplicationCall.documents_requis, seulement `id`/`type`.
    cle: d.cle ?? String(d.id ?? ""),
    libelle: d.libelle ?? d.type ?? "Document",
    nom_fichier: d.nom_fichier ?? d.nom_original ?? "document",
    url: d.url,
    taille: d.taille,
    mime_type: d.mime_type ?? d.mime,
    date_upload: d.date_upload ?? d.created_at,
  }))
}

interface RawApplication extends Application {
  nom?: string
  prenom?: string
  email?: string
  telephone?: string
  lieu?: string
  situation_professionnelle?: string
  application_call_id?: number
  application_call?: Parameters<typeof withLegacyCallNames>[0]
  projet?: string
  documents?: RawApplicationDocument[]
}

function withLegacyNames(a: RawApplication): Application {
  const nomComplet = [a.prenom, a.nom].filter(Boolean).join(" ").trim()
  return {
    ...a,
    candidat_nom: nomComplet || a.candidat_nom,
    candidat_email: a.email ?? a.candidat_email,
    candidat_telephone: a.telephone ?? a.candidat_telephone,
    ville: a.lieu ?? a.ville,
    profession: a.situation_professionnelle ?? a.profession,
    projet_description: a.projet ?? a.projet_description,
    appel_id: a.application_call_id ?? a.appel_id,
    appel: withLegacyCallNames(a.application_call) ?? a.appel,
    documents: withLegacyDocuments(a.documents) ?? (a.documents as unknown as ApplicationDocumentFile[] | undefined),
  }
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

    const json = await apiFetch<PaginatedResponse<RawApplication>>(
      `/api/admin/applications?${queryParams.toString()}`,
      { method: "GET" }
    )

    return { ...json, data: json.data.map(withLegacyNames) }
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

    const json = await apiFetch<{ data?: RawApplication } | RawApplication>(
      `/api/admin/applications/${id}`,
      { method: "GET" }
    )

    const raw = (json as { data?: RawApplication }).data ?? (json as RawApplication)
    return withLegacyNames(raw)
  },

  /**
   * Mise à jour du statut et des notes internes
   * Endpoint : PUT /api/admin/applications/{id}
   *
   * Note : `notes_internes` est envoyé mais ignoré côté backend — voir le
   * commentaire au-dessus de `withLegacyNames`.
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

    const json = await apiFetch<{ data?: RawApplication } | RawApplication>(
      `/api/admin/applications/${id}`,
      { method: "PUT", body: payload }
    )

    const raw = (json as { data?: RawApplication }).data ?? (json as RawApplication)
    return withLegacyNames(raw)
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

    const json = await apiFetch<{ data?: RawApplication } | RawApplication>(
      `/api/admin/applications/${id}/promote`,
      { method: "POST" }
    )

    const raw = (json as { data?: RawApplication }).data ?? (json as RawApplication)
    return withLegacyNames(raw)
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

    await apiFetch<void>(`/api/admin/applications/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Téléchargement sécurisé d'un document joint
   * Endpoint : GET /api/admin/applications/{id}/documents/{doc}/download
   * (Réponse binaire — passe par `fetch` directement, `apiFetch` est taillé
   * pour du JSON. GET n'a pas besoin du header CSRF.) `documentKey` doit
   * être l'ID du document (voir `withLegacyDocuments` ci-dessus, qui
   * remappe `cle` sur `id` faute de clé nommée côté backend).
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
      const { API_URL } = await import("@/lib/config")
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
   * (Réponse binaire — passe par `fetch` directement, `apiFetch` est taillé
   * pour du JSON. GET n'a pas besoin du header CSRF.)
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

      blob = new Blob([String.fromCharCode(0xfeff) + headers + rows], {
        type: "text/csv;charset=utf-8;",
      })
    } else {
      const { API_URL } = await import("@/lib/config")
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
