import type { Metadata } from "next"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"
import { ProgramsList } from "@/components/programs/programs-list"

export const metadata: Metadata = {
  title: "Programmes & activités",
  description:
    "Découvrez les programmes, formations et événements de Casa Impact déployés à Ziguinchor, Sédhiou et Kolda.",
}

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos programmes"
        title="Programmes & activités"
        description="Formations, accompagnements et événements conçus pour agir concrètement au service de la jeunesse et du territoire."
      />
      <Section>
        <ProgramsList />
      </Section>
      <CtaBand />
    </>
  )
}
