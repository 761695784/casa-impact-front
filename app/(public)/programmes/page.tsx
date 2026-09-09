import type { Metadata } from "next"
import { Section } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"
import { ProgramsHero } from "@/components/programs/programs-hero"
import { ProgramsList } from "@/components/programs/programs-list"
import { ProgramsHowItWorks } from "@/components/programs/programs-how-it-works"

export const metadata: Metadata = {
  title: "Programmes & Activités | Casa Impact",
  description:
    "Découvrez les programmes d'excellence, formations, incubateurs et événements de Casa Impact déployés à Ziguinchor, Sédhiou et Kolda.",
}

export default function ProgrammesPage() {
  return (
    <>
      <ProgramsHero />
      <Section className="py-12 sm:py-16">
        <ProgramsList />
      </Section>
      <Section className="py-12 sm:py-16 pt-0">
        <ProgramsHowItWorks />
      </Section>
      <CtaBand />
    </>
  )
}
