import { HomeHero } from "@/components/home/home-hero"
import {
  HomeManifesto,
  HomeTerritories,
  HomeDomains,
  HomeOpportunitiesPrograms,
  HomeImpact,
  HomePresident,
} from "@/components/home/home-sections"
import { HomeNews } from "@/components/home/home-news"
import { HomePartners } from "@/components/home/home-partners"
import { CtaBand } from "@/components/layout/cta-band"

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeManifesto />
      <HomeTerritories />
      <HomeDomains />
      <HomeOpportunitiesPrograms />
      <HomeImpact />
      <HomePresident />
      <HomePartners />
      <HomeNews />
      <CtaBand />
    </>
  )
}
