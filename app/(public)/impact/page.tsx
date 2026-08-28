import type { Metadata } from "next"
import { Target, LineChart, ShieldCheck } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/layout/section"
import { CtaBand } from "@/components/layout/cta-band"
import { ImpactIndicators } from "@/components/impact/impact-indicators"

export const metadata: Metadata = {
  title: "Notre impact",
  description:
    "Casa Impact mesure et publie son impact de façon transparente au service de la jeunesse et des communautés de la Casamance.",
}

const principles = [
  {
    icon: Target,
    titre: "Des objectifs clairs",
    texte:
      "Chaque programme est conçu autour d'objectifs précis et d'un public défini dans les trois régions de la Casamance.",
  },
  {
    icon: LineChart,
    titre: "Une mesure rigoureuse",
    texte:
      "Nous suivons des indicateurs concrets — participants formés, projets accompagnés, talents révélés — sur la durée.",
  },
  {
    icon: ShieldCheck,
    titre: "Une transparence totale",
    texte:
      "Aucune statistique n'est communiquée avant d'avoir été mesurée sur le terrain. Nos résultats seront publiés tels quels.",
  },
]

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Mesurer pour progresser"
        title="Notre impact"
        description="Casa Impact s'engage à démontrer son utilité par des résultats concrets et vérifiables, au service du territoire."
      />

      <Section title="Notre approche de l'impact" description="Trois principes guident notre façon de rendre compte.">
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.titre} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{p.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{p.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted title="Indicateurs mesurés" description="Les chiffres publiés reflètent uniquement des données réelles.">
        <ImpactIndicators />
      </Section>

      <CtaBand />
    </>
  )
}
