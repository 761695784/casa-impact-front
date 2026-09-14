import type { Metadata } from "next"
import { HomeHero } from "@/components/home/home-hero"
import { HomeStatsCounter } from "@/components/home/home-stats-counter"
import {
  HomeManifesto,
  HomeTerritories,
  HomeDomains,
  HomeOpportunitiesPrograms,
  HomeImpact,
  HomePresident,
} from "@/components/home/home-sections"
import { HomeTestimonials } from "@/components/home/home-testimonials"
import { HomeNews } from "@/components/home/home-news"
import { HomePartners } from "@/components/home/home-partners"
import { HomeBoutique } from "@/components/home/home-boutique"
import { CtaBand } from "@/components/layout/cta-band"

// Accord du 2026-09-14 ("aide moi pour le referencement seo") — pas de
// `title` ici volontairement : la page d'accueil hérite du `default` du
// layout racine (le nom de marque complet), plutôt que de passer par le
// template `%s | Casa Impact` qui donnerait un "Accueil | Casa Impact"
// moins engageant sur les résultats de recherche.
export const metadata: Metadata = {
  description:
    "Casa Impact fédère Ziguinchor, Sédhiou et Kolda autour d'une même vision : former, accompagner et faire grandir la jeunesse et les communautés de la Casamance.",
  alternates: { canonical: "/" },
  openGraph: {
    description:
      "Casa Impact fédère Ziguinchor, Sédhiou et Kolda autour d'une même vision : former, accompagner et faire grandir la jeunesse et les communautés de la Casamance.",
    url: "/",
  },
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeManifesto />
      <HomeStatsCounter />
      <HomeTerritories />
      <HomeDomains />
      <HomeOpportunitiesPrograms />
      <HomeImpact />
      <HomeTestimonials />
      <HomePresident />
      <HomePartners />
      <HomeBoutique />
      <HomeNews />
      <CtaBand />
    </>
  )
}
