import { User } from "lucide-react"
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
 * Toute la carte (positions ET tailles de texte) est exprimée en unités
 * proportionnelles à sa propre largeur — jamais en px fixes ni en
 * breakpoints d'écran (sm:/md:). Comme la forme de la carte est verrouillée
 * en 680×383 (voir `aspectRatio` ci-dessous, la même valeur que
 * `MembershipCardService::generate()` côté backend), sa hauteur est
 * TOUJOURS une fraction fixe de sa largeur — donc dimensionner le texte en
 * `cqw` (container query width, % de la largeur du composant lui-même) le
 * fait grossir/rétrécir exactement à l'identique quelle que soit la taille
 * d'affichage (mobile, tablette, desktop, fiche admin large...), sans
 * jamais pouvoir déborder ni chevaucher le pied de page : le `min(...cqw,
 * ...px)` ne fait que plafonner la taille sur très grand écran, il n'y a
 * volontairement PAS de plancher (`clamp` avec un minimum fixe) — un
 * plancher fixe est justement ce qui causait un chevauchement du pied de
 * page sur mobile/tablette (le texte ne rétrécissait plus assez).
 */
export function MembershipCardPreview({ data }: { data: MembershipCardData }) {
  const contributionLabel = data.type_contribution
    ? CONTRIBUTION_TYPE_LABELS[data.type_contribution]
    : "Membre"
  const regionLabel = MEMBERSHIP_REGION_LABELS[data.region] || data.region
  const dateLabel = formatDate(data.date, { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border bg-[#f7f6f2] shadow-md"
      style={{ aspectRatio: "680 / 383", containerType: "inline-size" }}
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
        <span className="-rotate-90 whitespace-nowrap text-[min(5cqw,22px)] font-bold tracking-wide text-white">
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
      <span className="absolute top-[8%] right-[5%] rounded-full bg-[#02542D] py-[min(1.47cqw,8px)] px-[min(3.82cqw,18px)] text-[min(2.94cqw,16px)] font-bold text-white">
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
        <p className="mb-[min(3.82cqw,20px)] truncate text-[min(4.41cqw,26px)] leading-tight font-bold text-[#02542D]">
          {data.nom_complet}
        </p>
        <p className="mb-[min(0.5cqw,3px)] truncate text-[min(2.79cqw,15px)] font-bold text-[#F2A20D]">
          {contributionLabel}
        </p>
        <p className="mb-[min(2.65cqw,14px)] truncate text-[min(4.71cqw,26px)] font-bold text-[#F2A20D]">
          {regionLabel}
        </p>
        <p className="text-[min(1.76cqw,11px)] text-muted-foreground">Depuis</p>
        <p className="text-[min(2.35cqw,14px)] font-bold text-foreground">{dateLabel || "—"}</p>
      </div>

      <p className="absolute right-[6%] bottom-[5%] left-[44%] truncate text-right text-[min(2.06cqw,12px)] font-bold text-[#02542D] italic">
        Casa Impact, trois régions - une vision - un impact.
      </p>
    </div>
  )
}
