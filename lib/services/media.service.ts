import { DATA_SOURCE } from "@/lib/config"
import { apiFetch } from "@/lib/api-client"
import { mockMediaItems } from "@/lib/mock/media.mock"
import type { CollectionResponse, Media, SingleResponse } from "@/types/models"

export interface ListMediaParams {
  search?: string
  type?: string
  categorie?: string
  statut?: string
}

/**
 * Type public autorisé pour mediable_type (voir
 * App\Http\Controllers\Api\Admin\MediaController::MEDIABLE_MAP côté
 * backend — liste blanche explicite, à garder synchronisée).
 */
export type MediableType =
  | "program"
  | "application-call"
  | "news"
  | "talent"
  | "partner"
  | "testimonial"

export interface CreateMediaParams {
  /** Fichier réel (image ou PDF) — jamais de base64, uploadé en multipart. */
  file: File
  nom?: string
  alt?: string
  legende?: string
  categorie?: "banniere" | "portrait" | "logo" | "document" | "general"
  /** Rattachement immédiat optionnel — sinon le fichier alimente uniquement la médiathèque. */
  mediableType?: MediableType
  mediableId?: number
  collection?: string
  ordre?: number
}

export interface AttachMediaParams {
  mediaId: number
  mediableType: MediableType
  mediableId: number
  collection?: string
  ordre?: number
}

export interface DetachMediaParams {
  mediaId: number
  mediableType: MediableType
  mediableId: number
  /** Omise : détache toutes les collections de cette fiche pour ce média. */
  collection?: string
}

