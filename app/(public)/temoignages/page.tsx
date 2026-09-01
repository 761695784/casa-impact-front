import type { Metadata } from "next"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/layout/section"
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Témoignages",
  description:
    "Les voix de celles et ceux que Casa Impact accompagne : bénéficiaires, membres et partenaires racontent leur expérience de l'organisation.",
}

export default function TemoignagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ils en parlent"
        title="Témoignages"
        description="Derrière chaque action, il y a des visages et des parcours. Découvrez ce que représente Casa Impact pour celles et ceux qui vivent l'organisation de l'intérieur."
      />

      <Section>
        <TestimonialsGrid />
      </Section>

      <CtaBand
        title="Votre histoire compte"
        description="Vous avez participé à un programme, un événement ou une action Casa Impact ? Partagez votre expérience avec la communauté."
        primary={{ label: "Partager mon témoignage", href: "/contact" }}
        secondary={{ label: "Découvrir nos programmes", href: "/programmes" }}
      />
    </>
  )
}
