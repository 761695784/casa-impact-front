import type { Metadata } from "next"
import { CtaBand } from "@/components/layout/cta-band"
import { DomainDetail } from "@/components/domains/domain-detail"
import { contentService } from "@/lib/services/content.service"

// Accord du 2026-09-14 ("aide moi pour le referencement seo") — voir
// app/(public)/actualites/[slug]/page.tsx pour le même correctif.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const domain = await contentService.getDomain(slug)

  if (!domain) {
    return {
      title: "Domaine d'intervention | Casa Impact",
      description: "Les domaines d'intervention de Casa Impact en Casamance.",
    }
  }

  const description =
    domain.resume || domain.description || "Domaine d'intervention de Casa Impact en Casamance."

  return {
    title: `${domain.nom} | Domaines d'intervention Casa Impact`,
    description,
    alternates: { canonical: `/domaines/${domain.slug}` },
    openGraph: {
      title: domain.nom,
      description,
    },
  }
}

export default async function DomainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <DomainDetail slug={slug} />
      <CtaBand />
    </>
  )
}
