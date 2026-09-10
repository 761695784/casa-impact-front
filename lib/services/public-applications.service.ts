import { apiFetch } from "@/lib/api-client"
import type { ApplicationConfirmation } from "@/types/models"
import type { Region } from "@/types/enums"

/**
 * Payload de soumission publique d'une candidature.
 * Endpoint : POST /api/public/applications (aucune authentification,
 * voir App\Http\Controllers\Api\Public\ApplicationController::store()).
 *
 * Champs alignés sur App\Http\Requests\Public\StoreApplicationRequest :
 * `application_call_id`/`nom`/`prenom`/`email`/`region`/`tranche_age`/
 * `niveau_etudes` sont obligatoires côté backend, le reste est nullable.
 * `documents` est envoyé en multipart, une clé par type de document
 * (`documents[cv]`, `documents[piece_identite]`...) — voir
 * ApplicationCall.documents_requis pour la liste attendue par cet appel.
 */
export interface SubmitApplicationPayload {
  application_call_id: number
  nom: string
  prenom: string
  email: string
  telephone?: string
  region: Region
  lieu?: string
  tranche_age: string
  niveau_etudes: string
  situation_professionnelle?: string
  competences?: string
  experience?: string
  motivation?: string
  projet?: string
  documents?: Record<string, File>
}

export const publicApplicationsService = {
  submitApplication: async (payload: SubmitApplicationPayload): Promise<ApplicationConfirmation> => {
    const formData = new FormData()
    formData.append("application_call_id", String(payload.application_call_id))
    formData.append("nom", payload.nom)
    formData.append("prenom", payload.prenom)
    formData.append("email", payload.email)
    if (payload.telephone) formData.append("telephone", payload.telephone)
    formData.append("region", payload.region)
    if (payload.lieu) formData.append("lieu", payload.lieu)
    formData.append("tranche_age", payload.tranche_age)
    formData.append("niveau_etudes", payload.niveau_etudes)
    if (payload.situation_professionnelle) {
      formData.append("situation_professionnelle", payload.situation_professionnelle)
    }
    if (payload.competences) formData.append("competences", payload.competences)
    if (payload.experience) formData.append("experience", payload.experience)
    if (payload.motivation) formData.append("motivation", payload.motivation)
    if (payload.projet) formData.append("projet", payload.projet)

    if (payload.documents) {
      Object.entries(payload.documents).forEach(([cle, file]) => {
        formData.append(`documents[${cle}]`, file)
      })
    }

    // `apiFetch` détecte le FormData et n'ajoute ni `Content-Type` ni
    // `JSON.stringify` — il attache quand même `X-XSRF-TOKEN` comme pour
    // toute requête mutante (même si cet endpoint est public, la requête
    // part du même domaine SPA stateful, voir lib/api-client.ts).
    const json = await apiFetch<{ data?: ApplicationConfirmation } | ApplicationConfirmation>(
      "/api/public/applications",
      { method: "POST", body: formData }
    )

    return (json as { data?: ApplicationConfirmation }).data ?? (json as ApplicationConfirmation)
  },
}
