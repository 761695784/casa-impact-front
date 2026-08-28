import { Section, SectionHeading } from "@/components/layout/section"
import { CheckSquare, FileUp, Sparkles, UserCheck, ArrowRight } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: CheckSquare,
    title: "1. Choix du Programme",
    desc: "Parcourez les appels à candidatures ouverts et vérifiez les critères d'éligibilité (région, profil, documents demandés).",
  },
  {
    step: "02",
    icon: FileUp,
    title: "2. Dépôt de Candidature",
    desc: "Remplissez le formulaire en ligne avec vos informations, votre lettre de motivation et vos pièces justificatives.",
  },
  {
    step: "03",
    icon: UserCheck,
    title: "3. Évaluation & Pitch",
    desc: "Les profils présélectionnés sont invités à un échange avec le comité de sélection et les coordinateurs régionaux.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "4. Intégration & Démarrage",
    desc: "Les lauréats intègrent officiellement leur promotion, signent la charte d'engagement et débutent l'accompagnement.",
  },
]

export function OpportunitiesProcess() {
  return (
    <Section className="py-16 sm:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Comment ça marche ?"
        title="Le Parcours de Sélection en 4 Étapes"
        description="Un processus transparent, rigoureux et basé sur le mérite pour garantir l'équité de chance à chaque jeune de Casamance."
        align="center"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className="relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-primary/40">
                    {s.step}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="mt-5 font-display text-base font-bold text-foreground">
                  {s.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-primary/30 pointer-events-none">
                  <ArrowRight className="size-5" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
