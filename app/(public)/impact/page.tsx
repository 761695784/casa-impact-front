import type { Metadata } from "next"
import { ImpactHero } from "@/components/impact/impact-hero"
import { ImpactOverviewStats } from "@/components/impact/impact-overview-stats"
import { ImpactRegionalBreakdown } from "@/components/impact/impact-regional-breakdown"
import { ImpactPrinciples } from "@/components/impact/impact-principles"
import { ImpactIndicators } from "@/components/impact/impact-indicators"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Notre impact — Résultats & Transformation en Casamance",
  description:
    "Découvrez l'impact réel et mesuré de Casa Impact : personnes accompagnées, membres adhérents et dynamiques territoriales à Ziguinchor, Sédhiou et Kolda.",
}

export default function ImpactPage() {
  return (
    <>
      {/* 1. Hero Cinématique */}
      <ImpactHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Notre impact" },
        ]}
      />

      {/* 2. Synthèse Globale des 6 Métriques Clés */}
      <ImpactOverviewStats />

      {/* 3. Répartition Territoriale dans l'Ordre Administratif : Ziguinchor, Sédhiou, Kolda */}
      <ImpactRegionalBreakdown />

      {/* 4. Méthodologie, Éthique & Transparence */}
      <ImpactPrinciples />

      {/* 5. Grille Complète des Indicateurs Détaillés */}
      <Section className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Rapport d'Évaluation Détaillé"
          title="Tous Nos Indicateurs d'Impact"
          description="Chaque indicateur fait l'objet d'un suivi régulier sur le terrain et d'une validation par notre commission scientifique."
          align="center"
        />
        <div className="mt-12">
          <ImpactIndicators />
        </div>
      </Section>

      {/* 6. Bandeau d'Appel à l'Action & Adhésion */}
      <CtaBand
        title="Participez vous aussi à la dynamique d'impact"
        description="Rejoignez une organisation de jeunes, d'entrepreneurs et de cadres engagés pour transformer durablement la Casamance."
        primary={{ label: "Devenir membre actif", href: "/adherer" }}
        secondary={{ label: "Découvrir les programmes", href: "/programmes" }}
      />
    </>
  )
}
