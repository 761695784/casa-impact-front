import { apiFetch } from "@/lib/api-client"
import { API_URL, DATA_SOURCE } from "@/lib/config"
import { mockMemberships } from "@/lib/mock/memberships.mock"
import type { Membership } from "@/types/models"
import type {
  MembershipStatus,
  MembershipRegion,
  ContributionDomain,
  ContributionType,
} from "@/types/enums"

export interface ListMembershipsParams {
  search?: string
  statut?: MembershipStatus | "all" | string
  region?: MembershipRegion | "all" | string
  source?: string
  /** Page demandée (1-indexée). Défaut 1. */
  page?: number
  /** Résultats par page. Défaut 20 (accord du 2026-09-11 : pagination de la liste après 20 lignes). */
  per_page?: number
}

/**
 * Métadonnées de pagination Laravel standard (`meta` d'une
 * ResourceCollection paginée) — `total` est TOUJOURS le compte réel côté
 * serveur, indépendant de `per_page` : c'est cette valeur qu'il faut
 * utiliser pour n'importe quel total affiché à l'écran (voir le bug du
 * 2026-09-11 : les compteurs de la page Adhésions étaient calculés en
 * comptant le tableau `data` reçu, plafonné à `per_page` — faux dès que la
 * base contient plus de lignes que ce plafond, ex. 100 vs 171 membres
 * réels après l'import historique).
 */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedMemberships {
  data: Membership[]
  meta: PaginationMeta
}

const DEFAULT_PER_PAGE = 20

/**
 * Champs de StoreMembershipManualRequest (App\Http\Requests\Admin) — saisie
 * manuelle par l'admin, réservée aux membres antérieurs au site (accord du
 * 2026-08-24). `numero_membre` est OPTIONNEL : à renseigner uniquement pour
 * un membre qui possède déjà une carte imprimée avec un ID (ex. import
 * historique au coup par coup) — laissé vide, le serveur en génère un
 * nouveau via MembershipReferenceGenerator (accord explicite du
 * 2026-09-11 : "Garder l'ID existant tel quel" quand il y en a un).
 * `send_welcome_email` par défaut à false ici côté front (contrairement au
 * défaut serveur) : un ajout manuel concerne presque toujours un membre
 * historique, à qui l'email "adhésion reçue aujourd'hui" n'a pas de sens.
 */
export interface CreateMembershipPayload {
  numero_membre?: string
  nom_complet: string
  email: string
  telephone: string
  profession?: string
  region: MembershipRegion
  departement?: string
  domaine_contribution?: ContributionDomain
  type_contribution?: ContributionType
  photo: File
  suggestions_competences?: string
  admin_note?: string
  send_welcome_email: boolean
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Résumé chiffré renvoyé par l'aperçu d'import (jamais de donnée
 * personnelle — voir MembershipImportController::preview()). `import_token`
 * identifie le fichier stocké temporairement côté serveur, à repasser tel
 * quel à commitLegacyImport()/cancelLegacyImport().
 */
export interface LegacyImportPreview {
  import_token: string
  counts: {
    to_create: number
    validees: number
    en_attente: number
    skipped_existing: number
    warnings: number
  }
  warnings: string[]
}

export interface LegacyImportResult {
  created: number
  failed: string[]
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
  ): Promise<PaginatedMemberships> => {
    const {
      search = "",
      statut = "all",
      region = "all",
      source,
      page = 1,
      per_page: perPage = DEFAULT_PER_PAGE,
    } = params

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

      const total = filtered.length
      const lastPage = Math.max(1, Math.ceil(total / perPage))
      const currentPage = Math.min(Math.max(1, page), lastPage)
      const start = (currentPage - 1) * perPage
      const pageData = filtered.slice(start, start + perPage)

      return delay<PaginatedMemberships>({
        data: pageData,
        meta: { current_page: currentPage, last_page: lastPage, per_page: perPage, total },
      })
    }

    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (statut && statut !== "all") queryParams.set("statut", statut)
    if (region && region !== "all") queryParams.set("region", region)
    if (source) queryParams.set("source", source)
    queryParams.set("page", String(page))
    queryParams.set("per_page", String(perPage))

    const json = await apiFetch<{ data: Membership[]; meta?: PaginationMeta }>(
      `/api/admin/memberships?${queryParams.toString()}`
    )
    const data = json.data || (json as unknown as Membership[])

