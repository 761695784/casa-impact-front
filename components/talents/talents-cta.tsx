"use client"

import Link from "next/link"
import { ArrowRight, UserPlus, CheckCircle2, Award, Sparkles } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/section"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    step: "01",
    title: "Soumission du profil",
    desc: "Vous déposez votre candidature ou vous recommandez un talent (entrepreneur, artiste, sportif, leader).",
  },
  {
    step: "02",
    title: "Comité de Sélection",
    desc: "L'équipe Casa Impact examine l'ancrage territorial, l'impact positif et le parcours du candidat.",
  },
  {
    step: "03",
    title: "Mise en lumière & Réseau",
    desc: "Publication sur le Mur des Talents, mise en relation avec mentors, partenaires et investisseurs.",
  },
]

export function TalentsCta() {
  return (
    <Section tone="muted" className="relative overflow-hidden py-20">
      <SectionHeading
        eyebrow="Rejoindre l'organisation"
        title="Comment intégrer le Mur des Talents ?"
        description="Une opportunité unique pour chaque jeune et créateur de Casamance d'accroître sa visibilité et de rejoindre un réseau d'impact."
        align="center"
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="relative flex flex-col justify-between rounded-3xl border border-border bg-background p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <span className="font-display text-4xl font-bold text-accent tabular-nums">
                {s.step}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-primary">
              <CheckCircle2 className="size-3.5 text-accent" />
              <span>Étape clé</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
          <Link href="/adherer" className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Soumettre une candidature de talent
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}
