import type { CSSProperties } from "react"
import { Lock, User } from "lucide-react"
import { branding } from "@/lib/config"
import { formatDate } from "@/lib/format"
import {
  MEMBERSHIP_REGION_LABELS,
  CONTRIBUTION_TYPE_LABELS,
  type MembershipRegion,
  type ContributionType,
} from "@/types/enums"

/**
 * Données minimales nécessaires pour reproduire la carte de membre — un
 * sous-ensemble volontairement léger de `Membership` pour que ce composant
 * serve à la fois côté admin (fiche d'une adhésion réelle, `[id]/page.tsx`)
 * et côté public (aperçu juste après soumission, avant même que le
 * `numero_membre` réel du serveur ou la photo n'existent en base — voir
 * membership-form.tsx).
 */
export interface MembershipCardData {
  numero_membre: string
  nom_complet: string
  photo_url?: string | null
  region: MembershipRegion
  type_contribution?: ContributionType
  /** ISO — date à afficher sous "Depuis" (validated_at, ou created_at à défaut). */
  date?: string
}

/**
 * Reproduction fidèle (positions/couleurs) de la VRAIE carte PDF générée
 * par MembershipCardService + resources/views/pdf/membership-card.blade.php
 * côté backend (bandeau vert, logo, pastille ID, encadré photo doré,
 * nom/statut/région/date, filigrane) — avec les VRAIES données de
 * l'adhérent, jamais un visuel générique statique.
 *
 * IMPORTANT : toutes les tailles de texte (et l'aspect-ratio / le
 * container-type de la carte elle-même) sont posées en style INLINE, pas
 * en classes Tailwind arbitraires (`text-[min(...)]`, `aspect-[...]`).
 * Ce projet a eu plusieurs fois le même problème : des valeurs Tailwind
 * arbitraires utilisant des fonctions CSS (clamp(), min(), ou la
 * propriété container-type) ne se recompilaient pas de façon fiable chez
 * l'utilisateur (cache du serveur de dev / JIT), ce qui cassait le rendu
 * silencieusement. Le style inline est interprété nativement par le
 * navigateur, sans dépendre d'aucune compilation — donc garanti fiable.
 *
 * Le principe reste le même : tout est exprimé en unités proportionnelles
 * à la largeur de la carte (`cqw` = % de la largeur du composant, via
 * `containerType:"inline-size"` ci-dessous), plafonnées avec `min(...cqw,
 * ...px)` pour ne pas devenir énormes sur un grand écran — mais SANS
 * plancher fixe, pour ne jamais pouvoir déborder ni chevaucher le pied de
 * page sur un écran étroit (mobile/tablette). Comme la carte garde
 * toujours ses proportions 680×383 (aspectRatio, la même valeur que
 * MembershipCardService::generate() côté backend), le texte grossit/
 * rétrécit exactement à l'identique quelle que soit la taille d'affichage.
 *
 * Nom, statut et région sont aussi tronqués sur une seule ligne
 * (whiteSpace:"nowrap" + textOverflow:"ellipsis") : un nom très long qui
 * passerait sur 2 lignes pousserait tout le reste du bloc vers le bas et
 * chevaucherait le pied de page — c'est exactement le bug corrigé le même
 * jour côté PDF (field-nom débordait sur 2 lignes pour un nom long).
 *
 * `blurred` (défaut : false) : à activer uniquement pour l'aperçu affiché
 * au public juste après la soumission du formulaire (membership-form.tsx),
 * AVANT tout paiement — la carte n'est donc pas encore officielle/valide,
 * et on ne veut pas qu'une capture d'écran ou une photo de cet aperçu
 * puisse être lue/utilisée comme si c'était la vraie carte. Le contenu
 * reste flouté (filter: blur) avec un badge explicatif par-dessus ; ce
 * n'est PAS un contrôle d'accès réel (les données sont quand même dans le
 * DOM), juste une dissuasion visuelle. La fiche admin, elle, ne passe
 * jamais `blurred` : c'est un usage interne, l'équipe doit voir la carte
 * nette pour vérifier les infos avant/après validation.
 */
