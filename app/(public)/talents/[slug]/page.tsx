import type { Metadata } from "next"
import { CtaBand } from "@/components/layout/cta-band"
import { TalentDetail } from "@/components/talents/talent-detail"
import { contentService } from "@/lib/services/content.service"

/**
 * Route manquante repérée pendant la passe SEO du 2026-09-14 : le
 * composant `TalentDetail` existait déjà (branché sur de vrais
 * hooks/services), mais aucune page ne l'appelait — les profils de
 * talents n'étaient donc pas accessibles par leur propre URL, et donc
 * pas indexables individuellement. Même modèle que
 * app/(public)/actualites/[slug]/page.tsx.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const talent = await contentService.getTalent(slug)

  if (!talent) {
    return {
      title: "Talent | Casa Impact",
      description: "Portraits des talents accompagnés par Casa Impact en Casamance.",
    }
  }

  const description =
    (talent.recit_corps ? talent.recit_corps.replace(/<[^>]+>/g, "").slice(0, 160).trim() : undefined) ||
    talent.presentation ||
    talent.bio ||
    talent.parcours ||
    "Portrait d'un talent accompagné par Casa Impact en Casamance."

  return {
    title: `${talent.nom} | Talents Casa Impact`,
    description,
    alternates: { canonical: `/talents/${talent.slug}` },
    openGraph: {
      title: talent.nom,
      description,
      images: talent.photo ? [{ url: talent.photo }] : undefined,
    },
  }
}

export default async function TalentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <TalentDetail slug={slug} />
      <CtaBand />
    </>
  )
}
