import { Section, SectionHeading } from "@/components/layout/section"
import { Sparkles, Globe, Compass, Users2, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const synergyPillars = [
  {
    title: "Convergence Jeunesse & Entrepreneuriat",
    desc: "Former des leaders capables de concevoir des projets innovants, viables et créateurs d'emplois locaux durables.",
  },
  {
    title: "Culture & Tourisme comme Moteurs d'Attractivité",
    desc: "Faire des richesses patrimoniales et de la beauté naturelle de la Casamance un levier de rayonnement international et de revenus communautaires.",
  },
  {
    title: "Investissement & Mobilisation de la Diaspora",
    desc: "Connecter les compétences et capitaux de la diaspora avec les opportunités concrètes identifiées sur le terrain à Ziguinchor, Kolda et Sédhiou.",
  },
]

export function DomainsCrossImpact() {
  return (
    <Section tone="dark" className="relative overflow-hidden py-20 sm:py-28">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <Sparkles className="size-3 text-accent" />
            <span>Vision Écosystémique</span>
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Une Approche Synergique & Intégrée du Territoire
          </h2>

          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg font-normal">
            Nos six domaines d'intervention ne fonctionnent pas en silos isolés. Ils s'alimentent mutuellement pour former un cercle vertueux de développement où chaque réussite renforce l'ensemble de la Casamance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:bg-forest hover:text-white hover:border-forest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Link href="/adherer" className="flex items-center gap-2">
                <span>Rejoindre un Domaine d'Action</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full border border-white/40 bg-white/10 text-white font-medium backdrop-blur-md hover:bg-white/20 hover:text-white hover:border-white/60 transition-all"
            >
              <Link href="/opportunites">Voir les programmes ouverts</Link>
            </Button>
          </div>
        </div>

        {/* Synergy Cards */}
        <div className="space-y-4">
          {synergyPillars.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:bg-white/15"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground font-bold text-sm">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
