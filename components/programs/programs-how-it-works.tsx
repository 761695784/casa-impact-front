import Link from "next/link"
import { Search, FileCheck, Award, ArrowRight, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function ProgramsHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Choisissez votre parcours",
      description:
        "Explorez nos programmes dans les domaines du leadership, de l'entrepreneuriat, de la culture, du sport ou du tourisme selon vos ambitions.",
    },
    {
      number: "02",
      icon: FileCheck,
      title: "Candidatez à une cohorte",
      description:
        "Répondez aux appels à candidatures ouverts en renseignant votre parcours et vos motivations pour intégrer la prochaine promotion.",
    },
    {
      number: "03",
      icon: Award,
      title: "Apprenez, agissez & rayonnez",
      description:
        "Bénéficiez de masterclasses immersives, d'un mentorat sur-mesure, de bourses d'action et rejoignez le réseau influent des Alumni.",
    },
  ]

  return (
    <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-forest via-forest to-forest/90 p-8 sm:p-12 text-white shadow-xl">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md">
          <Sparkles className="size-3.5 text-accent" />
          <span>Parcours d'Impact</span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Comment intégrer et vivre nos programmes ?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base max-w-2xl mx-auto">
          Un accompagnement structuré en 3 étapes pour transformer vos idées en réalisations concrètes sur le territoire.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-2xl border border-white/15 bg-black/20 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:bg-black/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">
                    ÉTAPE {step.number}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/15">
        <Link
          href="/opportunites"
          className={buttonVariants({
            size: "lg",
            className:
              "rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-md",
          })}
        >
          <span>Voir les appels à candidatures</span>
          <ArrowRight className="size-4 ml-1.5" />
        </Link>
        <Link
          href="/contact"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className:
              "rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-md",
          })}
        >
          Proposer une initiative ou un partenariat
        </Link>
      </div>
    </section>
  )
}