export function MembershipCardPreview({
  data,
  blurred = false,
}: {
  data: MembershipCardData
  blurred?: boolean
}) {
  const contributionLabel = data.type_contribution
    ? CONTRIBUTION_TYPE_LABELS[data.type_contribution]
    : "Membre"
  const regionLabel = MEMBERSHIP_REGION_LABELS[data.region] || data.region
  const dateLabel = formatDate(data.date, { day: "2-digit", month: "2-digit", year: "numeric" })

  const truncateStyle: CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-[#f7f6f2] shadow-md"
      style={{ aspectRatio: "680 / 383", containerType: "inline-size" }}
    >
      <div
        aria-hidden={blurred}
        className={blurred ? "pointer-events-none absolute inset-0 select-none" : "absolute inset-0"}
        style={blurred ? { filter: "blur(10px)", WebkitFilter: "blur(10px)" } : undefined}
      >
        {/* Filigrane baobab, pâle, à droite */}
        <img
          src={branding.watermark}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[8%] right-[6%] w-[45%] opacity-30 select-none"
        />

        {/* Bandeau vert à gauche */}
        <div className="absolute inset-y-0 left-0 flex w-[13%] items-center justify-center bg-[#02542D]">
          <span
            className="-rotate-90 whitespace-nowrap font-bold tracking-wide text-white"
            style={{ fontSize: "min(5cqw, 22px)" }}
          >
            Carte de membre
          </span>
        </div>

        {/* Logo */}
        <img
          src={branding.logo}
          alt="Casa Impact"
          className="absolute top-[7%] left-[17%] h-[15%] w-auto object-contain"
        />

        {/* Pastille ID */}
        <span
          className="absolute top-[8%] right-[5%] rounded-full bg-[#02542D] font-bold text-white"
          style={{
            fontSize: "min(2.94cqw, 16px)",
            padding: "min(1.47cqw, 8px) min(3.82cqw, 18px)",
          }}
        >
          {data.numero_membre}
        </span>

        {/* Encadré photo doré */}
        <div className="absolute top-[39%] left-[17%] h-[47%] w-[22%] overflow-hidden border-2 border-[#F2A20D] bg-white">
          {data.photo_url ? (
            <img src={data.photo_url} alt={data.nom_complet} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="size-1/3 opacity-40" />
            </div>
          )}
        </div>

        {/* Champs texte */}
        <div className="absolute top-[42%] right-[5%] left-[44%]">
          <p
            className="font-bold leading-tight text-[#02542D]"
            style={{ ...truncateStyle, fontSize: "min(4.41cqw, 26px)", marginBottom: "min(3.82cqw, 20px)" }}
          >
            {data.nom_complet}
          </p>
          <p
            className="font-bold text-[#F2A20D]"
            style={{ ...truncateStyle, fontSize: "min(2.79cqw, 15px)", marginBottom: "min(0.5cqw, 3px)" }}
          >
            {contributionLabel}
          </p>
          <p
            className="font-bold text-[#F2A20D]"
            style={{ ...truncateStyle, fontSize: "min(4.71cqw, 26px)", marginBottom: "min(2.65cqw, 14px)" }}
          >
            {regionLabel}
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "min(1.76cqw, 11px)" }}>
            Depuis
          </p>
          <p className="font-bold text-foreground" style={{ fontSize: "min(2.35cqw, 14px)" }}>
            {dateLabel || "—"}
          </p>
        </div>

        <p
          className="absolute right-[6%] bottom-[5%] left-[44%] text-right font-bold text-[#02542D] italic"
          style={{ ...truncateStyle, fontSize: "min(2.06cqw, 12px)" }}
        >
          Casa Impact, trois régions - une vision - un impact.
        </p>
      </div>

      {blurred && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/15 px-4 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-[#02542D] shadow-md">
            <Lock className="size-4" />
          </span>
          <p className="max-w-[85%] text-[11px] font-bold text-white drop-shadow sm:text-sm">
            Carte visible en clair dès validation de votre paiement
          </p>
        </div>
      )}
    </div>
  )
}
