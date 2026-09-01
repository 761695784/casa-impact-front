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
