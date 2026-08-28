import { CtaBand } from "@/components/layout/cta-band"
import { ProgramDetail } from "@/components/programs/program-detail"

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <ProgramDetail slug={slug} />
      <CtaBand />
    </>
  )
}
