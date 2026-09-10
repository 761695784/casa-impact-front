import { apiFetch } from "@/lib/api-client"
import type { MembershipConfirmation } from "@/types/models"
import type { MembershipRegion, ContributionDomain, ContributionType } from "@/types/enums"

/**
 * Champs de StoreMembershipRequest (App\Http\Requests\Public). `photo` est
 * REQUISE côté backend (`'photo' => ['required', 'image', 'max:10240']`) —
 * la carte de membre officielle en a besoin. `departement` est requis
 * uniquement si la région est en Casamance (Ziguinchor/Sédhiou/Kolda), voir
 * MembershipRegion::estEnCasamance() — validé aussi côté client dans
 * membership-form.tsx, mais le serveur reste la source de vérité.
 * `numero_membre`/`statut` ne sont jamais envoyés : toujours fixés par le
 * serveur.
 */
export interface SubmitMembershipPayload {
  nom_complet: string
  email: string
  telephone: string
  profession?: string
  region: MembershipRegion
  departement?: string
  domaine_contribution: ContributionDomain
  type_contribution: ContributionType
  photo: File
  engagement_moral: boolean
  suggestions_competences?: string
}

export const publicMembershipService = {
  /**
   * POST /api/public/memberships — soumission publique du formulaire
   * d'adhésion. multipart/form-data obligatoire (upload de photo) —
   * apiFetch détecte automatiquement un FormData et ne force pas de
   * Content-Type JSON dessus (voir lib/api-client.ts).
   */
  submitMembership: async (
    payload: SubmitMembershipPayload
  ): Promise<MembershipConfirmation> => {
    const formData = new FormData()
    formData.set("nom_complet", payload.nom_complet)
    formData.set("email", payload.email)
    formData.set("telephone", payload.telephone)
    if (payload.profession) formData.set("profession", payload.profession)
    formData.set("region", payload.region)
    if (payload.departement) formData.set("departement", payload.departement)
    formData.set("domaine_contribution", payload.domaine_contribution)
    formData.set("type_contribution", payload.type_contribution)
    formData.set("photo", payload.photo)
    // Laravel attend "1"/"0" (ou "true") pour un booléen en multipart —
    // un vrai `boolean` JS n'existe pas dans FormData (tout est string).
    formData.set("engagement_moral", payload.engagement_moral ? "1" : "0")
    if (payload.suggestions_competences) {
      formData.set("suggestions_competences", payload.suggestions_competences)
    }

    // Réponse enveloppée dans MembershipConfirmationResource + message
    // additionnel côté backend (`{data: {...}, message: "..."}`) — même
    // détail d'unwrap que publicApplicationsService.submitApplication.
    const json = await apiFetch<{ data?: MembershipConfirmation } | MembershipConfirmation>(
      "/api/public/memberships",
      { method: "POST", body: formData }
    )

    return (json as { data?: MembershipConfirmation }).data ?? (json as MembershipConfirmation)
  },
}
