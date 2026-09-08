import type { Metadata } from "next"
import { TestimonialsView } from "@/components/testimonials/testimonials-view"

export const metadata: Metadata = {
  title: "Témoignages & Récits d'Impact — Casa Impact",
  description:
    "Découvrez les histoires authentiques de celles et ceux que Casa Impact accompagne : jeunes leaders, entrepreneures, artisanes et partenaires de Ziguinchor, Sédhiou et Kolda.",
  openGraph: {
    title: "Témoignages & Récits d'Impact — Casa Impact",
    description:
      "La Casamance en mouvement à travers les voix de ses jeunes leaders, entrepreneurs et artisanes.",
  },
}

export default function TemoignagesPage() {
  return <TestimonialsView />
}
