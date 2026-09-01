import type { Metadata } from "next"
import { OpportunitiesHero } from "@/components/opportunities/opportunities-hero"
import { OpportunitiesPillars } from "@/components/opportunities/opportunities-pillars"
import { OpportunitiesProcess } from "@/components/opportunities/opportunities-process"
import { OpportunitiesList } from "@/components/opportunities/opportunities-list"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Opportunités & Appels à Candidatures — Casa Impact",
  description:
    "Rejoignez les programmes d'excellence de Casa Impact : incubateur d'entreprises, Académie du leadership, formations tech et financements en Casamance.",
}

export default function OpportunitesPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <OpportunitiesHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Opportunités & Candidatures" },
        ]}
      />

      {/* 4 Piliers d'Accompagnement */}
      <OpportunitiesPillars />

      {/* Liste des Appels à Candidatures Ouverts */}
      <Section id="appels" className="scroll-mt-24 py-16 md:py-24">
        <SectionHeading
          eyebrow="Cohortes & Appels"
          title="Appels à Candidatures en Cours"
          description="Consultez les programmes actuellement ouverts à Ziguinchor, Sédhiou et Kolda et déposez votre dossier en ligne."
          align="center"
        />
        <div className="mt-12">
          <OpportunitiesList />
        </div>
      </Section>

      {/* Parcours de Sélection en 4 Étapes */}
      <OpportunitiesProcess />

      {/* CTA Band */}
      <CtaBand
        title="Vous souhaitez devenir formateur, mentor ou partenaire d'une cohorte ?"
        description="Rejoignez notre réseau d'experts bénévoles et d'entreprises partenaires pour transmettre votre savoir-faire aux talents de Casamance."
        primary={{ label: "Proposer un Partenariat", href: "/contact" }}
        secondary={{ label: "Découvrir la Communauté", href: "/talents" }}
      />
    </>
  )
}
