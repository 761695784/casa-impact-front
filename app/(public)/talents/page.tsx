import type { Metadata } from "next"
import { TalentsHero } from "@/components/talents/talents-hero"
import { TalentsCategories } from "@/components/talents/talents-categories"
import { TalentsList } from "@/components/talents/talents-list"
import { TalentsCta } from "@/components/talents/talents-cta"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Mur des Talents — Champions & Créateurs de Casamance",
  description:
    "Découvrez le Mur des Talents de Casa Impact : entrepreneurs, artistes, sportifs et leaders qui bâtissent l'avenir de Ziguinchor, Kolda et Sédhiou.",
}

export default function TalentsPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <TalentsHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mur des talents" },
        ]}
      />

      {/* Piliers de détection */}
      <TalentsCategories />

      {/* Mur des Talents & Filtres */}
      <Section id="mur" className="scroll-mt-24 pt-0">
        <SectionHeading
          eyebrow="Annuaire & Profils"
          title="Les Visages de l'Excellence Casamançaise"
          description="Explorez les profils des talents engagés et faites émerger les champions de votre région."
          align="center"
        />
        <div className="mt-12">
          <TalentsList />
        </div>
      </Section>

      {/* Comment intégrer le Mur */}
      <TalentsCta />

      {/* Bandeau d'Appel à l'Action */}
      <CtaBand
        title="Vous souhaitez soutenir les talents de Casamance ?"
        description="Devenez mentor, partenaire ou investisseur pour accompagner la nouvelle génération de champions territoriaux."
        primary={{ label: "Devenir Partenaire", href: "/adherer" }}
        secondary={{ label: "Découvrir les programmes", href: "/programmes" }}
      />
    </>
  )
}
