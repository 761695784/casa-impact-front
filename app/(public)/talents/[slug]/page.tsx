import { CtaBand } from "@/components/layout/cta-band"
import { TalentDetail } from "@/components/talents/talent-detail"

export default async function TalentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <TalentDetail slug={slug} />
      <CtaBand />
    </>
  )
}
