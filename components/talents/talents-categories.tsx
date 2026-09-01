"use client"

import { Rocket, Palette, Trophy, Users, CheckCircle2, ArrowRight } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const talentCategories = [
  {
    title: "Entrepreneurs & Tech",
    tag: "Innovation Locale",
    desc: "Fondateurs de startups, porteurs de projets dans l'agro-business, le numérique, l'IA et l'artisanat moderne qui créent des emplois en Casamance.",
    icon: Rocket,
    border: "border-forest/30 hover:border-forest",
    gradient: "from-forest/10 via-background to-background",
    iconBg: "bg-forest text-white",
    badgeBg: "bg-forest/10 text-forest",
  },
  {
    title: "Créateurs & Artistes",
    tag: "Rayonnement Culturel",
    desc: "Musiciens, peintres, cinéastes, designers et écrivains qui valorisent l'âme, l'histoire et les traditions exceptionnelles de notre terroir.",
    icon: Palette,
    border: "border-accent/40 hover:border-accent",
    gradient: "from-accent/10 via-background to-background",
    iconBg: "bg-accent text-accent-foreground",
    badgeBg: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Champions Sportifs",
    tag: "Performance & Valeurs",
    desc: "Athlètes, footballeurs, lutteurs, basketteurs et encadreurs qui hissent haut les couleurs de Ziguinchor, Sédhiou et Kolda.",
    icon: Trophy,
    border: "border-earth/30 hover:border-earth",
    gradient: "from-earth/10 via-background to-background",
    iconBg: "bg-earth text-white",
    badgeBg: "bg-earth/10 text-earth",
  },
  {
    title: "Leaders & Pionniers",
    tag: "Impact Social",
    desc: "Militants associatifs, femmes d'impact, enseignants et figures engagées qui transforment concrètement le quotidien de leurs communautés.",
    icon: Users,
    border: "border-primary/30 hover:border-primary",
    gradient: "from-primary/10 via-background to-background",
    iconBg: "bg-primary text-primary-foreground",
    badgeBg: "bg-primary/10 text-primary",
  },
]

export function TalentsCategories() {
  return (
    <Section className="py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Nos Piliers de Détection"
          title="Quels sont les talents mis à l'honneur ?"
          description="Casa Impact offre une visibilité inédite et des opportunités d'accompagnement aux figures émergentes et confirmées de nos trois régions."
          className="mb-0"
        />
        <Button asChild className="rounded-full bg-accent text-accent-foreground font-semibold shadow-md shadow-accent/20 hover:bg-forest hover:text-white transition-all">
          <Link href="/adherer" className="flex items-center gap-2">
            Recommander un talent
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {talentCategories.map((cat) => {
          const Icon = cat.icon
          return (
            <div
              key={cat.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cat.border}`}
            >
              {/* Corner Ambient Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-50`} aria-hidden />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${cat.iconBg} shadow-sm`}>
                    <Icon className="size-6" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cat.badgeBg}`}>
                    {cat.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                  {cat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cat.desc}
                </p>
              </div>

              <div className="relative mt-6 pt-3 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-primary">
                <CheckCircle2 className="size-3.5 text-accent" />
                <span>Mise en lumière officielle</span>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
