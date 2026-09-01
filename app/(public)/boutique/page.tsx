import { Metadata } from "next"
import { BoutiqueHero } from "@/components/boutique/boutique-hero"
import { BoutiqueCatalog } from "@/components/boutique/boutique-catalog"
import { BoutiqueGuarantees } from "@/components/boutique/boutique-guarantees"
import { CtaBand } from "@/components/layout/cta-band"

export const metadata: Metadata = {
  title: "Boutique Officielle — Collections & Goodies Casa Impact",
  description:
    "Découvrez et commandez les polos, t-shirts collectors, casquettes et goodies officiels de Casa Impact. Livraison en Casamance et au Sénégal. Commande directe via WhatsApp.",
}

export default function BoutiquePage() {
  return (
    <>
      <BoutiqueHero />
      <BoutiqueCatalog />
      <BoutiqueGuarantees />
      <CtaBand
        title="Rejoignez aussi la communauté Casa Impact"
        description="Au-delà des collections, devenez membre actif et participez directement aux projets de transformation de Ziguinchor, Sédhiou et Kolda."
        primary={{
          label: "Adhérer (1 000 FCFA)",
          href: "/adherer",
        }}
        secondary={{
          label: "Découvrir les programmes",
          href: "/programmes",
        }}
      />
    </>
  )
}
