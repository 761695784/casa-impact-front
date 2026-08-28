import { CtaBand } from "@/components/layout/cta-band"
import { DomainDetail } from "@/components/domains/domain-detail"

export default async function DomainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <DomainDetail slug={slug} />
      <CtaBand />
    </>
  )
}
