import { API_URL } from "@/lib/config"

export function formatDate(value?: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return new Intl.DateTimeFormat("fr-FR", opts ?? { day: "numeric", month: "long", year: "numeric" }).format(d)
}

export function daysUntil(value?: string): number | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const diff = d.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("")
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value)
}

/**
 * Résout une URL de média renvoyée par MediaResource
 * (App\Http\Resources\MediaResource::url, `Storage::disk('public')->url(...)`)
 * vers une URL absolue utilisable côté navigateur.
 *
 * Toute URL contenant `/storage/...` (convention du disque `public` de
 * Laravel, seule origine réelle des médias de la Médiathèque) est
 * reconstruite à partir de `API_URL` — on ne se fie PAS à l'hôte que le
 * backend a pu renvoyer, car il dépend d'`APP_URL` côté Laravel et peut
 * être relatif (`/storage/...`) ou absolu mais avec un port erroné ou
 * absent (ex. `http://localhost/storage/...` sans le `:8000`, si
 * `APP_URL` n'est pas configuré avec le bon port dans le `.env` du
 * backend) : dans les deux cas, seul le segment `/storage/...` est fiable,
 * donc on ne garde que celui-ci et on le recolle à `API_URL` (déjà connu
 * côté frontend via `NEXT_PUBLIC_API_URL`).
 *
 * Tout le reste (ex. `/assets/...`, les visuels statiques du frontend
 * Next.js lui-même, comme les logos de secours codés en dur dans
 * `home-partners.tsx`, ou une URL absolue d'un tout autre domaine) est
 * laissé tel quel — ces chemins ne viennent jamais du backend.
 */
export function resolveMediaUrl(url?: string): string | undefined {
  if (!url) return undefined
  const storageIndex = url.indexOf("/storage/")
  if (storageIndex !== -1) {
    return `${API_URL}${url.slice(storageIndex)}`
  }
  return url
}

/**
 * Résout l'URL du logo d'un partenaire à partir de sa collection de
 * médias (App\Http\Resources\PartnerResource) : le logo est l'entrée de
 * `media` dont `collection === 'logo'`. Retourne `undefined` si aucun
 * logo n'est présent — à l'appelant de gérer le repli visuel.
 */
export function getPartnerLogoUrl(partner: {
  media?: { collection?: string; url: string }[]
  logo?: string
}): string | undefined {
  const media = partner.media || []
  const logoMedia = media.find((m) => m.collection === "logo")
  return resolveMediaUrl(logoMedia?.url || partner.logo)
}

/**
 * Résout l'image de couverture d'une actualité à partir de sa collection
 * de médias (App\Http\Resources\NewsResource::media, pivot
 * media_attachments) : l'entrée dont `collection === 'cover'`. Repli sur
 * le premier média disponible pour les rares articles créés avant
 * l'introduction de cette collection dédiée. Ne PAS utiliser `media?.[0]`
 * directement : quand couverture et album sont attachés dans le même
 * enregistrement, l'ordre entre les deux n'est pas garanti (voir
 * ActualiteFormDialog::syncMedia, qui les attache en parallèle) et un
 * article pouvait alors afficher sa première photo de galerie à la place
 * de sa vraie couverture, voire aucune image du tout si `media` n'était
 * pas chargé par l'API (liste publique corrigée le 2026-09-09).
 */
export function getNewsCoverUrl(news: {
  media?: { collection?: string; url: string }[]
}): string | undefined {
  const media = news.media || []
  const cover = media.find((m) => m.collection === "cover") || media[0]
  return resolveMediaUrl(cover?.url)
}

/**
 * Photos d'album d'une actualité, couverture exclue (déjà affichée
 * séparément dans le hero de la fiche détail) — évite de la voir dupliquée
 * dans la galerie photo de l'article.
 */
export function getNewsGalleryMedia<T extends { collection?: string }>(news: {
  media?: T[]
}): T[] {
  return (news.media || []).filter((m) => m.collection !== "cover")
}

/**
 * Résout la photo d'un témoin à partir de sa collection de médias
 * (App\Http\Resources\TestimonialResource::media, pivot media_attachments) :
 * l'entrée dont `collection === 'photo'`, repli sur le premier média
 * disponible. Même principe et même raison que `getNewsCoverUrl` — ne pas
 * se fier à `media?.[0]` seul.
 */
export function getTestimonialPhotoUrl(testimonial: {
  media?: { collection?: string; url: string }[]
}): string | undefined {
  const media = testimonial.media || []
  const photo = media.find((m) => m.collection === "photo") || media[0]
  return resolveMediaUrl(photo?.url)
}

/**
 * Résout la photo de profil d'un talent à partir de sa collection de
 * médias (App\Http\Resources\TalentResource::media, pivot
 * media_attachments) : l'entrée dont `collection === 'photo'`, repli sur
 * le premier média disponible. Même principe et même raison que
 * `getTestimonialPhotoUrl`.
 */
export function getTalentPhotoUrl(talent: {
  media?: { collection?: string; url: string }[]
  photo?: string
}): string | undefined {
  const media = talent.media || []
  const photo = media.find((m) => m.collection === "photo") || media[0]
  return resolveMediaUrl(photo?.url || talent.photo)
}

