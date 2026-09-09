import type { Metadata } from "next"
import { CtaBand } from "@/components/layout/cta-band"
import { ProgramDetail } from "@/components/programs/program-detail"
import { contentService } from "@/lib/services/content.service"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await contentService.getProgram(slug)

  if (!program) {
    return {
      title: "Programme | Casa Impact",
      description: "Découvrez les programmes et formations de Casa Impact.",
    }
  }

  return {
    title: `${program.titre} | Programmes Casa Impact`,
    description: program.resume || program.description || "Programme d'action et de formation Casa Impact en Casamance.",
    openGraph: {
      title: `${program.titre} | Casa Impact`,
      description: program.resume,
      images: program.image ? [{ url: program.image }] : undefined,
    },
  }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <>
      <ProgramDetail slug={slug} />
      <CtaBand />
    </>
  )
}
