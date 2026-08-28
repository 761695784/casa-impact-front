import { Section, SectionHeading } from "@/components/layout/section"
import {
  Lightbulb,
  GraduationCap,
  Briefcase,
  Compass,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const pillars = [
  {
    icon: Lightbulb,
    title: "Incubateur & Accélération de Projets",
    desc: "Un accompagnement intensif de 6 mois pour transformer votre idée d'entreprise en business viable, structuré et rentable.",
    benefits: [
      "Mentorat individuel par des dirigeants",
      "Espaces de co-working équipés à Ziguinchor, Kolda & Sédhiou",
      "Préparation aux levées de fonds et micro-financements",
    ],
    tone: "bg-forest/10 border-forest/20 text-forest dark:text-emerald-400",
  },
  {
    icon: GraduationCap,
    title: "Académie du Leadership Jeune",
    desc: "Développez votre posture managériale, votre prise de parole en public, et votre capacité à piloter des projets d'envergure territoriale.",
    benefits: [
      "Masterclass avec des figures inspirantes de la diaspora",
      "Immersion terrain et gestion de projets communautaires",
      "Réseau alumni puissant à l'échelle nationale",
    ],
    tone: "bg-accent/15 border-accent/30 text-accent-foreground",
  },
  {
    icon: Briefcase,
    title: "Métiers d'Avenir, Tech & Éco-Activités",
    desc: "Formations certifiantes accélérées aux compétences les plus recherchées : développement web, marketing digital, transformation agroalimentaire durable.",
    benefits: [
      "Apprentissage par la pratique sur des cas réels",
      "Mise en relation directe avec les recruteurs",
      "Équipements et matériel pédagogique fournis",
    ],
    tone: "bg-earth/10 border-earth/20 text-earth dark:text-amber-400",
  },
  {
    icon: Compass,
    title: "Bourses d'Excellence & Mobilité",
    desc: "Soutien financier et logistique aux étudiants et talents casamançais d'exception pour leur permettre de poursuivre des études spécialisées.",
    benefits: [
      "Prise en charge de frais d'inscription et de subsistance",
      "Parrainage professionnel sur-mesure",
      "Engagement de restitution d'impact au territoire",
    ],
    tone: "bg-primary/10 border-primary/20 text-primary",
  },
]

export function OpportunitiesPillars() {
  return (
    <Section tone="muted" className="py-16 sm:py-24">
      <SectionHeading
        eyebrow="Nos leviers de réussite"
        title="Ce Que Vous Apportent les Programmes Casa Impact"
        description="Chaque opportunité ouverte par Casa Impact est conçue pour déclencher un impact durable sur votre parcours et sur le développement du territoire."
        align="center"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => {
          const Icon = p.icon
          return (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div>
                <div className={`flex size-12 items-center justify-center rounded-2xl border ${p.tone}`}>
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-foreground leading-snug">
                  {p.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-xs text-foreground/80">
                  {p.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40">
                <Link
                  href="#appels"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Voir les appels ouverts</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
