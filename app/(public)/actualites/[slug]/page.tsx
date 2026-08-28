import { CtaBand } from "@/components/layout/cta-band"
import { NewsDetail } from "@/components/news/news-detail"

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <NewsDetail slug={slug} />
      <CtaBand />
    </>
  )
}