function delay<T>(data: T, ms = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export const mediaService = {
  /**
   * Liste des médias de la médiathèque (bibliothèque partagée, indépendante
   * de tout usage par fiche).
   * Endpoint : GET /api/admin/media
   */
  listMedia: async (params: ListMediaParams = {}): Promise<Media[]> => {
    const { search = "", type = "all", categorie = "all", statut = "all" } =
      params

    if (DATA_SOURCE === "mock") {
      let filtered = [...mockMediaItems]

      if (search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (m) =>
            m.nom?.toLowerCase().includes(q) ||
            m.nom_original?.toLowerCase().includes(q) ||
            m.legende?.toLowerCase().includes(q) ||
            m.alt?.toLowerCase().includes(q)
        )
      }

      if (type && type !== "all") {
        filtered = filtered.filter((m) => m.type === type)
      }

      if (categorie && categorie !== "all") {
        filtered = filtered.filter((m) => m.categorie === categorie)
      }

      if (statut && statut !== "all") {
        filtered = filtered.filter((m) => m.statut === statut)
      }

      filtered.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      )

      return delay<Media[]>(filtered)
    }

    const queryParams = new URLSearchParams()
    if (search) queryParams.set("search", search)
    if (type && type !== "all") queryParams.set("type", type)
    if (categorie && categorie !== "all")
      queryParams.set("categorie", categorie)
    if (statut && statut !== "all") queryParams.set("statut", statut)

    const res = await apiFetch<CollectionResponse<Media>>(
      `/api/admin/media${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    )
    return res.data
  },

  /**
   * Détail d'un média
   * Endpoint : GET /api/admin/media/{id}
   */
  getMedia: async (id: number | string): Promise<Media> => {
    if (DATA_SOURCE === "mock") {
      const found = mockMediaItems.find((m) => m.id === Number(id))
      if (!found) {
        throw new Error("Média introuvable")
      }
      return delay<Media>(found)
    }

    const res = await apiFetch<SingleResponse<Media>>(`/api/admin/media/${id}`)
    return res.data
  },

  /**
   * Mise à jour des métadonnées d'un média (nom/alt/legende/categorie/
   * statut uniquement — jamais l'attachement, voir attachMedia/detachMedia).
   * Endpoint : PUT /api/admin/media/{id}
   */
  updateMedia: async (
    id: number,
    payload: Partial<
      Pick<Media, "nom" | "alt" | "legende" | "categorie" | "statut">
    >
  ): Promise<Media> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMediaItems.findIndex((m) => m.id === Number(id))
      if (index === -1) throw new Error("Média introuvable")

      const updated: Media = {
        ...mockMediaItems[index],
        ...payload,
        updated_at: new Date().toISOString(),
      }

      mockMediaItems[index] = updated
      return delay<Media>(updated)
    }

    const res = await apiFetch<SingleResponse<Media>>(`/api/admin/media/${id}`, {
      method: "PUT",
      body: payload,
    })
    return res.data
  },

  /**
   * Upload réel (multipart) d'un fichier dans la médiathèque, avec
   * rattachement immédiat optionnel à une fiche.
   * Endpoint : POST /api/admin/media
   */
  createMedia: async (params: CreateMediaParams): Promise<Media> => {
    const {
      file,
      nom,
      alt,
      legende,
      categorie,
      mediableType,
      mediableId,
      collection,
      ordre,
    } = params

    if (DATA_SOURCE === "mock") {
      const isImage = file.type.startsWith("image/")
      const newId = Math.max(0, ...mockMediaItems.map((m) => m.id)) + 1
      const newMedia: Media = {
        id: newId,
        nom: nom || file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file),
        nom_original: file.name,
        mime: file.type,
        type: isImage ? "image" : "document",
        taille: file.size,
        alt,
        legende,
        categorie: categorie || "general",
        statut: "actif",
        collection: mediableType ? collection || "gallery" : undefined,
        ordre: mediableType ? ordre || 0 : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockMediaItems.unshift(newMedia)
      return delay<Media>(newMedia)
    }

    const formData = new FormData()
    formData.append("fichier", file)
    if (nom) formData.append("nom", nom)
    if (alt) formData.append("alt", alt)
    if (legende) formData.append("legende", legende)
    if (categorie) formData.append("categorie", categorie)
    if (mediableType) formData.append("mediable_type", mediableType)
    if (mediableId !== undefined) formData.append("mediable_id", String(mediableId))
    if (collection) formData.append("collection", collection)
    if (ordre !== undefined) formData.append("ordre", String(ordre))

    const res = await apiFetch<SingleResponse<Media>>(`/api/admin/media`, {
      method: "POST",
      body: formData,
    })
    return res.data
  },

  /**
   * Suppression d'un média — retire le fichier de TOUTE la bibliothèque,
   * donc de chaque fiche qui l'utilisait. Pour retirer une photo d'une
   * seule fiche sans la supprimer partout, voir detachMedia.
   * Endpoint : DELETE /api/admin/media/{id}
   */
  deleteMedia: async (id: number): Promise<boolean> => {
    if (DATA_SOURCE === "mock") {
      const index = mockMediaItems.findIndex((m) => m.id === Number(id))
      if (index !== -1) {
        mockMediaItems.splice(index, 1)
      }
      return delay<boolean>(true)
    }

    await apiFetch<void>(`/api/admin/media/${id}`, { method: "DELETE" })
    return true
  },

  /**
   * Rattache une photo déjà présente dans la bibliothèque à une fiche
   * (ex. couverture ou album d'une actualité). Idempotent côté backend
   * (updateOrCreate sur média+fiche+collection).
   * Endpoint : POST /api/admin/media/{id}/attach
   */
  attachMedia: async (params: AttachMediaParams): Promise<void> => {
    const { mediaId, mediableType, mediableId, collection, ordre } = params

    if (DATA_SOURCE === "mock") {
      return delay(undefined)
    }

    await apiFetch<void>(`/api/admin/media/${mediaId}/attach`, {
      method: "POST",
      body: {
        mediable_type: mediableType,
        mediable_id: mediableId,
        collection,
        ordre,
      },
    })
  },

  /**
   * Retire une photo d'une fiche (la photo reste dans la bibliothèque).
   * Endpoint : DELETE /api/admin/media/{id}/detach
   */
  detachMedia: async (params: DetachMediaParams): Promise<void> => {
    const { mediaId, mediableType, mediableId, collection } = params

    if (DATA_SOURCE === "mock") {
      return delay(undefined)
    }

    await apiFetch<void>(`/api/admin/media/${mediaId}/detach`, {
      method: "DELETE",
      body: {
        mediable_type: mediableType,
        mediable_id: mediableId,
        collection,
      },
    })
  },
}
