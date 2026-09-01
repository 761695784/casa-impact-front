import type { Metadata } from "next"
import { PageHero } from "@/components/layout/page-hero"
import { Section, SectionHeading } from "@/components/layout/section"
import { CasamanceMapSection } from "@/components/map/casamance-map-section"
import { CtaBand } from "@/components/layout/cta-band"
import { territoires } from "@/lib/institution"

export const metadata: Metadata = {
  title: "Carte des actions",
  description:
    "Découvrez les programmes, appels à candidatures et actions de Casa Impact à travers les trois régions de la Casamance : Ziguinchor, Sédhiou et Kolda.",
}

const legend = [
  { label: "Programme", className: "bg-primary" },
  { label: "Appel à candidatures", className: "bg-accent" },
]

export default function CartePage() {
  return (
    <>
      <PageHero
        eyebrow="Territoire"
        title="La Casamance en action"
        description="Nos programmes et appels à candidatures se déploient à travers les trois régions naturelles de la Casamance. Explorez la carte pour situer chaque action."
      />

      <Section>
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-sm font-medium text-foreground">Légende :</span>
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`inline-block size-3 rounded-full ${l.className}`} aria-hidden="true" />
              {l.label}
            </span>
          ))}
        </div>
        <CasamanceMapSection />
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Trois régions"
          title="Un territoire, une vision"
          description="De Ziguinchor à Sédhiou, en passant par Kolda, Casa Impact fédère les énergies positives de la Casamance."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {territoires.map((region) => (
            <div key={region.nom} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-xl font-bold text-primary">{region.nom}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{region.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
