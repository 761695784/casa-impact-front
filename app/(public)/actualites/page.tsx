import type { Metadata } from "next"
import { NewsHero } from "@/components/news/news-hero"
import { NewsList } from "@/components/news/news-list"
import { Section, SectionHeading } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Actualités — La Vie de Casa Impact & Événements",
  description:
    "Suivez l'actualité de Casa Impact : annonces officielles, communiqués, reportages de terrain et comptes-rendus d'initiatives à Ziguinchor, Sédhiou et Kolda.",
}

export default function ActualitesPage() {
  return (
    <>
      {/* Immersive Photo Hero */}
      <NewsHero
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Actualités" },
        ]}
      />

      {/* News List Section */}
      <Section className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Toutes les publications"
          title="Les Dernières Nouvelles du Territoire"
          description="Explorez les annonces, reportages et communiqués classés par catégorie."
          align="center"
        />
        <div className="mt-12">
          <NewsList />
        </div>
      </Section>

      {/* CTA Band */}
      <CtaBand
        title="Vous souhaitez participer aux prochaines initiatives ?"
        description="Rejoignez les membres de Casa Impact ou découvrez les opportunités d'accompagnement ouvertes."
        primary={{ label: "Adhérer à Casa Impact", href: "/adherer" }}
        secondary={{ label: "Voir les opportunités", href: "/opportunites" }}
      />
    </>
  )
}
