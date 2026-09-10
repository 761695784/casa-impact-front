import type { Metadata } from "next"
import { BoutiqueHero } from "@/components/boutique/boutique-hero"
import { BoutiqueCatalog } from "@/components/boutique/boutique-catalog"
import { BoutiqueGuarantees } from "@/components/boutique/boutique-guarantees"

export const metadata: Metadata = {
  title: "Boutique Officielle — Collections Casa Impact",
  description:
    "Découvrez la boutique officielle Casa Impact : polos brodés, t-shirts collectors, casquettes et goodies. Commandez en un clic via WhatsApp, livraison dans toute la Casamance et au Sénégal.",
}

export default function BoutiquePage() {
  return (
    <>
      {/* Bannière d'introduction + article vedette */}
      <BoutiqueHero />

      {/* Catalogue filtrable + commande WhatsApp */}
      <BoutiqueCatalog />

      {/* Garanties (livraison, qualité, impact) + bandeau commande groupée */}
      <BoutiqueGuarantees />
    </>
  )
}
