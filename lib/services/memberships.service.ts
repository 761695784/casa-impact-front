import { apiFetch } from "@/lib/api-client"
import { API_URL, DATA_SOURCE } from "@/lib/config"
import { mockMemberships } from "@/lib/mock/memberships.mock"
import type { Membership } from "@/types/models"
import type { MembershipStatus, MembershipRegion } from "@/types/enums"

export interface ListMembershipsParams {
  search?: string
  statut?: MembershipStatus | "all" | string
  region?: MembershipRegion | "all" | string
  source?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Service Adhésions (admin) — aligné sur les routes réelles :
 *   GET    /api/admin/memberships             (index, paginé)
 *   GET    /api/admin/memberships/{id}         (show)
 *   PUT    /api/admin/memberships/{id}         (update : SEULS statut/admin_note)
 *   DELETE /api/admin/memberships/{id}         (destroy)
 *   GET    /api/admin/memberships/{id}/card    (téléchargement carte PDF)
 *
 * Il n'existe PAS de routes /validate ou /reject côté backend — valider ou
 * refuser une adhésion passe par update() avec `statut`, voir
 * Admin\MembershipController::update() (passage à `validee` déclenche
 * automatiquement la génération de la carte + l'email MembershipValidated
 * côté serveur).
 */
export const membershipsService = {
  listMemberships: async (
    params: ListMembershipsParams = {}
  ): Promise<Membership[]> => {
    const { search = "", statut = "all", region = "all", source } = params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockMemberships]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nom_complet.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.telephone.toLowerCase().includes(q) ||
            m.numero_membre?.toLowerCase().includes(q) ||
            m.profession?.toLowerCase().includes(q) ||
            m.departement?.toLowerCase().includes(q)
        )
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((m) => m.statut === statut)
      }

      if (region && region !== "all") {
        filtered = filtered.filter((m) => m.region === region)
      }

      filtered.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      )
      return delay<Membership[]>(filtered)
    }

    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (region && region !== "all") queryParams.set("region", region)
    if (source) queryParams.set("source", source)
    queryParams.set("per_page", "100")

    const json = await apiFetch<{ data: Membership[] }>(
      `/api/admin/memberships?${queryParams.toString()}`
    )
    return json.data || (json as unknown as Membership[])
  },

  getMembership: async (id: number | string): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const found = mockMemberships.find(
        (m) => m.id === Number(id) || m.numero_membre === String(id)
      )
      if (!found) {
        throw new Error("Adhésion introuvable")
      }
      return delay<Membership>(found)
    }

    const json = await apiFetch<{ data: Membership }>(`/api/admin/memberships/${id}`)
    return json.data
  },

  /**
   * Seuls `statut` et `admin_note` sont acceptés par le backend
   * (UpdateMembershipRequest) — voir Admin\MembershipController::update().
   */
  updateMembership: async (
    id: number,
    payload: { statut?: MembershipStatus | string; admin_note?: string }
  ): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Adhésion introuvable")

      const existing = mockMemberships[index]
      const updated: Membership = {
        ...existing,
        ...payload,
        statut: (payload.statut as MembershipStatus) ?? existing.statut,
        updated_at: new Date().toISOString(),
      }

      mockMemberships[index] = updated
      return delay<Membership>(updated)
    }

    const json = await apiFetch<{ data: Membership }>(`/api/admin/memberships/${id}`, {
      method: "PUT",
      body: payload,
    })
    return json.data
  },

  /**
   * Valider une adhésion = update() avec statut=validee. Déclenche côté
   * serveur la génération de la carte + l'email MembershipValidated.
   */
  validateMembership: (id: number): Promise<Membership> =>
    membershipsService.updateMembership(id, { statut: "validee" }),

  /**
   * Refuser une adhésion = update() avec statut=refusee.
   */
  rejectMembership: (id: number): Promise<Membership> =>
    membershipsService.updateMembership(id, { statut: "refusee" }),

  deleteMembership: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index !== -1) {
        mockMemberships.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch(`/api/admin/memberships/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Téléchargement de la carte de membre PDF (adhésion déjà validée
   * uniquement — le backend renvoie 409 sinon). apiFetch ne convient pas
   * ici : il ne parse que du JSON, cette réponse est un PDF binaire. Même
   * principe que applicationsService.previewDocument (CSRF pas nécessaire,
   * GET est une méthode sûre).
   */
  downloadCard: async (id: number, numeroMembre?: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/admin/memberships/${id}/card`, {
      method: "GET",
      headers: { Accept: "application/pdf" },
      credentials: "include",
    })

    if (!res.ok) {
      const contentType = res.headers.get("content-type") || ""
      const payload = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : null
      throw new Error(
        payload?.message ||
          (res.status === 409
            ? "Cette adhésion n'est pas encore validée."
            : `Impossible de télécharger la carte (HTTP ${res.status})`)
      )
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `carte-membre-${numeroMembre || id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  },
}