    // Filet de sécurité si jamais `meta` manque (réponse non paginée) —
    // évite un crash plutôt qu'un total silencieusement faux.
    const meta: PaginationMeta = json.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: data.length,
      total: data.length,
    }

    return { data, meta }
  },

  /**
   * Saisie manuelle par l'admin (POST /api/admin/memberships) — membre
   * antérieur au site, avec conservation de son ID existant si fourni. Pas
   * de route dédiée à l'import de masse (voir la commande Artisan ponctuelle
   * `membership:import-legacy` côté backend, à part) : ce endpoint sert à
   * ajouter un membre historique à la fois depuis le panneau admin.
   * multipart/form-data obligatoire (photo) — apiFetch détecte
   * automatiquement un FormData.
   */
  createMembership: async (payload: CreateMembershipPayload): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const newId = Math.max(0, ...mockMemberships.map((m) => m.id)) + 1
      const newMembership: Membership = {
        id: newId,
        numero_membre: payload.numero_membre || `CI-${new Date().getFullYear()}-MOCK${newId}`,
        statut: "validee",
        nom_complet: payload.nom_complet,
        email: payload.email,
        telephone: payload.telephone,
        profession: payload.profession,
        region: payload.region,
        departement: payload.departement,
        domaine_contribution: payload.domaine_contribution,
        type_contribution: payload.type_contribution,
        photo_url: URL.createObjectURL(payload.photo),
        engagement_moral: true,
        suggestions_competences: payload.suggestions_competences,
        source: "manuel",
        admin_note: payload.admin_note,
        validated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockMemberships.unshift(newMembership)
      return delay<Membership>(newMembership)
    }

    const formData = new FormData()
    if (payload.numero_membre) formData.set("numero_membre", payload.numero_membre)
    formData.set("nom_complet", payload.nom_complet)
    formData.set("email", payload.email)
    formData.set("telephone", payload.telephone)
    if (payload.profession) formData.set("profession", payload.profession)
    formData.set("region", payload.region)
    if (payload.departement) formData.set("departement", payload.departement)
    if (payload.domaine_contribution) formData.set("domaine_contribution", payload.domaine_contribution)
    if (payload.type_contribution) formData.set("type_contribution", payload.type_contribution)
    formData.set("photo", payload.photo)
    if (payload.suggestions_competences) {
      formData.set("suggestions_competences", payload.suggestions_competences)
    }
    if (payload.admin_note) formData.set("admin_note", payload.admin_note)
    formData.set("send_welcome_email", payload.send_welcome_email ? "1" : "0")

    const json = await apiFetch<{ data: Membership }>("/api/admin/memberships", {
      method: "POST",
      body: formData,
    })
    return json.data
  },

  /**
   * Bouton "Importer l'historique (Excel)" du panneau admin — accord
   * explicite du 2026-09-11. Flux en 2 temps : preview() envoie le fichier
   * et récupère un résumé + un `import_token` (le fichier est stocké côté
   * serveur, jamais analysé/écrit tant que commit() n'est pas appelé).
   * N'existe pas en mode mock (nécessite le traitement réel du fichier
   * Excel côté backend) — même principe que downloadCard().
   */
  previewLegacyImport: async (file: File): Promise<LegacyImportPreview> => {
    const formData = new FormData()
    formData.set("file", file)

    return apiFetch<LegacyImportPreview>("/api/admin/memberships/import-legacy/preview", {
      method: "POST",
      body: formData,
    })
  },

  /**
   * Confirme l'import après aperçu — relit le fichier stocké côté serveur
   * (identifié par `import_token`) et écrit réellement en base. Aucun
   * email n'est envoyé pour les membres importés.
   */
  commitLegacyImport: async (importToken: string): Promise<LegacyImportResult> => {
    return apiFetch<LegacyImportResult>("/api/admin/memberships/import-legacy/commit", {
      method: "POST",
      body: { import_token: importToken },
    })
  },

  /**
   * Annule un aperçu sans le confirmer — supprime immédiatement le fichier
   * temporaire côté serveur (le fichier contient des données personnelles,
   * autant ne pas attendre le nettoyage automatique de 30 min).
   */
  cancelLegacyImport: async (importToken: string): Promise<void> => {
    await apiFetch(`/api/admin/memberships/import-legacy/${importToken}`, {
      method: "DELETE",
    })
  },

  /**
   * Ajoute ou remplace la photo d'un membre existant (POST
   * /api/admin/memberships/{id}/photo) — pensé pour compléter les membres
   * importés depuis l'historique Excel, créés sans photo (accord du
   * 2026-09-11). multipart/form-data obligatoire.
   */
  updateMembershipPhoto: async (id: number, photo: File): Promise<Membership> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMemberships.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Adhésion introuvable")

      const updated: Membership = {
        ...mockMemberships[index],
        photo_url: URL.createObjectURL(photo),
        updated_at: new Date().toISOString(),
      }
      mockMemberships[index] = updated
      return delay<Membership>(updated)
    }

    const formData = new FormData()
    formData.set("photo", photo)

    const json = await apiFetch<{ data: Membership }>(`/api/admin/memberships/${id}/photo`, {
      method: "POST",
      body: formData,
    })
    return json.data
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
