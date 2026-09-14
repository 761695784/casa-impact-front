import type { Metadata } from "next"
import { CallDetail } from "@/components/opportunities/call-detail"
import { contentService } from "@/lib/services/content.service"

// Accord du 2026-09-14 ("aide moi pour le referencement seo") — voir
// app/(public)/actualites/[slug]/page.tsx pour le même correctif.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const call = await contentService.getApplicationCall(slug)

  if (!call) {
    return {
      title: "Appel à candidatures | Casa Impact",
      description: "Appels à candidatures et opportunités Casa Impact en Casamance.",
    }
  }

  const description =
    call.resume || call.description || "Appel à candidatures Casa Impact en Casamance."

  return {
    title: `${call.titre} | Appels à candidatures Casa Impact`,
    description,
    alternates: { canonical: `/appels-a-candidatures/${call.slug}` },
    openGraph: {
      title: call.titre,
      description,
      images: call.image ? [{ url: call.image }] : undefined,
    },
  }
}

export default async function CallDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CallDetail slug={slug} />
}
