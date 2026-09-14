import type { Metadata } from "next"
import { CtaBand } from "@/components/layout/cta-band"
import { NewsDetail } from "@/components/news/news-detail"
import { contentService } from "@/lib/services/content.service"

// Accord du 2026-09-14 ("aide moi pour le referencement seo") — chaque
// article avait jusque-là le même titre générique hérité du layout
// racine ; chacun a désormais son propre titre/description/OG, sur le
// même modèle que app/(public)/programmes/[slug]/page.tsx.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await contentService.getNews(slug)

  if (!article) {
    return {
      title: "Actualité | Casa Impact",
      description: "Actualités et temps forts de Casa Impact en Casamance.",
    }
  }

  const description =
    article.extrait ||
    (article.corps ? article.corps.replace(/<[^>]+>/g, "").slice(0, 160).trim() : undefined) ||
    "Actualités et temps forts de Casa Impact en Casamance."

  return {
    title: `${article.titre} | Actualités Casa Impact`,
    description,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: {
      title: article.titre,
      description,
      type: "article",
      images: article.image ? [{ url: article.image }] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <NewsDetail slug={slug} />
      <CtaBand />
    </>
  )
}
