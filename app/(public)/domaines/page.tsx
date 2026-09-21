import type { Metadata } from "next"
import { DomainsHero } from "@/components/domains/domains-hero"
import { DomainsList } from "@/components/domains/domains-list"
import { DomainsCrossImpact } from "@/components/domains/domains-cross-impact"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  alternates: { canonical: "/domaines" },
  title: "Domaines d'Intervention — Les 7 Piliers Stratégiques de Casa Impact",
  description:
    "Découvrez les 7 domaines d'action de Casa Impact : jeunesse & leadership, entrepreneuriat & innovation, culture, sport, tourisme, investissement diaspora et sensibilisation environnementale en Casamance.",
}

export default function DomainesPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <DomainsHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Domaines d'intervention" },
        ]}
      />

      {/* Grille des 7 Domaines d'Intervention */}
      <Section id="domaines-grid" className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Nos piliers d'action"
          title="Sept Leviers pour Libérer le Potentiel de la Casamance"
          description="Chaque domaine concentre des programmes, des experts et des ressources dédiées au service de la jeunesse et des terroirs."
          align="center"
          className="mb-12"
        />
        <div className="mt-8">
          <DomainsList />
        </div>
      </Section>

      {/* Vision Écosystémique & Synergies */}
      <DomainsCrossImpact />

      {/* Bandeau d'Appel à l'Action */}
      <CtaBand
        title="Vous souhaitez contribuer activement à l'un de ces domaines ?"
        description="Rejoignez la communauté Casa Impact en tant que membre actif ou partenaire technique et financier."
        primary={{ label: "Adhérer à Casa Impact", href: "/adherer" }}
        secondary={{ label: "Proposer un Partenariat", href: "/contact" }}
      />
    </>
  )
}
