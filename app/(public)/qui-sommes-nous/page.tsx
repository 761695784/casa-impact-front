import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { CtaBand } from "@/components/layout/cta-band"
import { Section, SectionHeading } from "@/components/layout/section"
import {
  AboutIntro,
  AboutVisionMission,
  AboutValues,
  AboutPresident,
  AboutTerritories,
} from "@/components/about/about-sections"
import { TeamOrg } from "@/components/team/team-org"

export const metadata: Metadata = {
  title: "Qui sommes-nous — Histoire, Vision & Équipe",
  description:
    "Découvrez Casa Impact, organisation engagée pour le développement durable et inclusif de la Casamance : histoire, vision, valeurs, équipe exécutive et mot du Président Fondateur.",
}

export default function QuiSommesNousPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <AboutHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Qui sommes-nous" },
        ]}
      />

      {/* Identité & Origines */}
      <AboutIntro />

      {/* Vision • Mission • Objectif */}
      <AboutVisionMission />

      {/* 7 Valeurs Fondamentales */}
      <AboutValues />

      {/* Organisation & Bureau Exécutif */}
      <Section id="equipe" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Notre Organisation"
          title="Les Femmes et les Hommes de Casa Impact"
          description="Une équipe pluridisciplinaire et engagée, structurée en pôles d'action et présente dans les trois régions naturelles de la Casamance."
          align="center"
        />
        <div className="mt-14">
          <TeamOrg />
        </div>
      </Section>

      {/* Discours Officiel du Président */}
      <AboutPresident />

      {/* Ancrage Territorial (Ziguinchor, Kolda, Sédhiou) */}
      <AboutTerritories />

      {/* Appel à l'action */}
      <CtaBand
        title="Vous partagez notre vision pour la Casamance ?"
        description="Rejoignez les membres et partenaires de Casa Impact pour bâtir ensemble un avenir prospère pour notre jeunesse."
        primary={{ label: "Adhérer à l'organisation", href: "/adherer" }}
        secondary={{ label: "Découvrir nos opportunités", href: "/opportunites" }}
      />
    </>
  )
}
